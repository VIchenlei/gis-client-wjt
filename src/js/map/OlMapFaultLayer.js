import ol from 'openlayers'

const FAULTMAPID = 7 //地质构造图层ID
const UNDERGROUNDCABLE = 8 // 地下三线图层ID

export default class OlMapFaultLayer {
  constructor(layer) {
    this.map = layer.map
    this.faultLayer = null // 地质构造图层
    this.undergroundLayer = null //三线构造图层
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers() {
    xbus.on('DRAW-FAULT-LAYER', () => {
      this.faultLayer = this.loadDC(FAULTMAPID)
      this.undergroundLayer = this.loadDC(UNDERGROUNDCABLE)
    })

    xbus.on('MAP-SHOW-UNDERGROUND', (msg) => {
      let layer = this.undergroundLayer
      if (msg.isVisible) {
        layer && layer.setVisible(true)
      } else {
        layer && layer.setVisible(false)
      }
    })

    xbus.on('MAP-SHOW-FAULT', (msg) => {
      let layer = this.faultLayer
      if (msg.isVisible) {
        layer && layer.setVisible(true)
      } else {
        layer && layer.setVisible(false)
      }
    })

    xbus.on('MAP-LOAD-SUCESS', () => {
      this.faultLayer = this.loadDC(FAULTMAPID)
      this.undergroundLayer = this.loadDC(UNDERGROUNDCABLE)
    })
  }

  dealMapUrl(url) {
    let dealUrl = url.split('/geoserver')[1]
    return `/geoserver${dealUrl}`
  }
  
  loadDC (layerMapID) {
    let mapID = 5
    let map = xdata.mapStore.maps && xdata.mapStore.maps.get(layerMapID)
    let row = xdata.metaStore.data.map && xdata.metaStore.data.map.get(layerMapID)
    if (!map) return
    let mapURL = this.dealMapUrl(map.tileWmsOpts.url)
    map.tileWmsOpts.url = mapURL
    let mapDef = map
    if (!mapDef) {
      console.warn('NO map definition of the mapID : ', mapID)
      return
    }

    let chooseMap = xdata.mapStore.gisMap && xdata.mapStore.gisMap.get(mapID)
    let projExtent = ol.proj.get('EPSG:3857').getExtent()
    let startResolution = ol.extent.getWidth(projExtent) / 256
    let resolutions = new Array(22)
    for (var i = 0, len = resolutions.length; i < len; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i)
    }
    let extent = [2000, -1500, 12000, 4000]
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

    let tileWmsOpts = mapDef.tileWmsOpts
    tileWmsOpts.tileGrid = tileGrid
    let mapType = mapDef.type
    if (!mapDef.type) {
      let str = mapDef.tileWmsOpts.url
      mapType = mapDef.tileWmsOpts.url.includes('wms')
      mapType = 'wms'
    }

    chooseMap = {
      map_type: mapType
    }
    let layer = null
    if (chooseMap.map_type === 'wms') {
      layer = new ol.layer.Tile({
        source: new ol.source.TileWMS(tileWmsOpts),
        zIndex: 20
      })
    } else {
      console.warn('unknow map type!')
    }
    this.map.addLayer(layer)
    layer.setVisible(false)
    return layer
  }
}
