import ol from 'openlayers'

export default class OlMapMeasureLayer {
  constructor (layer) {
    this.map = layer.map
    this.draw = layer.draw
    this.type = null
    this.mode = null
    this.featureId = 200
    this.initLayers()
    this.registerGlobalEventHandlers()
  }

  initLayers () {
    this.measureSource = new ol.source.Vector()
    this.measureLayer = new ol.layer.Vector({
      source: this.measureSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0099ff',
          width: 3
        })
      })
    })
    this.map.addLayer(this.measureLayer)
  }

  registerGlobalEventHandlers () {
    let self = this
    xbus.on('MAP-MEASURE', (msg) => {
      if (this.map.getTarget() !== 'monitormap') return
      if (this.draw.interaction) {
        this.map.removeInteraction(this.draw.interaction)
      }
      this.addInteraction(msg.geometry)
    })
    this.map.addEventListener('dblclick', function (e) {
      if (self.mode) {
        self.mode = null
        return false
      }
    }, false)
  }

  /**
   * 创建测量工具提示框
   */
  createMeasureTooltip () {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement)
    }
    this.measureTooltipElement = document.createElement('div')
    this.measureTooltipElement.className = 'tooltip tooltip-measure'
    this.measureTooltip = new ol.Overlay({
      id: this.featureId,
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    })
    this.map.addOverlay(this.measureTooltip)
  }
  

  /**
   * 绑定交互绘制工具开始绘制的事件
   * @param {event} evt
   */
  drawstart (evt) {
    let sketch = evt.feature
    let tooltipCoord = evt.coordinate
    this.mode = 'drawing'
    sketch.getGeometry().addEventListener('change', (evt) => {
      let geom = evt.target
      let output
      if (geom instanceof ol.geom.Polygon) {
        output = this.formatArea(geom)
        tooltipCoord = geom.getInteriorPoint().getCoordinates()
      } else if (geom instanceof ol.geom.LineString) {
        output = this.formatLength(geom)
        tooltipCoord = geom.getLastCoordinate()
      }
      this.measureTooltipElement.innerHTML = output
      this.measureTooltip.setPosition(tooltipCoord)
    })
  }

  /**
   * 绑定交互绘制工具结束绘制的事件
   * @param {Event} evt
   */
  drawend (evt) {
    let deletetipCoord = null
    let sketch = evt.feature
    let geom = sketch.getGeometry()
    sketch.setId(this.featureId)
    if (geom instanceof ol.geom.LineString) {
      deletetipCoord = geom.getLastCoordinate()
    } else if (geom instanceof ol.geom.Polygon) {
      deletetipCoord = geom.getInteriorPoint().getCoordinates()
    }
    this.measureTooltipElement.className = 'tooltip tooltip-static'
    this.measureTooltip.setOffset([0, -7])
    this.createDeleteBox(deletetipCoord, this.featureId)
    this.map.removeInteraction(this.draw.interaction)
    this.measureTooltipElement = null
    this.featureId = this.featureId + 1
  }

  /**
   * 加载交互绘制控件函数
   * @param {number} geomtry
   */
  addInteraction (geomtry) {
    let self = this
    let type = (geomtry === 1 ? 'LineString' : 'Polygon')
    this.draw.interaction = new ol.interaction.Draw({
      source: this.measureSource,
      type: type,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#0099ff',
          width: 3
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    })

    this.createMeasureTooltip()
    this.map.addInteraction(this.draw.interaction)
    this.draw.interaction.addEventListener('drawstart', function (evt) { self.drawstart(evt) }, false)
    this.draw.interaction.addEventListener('drawend', function (evt) { self.drawend(evt) }, false)

  }

  /**
   *创建删除图标overlay，点击叉号删除对应的要素
    *@param {ol.Coordinate} boxCoord
    *@param {number} Fid
    *@return
    */
  createDeleteBox (boxCoord, Fid) {
    let deleteBoxElement = document.createElement('div')
    deleteBoxElement.className = 'deletebox deletebox-static'
    deleteBoxElement.innerHTML = 'x'
    deleteBoxElement.setAttribute('featureId', Fid)
    deleteBoxElement.addEventListener('click', (evt) => {
      let deletebox = evt.target
      let featureId = deletebox.getAttribute('featureId')
      this.measureSource.removeFeature(this.measureSource.getFeatureById(featureId))
      this.map.removeOverlay(this.map.getOverlayById(featureId))
      deletebox.parentNode.removeChild(deletebox)
    })

    let deleteBox = new ol.Overlay({
      id: 'deleteBox',
      element: deleteBoxElement,
      offset: [15, 20],
      positioning: 'bottom-center'
    })
    deleteBox.setPosition(boxCoord)
    this.map.addOverlay(deleteBox)
  }

  /**
   * 测量长度
   * @param {ol.geom.LineString} line
   * @return {string}
   */
  formatLength (line) {
    let wgs84Sphere = new ol.Sphere(6378137)
    let length = 0
    let coordinates = line.getCoordinates()
    var sourceProj = this.map.getView().getProjection()
    let defaultMapID = xdata.metaStore.defaultMapID
    let scaleData = defaultMapID && xdata.metaStore.data.map && xdata.metaStore.data.map.get(defaultMapID)
    let scale = scaleData && scaleData.scale ? scaleData.scale : 1
    for (let i = 0, li = coordinates.length - 1; i < li; i++) {
      let c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326')
      let c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326')
      length += wgs84Sphere.haversineDistance(c1, c2)
    }
    length = `${Math.round(length * scale * 10)/10} m`
    return length
  }

  /**
   * 测量面积
   * @param {ol.geom.Polygon} polygon
   * @param {string}
   */
  formatArea (polygon) {
    let wgs84Sphere = new ol.Sphere(6378137)
    let area = 0
    let sourceProj = this.map.getView().getProjection()
    let geom = polygon.clone().transform(sourceProj, 'EPSG:4326')
    let coordinates = geom.getLinearRing(0).getCoordinates()
    area = Math.round(Math.abs(wgs84Sphere.geodesicArea(coordinates) * 4)) + ' ' + 'm<sup>2</sup>'
    return area
  }
}
