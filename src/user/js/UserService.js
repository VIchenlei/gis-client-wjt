import Socket from '../../js/Socket.js'
import {saveCredential} from './Credential.js'
import {setCookie} from '../../js/cookie.js'
import {getAlarmShow, getAccessSql} from '../../js/utils/utils.js'
import rateQuery from '../../monitor/js/rate_query.js'
import reptGraphQuery from '../../report/js/rept_graph_query.js'
import maturityQuery from './maturityQuery.js'
import '../../header/tags/alarm-list.html'
import '../../monitor/tags/helpme-list.html'
const RELOADPAGE = 2 * 60 * 60 * 1000


export default class UserService {
  constructor (name = 'UNKNOWN') {
    this.name = name
    this.pwd = null
    this.room = 'MONITOR' // 登录后默认是在实时房间
    this.logined = false // 登录状态
    this.sock = null
    this.mainPage = null

    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    xbus.on('USER', (msg) => {
      switch (msg.cmd) {
        case 'LOGIN':
          this.login(msg.data.user_name, msg.data.user_pwd, msg.data.md5)
          break
        case 'LOGOUT':
          this.logout()
          break
        case 'MODIFY_PWD':
          this.modifyPwd(msg.data)
          break
      }
    })
  }

  login (username, userpwd, md5) {
    if (!this.sock) {
      this.sock = new Socket()
    }

    let self = this
    this.sock.getConnection(3000).then((socket) => {
      self.doLogin(username, userpwd, md5)
    }).catch((msg) => {
      console.warn('Get connection error, please try later: ', msg)
    })
  }

  doLogin (name, pwd, md5) {
    let reqMsg = {
      cmd: 'login',
      data: {
        user_name: name,
        user_pass: pwd,
        md5: md5
      }
    }
    this.pwd = pwd || md5
    this.sock.socket.emit('USER', reqMsg, (data) => {
      this.doLoginRes(data)
    })
  }

  doLoginRes (res) {
    if (this.logined) return
    if (res) {
      if (res.code === 0) {
        let socket = this.sock.socket
        this.name = res.data.name
        socket.username = res.data.name
        socket.sid = res.data.sid

        saveCredential(this.name, this.pwd)
        setCookie('username', res.data.md5)

        let userinfo = {
          name: this.name,
          roleId: res.data.roleID,
          deptID: res.data.deptID,
          userIP: res.data.ip,
          accessID: res.data.accessID,
          objRange: res.data.objRange,
          userCName: res.data.userCName,
          isCheck: res.data.isCheck,
          menus: res.data.menus,
          transerMenus: res.data.transerMenus
        }
        xdata.userinfoUpdate(userinfo)

        if (res.data.isCheck === 1) xbus.trigger('SAVE-META-DATA-SPECIAL')

        // mount the main page
        this.mainPage = riot.mount('div#p_main', 'page-main', userinfo)[0]
        this.searchMonitorRate()
        window.transer.pTransfer('p_main')

        let isShowAlarm = getAlarmShow()
        if (isShowAlarm) {
          this.helpme = riot.mount('helpme-list', {})[0]
          this.alarmlist = riot.mount('alarm-list', userinfo)[0]
        }
        this.logined = true
        window.initShowDialogUtil()
        xbus.trigger('COLLECTOR-STATUS-UPDATE')
        this.searchCredials()
        this.checkoutUserDo(RELOADPAGE)
      } else {
        xbus.trigger('SHOW-USER-TIPS', {
          msg: '用户名或密码错误，请确认后重试。'
        })
      }
    }
  }

  searchMonitorRate() {
    let sql = rateQuery['efficiency_overview']
    let message = {
      cmd: 'query',
      data: {
        name: 'three-credentials',
        sql: sql.sqlTmpl,
        searchTime: sql.searchTime,
        termTime: sql.termTime
      }
    }
    xbus.trigger('REPT-FETCH-DATA', {
      req: message,
      def: {
        name: 'three-credentials'
      }
    })
  }

  getCredialsMaturitySql (sql, str) {
    let maturityNames = ['staff', 'vehicle']
    const needDisplay = `${xdata.isCheck === 1 ? 'and dse.need_display' : ''}`
    const deptID = xdata.depts ?  ` and dse.dept_id in (${xdata.depts.join(',')})` : ''
    const CK = xdata.isCheck === 1 ? '_ck' : ''
    for (let i = 0; i < maturityNames.length; i++) {
      let name = maturityNames[i]
      let maturitySql = maturityQuery[name]
      maturitySql = maturitySql.replace('{str}', str).replace('{exprString}', needDisplay).replace('{deptID}', deptID)
      maturitySql = name === 'staff' ? maturitySql.replace(/{CK}/g, CK) : maturitySql
      sql.sqlTmpl[`credentials-maturity-${name}`] = maturitySql
    }
    return sql
  }

  searchCredials() {
    let sql = reptGraphQuery['efficiency_overview']
    let str = getAccessSql('credentials-maturity-staff')
    sql = this.getCredialsMaturitySql(sql, str)
    console.log('sql', sql)
    let message = {
      cmd: 'query',
      data: {
        name: 'three-credentials',
        sql: sql.sqlTmpl,
        searchTime: sql.searchTime,
        termTime: sql.termTime
      }
    }
    console.log(message)
    xbus.trigger('REPT-FETCH-DATA', {
      req: message,
      def: {
        name: 'three-credentials'
      }
    })
  }

  checkoutUserDo(seconds) {
    let status = true
    let timer

    document.body.onmousedown = function () {
      status = true
    }
    document.body.onmouseup = function () {
      countTime()
    }

    function countTime() {
      setInterval(function () {
        if (!status) {
          window.location.reload()
          status = true
        }
      }, 1)
      if (timer) {
        clearInterval(timer)
      }
      timer = setInterval(function () {
        status = false
      }, seconds)
    }
    countTime()
  }
  
  modifyPwd(msg) {
    this.sock.socket.emit('USER', {
      cmd: 'modify',
      data: {
        username: msg.username,
        oldpwd: msg.oldpwd,
        newpwd: msg.newpwd
      }
    }, (data) => {
      xbus.trigger('USER-MODIFY-PWD-RES', data)
    })
  }

  logout() {
    window.transer.pTransfer('p_login')
    this.mainPage && this.mainPage.unmount(true)
    this.alarmlist && this.alarmlist.unmount(true)
    this.mainPage = null
    this.alarmlist = null

    window.initApp()
    let socket = this.sock && this.sock.socket
    if (socket) {
      let reqMsg = {
        cmd: 'logout',
        data: {
          user_name: socket.username
        }
      }
      socket.emit('USER', reqMsg)
      socket.close()
    }
    window.location.reload()
  }
}
