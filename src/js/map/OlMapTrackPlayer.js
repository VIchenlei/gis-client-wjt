// import TWEEN from 'tween.js'
import OlMapTrackLayer from './OlMapTrackLayer.js'
import { getPolylineBYPoints, drawOLLine } from './OlMapUtils.js'
import { clone } from '../utils/utils'
import ol from 'openlayers'
import {mapIcon} from '../def/map_icon.js'
let trackIcon = mapIcon.track
export default class OlMapTrackPlayer extends OlMapTrackLayer {
  constructor (workspace) {
    super(workspace)
    this.map = workspace.map
    this.trackWhole = null
    this.layerSource = new ol.source.Vector()
    this.trackPlayerLayer = new ol.layer.Vector({source: this.layerSource})
    this.trackPlayerLayer.name = 'trackplayerlayer'
    this.map.addLayer(this.trackPlayerLayer)
  }

  drawWholeTrack (msg, PatrolPath) {
    let cardID = msg.cardID
    this.data = msg.rows
    let data = this.data
    let track = this.drawOLTrack(cardID, data, 'track-whole', PatrolPath)

    this.trackWhole = { cardID: cardID, pathDef: track.pathDef, pathDom: track.pathDom, pathLength: track.pathLength }
  }

  drawOLTrack (cardID, data, className, PatrolPath) {
    let track = null
    let path = this.getPolylineBYPoints(data, null, this.mapID)
    if (path.hopCount > 0) {
      if (path.indexArray.length > 0) {
        let id = `HISTORY_TRACK_${cardID}`
        for (let i = 0; i < path.pointCol.length; i++) {
          let type = null
          if (i === 0) type = 'start'
          if (i === path.pointCol.length - 1) type = 'end'
          track = this.drawOLLine(this.layerSource, path.pointCol[i], className, type)
        }
      } else {
        let id = `HISTORY_TRACK_${cardID}`
        track = drawOLLine(this.layerSource, id, path.pointCol, className, PatrolPath)
      }
    }
    return { pathDom: track.lineFeature, pathLength: track.lineLength, pathDef: path }
  }

  getPolylineBYPoints(data, special, mapID) {
    if (!data || data.length <= 0) {
      return { data: null, hopCount: 0, path: '' }
    }
    let indexArray = this.getDifferentMapIndexArray(data)
    let pointList = new Array()
    let hopCount = data.length
    if (indexArray && indexArray.length > 0) {
      let pointsArray = []
      for (let i = 0; i < indexArray.length; i++) {
        let cloneData = clone(data)
        if (i < indexArray.length - 1) {
          if (i === 0) {
            pointsArray.push(cloneData.splice(indexArray[i], indexArray[i+1] + 1))
          } else {
            pointsArray.push(cloneData.splice(indexArray[i], indexArray[i+1]-indexArray[i] + 1))
          }
        }
      }
      pointList = this.getPointList(pointsArray, special, mapID)
    } else {
      for (let i = 0; i < hopCount; i++) {
        let item = data[i]
        if (mapID && item.map_id !== mapID) continue
        
        let x = item.x
        let y = item.y
        if (special) {
          let coordinates = item[special] && item[special].split(',')
          x = Number(coordinates[0])
          y = Number(coordinates[1])
        }
        pointList.push([x, -y])
      }
    }
    
    return { data: data, hopCount: hopCount, pointCol: pointList, indexArray }
  }

  getDifferentMapIndexArray(data) {
    let indexArray = []
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (i < data.length - 1 && item.map_id !== data[i + 1].map_id) {
        indexArray.push(i)
      }
    }
    if (indexArray.length > 0) {
      indexArray.unshift(0)
      indexArray.push(data.length - 1)
    }
    return indexArray
  }
  
  getPointList(pointsArray, special, mapID) {
    let pointList = []
    for (let i = 0; i < pointsArray.length; i++) {
      let data = pointsArray[i]
      if (data[2] && data[2].map_id !== mapID) continue
      let points = []
      for (let j = 0; j < data.length; j++) {
        let item = data[j]
        let x = item.x
        let y = item.y
        if (special) {
          let coordinates = item[special] && item[special].split(',')
          x = Number(coordinates[0])
          y = Number(coordinates[1])
        }
        points.push([x, -y])
      }
      pointList.push(points)
    }
    return pointList
  }

  createPathStyle () {
    const style = {
      stroke: { width: 4, color: '#FFCC33' },
      fill: { color: 'rgba(255,255,255,0.2)'},
    }
    return new ol.style.Style({
      stroke: new ol.style.Stroke(style.stroke),
      fill: new ol.style.Fill(style.fill)
    })
  }

  drawOLLine (layerSource, point, name, type) {
    const linestring = new ol.geom.LineString(point) // 坐标数组
    const lineLength = linestring.getLength()
    var lineFeature = new ol.Feature({
      geometry: linestring,
      id: name,
      finished: false
    })
    
    lineFeature.setStyle(this.createPathStyle())
    let startMarker = null, endMarker = null
    if (type === 'start') {
      startMarker = new ol.Feature({
        geometry: new ol.geom.Point(point[0])
      })
      startMarker.setStyle(trackIcon['startMarker'])
      startMarker.setProperties({
        'id': name,
        'data-type': 'startMarker'
      })
    } else if (type === 'end') {
      endMarker = new ol.Feature({
        geometry: new ol.geom.Point(point[point.length - 1])
      })
      endMarker.setStyle(trackIcon['endMarker'])
      endMarker.setProperties({
        'id': name,
        'data-type': 'endMarker'
      })
    }
    layerSource.addFeature(lineFeature)
    if (startMarker) layerSource.addFeature(startMarker)
    if (endMarker) layerSource.addFeature(endMarker)
    return { lineFeature, lineLength }
  }
}
