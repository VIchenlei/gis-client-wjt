import ol from 'openlayers'
import { DEAFULT_MAP_MATRIXID } from '../def/map_def.js'
import OlMapWorkspace from '../map/OlMapWorkSpace.js'

export default class OlMapService {
  /**
   * 初始化
   * @param {*} containerName 地图容器 element 的 id
   * @param {*} mapType 地图类型：MONITOR or HISTORY
   */

  constructor (mapType) {
    this.mapType = mapType

    this.mapID = -1
    this.map = null
    this.view = null
    this.workspace = null
    this.reader_id = null
    this.isInnerIP = false // 默认是外网
  }

  dealMapUrl(url) {
    let dealUrl = url.split('/geoserver')[1]
    return `/geoserver${dealUrl}`
  }
  
  loadMap (containerName, mapID, map, row) {
    let ret = null
    let self = this

    if (mapID === this.mapID && this.map) {
      console.log('Same mapID, NO need to load map again. mapID=', mapID)
      return ret
    }

    let container = document.querySelector('#' + containerName)
    if (!container) {
      console.warn('NO map container element in current document: ', containerName)
      return ret
    }

    let mapURL = this.dealMapUrl(map.tileWmsOpts.url)
    map.tileWmsOpts.url = mapURL

    let mapDef = map
    if (!mapDef) {
      console.warn('NO map definition of the mapID : ', mapID)
      return ret
    }

    let chooseMap = xdata.mapStore.gisMap && xdata.mapStore.gisMap.get(mapID)
    let projExtent = ol.proj.get('EPSG:3857').getExtent()
    let startResolution = ol.extent.getWidth(projExtent) / 256
    let resolutions = new Array(22)

    for (var i = 0, len = resolutions.length; i < len; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i)
    }

    let extent = [2000, -1500, 12000, 4000] // 地图范围 默认高河地图范围
    if (row) {
      extent = [parseInt(row.minX), parseInt(row.minY), parseInt(row.maxX), parseInt(row.maxY)]
    } else if (chooseMap) {
      extent = [parseInt(chooseMap.minX), parseInt(chooseMap.minY), parseInt(chooseMap.maxX), parseInt(chooseMap.maxY)]
    }

    let tileGrid = new ol.tilegrid.TileGrid({
      extent: extent,
      resolutions: resolutions,
      tileSize: [512, 256]
    })

    let tileWmsOpts = mapDef.tileWmsOpts,
      wmsLayer
    tileWmsOpts.tileGrid = tileGrid
    let mapType = mapDef.type
    if (!mapDef.type) {
      mapType = mapDef.tileWmsOpts.url.includes('wms') ? 'wms' : 'wmts'
    }

    let mapObj = {map_type: mapType}
    if (mapType === 'wms') {
      mapObj.url = tileWmsOpts.url
      mapObj.layers = tileWmsOpts.params.LAYERS
      mapObj.matrixId = DEAFULT_MAP_MATRIXID
      wmsLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS(tileWmsOpts)
      })
    } else if (mapType === 'wmts') {
      let matrixIds = [],
        resolution = []
      let startResolutions = ol.extent.getHeight(extent) / 256
      for (let i = 0; i <= spliceLevel; i++) {
        matrixIds[i] = chooseMap.matrixId + i
        resolution[i] = startResolutions / Math.pow(2, i)
      }
      let matrixSet = chooseMap.matrixId && chooseMap.matrixId.slice(0, chooseMap.matrixId.indexOf(':'))
      wmsLayer = new ol.layer.Tile({
        source: new ol.source.WMTS({
          url: chooseMap.url,
          layer: chooseMap.layers,
          tileGrid: new ol.tilegrid.WMTS({
            extent: extent,
            resolutions: resolution,
            matrixIds: matrixIds,
            tileSize: [256, 256]
          }),
          matrixSet: matrixSet,
          format: 'image/png',
          projection: 'EPSG:3857'
        })
      })
    } else {
      console.warn('unknow map type!')
    }

    if (containerName === 'monitormap') {
      window.wmsLayer = wmsLayer
    }

    let view = new ol.View(mapDef.viewOpts)

    let m = {
      layers: [wmsLayer],
      overlays: [], // overlays: [tooltips],
      target: containerName,
      view: view,
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      interactions: ol.interaction.defaults({
        doubleClickZoom: false
      }).extend([])
    }
    let olmap = new ol.Map(m)
    let zoomslider = new ol.control.ZoomSlider()
    let ele = document.createElement('div')
    let img = document.createElement('img')
    img.src = '../img/north.png'
    ele.innerHTML = img
    document.querySelector('.ol-compass').innerText = ''
    let resetNorth = new ol.control.Rotate({
      autoHide: false,
      label: img
    })
    olmap.addControl(zoomslider)
    olmap.addControl(resetNorth)
    // save the default parameters of map
    this.initViewConfig = {
      zoom: view.getZoom(),
      center: view.getCenter(),
      rotation: view.getRotation()
    }

    this.workspace && this.workspace.destroy()
    this.workspace = new OlMapWorkspace(olmap, mapID, this.mapType)

    let moveReaderPointer = new Map()
    // 设置鼠标在特定 feature 上的形状
    olmap.on('pointermove', function (e) {
      let pixel = olmap.getEventPixel(e.originalEvent)
      let hit = olmap.hasFeatureAtPixel(pixel)
      if (hit) {
        olmap.forEachFeatureAtPixel(pixel, (feature) => {
          let dataSubtype = feature.getProperties() && feature.getProperties()['data_subtype']
          if (['virtual_reader', 'reader-v', 'reader', 'reader_o', 'reader_s', 'reader_b'].includes(dataSubtype)) {
            let id = feature.getProperties().id
            self.showDetailOrBriefLabel(feature, 'detail', id)
            moveReaderPointer.set(id, feature)
          }
        })
      } else if (moveReaderPointer.size > 0) {
        let features = Array.from(moveReaderPointer.values())
        features.forEach((feature) => {
          self.showDetailOrBriefLabel(feature, 'brief', feature.getProperties().id)
        })
        moveReaderPointer = new Map()
      }
      olmap.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })

    // save the object for later use
    this.mapID = mapID
    this.map = olmap
    this.view = view
    ret = olmap
    return ret
  }

  resetCardLayers() {
    if (this.workspace && this.workspace.cardLayer) {
      this.workspace.cardLayer.vehicleLayerSource && this.workspace.cardLayer.vehicleLayerSource.clear()
      this.workspace.cardLayer.staffLayerSource && this.workspace.cardLayer.staffLayerSource.clear()
    }
  }
  
  resetTrackLayers() {
    if (this.workspace && this.workspace.trackLayer) {
      this.workspace.trackLayer.layerSource && this.workspace.trackLayer.layerSource.clear()
    }
  }

  resetView() {
    if (this.view && this.initViewConfig) {
      this.view.setCenter(this.initViewConfig.center)
      this.view.setRotation(this.initViewConfig.rotation)
      this.view.setZoom(this.initViewConfig.zoom)
    }
  }

  showDetailOrBriefLabel(feature, type, id) {
    let style = feature.getStyle()
    let text = style ? style.getText() : ''
    let readers = xdata.metaStore.data.reader
    let reader = readers && readers.get(id)
    if (!reader) return 
    let newText = type === 'detail' ? `${id}-${reader.name}` : `${reader.brief_name}`
    text && text.setText(newText)
  }
}
