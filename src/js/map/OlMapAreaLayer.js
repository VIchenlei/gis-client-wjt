import ol from 'openlayers'
import { config } from '../../config/js/config_def.js'
import { ZOOM_LEVEL } from '../def/map_def.js'
import {convertSVGPath2Coord, getUpdateRows} from './OlMapUtils.js'
import { testMapID } from '../utils/utils.js'
import { AREALAYERDEF } from '../def/areaLayerDef.js'

export default class OlMapAreaLayer {
  constructor (glayer) {
    this.areaList = new Map()
    this.map = glayer.map
    this.mapType = glayer.mapType
    this.isAreasDrawed = false
    this.path = null
    this.areaSelect = new ol.interaction.Select()
    this.areaModify = new ol.interaction.Modify({
      features: this.areaSelect.getFeatures()
    })
    this.isEditing = false
    this.initLayer()
    this.registerGlobalEventHandlers()
    this.highlight()
  }

  registerGlobalEventHandlers () {
    let self = this

    // 关闭对话框重绘区域
    xbus.on('AREA-INIT', msg => {
      if (this.feature) this.feature.setGeometry(null)
      let feature = this.layerSource.getFeatureById('area' + msg.area)
      if (feature) this.layerSource.removeFeature(feature)
      const area = xdata.metaStore.data.area && xdata.metaStore.data.area.get(msg.area)
      if (!area) return
      const areaMsg = {
        mapID: this.mapID,
        mapType: this.mapType,
        isVisible: true,
        visiblearea: `area_${area.area_type_id}`
      }
      let visibleAreaType = this.getVisibleAreaType(areaMsg)
      this.drawArea(areaMsg, area, visibleAreaType)
    })

    xbus.on('MAP-SHOW-AREA', (msg) => {
      if(msg.hasOwnProperty('fromPage')){
        if (this.feature) this.feature.setGeometry(null)
        let feature = this.layerSource.getFeatureById('area' + msg.areas)
        if (feature) this.layerSource.removeFeature(feature)
        this.isAreasDrawed = false
      }
      self.showArea(msg)
      window.AreaLayerShow = msg.isVisible
    })

    xbus.on('DRAW-AREA-UPDATE', () => {
      this.layerSource.clear()
      this.mapID = xdata.metaStore.defaultMapID
      this.drawAreas()
      let show = window.AreaLayerShow
      this.areaLayer.setVisible(show)
    })

    xbus.on('MAP-LOAD-SUCESS',()=>{
      this.layerSource.clear()
      this.alarmAreaSource.clear()
      this.mapID = xdata.metaStore.defaultMapID
      this.drawAreas()
      this.areaLayer.setVisible(false)
    })

    xbus.on('REMOVE-MAP-AREA', (msg) => {
      if (msg.id) {
        let feature = this.layerSource.getFeatureById('area' + msg.id)
        feature && this.layerSource.removeFeature(feature)
      }
    })

    xbus.on('MAP-AREAEDIT', (msg) => {
      this.areaSelect.setActive(true)
      this.areaModify.setActive(true)
      this.isEditing = true
      this.map.addInteraction(this.areaSelect)
      this.map.addInteraction(this.areaModify)
      this.unpdateAreaId = !msg.id ? null : msg.id
    })

    this.map.addEventListener('dblclick', (evt) =>{
      if (!this.isEditing) return
      this.isEditing = false
      this.areaSelect.setActive(false)
      this.areaModify.setActive(false)
      this.map.removeInteraction(this.areaSelect)
      this.map.removeInteraction(this.areaModify)
      this.editEnd(evt)
    })

    this.areaModify.on('modifystart', (e) => {
      let id = e.features.getArray()[0].getId()
      let currentId = 'area' + this.unpdateAreaId
      if (id !== currentId) {
        self.areaModify.setActive(false)
        self.map.removeInteraction(self.areaSelect)
      }
    })

  }

  handleSubtype (feature, evt) {
    const id = feature.getId()
    const currentId = 'area' + this.unpdateAreaId
    if (id !== currentId) {
      this.areaModify.setActive(false)
      this.map.removeInteraction(this.areaSelect)
    } else {
      this.areaModify.setActive(true)
      this.map.addInteraction(this.areaSelect)
    }

    if (!this.isEditing) {
      this.showTips(evt, feature)
    }
  }

  initLayer () {
    this.layerSource = new ol.source.Vector()
    this.areaLayer = new ol.layer.Vector({
      source: this.layerSource,
      zIndex: 1
    })
    this.areaLayer.setVisible(true)
    this.alarmAreaSource = new ol.source.Vector()
    this.alarmAreaLayer = new ol.layer.Vector({
      source: this.alarmAreaSource,
      zIndex: 1
    })
    this.map.addLayer(this.areaLayer)
    this.map.addLayer(this.alarmAreaLayer)
  }

