import ol from 'openlayers'
import { getMessage, composeUpdateDBReq } from '../utils/utils'
import { initInteractions, getUpdateRows } from './OlMapUtils'
import { config } from '../../config/js/config_def'
import { AREALAYERDEF } from '../def/areaLayerDef.js'
import '../../tags/rs-meta-dialog/rs-meta-dialog.html'

export default class OlMapLandmarkEdit{
  constructor (glayer) {
    this.glayer = glayer
    this.map = glayer.map
    this.draw = glayer.draw
    this.modify = null
    this.snap = null
    this.EditLayer = null
    this.source = null
    this.tool = null
    this.isforbidArea = false
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {

    xbus.on('MAP-LAYER-EDIT', (msg) => {
      if (this.map.getTarget() !== 'monitormap') return
      this.EditLayer = this.getLayerByName(this.glayer, msg.layername)
      this.sourceArea = this.EditLayer.areaLayer.getSource()
      this.source = new ol.source.Vector()
      this.tool = msg.tool
      this.isforbidArea = msg.iconname === 'edit_forbid_area' ? true : false
      this.isUpdate = msg.type === 'update' ? true : false
      this.unpdateAreaId = !msg.id ? null : msg.id
      initInteractions(this.map, this.draw, this.snap, this.modify, this.addInteractions, this)
    })

    xbus.on('META-UPDATE-DB-RES', (res) => {
      if (res.data.name === 'area' && this.isforbidArea){
        const tips = res.code == 0 ? '添加禁区成功' : '添加禁区失败'
        if(this.feature && res.code == 0){
          this.feature.setId('area' + this.metaforbid.areaid)
          this.feature.setProperties({areaLabel: this.metaforbid.name})
          this.feature.setStyle(this.createPolygonStyle(this.metaforbid.name))
          this.sourceArea.addFeature(this.feature)
        }
        const msg = {
          type: res.code === 0 ? 'success' : 'error',
          message: tips
        }
        window.xMessage.open(msg)
      }
    })

  }

  /**
   * 根据图层名称获取图层
   */
  getLayerByName (glayer, layername) {
    if (layername == 'areaLayer') {
      this.EditLayer = glayer.areaLayer
    }
    return this.EditLayer
  }

  addInteractions (interaction) {
    interaction.addEventListener('drawend', (evt) => {
      this.feature = evt.feature
      let wkt = new ol.format.WKT()
      let wktGeo = wkt.writeGeometry(this.feature.getGeometry())
      let name = 'area'
      let store = xdata.metaStore
      const table = {
        def: xdata.isCheck === 1 ? config['area_ischeck'].def : config['area'].def,
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
      //table 所有的区域数据 values null valueGeom地标值valuePath地标路径
      let rows2 = this.getRows(table, values, valueGeom, valuePath)
      let rows3 = getUpdateRows(table, valueGeom, valuePath, this.unpdateAreaId, name)
      let msg3 = null
      if(this.isUpdate){
        msg3 = {
          cmd: "UPDATE",
          key: "area_id",
          maxid: table.maxid,
          name: "area",
          rows: rows3,
          table: "dat_area",
          title: "区域",
          fromPage: 'monitor'
        }   
      } else {
        msg3 = getMessage('INSERT', rows2, table.def, table.maxid)
      }
      this.isforbidArea ? this.insertForbidArea(msg3) : this.showMetaDialog(msg3)
      this.map.removeInteraction(interaction)
    })
  }

  getRows (table, values, valueGeom, valuePath) {
    values = values ? values.row : null
    let rows = []
    let length = table.def.fields.names.length
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
      if (table.def.fields.names[i] === 'path' && valuePath) {
        v = valuePath[table.def.fields.names[i]]
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
    msg.checkboxes = ['business_type']
    msg.spliceInputs = ['over_speed_vehicle']
    this.rsMetaDialog = riot.mount('rs-meta-dialog', { message: msg, parenTag: self})[0]
  }

  //添加禁区
  insertForbidArea (msg) {
    const path = msg.rows.filter(item => item.field_name === 'path')[0].field_value
    const areaID = msg.rows.filter(item => item.field_name === 'area_id')[0].field_value
    const sql = `INSERT INTO dat_area (area_id, name, area_type_id, business_type, map_id, over_count_person, over_count_vehicle, over_time_person, over_speed_vehicle, path, angle, is_work_area,over_count_person_rp) VALUES(${areaID}, "禁区", 3, 192, 5, 0, 0, 0, 0, "${path}", "0", 0, 0)`
    const req = composeUpdateDBReq('INSERT', msg.name, areaID, sql)
    this.metaforbid = {
      name: '禁区',
      areaid: areaID
    }
    xbus.trigger('META-UPDATE-DB', { req: req })
    this.registerGlobalEventHandlers()
  }

  createPolygonStyle (text, type) {
    const style = {
      stroke: { width: 1, color: [255, 203, 165] },
      fill: { color: [255, 203, 165, 0.4] },
      text: { text: text, font: '12px', scale: 1.2, fill: new ol.style.Fill({color: '#009fff'}) }
    }
    if (AREALAYERDEF.hasOwnProperty(type)) {
      const styleObj = AREALAYERDEF[type]
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
}