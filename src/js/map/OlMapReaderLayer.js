import ol from 'openlayers'
import {
  drawSymbol
} from './OlMapUtils.js'
import {
  testMapID, isPC
} from '../utils/utils.js'

export default class OlMapReaderLayer {
  constructor (glayer) {
    this.mapType = glayer.mapType
    this.map = glayer.map
    this.mapID = xdata.metaStore.defaultMapID
    this.isReaderDrawed = false // 图层是否已被画到地图上
    this.groups = new Map()
    this.alarmReaders = xdata.deviceStore.alarmReaders
    this.mapID = xdata.metaStore.defaultMapID
    this.isMoveReader = false // 是否正在拖动分站修改分站位置
    this.initLayer()
    this.registerGlobalEventHandlers()
  }

  initLayer () {
    this.readerLayerSource = new ol.source.Vector()
    this.readerLayer = new ol.layer.Vector({
      source: this.readerLayerSource,
      zIndex: 6
    })
    this.readerLayer.setVisible(false)
    this.map.addLayer(this.readerLayer)
  }

  registerGlobalEventHandlers () {
    let self = this

    /**根据告警修改分站状态 */
    xbus.on('MAP-UPDATE-READER-STATE', (device) => {
      if (this.isMoveReader) return // isMoveReader为true表示正在拖动分站，此时不要重绘分站，重绘分站会使正在拖动的分站会复位
      if (self.mapType === 'MONITOR') {
        let deviceStateKey = device.device_id + '-' + device.device_type
        self.updateStateColor(deviceStateKey, device)
      }
    })

    /**显示隐藏分站界面*/
    xbus.on('MAP-SHOW-READER', msg => {
      if (msg.mapType !== this.mapType) return
      window.isShowReader = msg.isVisible
      if (msg.isVisible) {
        if (!this.isReaderDrawed) {
          self.drawReaders(msg)
        }
        if (msg.id) {
          self.startLocation(msg.id)
        }
        this.readerLayer.setVisible(true)
        const updateReaderColors = xdata.alarmStore.updateReaders && Array.from(xdata.alarmStore.updateReaders.values())
        if (updateReaderColors && updateReaderColors.length > 0) {
          this.changeAllReaderState(updateReaderColors)
          xdata.alarmStore.updateReaders.clear()
        }
      } else {
        this.readerLayer.setVisible(false)
        self.stopLocation()
      }
    })

    xbus.on('MOVE-READER', (currenTag) => {
      this.isMoveReader = true
    })

    xbus.on('DRAW-READER-UPDATE', (msg) => {
      if (msg && msg.isCloseDialog) { // 拖动后双击进入对话框未保存的状况下 关闭对话框需要重置isMoveReader
        this.isMoveReader = false
      }
      if (!this.isMoveReader) {
        this.resetLayer()
        self.stopLocation()
      }
    })

    xbus.on('MAP-LOAD-SUCESS', () => {
      this.mapID = xdata.metaStore.defaultMapID
      this.resetLayer()
      this.readerLayer.setVisible(false) // 等待地图加载完毕，获取上次图层状态
    })
  }

  resetLayer () {    
    this.readerLayerSource && this.readerLayerSource.clear()
    this.drawReaders()
    this.isMoveReader = false
  }

  startLocation(ids) {
    let msg = {
      cards: ids,
      symbolType: 'reader'
    }
    window.cardStartLocating(msg)
  }

  stopLocation() {
    let keys = Array.from(xdata.locateStore.localReader.keys())
    if (keys.length > 0) {
      window.cardStopLocating({
        cards: keys
      })
    }
  }

  drawReaders(msg) { 
    let rows = xdata.metaStore.data.reader && Array.from(xdata.metaStore.data.reader.values())
    if (!rows) return
    for( let reader of rows) {
      let readerId = reader.reader_id
      let readerObj = xdata.metaStore.data.reader && xdata.metaStore.data.reader.get(readerId)
      if (readerObj && readerObj.state === 1) continue // 分站停用不绘画
      let areaID = readerObj && readerObj.area_id
      let areaObj = xdata.metaStore.data.area && xdata.metaStore.data.area.get(areaID)
      let mapID = areaObj && areaObj.map_id
      if (testMapID(mapID, this.mapID)) {
        let group = this.drawReadersOn(reader)
        let keyName = reader.reader_id + '-' + reader.device_type_id
        this.groups.set(keyName, group)
      }
    }
    this.isReaderDrawed = true
  }

