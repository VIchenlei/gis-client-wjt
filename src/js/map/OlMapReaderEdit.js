import ol from 'openlayers'
import { getMessage, getRows, clone } from '../utils/utils'
import { initInteractions } from './OlMapUtils'
import { getInfo, dealAntennaData, getReaderPathOfMsg, getPointshortPath } from '../../manage/js/utils.js'
import '../../tags/rs-merge-dialog/tags/rs-merge-dialog.html'
export default class OlMapReaderEdit{
  constructor (glayer) {
    this.map = glayer.map
    this.draw = glayer.draw
    this.modify = null
    this.snap = null
    this.source = null
    this.tool = null
    let self = this
    this.currenTag = null
    this.isMoveReader = false
    this.readerId = null
    this.isToolTip = true

    // 新增分站
    xbus.on('MAP-READER-EDIT', (msg) => {
      this.source = new ol.source.Vector()
      this.tool = msg instanceof Object ? msg.tool.getAttribute('name') : msg
      initInteractions(this.map, this.draw, this.snap, this.modify, this.addInteractions, this, 'Point')
    })

    xbus.on('MAP-CHANGE-TOOLTIPS', (msg) => {
      this.isToolTip = msg.isToolTip
    })

    this.map.addEventListener('dblclick', function (evt) {
      if (!self.isMoveReader) return
      let feature = self.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)
      if (feature && ['reader', 'virtual_reader', 'reader-v', 'reader_o', 'reader_s', 'reader_b'].includes(feature.getProperties()['data_subtype'])) {
        let dataID = feature.get('data-id')
        let id = dataID ? dataID.split('-')[0] : -1
        if (Number(id) < 0 || id != self.readerId) return
        self.setMoveReaderMsg(evt)
        self.isMoveReader = false
        this.currenTag = null
        this.readerId = null
        if (this.appD) this.map.removeInteraction(this.appD)
      }
    })

