import io from 'socket.io-client'
import { toJson } from './utils/utils.js'

let callbackcount = 0
const url = window.location.host
// const url = '192.168.0.240:8086'
// const url = 'localhost:8086'

const connectionOpts = {
  'reconnectionAttempts': 'Infinity', // avoid having user reconnect manually in order to prevent dead clients after a server restart
  'timeout': 10000, // 10s, before connect_error and connect_timeout are emitted.
  'transports': ['websocket']
}

export default class Socket {
  constructor () {
    this.socket = io(url, connectionOpts)
    window.xsocket = this.socket

    this.allData = null // 暂存resp_all_data数据

    this.registerSocketEventHandlers()
    this.registerGlobalEventHandlers()
  }

  getConnection (timeout) {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        console.log('Socket.getConnection: Aready connected.')
        resolve(this.socket)
      } else {
        console.log('Socket.getConnection: Socket do NOT connect.')
      }

      // set our own timeout in case the socket ends some other way than what we are listening for
      let timer = setTimeout(function () {
        timer = null
        error('Socket.getConnection: local timeout.')
      }, timeout)

      // common error handler
      function error (data) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        reject(data)
      }

      // success
      this.socket.on('connect', () => {
        clearTimeout(timer)
        resolve(this.socket)
        xbus.trigger('NETWORK-STATUS-CHANGE', {
          connected: true,
          lastChangeTime: (new Date()).format('hh:mm:ss')
        })
      })

      // errors
      this.socket.on('connect_error', error)
      this.socket.on('connect_timeout', error)
      this.socket.on('error', error)
      this.socket.on('disconnect', (error) => {
        console.log(error)
        xbus.trigger('COLLECTOR-DISCONNECTED')
        xbus.trigger('NETWORK-STATUS-CHANGE', {
          connected: false,
          lastChangeTime: (new Date()).format('hh:mm:ss')
        })
      })

      // here reconnect to remote
      this.socket.connect() // 这里是异步
    })
  }

  dealAllData (data) {
    if (!this.respAllData) {
      this.respAllData = !this.respAllData
      for (let i = 0; i < data.length; i++) {
        let row = data[i]
        row = JSON.parse(row)

        switch (row.cmd) {
          case 'pos_map':
            xbus.trigger('POS-ALL-DATA', row)
            break
          case 'special_area_up_mine':
            xbus.trigger('RESP-ALL-DATA', row)
            break
          case 'event':
            xbus.trigger('ALARM-UPDATE', row)
            break
          case 'callcardlist':
          case 'call_card_resp':
            xbus.trigger('CALL-CARD-LIST', row.data)
            break
          case 'tunneller_stat':
            xbus.trigger('TUNNELLER-STAT-START', row.data)
            break
          case 'coal_cutting':
            xbus.trigger('COAL-CUTTING-START', row.data)
            break
          case 'leader_arrange':
            xbus.trigger('CURRENT-LEADER-ARRANGE', row.data)
            break
          case 'light_state':
            xbus.trigger('TRAFFIC-LIGHTS-STATE', row.data)
            break
        }
      }
    }
  }

  /**
   * 注册网络消息事件的处理器
   *
   * @method registerSocketEventHandlers
   *
   */
  registerSocketEventHandlers () {
    this.socket.on('META', (res) => {
      let cmd = res.cmd

      switch (cmd) {
        case 'meta_definition':
          xbus.trigger('META-DEF', res)
          break
        case 'CARD_DEF':
          xbus.trigger('CARD-STATE-DEF', res)
          break
        case 'meta_data':
          xbus.trigger('META-DATA', res)
          break
        case 'update':
          xbus.trigger('META-UPDATE-DB-RES', res) // deal with in meta-dialog
          break
        case 'meta_data_all':
          xbus.trigger('ALL-DATA-HAS-PULL', res)
          break
        case 'meta_data_length':
          xbus.trigger('PULL_META_LENGTH', res)
          break
        default:
          console.warn(`未知的 META 指令：cmd = ${cmd}`)
          break
      }
    })

    /**
     * 处理 PUSH 消息。
     * PUSH 消息来自采集服务器，由 WebServer 转发。
     *
     * @method
     *
     * @param  {[type]} res) {                   console.log(JSON.stringify(res))    } [description]
     *
     * @return {[type]}      [description]
     */
    this.socket.on('PUSH', (ress) => {
      let res = toJson(ress)
      if (!res) {
        console.warn('PUSH null message.')
        return
      }
      let cmd = res.cmd
      let data = res.data // res.data could be string
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (error) {
          console.warn('CAN NOT parse the PUSHed JSON data: ', data)
          return
        }
      }
      if (!xdata.metaStore.firstPull) {
        if (cmd === 'resp_all_data') this.allData = data
        return
      }
      if (cmd === 'pos_map' && xdata.maptype === 'HISTORY') return
      if (this.allData) {
        this.dealAllData(this.allData)
        this.allData = null
      }

      switch (cmd) {
        case 'pos_map':
          xbus.trigger('CARD-UPDATE-POS', data)
          xbus.trigger('COLLECTOR-STATUS-LOGIN')
          this.updateLastPushTime()
          break
        case 'positon_all': // when login, push all the cards under well
          xbus.trigger('CARD-UPDATE-POS', data)
          break
        case 'event':
          // console.log(data)
          xbus.trigger('ALARM-UPDATE', {
            data: data
          })
          break
        case 'callcardlist':
        case 'call_card_resp':
          xbus.trigger('CALL-CARD-LIST', data)
          break
        // 呼叫确认
        case 'call_confirm':
          xbus.trigger('CALL-CARD-CONFIRM', data)
          break
        case 'call_card_cancel_resp':
          xbus.trigger('CAll-CARD-REMOVE', data)
          break
        case 'up_mine':
          xbus.trigger('CARD-REMOVE-CARD', data)
          break
        case 'alarm_done':
          console.log(data)
          xbus.trigger('ALARM-UPDATE', {
            data: Array.isArray(data) ? data : [data]
          })
          break
        case 'helpme_done':
          xbus.trigger('HELPME-DONE', res)
          break
        case 'nosignal_staffs':
          xbus.trigger('CARD-NOSIGNAL', data)
          break
        case 'light_ctrl_rsp':
          xbus.trigger('DEVICE-CHANGE-STATE', data)
          break
        case 'collector_status':
          xbus.trigger('COLLECTOR-STATUS', res)
          this.updateLastPushTime()
          break
        case 'special_area_up_mine':
          xbus.trigger('CARD-REMOVE-ICON', data)
          break
        case 'net_ip_resp':
          xbus.trigger('NET-RESPONSE', data)
          break
        case 'resp_all_data':
          if (!this.respAllData) {
            this.respAllData = !this.respAllData
            for (let i = 0; i < data.length; i++) {
              let row = data[i]

              switch (row.cmd) {
                case 'pos_map':
                  xbus.trigger('POS-ALL-DATA', row)
                  break
                case 'special_area_up_mine':
                  xbus.trigger('RESP-ALL-DATA', row)
                  break
                case 'event':
                  xbus.trigger('ALARM-UPDATE', row)
                  break
                case 'callcardlist':
                case 'call_card_resp':
                  xbus.trigger('CALL-CARD-LIST', row.data)
                  break
                case 'tunneller_stat':
                  xbus.trigger('TUNNELLER-STAT-START', row.data)
                  break
                case 'coal_cutting':
                  xbus.trigger('COAL-CUTTING-START', row.data)
                  break
                case 'leader_arrange':
                  xbus.trigger('CURRENT-LEADER-ARRANGE', row.data)
                  break
                case 'light_state':
                  xbus.trigger('TRAFFIC-LIGHTS-STATE', row.data)
                  break
              }
            }
          }
          break
        case 'light_state':
          xbus.trigger('TRAFFIC-LIGHTS-STATE', data)
          break
        case 'person_on_car':
          xbus.trigger('PERSON-ON-CAR', data)
          break
        case 'resp_all_person_on_car':
          xbus.trigger('RESP-PERSON-ONCAR', data)
          break
        case 'vehicle_state':
          xbus.trigger('CHANGE-WORKFACE-VEHICLE', data)
          break
        case 'alarm_done_resp':
        case 'recover_alarm_resp':
          window.xMessage.open({
            value: 'success',
            message: data
          })
          break
        case 'net_ip_resp':
          xbus.trigger('NET-RESPONSE', data)
          break
      }
    })

    this.socket.on('MANAGER_RESPONCE', (res) => {
      if (!res) return
      let cmd = res.cmd
      let data = res.data
      switch (cmd) {
        case 'device_net_params_response':
          xbus.trigger('NETWORK-CONFIGURATION', data)
          break
        case 'device_params_response':
        case 'device_software_update_response':
        case 'non_ip_device_params_response':
        case 'non_ip_device_software_update_response':
          xbus.trigger('DEVICE-PARAMS-RESPONSE', data, cmd.replace('_response', ''))
          break
        case 'network_configuration_response': // 修改网络配置参数返回数据
          xbus.trigger('NETWORK-CONFIGURATION-RESPONSE', data)
          break
        case 'device_configuration_response': // 修改设备参数返回数据
        case 'non_ip_device_configuration_response':
          xbus.trigger('DEVICE-CONFIGURATION-RESPONSE', data)
          break
        case 'device_upload_down': // 设备升级完成
        case 'device_error': // 设备升级失败
          xbus.trigger('DEVICE_UPLOAD_DOWN', data)
          break
        case 'device_uploading':
          const {total: length, cur_num: size} = data
          xbus.trigger('PROGRESS-BAR', {length, size})
          break
        default:
          break
      }
    })

    this.socket.on('FILE', (res) => {
      let cmd = res.cmd
      let data = toJson(res.data)
      switch (cmd) {
        case 'download':
          console.log('download map file done.', res.code)
          if (res.code === 0) {
            xbus.trigger('MAP-FILE-DOWNLOADED', {
              filename: res.data.name,
              filedata: res.data.data
            })
          } else if (res.code === -1) {
            let mapPath = xdata.metaStore.data['map']
            if (!mapPath) {
              let div = document.createElement('div')
              document.querySelector('.mapcontainer').append(div)
              div.innerText = '下载地图失败，请刷新页面或联系管理员！'
              div.style.textAlign = 'center'
              div.style.position = 'absolute'
              div.style.top = '40%'
              if (document.body.clientWidth < 800) {
                div.style.left = '12%'
              } else if (document.body.clientWidth > 800) {
                div.style.left = '40%'
              }
            }
          } else {
            console.warn(`获取地图文件${res.data.name}失败。`)
            document.querySelector('.page-head').classList.remove('hide')
            document.querySelector('.page-foot').classList.remove('hide')
          }
          break
        case 'upload_more':
          xbus.trigger('FILE-UPLOAD-MORE', data)
          break
        case 'upload_done':
          xbus.trigger('FILE-UPLOAD-DONE', data)
          break
        default:
          console.warn(`未知的文件上传指令：cmd = ${cmd}`)
          break
      }
    })
  }

  sendMsg (eventName, msg, cb) {
    let socket = this.socket
    msg['username'] = xdata.userName
    let ret = false
    if (socket && socket.connected) {
      cb && cb instanceof Function ? socket.emit(eventName, msg, cb) : socket.emit(eventName, msg)
      ret = true
    } else {
      console.warn('Socket.js : The socket is disconnected.')
      xbus.trigger('FAILED-FOR-NOCONN', {
        eventName: eventName
      })
    }

    return ret
  }

  getManager (msg) {
    this.sendMsg('MANAGER', msg, (res) => {
      xbus.trigger('MANAGER-SHOW-POWER', res)
    })
  }

  getRept (msg) {
    let queryKey = `${xdata.userName}-${++callbackcount}-${msg.def.name}`
    msg.req['key'] = queryKey
    this.sendMsg('REPT', msg.req, (res) => {
      let key = res.key
      if (key === queryKey) {
        let ds = {
          def: msg.def,
          rows: res.data,
          total: res.total,
          pageIndex: res.pageIndex,
          monthTime: msg.monthTime
        }
        xbus.trigger('REPT-SHOW-RESULT', ds)
      }
    })
  }

  getMetaResult (msg) {
    // let metaKey = `${xdata.userName}-${new Date().getTime()}-${msg.req.data.name}`
    let metaKey = `${xdata.userName}-${++callbackcount}-${msg.req.data.name}`
    msg.req['key'] = metaKey
    msg.req['username'] = xdata.userName
    this.sendMsg('META', msg.req, (res) => {
      let key = res.key
      if (key === metaKey) {
        xbus.trigger('META-UPDATE-DB-RES', res)
      }
    })
  }

  getReptToFile (msg) {
    this.sendMsg('REPT', msg, (res) => {
      if (res.code !== 0) {
        console.warn('导出文件失败：', res.msg)
        window.xhint.close()
        return
      }
      window.xhint.close()
      switch (res.data.fileType) {
        case 'csv':
        case 'pdf':
        case 'xlsx':
          let self = this
          let link = document.createElement('a')
          let absoluteUrl = self.getAbsoluteUrl(res.data.url)
          link.setAttribute('href', absoluteUrl)
          link.setAttribute('target', '_blank')
          link.setAttribute('download', res.data.name)
          window.setTimeout(function () { // 标签还未创建完成或者服务器文件还未生成！
            link.click()
          }, 2000)
          break
        case 'printPDF':
          let printURL = this.getAbsoluteUrl(res.data.url)
          let printLink = document.createElement('a')
          printLink.setAttribute('onclick', 'window.open("' + printURL + '")')
          window.setTimeout(function () {
            printLink.click()
          }, 2000)
          break
      }
      window.xhint.close()
    })
  }

  getAbsoluteUrl (url) {
    let a = document.createElement('a')
    a.href = url
    url = a.href
    return url
  }

  getMapFile (filename) {
    this.sendMsg(EVT.FILE, {
      cmd: CMD.FILE.DOWNLOAD,
      data: {
        name: filename,
        type: 'map'
      }
    })
  }

  updateLastPushTime () {
    xdata.lastUpdate = Date.now()
    xbus.trigger('LAST-UPDATE')
  }

  getFadeReader (msg) {
    this.sendMsg('FADE', msg.req, (res) => {
      console.log('盲区数据', JSON.stringify(res))
      let ds = {
        def: msg.def,
        rows: res
      }
      xbus.trigger('FADE-READER-DATA-RESULT', ds)
    })
  }
 
  registerGlobalEventHandlers () {
    let self = this
    xbus.on('MAP-DOWNLOAD-FILE', (msg) => {
      self.getMapFile(msg.filename)
    })

    xbus.on('PULL-DOWN-METADATA', (msg) => {
      self.sendMsg('META', msg)
    })

    xbus.on('AFRESH-METADATA', (msg) => {
      self.sendMsg('META', msg)
    })

    xbus.on('REPT-FETCH-DATA', (msg) => {
      self.getRept(msg)
    })

    xbus.on('FADE-READER-DATA', (msg) => {
      self.getFadeReader(msg)
    })

    xbus.on('REPT-FETCH-FILE', (msg) => {
      self.getReptToFile(msg)
    })

    xbus.on('ALARM-DONE-REQ', (msg) => {
      self.sendMsg('ALARM', msg)
    })

    xbus.on('HELPME-DONE-REQ', (msg) => {
      self.sendMsg('CALL', msg)
    })

    xbus.on('HELP-ME-CONFIRM', (msg) => {
      self.sendMsg('CALL', msg)
    })

    xbus.on('RECOVER-ALARM', (msg) => {
      self.sendMsg('ALARM', msg)
    })

    xbus.on('CALL-REMOTE', (msg) => {
      self.sendMsg('CALL', msg)
    })

    xbus.on('CALL-CARD-START', (msg) => {
      self.sendMsg('CALL', msg)
    })

    xbus.on('MAN-CONTROL-UPMINE', (msg) => {
      self.sendMsg('CALL', msg)
    })

    xbus.on('META-UPDATE-DB', (msg) => {
      self.getMetaResult(msg)
      // self.sendMsg('META', msg.req)
    })

    xbus.on('DELETE-PIC', (msg) => {
      self.sendMsg('FILE', msg)
    })

    xbus.on('GET-NET-IP', () => {
      self.sendMsg('MANAGER', {
        cmd: 'get_net_ip'
      })
    })

    xbus.on('GET-POWER-MSG', (msg) => {
      self.getManager({
        cmd: 'get_power_msg'
      })
    })

    xbus.on('GET-DEVICE-PARAMS', () => {
      self.sendMsg('MANAGER', {
        cmd: 'get_device_parmars'
      })
    })

    xbus.on('SEND-MANAGER-MSG', msg => {
      self.sendMsg('MANAGER', msg)
    })

    xbus.on('SEND-DESTORY-TCP', () => {
      self.sendMsg('MANAGER', {
        cmd: 'send_destory_tcp'
      })
    })

    xbus.on('PULL-IMPORT-FILE', (msg) => {
      self.sendMsg('PULLMSG', {
        cmd: 'pull-msg',
        data: {
          tablename: msg
        }
      })
    })

    xbus.on('GET-NET-IP', () => {
      self.sendMsg('MANAGER', {
        cmd: 'get_net_ip'
      })
    })

    xbus.on('LIGHT-CONTROL-REQ', (msg) => {
      self.sendMsg('CALL', msg)
    })
  }
}
