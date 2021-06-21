import ol from 'openlayers'
import io from 'socket.io-client'
import { testMapID } from '../utils/utils.js'

export default class OlMapCameraLayer {
  constructor (glayer) {
    this.mapType = glayer.mapType
    this.map = glayer.map
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    let self = this
    xbus.on('MAP-INIT-CAMERA', () => {
      self.initLayer()
      this.vectorLayer.setVisible(false)
    })

    xbus.on('MAP-SHOW-CAMERA', (msg) => {
      if (msg.mapType === this.mapType) {
        window.cameraLayerShow = msg.isVisible
        if(!this.vectorLayer){
          self.initLayer()
        }
        if (msg.isVisible) {
          this.vectorLayer.setVisible(true)
        } else {
          this.vectorLayer.setVisible(false)
        }
      }
    })

    xbus.on('MAP-LOAD-SUCESS',()=>{
      this.initLayer()
      this.vectorLayer.setVisible(false)
    })

    xbus.on('START-PLAY-VEDIO', (msg) => {
      let id = msg.feature.getId()
      let data = xdata.metaStore.data.camera.get(id)
      let str = data && 'rtsp://' + data.user + ':' + data.password + '@' + data.ip + ':' + data.port + '/' + data.codec + '/' + data.channel + '/' + data.subtype + '/av_stream'
      console.log('rtspStr', str)
      this.openVlc(str)
    })
  }

  openVlc (str) {
    let socket = io.connect('http://127.0.0.1:3000')
    if (!socket.connected) {
      socket.emit('chat message', str)
    }
    socket.on('reconnecting', (time) => {
      time === 2 ? socket.close() : console.warn('正在重连第' + time + '次...')
    })
    socket.on('disconnect', (error) => {
      console.log('error', error)
    })
    socket.on('error', (error) => {
      console.log(error)
    })
  }

  initLayer () {
    let featureArr = []
    let carmeras = xdata.metaStore.dataInArray.get('camera')
    let curMapId = xdata.metaStore.defaultMapID
    if (carmeras && carmeras.length > 0) {
      for (var i = 0; i < carmeras.length; i++) {
        if (!testMapID(carmeras[i].map_id, curMapId)) continue
        this.drawlabel(featureArr, carmeras[i].camera_id, carmeras[i].x, carmeras[i].y, carmeras[i].angle)
      }
    }
    this.vectorSource = new ol.source.Vector({
      features: featureArr
    })

    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    })

    this.map.addLayer(this.vectorLayer)
  }

  drawlabel (featureArr, id, x, y, angle) {
    let label = new ol.geom.Point([x, -y]), rotate, src = '../img/cameraright.png'
    rotate = angle
    let feature = new ol.Feature({
      geometry: new ol.geom.Point([0, 0]),
      name: 'camera',
      population: 4000,
      rainfall: 500,
      'data-type': 'camera'
    })
    feature.setId(id)
    feature.setStyle(this.setFeatureStyle(src, rotate))
    feature.setGeometry(label)
    featureArr.push(feature)
  }

  setFeatureStyle (src, rotate) {
    return new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: src,
        rotation: rotate,
        scale: 0.14,
        rotateWithView: true
      }))
    })
  }
}