    xbus.on('MOVE-READER', (currenTag) => {
      this.isMoveReader = true
      //拖拽分站
      this.currenTag = currenTag
      this.readerId = currenTag.firstMsg.rows[0].field_value
      var app = {}
      app.Drag = function () {
        ol.interaction.Pointer.call(this, {
          handleDownEvent: app.Drag.prototype.handleDownEvent,
          handleDragEvent: app.Drag.prototype.handleDragEvent,
          handleMoveEvent: app.Drag.prototype.handleMoveEvent,
          handleUpEvent: app.Drag.prototype.handleUpEvent
        })
        this._coordinate = null
        this._cursor = 'pointer'
        this._feature = null
        this._previousCursor = undefined
      }
      ol.inherits(app.Drag, ol.interaction.Pointer)
      app.Drag.prototype.handleDownEvent = function (evt) {
        var map = evt.map
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function (feature) {
            return feature
          })

        if (feature) {
          var geom = (feature.getGeometry());
          if (geom instanceof ol.geom.MultiPolygon) {
            return
          } else if (geom instanceof ol.geom.LineString) {
            return
          } else {
            this._coordinate = evt.coordinate
            this._feature = feature
          }
        }
        let dataID = feature && feature.get('data-id')
        let id = dataID ? dataID.split('-')[0] : -1
        if (Number(id) === self.readerId && self.isMoveReader) {
          return !!feature
        } else {
          return
        }
      }
      app.Drag.prototype.handleDragEvent = function (evt) {
        var deltaX = evt.coordinate[0] - this._coordinate[0]
        var deltaY = evt.coordinate[1] - this._coordinate[1]
        var geometry = this._feature.getGeometry()
        geometry.translate(deltaX, deltaY)
        this._coordinate[0] = evt.coordinate[0]
        this._coordinate[1] = evt.coordinate[1]
      }
      app.Drag.prototype.handleMoveEvent = function (evt) {
        if (this._cursor) {
          var map = evt.map
          var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
              return feature
            })
          var element = evt.map.getTargetElement()
          if (feature) {
            if (element.style.cursor != this._cursor) {
              this._previousCursor = element.style.cursor
              element.style.cursor = this._cursor
            }
          } else if (this._previousCursor !== undefined) {
            element.style.cursor = this._previousCursor
            this._previousCursor = undefined
          }
        }
      }
      app.Drag.prototype.handleUpEvent = function (evt) {
        //拖动以后触发操作
        var stationnum = this._feature.U.StationNum
        this._coordinate = null
        this._feature = null
        return false
      }
      this.appD = new app.Drag()
      //将交互添加到map中
      this.map.addInteraction(this.appD)
    })
  }

  handleSubtype (feature, evt) {
    this.showTips(evt, feature)
  }

  //拖动分站之后把坐标赋予x/y
  setMoveReaderMsg(evt) {
    let coordinate = evt.coordinate
    let currenTag = this.currenTag
    currenTag.tags['rs-merge-dialog-table'][0].refs['x'].refs['x'].value = Number(coordinate[0].toFixed(2))
    currenTag.tags['rs-merge-dialog-table'][0].refs['y'].refs['y'].value = Number(coordinate[1].toFixed(2))
    this.currenTag.isShow = true
    this.currenTag.coords = coordinate
    this.currenTag.coords[1] = -coordinate[1]
    this.currenTag.isMoveReader = true
    this.currenTag.update()
  }

  addInteractions (interaction) {
    interaction.addEventListener('drawend', (evt) => {
      this.feature = evt.feature
      let wkt = new ol.format.WKT()
      let wktGeo = wkt.writeGeometry(this.feature.getGeometry())

      let name2 = 'reader'
      let store = xdata.metaStore
      let table = {
        def: store.defs[name2],
        rows: store.dataInArray.get(name2),
        maxid: store.maxIDs[name2]
      }
      this.sencondTable = {
        def: xdata.metaStore.defs['antenna'],
        rows: xdata.metaStore.dataInArray.get('antenna'),
        maxid: xdata.metaStore.maxIDs['antenna'],
      }
      this.thirdTable = {
        def: xdata.metaStore.defs['reader_path_tof_n'],
        rows: xdata.metaStore.dataInArray.get('reader_path_tof_n'),
        maxid: xdata.metaStore.maxIDs['reader_path_tof_n'],
      }
      let geom = "'" + wktGeo + "'"
      let valueGeom = { geom: geom }
      let values = null
      let rows2 = this.getRows(table, values, valueGeom, wktGeo)
      let msg3 = getMessage('INSERT', rows2, table.def, table.maxid)
      this.showMergeDialog(msg3)
      this.map.removeInteraction(interaction)
    })
  }

  getRows(table, values, valueGeom, wktGeo) {
    values = values ? values.row : null
    let rows = []
    let length = table.def.fields.names.length
    let coords = valueGeom.geom.split('POINT')[1].split('(')[1].split(')')[0].split(' ')
    for (let i = 0; i < length; i++) {
      let v = values ? values[table.def.fields.names[i]] : ''
      if (!values && i == table.def.keyIndex) {
        // 新增记录，id 为 最大id+1
        v = table.maxid || table.maxid === 0 ? table.maxid + 1 : 0
      }
      if (table.def.fields.names[i] === 'geom' && valueGeom) {
        v = valueGeom[table.def.fields.names[i]]
      }
      if (table.def.fields.names[i] === 'name') {
        v = ''
      }
      if (table.def.fields.names[i] === 'x') {
        v = Math.round(Number(coords[0]) * 10) / 10
      }
      if (table.def.fields.names[i] === 'y') {
        v = Math.round(Number(coords[1]) * 10) / 10
      }
      if (table.def.fields.names[i] === 'z') {
        v = 0
      }
      let row = {
        field_name: table.def.fields.names[i],
        field_value: v,
        field_type: table.def.fields.types[i],
        field_label: table.def.fields.labels[i],
        field_enableNull: table.def.fields.enableNull[i]
      }
      rows.push(row)
    }
    return rows
  }

  getMergeData(msg) {
    const value = msg.rows[0].field_value
    const { cmd, key } = msg
    const sencondTable = this.sencondTable
    const thirdTable = this.thirdTable
    let sencondMsg = []
    for (let i = 0; i < 2; i++) {
      let antennaMsg = getInfo(sencondTable, value, cmd, key)[0]
      antennaMsg = dealAntennaData(msg, antennaMsg, i + 1)
      sencondMsg.push(antennaMsg)
    }
    let pathMsg = getReaderPathOfMsg(msg, 'INSERT', 4)
    let thirdMsg = pathMsg

    const datas = {
      firstMsg: msg,
      sencondMsg: sencondMsg,
      thirdMsg: thirdMsg
    }
    return datas
  }

  //执行弹出合并弹出窗
  showMergeDialog (msg) {
    if (this.rsMergeDialog) {
      this.rsMergeDialog.unmount(true)
    }
    let datas = this.getMergeData(msg)
    this.rsMergeDialog = riot.mount('rs-merge-dialog', { message: datas, parenTag: self })[0]
  }

  showTips(evt, feature) {
    if (!this.isToolTip) return
    let dataID = feature.get('data-id')
    let id = dataID ? dataID.split('-')[0] : -1
    if (id < 0) return

    let subtype = ['virtual_reader', 'reader', 'reader-v', 'reader_o', 'reader_s', 'reader_b'].includes(feature.get('data_subtype')) ? 'reader' : feature.get('data_subtype')
    let readerInfoDef = xdata.metaStore.defs[subtype]
    let readerInfo = xdata.metaStore.data[subtype].get(parseInt(id, 10))
    let formatedInfo = xdata.metaStore.formatRecord(readerInfoDef, readerInfo, null)

    let deviceStateDef = xdata.deviceStore.getStateDefs()
    let deviceState = xdata.deviceStore.getState(id, readerInfo.device_type_id)

    let coordinate = evt.coordinate

    let msg = {
      type: 'READER',
      subtype: subtype,
      id: id,
      event: evt,
      state: {
        def: deviceStateDef,
        rec: deviceState
      },
      info: {
        def: xdata.metaStore.defs['reader'],
        rec: formatedInfo
      },
      coordinate: coordinate
    }
    xbus.trigger('MAP-TOOLTIPS-SHOW', msg)
  }
}