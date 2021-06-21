import ol from 'openlayers'
import landmarkStateDef from '../def/landmark_state_def'
import { getMessage } from '../utils/utils'
import { initInteractions } from './OlMapUtils'
import '../../tags/rs-meta-dialog/rs-meta-dialog.html'
export default class OlMapLandmarkEdit{
  constructor (glayer) {
    this.map = glayer.map
    this.draw = glayer.draw
    this.modify = null
    this.snap = null
    this.source = null
    this.tool = null
    let self = this
    this.registerGlobalEventHandlers()
  }
  
  registerGlobalEventHandlers () {
    xbus.on('MAP-LANDMARK-EDIT', (msg) => {
      this.source = new ol.source.Vector()
      this.tool = msg.tool.getAttribute('name')
      initInteractions(this.map, this.draw, this.snap, this.modify, this.addInteractions, this, 'Point')
    })
  }

  handleSubtype (feature, evt) {
    this.showTips(evt, feature)
  }

  addInteractions (interaction) {
    interaction.addEventListener('drawend', (evt) => {
      let values = null
      let store = xdata.metaStore
      this.feature = evt.feature
      const wkt = new ol.format.WKT()
      const wktGeo = wkt.writeGeometry(this.feature.getGeometry())
      const name2 = 'landmark'  
      const table = {
        def: store.defs[name2],
        rows: store.dataInArray.get(name2),
        maxid: store.maxIDs[name2]
      }
      const geom = "'" + wktGeo + "'"
      const valueGeom = { geom: geom }
      const rows2 = this.getRows(table, values, valueGeom, wktGeo)
      const msg3 = getMessage('INSERT', rows2, table.def, table.maxid)
      this.showMetaDialog(msg3)
      this.map.removeInteraction(interaction)
    })
  }

  getRows (table, values, valueGeom, wktGeo) {
    values = values ? values.row : null
    let rows = []
    const length = table.def.fields.names.length
    const coords = valueGeom.geom.split('POINT')[1].split('(')[1].split(')')[0].split(' ')
    for (let i = 0; i < length; i++) {
      let v = values ? values[table.def.fields.names[i]] : ''
      if (!values && i == table.def.keyIndex) {
        v = table.maxid ? table.maxid + 1 : 0
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

      const row = {
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

  //执行弹出录入对话框
  showMetaDialog (msg) {
    if (this.rsMetaDialog) this.rsMetaDialog.unmount(true)
    this.rsMetaDialog = riot.mount('rs-meta-dialog', { message: msg, parenTag: self})[0]
  }

  showTips (evt, feature) {
    const dataID = feature.get('data-id')
    if (!dataID) return

    const landmark = xdata.metaStore.data && xdata.metaStore.data.landmark.get(Number(dataID))
    const landmarkState = {
      'landmark_id': landmark.landmark_id,
      'name': landmark.name,
      'x': landmark.x,
      'y': landmark.y,
      'z': landmark.z
    }
    const landmarkInfoDef = xdata.metaStore.defs['landmark']
    const landmarkInfo = xdata.metaStore.data['landmark'].get(parseInt(dataID, 10))
    const formatedInfo = xdata.metaStore.formatRecord(landmarkInfoDef, landmarkInfo, null)
    const coordinate = evt.coordinate
    const msg = {
      type: 'DEVICE',
      subtype: feature.get('data_subtype'),
      id: dataID,
      event: evt,
      state: {
        def: landmarkStateDef['landmark'],
        rec: landmarkState
      },
      info: {
        def: xdata.metaStore.defs['landmark'],
        rec: formatedInfo
      },
      coordinate: coordinate
    }
    xbus.trigger('MAP-TOOLTIPS-SHOW', msg)
  }
}