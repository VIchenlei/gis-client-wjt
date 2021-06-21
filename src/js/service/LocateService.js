import { CARD } from '../def/state.js'
import ol from 'openlayers'
import {ZOOM_LEVEL} from '../def/map_def.js'
let map = null
export default class LocateService {
  constructor (cardLayer) {
    if (cardLayer.mapType === 'MONITOR') {
      map = cardLayer.map
    }
    this.cardLayer = cardLayer
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    let self = this

    /*
      // 处理  标识卡 的定位，输入消息定位如下
      msg ={
        action: 'START',  // *, START, STOP
        cards: [id, id, ...],  // *, id list
        type: 'ALARM'  // 可选，默认无此字段或null，即手工触发定位；告警定位为 ALARM
      }
    */
    
    /**
     * 进入定位状态
     * msg:
     *  cards: [id, id, ...]
     *  type: ''/ALARM/HEPL   '' 白色  ALARM/HEPL 红色
     *  symbolType： 'staff'/'vehicle/reader/landmark'
    */
    window.cardStartLocating = (msg) => {
      let cards = msg.cards
      for (let i = 0, len = cards.length; i < len; i++) {
        let cardID = cards[i]
        self.startLocating(cardID, msg.type, msg.symbolType)
      }
    }

    /**
     * 停止定位状态
     * msg:
     *  cards: [id, id, ...]
     */
    window.cardStopLocating = (msg) => {
      let cards = msg.cards
      for (let i = 0, len = cards.length; i < len; i++) {
        let cardID = cards[i]
        self.stopLocating(cardID)
      }
    }

    /**
     * msg:
     *  cards: [id, id, ...]
     *  type: ''/ALARM/HEPL   '' 白色  ALARM/HEPL 红色
     *  symbolType： 'staff'/'vehicle/reader/landmark'
    */
    window.triggerLocating = (msg) => {
      self.toggleLocating(msg)
    }
  }

  /**切换定位状态 */
  toggleLocating (msg) {
    let type = msg.type
    let cards = msg.cards
    let symbolType = msg.symbolType
    for (let i = 0, len = cards.length; i < len; i++) {
      let cardID = cards[i]
      xdata.locateStore.locates.has(cardID) ? this.stopLocating(cardID) : this.startLocating(cardID, type, symbolType)
    }
  }

  /**移动地图，将(x,y)放置到视图中心 */
  panCenterTo (x, y) {
    let view = map.getView()
    view.animate({
      center: [x, y],
      duration: 1000,
      zoom: ZOOM_LEVEL.STAFFLEAVE
    })
  }


  /**
   * 启动单张卡的定位
   * @param {*} cardID 卡号
   * @param {*} type 定位类型
   * @param {*} symbolType 设备类型
   */
  startLocating (cardID, type, symbolType) {
    let x, y
    if (symbolType) {
      let card = xdata.metaStore.data[symbolType]
      card = card && card.get(Number(cardID))
      if (!card) {
        console.warn('当前井下没有此设备', cardID)
        return
      }
      x = card.x
      y = -card.y
    } else {
      let card = xdata.cardStore.getLastState(cardID)
      if (!card) {
        console.warn('当前井下没有此卡: ', cardID)
        return
      }
      x = card[CARD.x]
      y = -card[CARD.y]
    }

    if (!xdata.locateStore.locates.has(cardID)) {
      this.doLocating(cardID, type, x, y)
      xdata.locateStore.locates.set(cardID, true)
      if ((/^001/i).test(cardID)) {
        xdata.locateStore.locatestaff.set(cardID, true)
      } else if ((/^002/i).test(cardID)) {
        xdata.locateStore.locatevehicle.set(cardID, true)
      } else if (symbolType === 'reader') {
        xdata.locateStore.localReader.set(cardID, true)
      } else if(symbolType === 'landmark'){
        xdata.locateStore.locateLandmark.set(cardID, true)        
      } else if (symbolType === 'light') {
        xdata.locateStore.localLight.set(cardID, true)
      }
    }
    this.panCenterTo(x, y)
  }

  /**绘制定位圆圈 */
  doLocating (cardID, type, x, y) {
    let div = document.createElement('div')
    let circleClass = 'css_animation'
    if (type === 'ALARM' || type === 'HELP') circleClass = 'css_animation_alarm'
    div.setAttribute('id', circleClass)
    div.setAttribute('class', 'animation' + cardID)
    let pointOverlay = new ol.Overlay({
      element: div,
      positioning: 'center-center',
      id: 'position' + cardID,
      stopEvent: false
    })
    map.addOverlay(pointOverlay)
    pointOverlay.setPosition([x, y])
  }


  /**
   * 停止单张卡的定位
   * @param {*} cardID 卡号
  */
  stopLocating (cardID) {
    let position = map.getOverlayById('position' + cardID)
    position && map.removeOverlay(position)
    xdata.locateStore.locates.delete(cardID)
    if ((/^001/i).test(cardID)) {
      xdata.locateStore.locatestaff.delete(cardID, true)
    } else if ((/^002/ig).test(cardID)) {
      xdata.locateStore.locatevehicle.delete(cardID, true)
    } else if (xdata.locateStore.locateLandmark.get(cardID)){
      xdata.locateStore.locateLandmark.delete(cardID, true)
    } else if (xdata.locateStore.localReader.get(cardID)) {
      xdata.locateStore.localReader.delete(cardID, true)
    } else if (xdata.locateStore.localLight.get(cardID)) {
      xdata.locateStore.localLight.delete(cardID)
    }
  }
}
