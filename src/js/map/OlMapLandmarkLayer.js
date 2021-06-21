import ol from 'openlayers'
import { drawSymbol } from './OlMapUtils.js'
import { SYMBOL_TYPE } from './Symbol.js'

export default class OlMapLandmarkLayer {
  constructor (glayer) {
    this.map = glayer.map
    this.draw = glayer.draw
    this.source = null
    this.tool = null
    this.initLayers()
    this.registerGlobalEventHandlers()
  }

  initLayers () {
    this.landmarkerSource = new ol.source.Vector()
    this.landmarkerLayer = new ol.layer.Vector({
      source: this.landmarkerSource,
      style: new ol.style.Style({
        zIndex: 3
      })
    })

    this.landmarkerLayer.setVisible(false)
    this.map.addLayer(this.landmarkerLayer)
    this.isLandmarkerLayer = false
  }

  drawAllLandmarker () {
    let landmarks = xdata.metaStore.data.landmark && Array.from(xdata.metaStore.data.landmark.values())
    this.mapID = xdata.metaStore.defaultMapID 
    if (landmarks) {
      for (let landmark of landmarks) {
        let areaID = landmark.area_id
        let areaObj = xdata.metaStore.data.area && xdata.metaStore.data.area.get(areaID)
        let mapID = areaObj && areaObj.map_id
        if (mapID === this.mapID) {
          this.drawLandmarkerOn(landmark)
        }
      }
    }
    this.isLandmarkerLayer = true
  }

  drawLandmarkerOn (landmark) {
    let landmarkID = landmark.landmark_id
    let attrs = {
      'data-id': landmarkID,
      'data-number': landmark.name,
      'data_subtype': SYMBOL_TYPE.LANDMARKER,
      'data-type': SYMBOL_TYPE.LANDMARKER,
      x: landmark.x,
      y: landmark.y,
      class: 'icon-device state-connected',
      geom: landmark.geom
    }
    return drawSymbol(attrs, this.landmarkerSource, this.map)
  }

  registerGlobalEventHandlers () {
    let self = this

    xbus.on('MAP-SHOW-LANDMARK', (msg) => {
      window.isShowLandMarker = msg.isVisible
      if (msg.isVisible) {
        if (!this.isLandmarkerLayer) {
          self.drawAllLandmarker()
        }
        this.landmarkerLayer.setVisible(true)
        if (msg.id) {
          window.triggerLocating({
            cards: msg.id,
            type: msg.type,
            symbolType: 'landmark'
          })
        }
      } else {
        this.landmarkerLayer.setVisible(false)
        self.stopLocation()
      }
    })


    xbus.on('DRAW-MAP-LANDMARK', (msg) => {
      let feature = this.landmarkerSource.getFeatureById(Number(msg.landmarkID))
      if (feature) {
        this.landmarkerSource.removeFeature(feature)
      }
      this.isLandmarkerLayer = false
    })

    xbus.on('DRAW-LANDMARKER-UPDATE', () => {
      this.resetLayer()
      this.stopLocation()
    })
  }

  stopLocation() {
    let keys = Array.from(xdata.locateStore.locateLandmark.keys())
    if (keys.length > 0) {
      window.cardStopLocating({
        cards: keys
      })
    }
  }

  resetLayer () {    
    this.landmarkerSource && this.landmarkerSource.clear()
    this.drawAllLandmarker()
  }
}
