import ol from 'openlayers'
import {
  drawSymbol
} from './OlMapUtils.js'
import { testMapID } from '../utils/utils.js'
const defColorArr = ['红','黄','绿','闪烁']//用来处理判断是否输出warn
const lightDef = {
  name: 'light',
  label: '红绿灯',
  table: 'dat_light',
  keyIndex: 0,
  fields: {
    names: ['light_id', 'lights_group_id', 'name', 'physicsLightId', 'towards', 'stateName', 'stateCtrl', 'ctrlUser'], 
    types: ['NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'STRING'],
    labels: ['红绿灯编号', '所属灯组', '名称', '物理灯号', '物理灯朝向', '当前状态', '控制状态', '控制人'],
    enableNull: [false, false, false, false, false, false, false, false]
  }
}

export default class OlMapLightLayer {
  constructor (glayer) {
    this.mapType = glayer.mapType
    this.map = glayer.map
    this.groups = new Map() // 保存 device group 的 DOM 对象，用于后续修改状态，避免 DOM 搜索
    this.overlayGroups = new Map()
    this.alarmTrafficLights = xdata.TrafficLightsStore.alarmTrafficLights
    this.initLayer()
    this.registerGlobalEventHandlers()
    this.initDrawTrafficLisght()
  }

  initLayer () {
    this.lightLayerSource = new ol.source.Vector()
    this.lightLayer = new ol.layer.Vector({
      source: this.lightLayerSource,
      zIndex: 7
    })
    this.lightLayer.setVisible(false)
    this.map.addLayer(this.lightLayer)
  }

  handleSubtype (feature, evt) {
    this.showTips(feature, 'feature', evt)
  }

  showTips(feature, type, evt) {
    let msg
    let lights = xdata.metaStore.data.light
    if(type === 'feature'){
      msg = {
        lights_group_id: feature.getProperties()['groupId'],
        light_id: feature.getProperties()['id'],
        stateName: feature.getProperties()['state'],
        ctrlUser: feature.getProperties()['ctrlUser'],
        stateCtrl: feature.getProperties()['stateCtrl'],             
      }
    }else if(type === 'overlay'){
      msg = {
        lights_group_id: Number(feature.getAttribute('groupId')),
        light_id: Number(feature.getAttribute('id')),
        stateName: '闪烁',
        ctrlUser: feature.getAttribute('ctrlUser'),
        stateCtrl: Number(feature.getAttribute('stateCtrl')),
      }
    } else {
      console.warn('unKnown click type!')
    }
    let light = lights && lights.get(msg.light_id)
    let physicsLightId = light.physics_light_id
    let towards = light.physics_light_direction
    msg['physicsLightId'] = physicsLightId
    msg['towards'] = towards === 0 ? '反面' : '正面'
    msg['name'] = light.name
    msg['stateCtrl'] = msg.stateCtrl ? '已被手动控制' : '未被手动控制' 

    let formatedInfo = xdata.metaStore.formatRecord(lightDef, msg, null)

    const msg1 = {
      type: 'LIGHT',
      subtype: 'light',
      id: msg.lightId,
      event: evt,
      state: null,
      info: {
        def: lightDef,
        rec: formatedInfo
      },
      coordinate: evt.coordinate
    }
    xbus.trigger('MAP-TOOLTIPS-SHOW', msg1)
  }

  registerGlobalEventHandlers () {
    let self = this

    // 显示隐藏红绿灯
    xbus.on('MAP-SHOW-LIGHT', msg => {
      if (msg.mapType === 'MONITOR') {
        window.isShowLight = msg.isVisible
        if (msg.isVisible) {
          this.removeOrAddOverlayHide('remove')
          this.lightLayer.setVisible(true)
          if (msg.id) {
            window.triggerLocating({
              cards: msg.id,
              type: msg.type,
              symbolType: 'light'
            })
          }
        } else {
          this.removeOrAddOverlayHide('add')
          this.lightLayer.setVisible(false)
          this.stopLocation()
        }
      }
    })

    xbus.on('LIGHTS-STATE-UPDATE', (data)=>{
      this.drawLightsAndChangeState(data)
    })
     //登录的时候会有全量数据过来，直接画红绿灯，也可以初始化所有的灯为默认值

    xbus.on('LIGHT-WARN-UPDATE', (data) => {
      let status = data.status
      let physicsLightID = data.obj_id
      let lights = xdata.metaStore.dataInArray.get('light')
      let rows = lights && lights.filter(item => item.light_id === parseInt(physicsLightID, 10))
      if (!rows) return
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        let groupId = row.lights_group_id
        let lightId = row.light_id
        let stateName = status === 0 ? '异常' : '绿'
        let x = row.x, y = row.y
        let msg = [groupId, lightId, '', '']
        this.drawLights(msg, stateName, x, y)
      }
    })
    xbus.on('DRAW-LIGHT-UPDATE', () => {
      this.resetLayer()
    })
  }
  
  initDrawTrafficLisght () {
    let data =  xdata.metaStore.data.light && Array.from(xdata.metaStore.data.light.values()).map(item =>[item.lights_group_id, item.light_id, 10, '']) // ['灯组ID', '红绿灯id', '设备状态', '红绿灯控制人']
    data && this.drawLightsAndChangeState(data)
  }

  drawLightsAndChangeState (data) {
    //todo: 判断是否被画，被画后执行改变状态函数,或者可以用groups存起来，减少遍历
    for (let i = 0, len = data.length; i < len; i++) {
      let row = data[i]
      // 以告警红绿灯颜色为主
      let alarms = xdata.alarmStore.onAlarming && Array.from(xdata.alarmStore.onAlarming.values())
      let isExitAlarm = alarms && alarms.find(item => Number(item.type_id) === 8 && Number(item.obj_id) === row[1])
      let lightData = xdata.metaStore.data.light.get(row[1]),
          x = lightData && lightData.x, 
          y = lightData && lightData.y
      let stateData = xdata.metaStore.data.device_state.get(row[2])
      let stateName = stateData && defColorArr.includes(stateData.name) && stateData.name
      if (isExitAlarm) stateName = '异常'
      if(!stateName){
        console.warn('unknow light state,pleace check device_state config!')
        continue
      }
      this.drawLights(row, stateName, x, y)
    }
  }

  removeOrAddOverlayHide(type) {
    let overlays = document.getElementsByClassName('lightFlash')
    if (overlays && overlays.length > 0) {
      for (let i=0,len = overlays.length; i<len; i++) {
        type === 'remove' ?  overlays[i].classList.remove('hide') : overlays[i].classList.add('hide') 
      }
    }
  }

  drawLights (row, stateName, x, y) {
    let lightsGroupID = row[0]
    let lightsGroupObj = xdata.metaStore.data.lights_group && xdata.metaStore.data.lights_group.get(lightsGroupID)
    let areaID = lightsGroupObj && lightsGroupObj.area_id
    let areaObj = xdata.metaStore.data.area && xdata.metaStore.data.area.get(areaID)
    let mapID = areaObj && areaObj.map_id
    let defaultMapID = parseInt(xdata.metaStore.defaultMapID, 10)
    if (testMapID(mapID, defaultMapID)) {
      if (this.setStateAndNeedRedraw(row, stateName, x, y)) {
        if (stateName === '闪烁') {
          this.mapAddOverlay(row,x,y)
          this.overlayGroups.set(row[1], true)
        } else {
          let attrs = {
            'groupId': row[0],
            'data-id': row[0] + '-' + row[1],
            'id': row[1],
            'data-type': 'lights',
            'data_subtype': 'traffic-lights', //设备类型名
            'stateCtrl': row[3] ? 1 : 0,
            'ctrlUser': row[3],
            x: x,
            y: y,
            class: '',
            state: stateName
          }
          drawSymbol(attrs, this.lightLayerSource, this.map)
        }
      }
    }
  }

  setStateAndNeedRedraw (data, stateName, x, y) {
    let feature = this.lightLayerSource.getFeatureById(data[0] + '-' + data[1]),src
    let overlay = this.overlayGroups.get(data[1])
    if (!overlay && !feature) return true //都没有,即新画

    if (feature) {// 如果有，改状态,也有可能是改为overlay，改后不需要重画
      if (stateName === '闪烁') {
        this.mapAddOverlay(data, x, y)
        this.overlayGroups.set(data[1], true)
        this.lightLayerSource.removeFeature(feature)
      } else {
        if (stateName === '红') src = `../../img/lightred.png`
        if (stateName === '绿') src = `../../img/lightgreen.png`
        if (stateName === '黄') src = `../../img/lightyellow.png`
        if (stateName === '异常') src = '../../img/lightgrey.png'
        let style = {image: new ol.style.Icon({src: src,scale: 0.08})}
        let attributes = {
          'groupId': data[0],
          'data-id': data[0] + '-' + data[1],
          'id': data[1],
          'data-type': 'lights',
          'data_subtype': 'traffic-lights', // 设备类型名
          'stateCtrl': data[3] ? 1 : 0,
          'ctrlUser': data[3],
          x: x,
          y: y,
          class: '',
          state: stateName
        }
        feature.setProperties(attributes)
        feature.setStyle(new ol.style.Style(style))
      }
      return false 
    }

    if (overlay) { // 原来是overlay,需要改为feature,需要重画
      this.removeOverlay(data) 
      return true 
    }
  }

  removeOverlay (data) {
    let overlay = this.map.getOverlayById('lightFlash' + data[1])
    overlay && this.map.removeOverlay(overlay)
  }

  mapAddOverlay (data,x,y) {
    let curLayerShow = this.lightLayer.getVisible()
    let div = document.createElement('div')
    curLayerShow ? div.setAttribute('class', 'lightFlash') : div.setAttribute('class', 'lightFlash hide')
    div.setAttribute('id', data[1])
    div.setAttribute('groupId', data[0])
    div.setAttribute('ctrlUser', data[3])
    div.setAttribute('stateCtrl', data[4])

    let pointOverlay = new ol.Overlay({
      element: div,
      positioning: 'center-center',
      id: 'lightFlash' + data[1],
      stopEvent: false
    })

    div.addEventListener("click", this.showTips.bind(this,div,'overlay'))
    this.map.addOverlay(pointOverlay)
    pointOverlay.setPosition([x, -y])
  }

  stopLocation () {
    let keys = Array.from(xdata.locateStore.localLight.keys())
    if (keys.length > 0) {
      window.cardStopLocating({
        cards: keys
      })
    }
  }
  resetLayer () {    
    this.lightLayerSource && this.lightLayerSource.clear()
    this.initDrawTrafficLisght()
  }
}