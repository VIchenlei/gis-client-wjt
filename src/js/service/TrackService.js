import { CARD } from '../def/state.js'
import ol from 'openlayers'
import {ZOOM_LEVEL} from '../def/map_def.js'
let map = null
export default class TrackService {
  constructor (cardLayer) {
    if (cardLayer.mapType === 'MONITOR') {
      this.cardLayer = cardLayer
      xdata.trackStore.vehicleLayerSource = cardLayer.vehicleLayerSource
      xdata.trackStore.staffLayerSource = cardLayer.staffLayerSource
      map = cardLayer.map
    }
    this.vehicleLayerSource = xdata.trackStore.vehicleLayerSource
    this.staffLayerSource = xdata.trackStore.staffLayerSource
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    let self = this

    // 切换跟踪状态
    window.trackToggle = (msg) => {
      self.toggleTracking(msg)
    }

    // 地图卡更新
    xbus.on('MAP-CARD-UPDATE', (msg) => {
      if (msg && msg.card && xdata.trackStore.has(msg.card[CARD.card_id])) {
        self.trackTo(msg.card)
      }
    })
  }


  /**对象移动时，增加一段轨迹 */
  trackTo (card) {
    let cardID = card[CARD.card_id]
    let cardTypeName = this.getCardTypeName(cardID)
    let lineFeatureID = cardID + 'line'
    let feature = this.getFeature(cardTypeName, lineFeatureID)
    if (feature && feature.getId() === lineFeatureID) {
      let linestring = feature.getGeometry()
      linestring.appendCoordinate([card[CARD.x], -card[CARD.y]])
      feature.setGeometry(linestring)
    }
  }

  /**切换追踪的状态 */
  toggleTracking (msg) {
    let cards = msg.cards
    for (let i = 0, len = cards.length; i < len; i++) {
      let cardID = cards[i]
      xdata.trackStore.has(cardID) ? this.stopTracking(cardID) : this.startTracking(cardID)
    }
  }

  /**根据卡号判断卡的类型 */
  getCardTypeName (cardID) {
    let cardTypeName = xdata.metaStore.getCardTypeName(cardID)
    if (!cardTypeName) {
      cardID = String(cardID)
      if (/^001/.test(cardID)) {
        cardTypeName = 'staff'
      } else if (/^002/.test(cardID)) {
        cardTypeName = 'vehicle'
      }
    }
    return cardTypeName
  }

  /**开始跟踪 */
  startTracking (cardID) {
    let cardTypeName = this.getCardTypeName(cardID)
    let lineFeatureID = cardID + 'line'
    let lfeature = this.getFeature(cardTypeName, lineFeatureID)

    if (!lfeature) {
      let iconFeatureID = cardID
      let ifeature = this.getFeature(cardTypeName, iconFeatureID)
      let coord = ifeature && ifeature.getGeometry().getCoordinates()
      if (!coord) {
        let card = xdata.cardStore.getLastState(cardID)
        let x = Number(card[CARD.x])
        let y = -Number(card[CARD.y])
        coord = [x, y]
      }
      let posdata = [coord, coord]
      let trackFeature = new ol.Feature({
        geometry: new ol.geom.LineString(posdata)
      })
      trackFeature.setProperties({type: 'trackFeature'})
      trackFeature.setId(lineFeatureID)
      trackFeature.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 3,
          color: [255, 0, 0, 1]
        })
      }))

      this.addFeature(cardID, cardTypeName, trackFeature)
      this.panCenterTo(coord)
    }
  }

  /**地图移动至以x,y为坐标点 */
  panCenterTo ([x, y]) {
    let view = map.getView()
    view.animate({
      center: [x, y],
      duration: 1000,
      zoom: ZOOM_LEVEL.STAFFLEAVE
    })
  }

  /**停止跟踪 */
  stopTracking (cardID) {
    let cardTypeName = this.getCardTypeName(cardID)
    let lineFeatureID = cardID + 'line'
    let lfeature = this.getFeature(cardTypeName, lineFeatureID)
    this.removeFeature(cardID, cardTypeName, lfeature)
    xbus.trigger('MAP-UPDATE-SIZE')
  }

  /**在图层上添加追踪路线 */
  addFeature (cardID, cardTypeName, feature) {
    if (cardTypeName === 'vehicle') {
      this.vehicleLayerSource.addFeature(feature)
    } else if (cardTypeName === 'staff') {
      this.staffLayerSource.addFeature(feature)
    }
    xdata.trackStore.set(cardID, true)
  }

  /**在图层上删除追踪路线 */
  removeFeature (cardID, cardTypeName, feature) {
    if (feature) {
      if (cardTypeName === 'vehicle') {
        this.vehicleLayerSource && this.vehicleLayerSource.getFeatureById(cardID + 'line') && this.vehicleLayerSource.removeFeature(feature)
      } else if (cardTypeName === 'staff') {
        this.staffLayerSource && this.staffLayerSource.getFeatureById(cardID + 'line') && this.staffLayerSource.removeFeature(feature)
      }
    }
    xdata.trackStore.delete(cardID)
  }

  /**根据卡类型以及feature的id获取feature */
  getFeature (cardTypeName, featureID) {
    let feature = null
    if (cardTypeName === 'vehicle') {
      feature = this.vehicleLayerSource.getFeatureById(featureID)
    } else if (cardTypeName === 'staff') {
      feature = this.staffLayerSource.getFeatureById(featureID)
    }
    return feature
  }
}
