export default class DeviceUpdateStore {
  constructor (gs) {
    // 设备网络store
    this.deviceNetStore = new Map()
    // 设备参数store
    this.deviceParamsStore = new Map()

    this.netStore = new Map()
    this.paramsStore = new Map()

    this.scanMsg = null

    // 电源信息store
    this.powerStore = new Map()

    // 保存已经升级的标识卡
    this.cardUploaded = new Map()

    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    // 网络配置信息
    xbus.on('NETWORK-CONFIGURATION', data => {
      this.dealDeviceData(data, 'network_configuration', 'deviceNetStore', 'netStore')
    })

    xbus.on('DEVICE-PARAMS-RESPONSE', (data, cmd) => {
      let name = cmd.includes('device_params') ? 'device_configuration' : 'software_configuration'
      this.dealDeviceData(data, name, 'deviceParamsStore', 'paramsStore', cmd)
    })

    xbus.on('NETWORK-CONFIGURATION-RESPONSE', data => {
      this.dealModifyDeviceData(data, 'network_configuration', 'deviceNetStore', 'netStore')
    })

    xbus.on('DEVICE-CONFIGURATION-RESPONSE', data => {
      if (!data) return
      this.dealModifyDeviceData(data, 'device_configuration', 'deviceParamsStore', 'paramsStore')
    })

    xbus.on('MANAGER-SHOW-POWER', list => {
      if (!list) return
      this.dealPowerData(list, 'device_power', 'powerStore')
    })

    xbus.on('DEVICE_UPLOAD_DOWN', data => {
      window.xhint.close()
      const {deviceAddress, deviceType, code, msg} = data
      if ([145, 146, 148, 149].includes(deviceType)) {
        if (code === 0) {
          this.cardUploaded.set(`${deviceAddress}-${deviceType}`, true)
        } else {
          this.cardUploaded.delete(`${deviceAddress}-${deviceType}`)
        }
      }
      window.xMessage.open({
        type: code ? 'error' : 'success',
        message: code ? (msg || '升级失败') : `${deviceAddress}#设备升级完毕！`
      })
    })
  }

  dealDeviceData (data, name, storename, storemap, cmd) {
    if (!data) return
    let {deviceAddress, deviceType, originIPDeviceAddress, originIPDeviceType} = data

    if (name === 'device_configuration') {
      Object.keys(data).forEach(item => {
        if (['timeSynchronization', 'broadcastDuration', 'BlinkDuration', 'responseDuration', 'FinalDuration', 'afterPositionDormat', 'confictDormat', 'ACKDuration', 'checkingDuration', 'rangingDuration', 'signalDuration'].includes(item) && data[item] == 4294967295) {
          data[item] = '此值无效'
        }
      })
    } 

    // 非IP设备的转发设备为带IP的设备
    let okey = originIPDeviceAddress ? `${originIPDeviceAddress}-${originIPDeviceType}` : `${deviceAddress}-${deviceType}`
    let store = this[storename].get(okey)
    let state = 'even'
    if (!store) {
      store = new Map()
      this[storename].set(okey, store)
      state = this[storename].size % 2 === 0 ? 'even' : 'odd'
    }
    let key = `${deviceAddress}-${deviceType}`
    data['classstate'] = store.get(okey) ? store.get(okey).classstate : state
    store.set(key, data)

    this[storemap].set(`${deviceAddress}-${deviceType}`, data)
    if (cmd === 'device_software_update' && deviceType === 1) {
      // 如果是设备升级的话，需要增加can中继的假数据
      const canData = JSON.parse(JSON.stringify(data))
      canData.deviceType = 6
      canData.isIP = false
      canData.programVersion = ''
      this[storename].get(okey).set(`${deviceAddress}-6`, canData)
      this[storemap].set(`${deviceAddress}-6`, canData)
    }
    xbus.trigger('DEVICE-UPDATE-HARDWARE', {name, storename})
  }

  dealModifyDeviceData (data, name, storename, storemap) {
    if (!data) return
    let {deviceAddress, deviceType, originIPDeviceAddress, originIPDeviceType} = data
    // 非IP设备的转发设备为带IP的设备
    let okey = originIPDeviceAddress ? `${originIPDeviceAddress}-${originIPDeviceType}` : `${deviceAddress}-${deviceType}`
    let modifyData = this[storename].get(`${okey}`)
    let result = data.data

    if (!modifyData) {
      return this.dealDeviceData(data, name, storename, storename === 'deviceParamsStore' ? 'paramsStore' : 'netStore')
    }
    let store = this[storemap].get(`${deviceAddress}-${deviceType}`)
    if (!store) return
    for (let key in result) {
      let value = result[key]
      store[key] = value
    }
    modifyData.set(`${deviceAddress}-${deviceType}`, store)
    xbus.trigger('META-UPDATE-DB-RES', {
      data: {
        name
      },
      code: 0,
      cmd: 'update'
    })
    if (result.childDeviceAddress) {
      this.deviceParamsStore.clear()
      this.paramsStore.clear()
      xbus.trigger('SEND-MANAGER-MSG', {
        cmd: this.scanMsg.name,
        data: this.scanMsg.data
      })
    } else {
      xbus.trigger('DEVICE-UPDATE-RESPONSE', {name, storename})
    }
  }

  dealPowerData (list, name, storename) {
    for (let i = 0; i < list.length; i++) {
      const data = list[i]
      const { deviceAddress } = data
      this.powerStore.set(deviceAddress, data)
    }
    xbus.trigger('DEVICE-UPDATE-POWER', {name, storename})
  }
}
