import ol from 'openlayers'
import { getReaderCoord, getAantennaAngle } from '../../tags/rs-disc/rs-disc.js'
import {
  testMapID
} from '../utils/utils.js'

export default class OlMapAntennaLayer {
  constructor (glayer) {
    this.mapType = glayer.mapType
    this.map = glayer.map
    this.initLayer()
    this.registerGlobalEventHandlers()
  }

  initLayer () {
    this.antennaLayerSource = new ol.source.Vector()
    this.antennaLayer = new ol.layer.Vector({
      source: this.antennaLayerSource,
      zIndex: 5
    })
    this.map.addLayer(this.antennaLayer)
  }

  registerGlobalEventHandlers () {
    xbus.on('MAP-SHOW-ANTENNA', (msg) => {
      this.mapID = xdata.metaStore.defaultMapID
      this.drawAntenna(msg)
    })

    xbus.on('MAP-LOAD-SUCESS', () => {
      this.antennaLayerSource.clear()
      this.mapID = xdata.metaStore.defaultMapID
      this.drawAntenna({})
      this.antennaLayer.setVisible(false)
    })
  }

  drawAntenna (msg) {
    const { name, checked } = msg
    const keyValue = parseInt(name, 10)
    let reader = xdata.metaStore.data.reader && xdata.metaStore.data.reader.get(keyValue)
    const antennas = xdata.metaStore.data.antenna && Array.from(xdata.metaStore.data.antenna.values())
    let antenna = keyValue ? antennas.filter(item => item.reader_id === keyValue) : antennas
    const pathColor = ['#9932CD', '#70DB93']
    if (checked || msg.isVisible) {
      this.antennaLayer.setVisible(true)
      if (antenna && antenna.length > 0) {
        for (let i = 0; i < antenna.length; i++) {
          reader = keyValue ? reader : xdata.metaStore.data.reader && xdata.metaStore.data.reader.get(antenna[i].reader_id)
          if (!reader) continue
          let areaID = reader.area_id
          let areaObj = xdata.metaStore.data.area && xdata.metaStore.data.area.get(areaID)
          let mapID = areaObj && areaObj.map_id
          if (testMapID(mapID, this.mapID)) {
            if (!keyValue) {
              !xdata.antennaStore.showAntenna.get(reader.reader_id) && xdata.antennaStore.showAntenna.set(reader.reader_id, true)
            }
            const color = antenna[i].idx === 1 ? pathColor[0] : pathColor[1]
            const angle = getAantennaAngle(reader.x, -reader.y, antenna[i].x, -antenna[i].y)
            const point = getReaderCoord(reader.x, -reader.y, 5, angle)
            const pathArray = [[reader.x, -reader.y], [point.x, point.y]]
            let idx = antenna[i].idx
            let readerId = keyValue ? keyValue : antenna[i].reader_id
            this.drawOLLine(this.antennaLayerSource, pathArray, readerId, color, idx)
          }
        }
      }
    } else {
      if (keyValue) {
        // 关闭具体分站的天线
        const features = this.antennaLayerSource.getFeatures()
        for (let feature of features) {
          const id = feature.getProperties().id
          if (id == keyValue) this.antennaLayerSource.removeFeature(feature)
        } 
      } else {
        this.antennaLayerSource.clear() 
        // 清空store
        let keys = Array.from(xdata.antennaStore.showAntenna.keys())
        if (keys && keys.length > 0) {
          keys.forEach(key => {
            xdata.antennaStore.showAntenna.delete(key)
          })
        }
      }
    }
  }


  getDeviceText(idx) {
    if (!idx) return ''
    let t
    let briefName = idx
    if (briefName) {
      t = {
        text: `${briefName}`,
        font: '12px',
        fill: new ol.style.Fill({color: '#09f'}),
        stroke: new ol.style.Stroke({lineCap: 'square', color: '#fff', miterLimit: 10, width: 10}),
        offsetY: 0
      }
    }
    return t
  }

  drawOLLine (layerSource, point, name, color, idx) {
    let t = this.getDeviceText(idx)
    const linestring = new ol.geom.LineString(point) // 坐标数组
    const lineLength = linestring.getLength()
    var lineFeature = new ol.Feature({
      geometry: linestring,
      id: name,
      finished: false
    })

    const style = {
      stroke: { width: 4, color: color },
      fill: { color: 'rgba(255,255,255,0.2)'}
    }
    let ant = new ol.style.Style({
      stroke: new ol.style.Stroke(style.stroke),
      fill: new ol.style.Fill(style.fill),
      text: new ol.style.Text(t)
    })

    lineFeature.setStyle(ant)
    layerSource.addFeature(lineFeature)
    return { lineFeature, lineLength }
  }
}