  drawReadersOn(reader) {
    let state = 0
    let eventType = 0
    let readerId = reader.reader_id
    let isAlarmRenderID = `${readerId}-${reader.device_type_id}`
    let isAlarm = this.alarmReaders.get(isAlarmRenderID)
    if (isAlarm && Array.from(isAlarm.values()).length > 0) {
      state = 1
      eventType = 33
      if (isAlarm.get(6)) eventType = 6
    }
    const deviceTypeObj = xdata.metaStore.data.device_type && xdata.metaStore.data.device_type.get(reader.device_type_id)
    const deviceTypeName = deviceTypeObj && deviceTypeObj.name
    let attrs = {
      'data-id': readerId + '-' + reader.device_type_id,
      'id': readerId,
      'data_subtype': deviceTypeName,
      x: reader.x,
      y: reader.y,
      state: state,
      event_type: eventType
    }
    return drawSymbol(attrs, this.readerLayerSource, this.map)
  }

  storeAlarmReaders(deviceKey, eventType) {
    let ret = this.alarmReaders.get(deviceKey)
    if (!ret) {
      let map = new Map()
      this.alarmReaders.set(deviceKey, map)
    }
    ret = this.alarmReaders.get(deviceKey)
    ret.set(eventType, true)
  }

  updateStateColor(deviceKey, device) {
    let group = this.groups.get(deviceKey)
    let eventType = device.event_type
    let alarmReader = this.alarmReaders.get(deviceKey)

    if (device.state === 0) { // 结束告警，需要特殊判断
      alarmReader && alarmReader.delete(eventType)
      let alarmKey = alarmReader && Array.from(alarmReader.keys())
      if (alarmKey && alarmKey[0]) { // 如果还有其他告警，修改告警类型，重新画告警分站图标
        device.event_type = alarmKey[0]
      }
    } else { // 新的告警消息
      alarmReader = this.alarmReaders.get(deviceKey)
      this.storeAlarmReaders(deviceKey, eventType)
      if (eventType !== 6) { // 如果告警类型不是分站通信异常，需要特殊处理
        let isAbnomal = alarmReader && alarmReader.get(6)
        if (isAbnomal) return // 如果已经推送过分站通信异常，则不需要修改分站图标
      }
    }

    if (group) {
      let feature = this.readerLayerSource.getFeatureById(deviceKey)
      if (!feature) return
      this.readerLayerSource.removeFeature(feature)
      device['x'] = group.get('x')
      device['y'] = group.get('y')
      this.drawReadersOn(device)
    }
  }

  changeAllReaderState(rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const type = row['type_id']
      this.changeReaderStateOnMap(row, type)
    }
  }

  changeReaderStateOnMap (row, type) {
    let readerObj = xdata.metaStore.data.reader && xdata.metaStore.data.reader.get(Number(row['obj_id']))
    if (!readerObj) {
      this.updateReaders.set(Number(row['obj_id']), row)
      return
    }
    const deviceTypeID = readerObj.device_type_id
    let msg = {
      device_id: Number(row['obj_id']),
      reader_id: Number(row['obj_id']),
      device_type: deviceTypeID,
      device_type_id: deviceTypeID,
      reader_type: 'reader',
      name: xdata.metaStore.getNameByID('reader_id', Number(row['obj_id'])),
      state: row['status'] === 0 ? 1 : 0,
      time: new Date(row['cur_time']).format('MM-dd hh:mm:ss'),
      map_id: row['map_id'],
      control: 0,
      event_type: type
    }
    xdata.deviceStore.setState(msg)
    xbus.trigger('MAP-UPDATE-READER-STATE', msg)
  }
}