  highlight () {
    let featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: this.map,
      zIndex: -10
    })
    let highlight
    let self = this
    let displayFeatureInfo = function (pixel) {
      let feature = self.map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature
      })
      let name = feature && feature.getProperties() && feature.getProperties().name
      if (name === 'fadeArea') return
      if (feature !== highlight) {
        if (highlight && name !== 'workArea' && name !== 'belt') {
          featureOverlay.getSource().removeFeature(highlight)
        }
        if (feature && name !== 'workArea' && name !== 'belt') {
          featureOverlay.getSource().addFeature(feature)
        }
        if (name !== 'workArea' && name !== 'belt') {
          highlight = feature
        }
      }
    }

    this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return
      }
      var pixel = self.map.getEventPixel(evt.originalEvent)
      displayFeatureInfo(pixel)
    })
  }

  showArea (msg) {
    if (msg.mapType !== this.mapType) return
    if (msg.isVisible) {
      if (msg.type && testMapID(msg.mapID, this.mapID)) {
        this.drawAlarmArea(msg)
      } else {
        if (!this.isAreasDrawed) {
          this.drawAreas(msg)
        }
        this.setDiffAreaTypeVisible(msg)
        this.areaLayer.setVisible(true)
      }
    } else {
      if (msg.type && testMapID(msg.mapID, this.mapID)) {
        this.removeAlarmArea(msg)
      } else {
        this.unvisible(msg)
        if (Array.from(this.areaList.values()).length <= 0) this.areaLayer.setVisible(false)
      }
    }
  }

  drawAlarmArea (msg) {
    if (xdata.metaStore.data.area) {
      let locationareas = msg.areas
      for (let localarea of locationareas) {
        let areaID = localarea
        let isLocalArea = this.alarmAreaSource.getFeatureById('location' + areaID)
        if (isLocalArea) {
          let locatingarea = xdata.locateStore.locateAreas.get(areaID)
          if (locatingarea !== msg.type) {
            let text = isLocalArea.get('areaLabel')
            isLocalArea.setStyle(this.createPolygonStyle(text, msg.type))
          }
        } else {
          let area = xdata.metaStore.data.area.get(areaID)
          let areaLabel = xdata.metaStore.getNameByID('area_id', areaID)
          if (area && area.path) {
            let coordinates = []
            let paths = area.path.split(' ')
            for (let path of paths) {
              let point = path.split(',')
              let x = Number(point[0].substring(1))
              let y = -Number(point[1])
              coordinates.push([x, y])
            }
            let message = {
              areaLabel: areaLabel,
              data_subtype: 'area'
            }
            let polygon = new ol.geom.Polygon([coordinates])
            let center = polygon.getInteriorPoint().getCoordinates()
            this.map.getView().animate({
              center: center,
              duration: 1000,
              zoom: ZOOM_LEVEL.SMALL
            })
            let feature = new ol.Feature(polygon)
            feature.setId('location' + areaID)
            feature.setProperties(message)
            this.alarmAreaSource.addFeature(feature)
            feature.setStyle(this.createPolygonStyle(areaLabel, msg['type']))
          }
        }
      }
    }
  }

  removeAlarmArea (msg) {
    let areas = msg.areas
    for (let i = 0, len = areas.length; i < len; i++) {
      let areaID = areas[i]
      this.deleteArea(areaID)
      xdata.locateStore.locateAreas.delete(areaID)
    }
  }

  deleteArea (areaID) {
    let feature = this.alarmAreaSource.getFeatureById('location' + areaID)
    if (feature) this.alarmAreaSource.removeFeature(feature)
  }

  drawFeature (area, featureID, areaType, visibleAreaType) {
    let feature = null
    if (xdata.isCheck === 1 && area.need_display === 0) return
    let areaLabel = xdata.metaStore.getNameByID('area_id', area.area_id)
    if (area.path) {
      let coordinates = convertSVGPath2Coord(area.path)
      let polygon = new ol.geom.Polygon([coordinates])
      polygon.set(featureID, featureID, true)
      feature = new ol.Feature(polygon)
    } else if (area.geom) {
      let wkt = new ol.format.WKT()
      let wktGeo = wkt.readGeometry(area.geom)
      feature = new ol.Feature(wktGeo)
    }
    if (feature) {
      feature.setId(featureID)
      feature.setProperties({areaLabel: areaLabel, areaType: areaType, data_subtype: 'area'})
      feature.setStyle(this.createPolygonStyle(areaLabel, areaType))
      if (visibleAreaType) {
        if (areaType != visibleAreaType) feature.setStyle(null)
        this.layerSource.addFeature(feature)
      }
    }
  }

  unvisible (msg) {
    let visibleAreaType = this.getVisibleAreaType(msg)
    this.areaList.delete(msg.visiblearea)
    let features = this.layerSource.getFeatures()
    for (let feature of features) {
      let areaType = feature.getProperties().areaType
      if (areaType == visibleAreaType) this.layerSource.removeFeature(feature)
    } 
  }

  getVisibleAreaType (msg) {
    let visibleAreaType = msg && msg.visiblearea
    visibleAreaType = visibleAreaType && visibleAreaType.substr(5)
    visibleAreaType = visibleAreaType && Number(visibleAreaType)
    return visibleAreaType
  }

  setDiffAreaTypeVisible (msg) {
    let visibleAreaType = this.getVisibleAreaType(msg)
    if (xdata.metaStore.data.area) {
      let areas = xdata.metaStore.data.area.values()
      for (let area of areas) {
        if (!testMapID(area.map_id, this.mapID)) continue
        if (xdata.isCheck === 1 && area.need_display === 0) continue
        let featureID = 'area' + area.area_id
        let areaType = area.area_type_id
        let feature = this.layerSource.getFeatureById(featureID)
        this.areaList.set(msg.visiblearea,visibleAreaType)
        let areaList = Array.from(this.areaList.values())
        if (!areaList.includes(areaType)) {
          feature && this.layerSource.removeFeature(feature)
        } else {
          if (!feature) {
            this.drawFeature(area, featureID, areaType, visibleAreaType)
          }
        }
      }
    } 
  }

  drawArea (msg, area, visibleAreaType) {
    let featureID = 'area' + area.area_id
    let areaType = area.area_type_id
    if (!msg) {
      let areaName = 'area_' + areaType
      visibleAreaType = this.areaList.get(areaName)
    }
    this.drawFeature(area, featureID, areaType, visibleAreaType)
  }

  drawAreas (msg) {
    this.mapID = msg ? msg.mapID : this.mapID 
    let visibleAreaType = this.getVisibleAreaType(msg)
    if (xdata.metaStore.data.area) {
      let areas = xdata.metaStore.data.area.values()
      for (let area of areas) {
        if (!testMapID(area.map_id, this.mapID) || (xdata.isCheck === 1 && area.need_display === 0)) continue
        this.drawArea(msg, area, visibleAreaType)
      }
    }
    this.isAreasDrawed = true
  }

  createPolygonStyle (text, type) {
    let style = {
      stroke: { width: 1, color: [255, 203, 165] },
      fill: { color: [255, 203, 165, 0.4] },
      text: { text: text, font: '12px', scale: 1.2, fill: new ol.style.Fill({color: '#009fff'}) }
    }
    if (AREALAYERDEF.hasOwnProperty(type)) {
      let styleObj = AREALAYERDEF[type]
      style.stroke.color = styleObj.strokeColor
      style.fill.color = styleObj.fillColor
      style.text.fill = new ol.style.Fill(styleObj.textFill)
    }
    return new ol.style.Style({
      stroke: new ol.style.Stroke(style.stroke),
      fill: new ol.style.Fill(style.fill),
      text: new ol.style.Text(style.text)
    })
  }

  editEnd (evt) {
    this.feature = this.layerSource.getFeatureById('area' + this.unpdateAreaId)
    let wkt = new ol.format.WKT()
    let wktGeo = wkt.writeGeometry(this.feature.getGeometry())
    let name = 'area'
    let store = xdata.metaStore
    let table = {
      def: store.defs[name],
      rows: store.dataInArray.get(name),
      maxid: store.maxIDs[name]
    }
    
    let path = wktGeo.slice(9,-2).split(',').map((item,index)=>{
      item = item.split(' ').map((it,index) =>{
        if(index === 1){
          it = Number(it) > 0 ? '-'+ Number(it) : Math.abs(Number(it))
        }
        it = Number(it).toFixed(1)
        return it
      }).join(' ')
      if (index === 0) {
        item = "M" + item.replace(/[ ]/g,",")
      } else {
        item = "L" + item.replace(/[ ]/g,",")
      }
      return item
    })

    path = path.join(" ")
    let geom = "'" + wktGeo + "'"
    let valueGeom = {geom: geom}
    let values = null
    let valuePath = {path: path}
    let rows = getUpdateRows(table, valueGeom, valuePath, this.unpdateAreaId, name)
    xbus.trigger('UPDATE-META-ROWS', {rows: rows})
  }

  showTips (evt, feature) {
    let dataID = feature.getId()
    if (!dataID) return
    dataID = dataID.replace(/[^0-9]/ig,"")
    const store = xdata.metaStore
    const area = store.data.area && store.data.area.get(Number(dataID))
    const areaInfoDef = store.defs['area']
    const areaInfo = store.data['area'].get(parseInt(dataID, 10))
    const formatedInfo = store.formatRecord(areaInfoDef, areaInfo, null)
    const coordinate = evt.coordinate
    const msg = {
      type: 'AREA',
      subtype: 'area',
      id: dataID,
      event: evt,
      info: {
        def: xdata.isCheck === 1 ? config['area_ischeck'].def : config['area'].def,
        rec: formatedInfo
      },
      coordinate: coordinate
    }
    xbus.trigger('MAP-TOOLTIPS-SHOW', msg)
  }

  unregisterGlobalEventHandlers () {
    xbus.off('MAP-SHOW-AREA')
  }
}
