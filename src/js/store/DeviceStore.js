import {judgeAreaIsneedDisplay} from '../utils/utils.js'

const DEVICEDEF = {
    name: 'device',
    label: '设备',
    table: '',
    keyIndex: 0,
    fields: {
        names: ['device_id', 'name', 'device_type_id', 'state', 'event_type_id', 'alarm_time', 'time'],
        types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'DATETIME', 'DATE'],
        labels: ['设备编号', '名称', '设备类型', '设备状态', '告警状态', '告警时间', '状态更新时间']
    }
}

export default class DeviceStore {
    constructor(gstore) {
        this.states = new Map() // key = device_id + '-' + device_type_id
        this.deviceDef = DEVICEDEF
        this.alarmReaders = new Map()
        this.registerGlobalEventHandlers()
    }

    registerGlobalEventHandlers() {
        xbus.on('DEVICE-UPDATE-STATE', (msg) => {
            let data = toJson(msg)
            let len = data.length
            for (let i = 0; i < len; i++) {
                let device = data[i].devices ? data[i].devices[0] : data[i]
                let deviceMsg = {
                    device_id: deivce.device_id || device[0],
                    reader_id: deivce.device_id || device[0],
                    device_type_id: device.device_type_id || device[1],
                    name: xdata.metaStore.getNameByID('reader_id', deivce.device_id || device[0]),
                    state: device.state || device[2],
                    time: device.time || new Date(device[3]).format('MM-dd hh:mm'),
                    control: device[5]
                }
                this.setState(deviceMsg)
            }
            xbus.trigger('MAP-UPDATE-READER-STATE DEVICE-STATE-UPDATED', Array.from(this.states.values()))
        })

        xbus.on('DEVICE-CHANGE-STATE', (msg) => {
            let data = toJson(msg)
            let len = data.length
            for (let i = 0; i < len; i++) {
              let lightData = data[i]
              let lightMsg = {
                  cmd: 'lights_ctrl_rsp',
                  task_id: lightData.task_id,
                  user_id: lightData.user_id,
                  device_type: 3
              }
              for (let j = 0, l = lightData.lights.length; j < l; j++) {
                let light = lightData.lights[j]
                lightMsg['lights_id'] = light.id
                lightMsg['lights_ctrl_type'] = light.ctrl_type
                lightMsg['light_state'] = light.light_state
              }
              self.setState(lightMsg)
            }
            xbus.trigger('DEVICE-STATE-UPDATED')
          })
    }

    setState(state) {
        let stateKey = state.cmd === 'lights_ctrl_rsp' ? `${state.task_id}-${state.user_id}` : `${state.device_id}-${state.device_type}`
        this.states.set(stateKey, state)
    }

    // 获取选定范围内分站
  getReaderDetail (filterGeo) {
    let readers = xdata.metaStore.data.reader && Array.from(xdata.metaStore.data.reader.values())
    if (!readers) return
    let arrtriFilterReaders = []
    if (filterGeo) {
      arrtriFilterReaders = readers.filter(item => {
        let coord = [item.x, -item.y]
        let isItem = filterGeo.intersectsCoordinate(coord)
        return isItem && item.reader_id
      })
    }
    return arrtriFilterReaders
  }

  getState (deviceID, deviceTypeID) {
    let deviceState = null, deviceName = null
    let stateKey = deviceID + '-' + deviceTypeID
    let state = this.states.get(stateKey)
    // 如果当前没有设备状态，默认为“正常”
    let readerTypeArr = [0, 1, 6, 7, 8, 9, 10]
    let deviceAlarm = null
    if (readerTypeArr.includes(deviceTypeID)) {
      let device = Array.from(xdata.metaStore.dataInArray.get('reader')).find(item => item.reader_id === Number(deviceID))
      deviceState = device && device.state
      deviceName = device && device.name
      let alarms = xdata.alarmStore.onAlarming && Array.from(xdata.alarmStore.onAlarming.values())
      let currentDeviceAlarm = alarms.filter(item => parseInt(item.obj_id, 10) === parseInt(deviceID, 10) && item.obj_type_id === 4)
      if (currentDeviceAlarm && currentDeviceAlarm.length > 1) {
        currentDeviceAlarm = currentDeviceAlarm.filter(item => item.type_id === 6)
      }
      deviceAlarm = currentDeviceAlarm[0]
    } 
    if (!state) {
      state = {
        'device_id': deviceID,
        'state': deviceState, // 0: normal
        'device_type_id': deviceTypeID,
        'time': new Date().format('MM-dd hh:mm:ss'),
        'name': deviceName
      }
    }
    state['event_type_id'] = deviceAlarm && deviceAlarm.type_id
    state['alarm_time'] = deviceAlarm && new Date(deviceAlarm.cur_time).format('yyyy-MM-dd hh:mm:ss')

    return state
  }

  getStateDefs () {
    return this.deviceDef
  }

  getSearchData (type) {
    let tableName = type === 3 ? 'reader' : 'landmark'
    let sdata = []
    let objs = xdata.metaStore.data[tableName]
    objs = objs && Array.from(objs.values())
    if (objs) {
      for (let i = 0, len = objs.length; i < len; i++) {
        let obj = objs[i]
        let id = obj[`${tableName}_id`]
        let name = obj.name
        let needDisplay = judgeAreaIsneedDisplay(obj)
        if (!needDisplay) continue
        let spy = name && xdata.spell.makePy(name)  // 首字母
        let brief = spy ? spy[0] : ''
        let areaID = obj.area_id
        let areaObj = xdata.metaStore.data.area && xdata.metaStore.data.area.get(areaID)
        let mapID = areaObj && areaObj.map_id
        sdata.push({
          id: id,
          n: name,
          b: brief,
          t: type,
          c: id,
          m: mapID
        })
      }
    } 
    return sdata
  }
}