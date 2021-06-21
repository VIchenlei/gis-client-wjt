import specialTable from '../def/special_table_key_def.js'
import {
  CARD
} from '../def/state.js'
import {
  DEFAULT_MAP_ID
} from '../def/map_def.js'
import { clone, concatObject, formatElapsedTime } from '../utils/utils.js'

const CARD_TYPES = ['vehicle_extend', 'staff_extend', 'adhoc']
const SHIFTTABLENAME = 'shift_setting'

// 以 '_id' 结尾的通配符
let endWithID = /^(\w*)_id$/i
export default class MetaStore {
  constructor (gstore) {
    this.gstore = gstore
    this.defaultMapID = DEFAULT_MAP_ID
    this.defs = null // meta data definition
    this.data = {} // meta data store
    this.maxIDs = {} // meta data max id,

    this.firstPull = false

    // 以卡号为索引的、卡绑定对象的列表
    this.cardIndex = new Map() // card_id -> staff or vehicle

    this.dataInArray = new Map() // name => array
    this.hmDeptIDMax = 1 // 虹膜部门id最大值
    this.depts = new Map()
    this.fadeAreaArr = new Map() //记录显示的分站盲区
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    xbus.on('META-DEF', (res) => {
      this.saveMetaDef(res.data)
    })

    xbus.on('META-DATA', (res) => {
      if (res && res.code === 0) {
        if (res.data.name === 'mdt_update' && this.defs) {
          if (!this.data.mdt_update) {
            let msg = {
              name: 'progress-bar',
              information: '正在更新数据，请稍候...'
            }
            xdata.dexieDBStore.forceUpdateMetadata = true
            window.xhint.showLoading(msg)
          }
          xdata.dexieDBStore.openDB(res.data.name, res.data.rows)
        } else if (res.data.name === 'driver_arrange') {
          let data = res.data.rows
          if (data && data.length > 0) {
            let time = new Date().format('yyyy-MM-dd')
            let intradayDriver = data.filter(item => new Date(item.driver_date).format('yyyy-MM-dd') === time)
            intradayDriver && intradayDriver.length > 0 && this.updateDriverData(intradayDriver)
          }
        } else {
          let name = res.data.name
          if (name && name.indexOf('dat') < 0 && !['rt_person_forbid_down_mine', 'tt_inspection_route_planning'].includes(res.data.name)) {
            name = `dat_${res.data.name}`
          }
          xdata.dexieDBStore.db[name] ? xdata.dexieDBStore.storeDATA(name, res.data.rows, res.upMethod, res.tableNames) : this.saveMetaData(res.data.name, res.data.rows)
        }
      } else {
        console.warn(`获取 META ${res.data.name} 失败。`)
      }
    })

    xbus.on('SAVE-META-DATA-SPECIAL', () => {
      this.storeSpecialData()
    })
  }

  saveMetaDef (data) {
    this.defs = data
    xdata.isCheck === 1 && this.storeSpecialData(this.defs)
  }

  // 检查账号登录，需要特殊处理dat_dept/dat_staff_extend表
  storeSpecialData (data) {
    if (!data) { // 登陆时，需要删除dataInArray中的相关数据
      let deptCkArray = this.dataInArray.get('dept_ck'), staffExtendCkArray = this.dataInArray.get('staff_extend_ck')
      this.dataInArray.set('dept', deptCkArray)
      this.dataInArray.set('staff_extend', staffExtendCkArray)
      this.dataInArray.delete('dept_ck')
      this.dataInArray.delete('staff_extend_ck')
    }
    data = data || this.data
    let deptCk = data['dept_ck'], staffExtendCk = data['staff_extend_ck']
    data['dept'] = deptCk
    data['staff_extend'] = staffExtendCk
    delete data['dept_ck']
    delete data['staff_extend_ck']
    this.maxIDs['dept'] = this.maxIDs['dept_ck']
  }

  jointObj (type) {
    if (type !== 'staff' && type !== 'vehicle') return 
    this[`${type}s`] = new Map()

    let objects = this.data[type] ? Array.from(this.data[type].values()) : this.dataInArray.get(type)
    if (objects) {
      objects = clone(objects)
      let isCheck = xdata.isCheck === 1
      for (let i = 0, len = objects.length; i < len; i++) {
        let obj = objects[i]
        let objID = obj[type + '_id']
        let objExtend, objInfo
        objExtend = this.data[type + '_extend'] && this.data[type + '_extend'].get(objID)
        objInfo = objExtend ? concatObject(obj, objExtend) : obj
        if (isCheck && !objInfo.need_display) continue
        let cardInfo = objInfo && xdata.metaStore.data.card && xdata.metaStore.data.card.get(objInfo.card_id)
        let stateID = cardInfo && cardInfo.state_id
        if (objInfo) objInfo.state_id = (stateID || stateID === 0) ? stateID : ''
        this[`${type}s`].set(objID, objInfo)
      }
      this.broadcastMetaUpdate(type)
    }
  }

  handleTable (name) {
    let self = this

    // store drivers
    if (!name || name === 'driver_arrange') {
      let drivers = this.dataInArray.get('driver_arrange')
      if (drivers && drivers.length > 0) {
        let time = new Date().format('yyyy-MM-dd')
        let currentArrangement = drivers.filter(item => new Date(item.driver_date).format('yyyy-MM-dd') === time)
        currentArrangement && currentArrangement.length > 0 && self.updateDriverData(currentArrangement)
      }
    }

    if (!name || /staff/.test(name)) this.jointObj('staff')
    if (!name || /vehicle/.test(name)) this.jointObj('vehicle')

    // this.setWorkArea(this.dataInArray.get('drivingface_vehicle'))
    // this.setWorkArea(this.dataInArray.get('coalface_vehicle'))

    if (!name || name === 'map') {
      xbus.trigger('SAVE-GIS-MAP', this.dataInArray.get('map'))
      xbus.trigger('DRAW-FAULT-LAYER')
    }
    if (!name || name === 'camera') xbus.trigger('MAP-INIT-CAMERA')
    if (!name || name === 'area') xbus.trigger('DRAW-AREA-UPDATE')
    if (!name || name === 'reader') xbus.trigger('DRAW-READER-UPDATE')
    if (!name || name === 'landmark') xbus.trigger('DRAW-LANDMARKER-UPDATE')
    if (!name || name === 'area') xbus.trigger('MAP-INIT-AREALIST', this.dataInArray.get('area'))
    if (!name || name === 'reader_path_tof_n') xbus.trigger('DRAW-READERPATH-UPDATE')
    if (!name || name === 'goaf') xbus.trigger('DRAW-ALL-GOAF')
    if (!name || name === 'light') xbus.trigger('DRAW-LIGHT-UPDATE')
  }

  dealSpecialCheckName (name) {
    if (xdata.isCheck === 1) {
      if (name === 'dat_dept_ck' || name === 'dat_staff_extend_ck') return {
        isSaveMetaData: true,
        tableName: name.replace('_ck', '')
      }
      if (name === 'dat_dept' || name === 'dat_staff_extend') return {
        isSaveMetaData: false,
        tableName: null
      }
    }
    return {
      isSaveMetaData: true,
      tableName: name
    }
  }

  /**
   * [broadcastMetaUpdate when meta updated, inform all (the views) to refresh their local data]
   * @param  {[type]} name [meta data's name]
   * @param  {[type]} rows [the result data, may be null]
   * @return {[type]}      [description]
   */
  broadcastMetaUpdate (name, maxID, rows) {
    let def = this.defs ? this.defs[name] : name + '_id'
    let table = {
      def: def,
      maxid: maxID,
      rows: rows
    }
    xbus.trigger('META-DATA-UPDATE', table)
  }

  dealSpecialId (keyName, name) {
    return specialTable[name] ? specialTable[name] : keyName
  }

  // 获取虹膜部门最大id+1
  getMaxHMDeptID (rows) {
    let hmDeptIDArr = Array.from(rows.values()).map(item => item.hm_dept_id || 0)
    this.hmDeptIDMax = hmDeptIDArr && hmDeptIDArr.length > 0 ? Math.max(...hmDeptIDArr) + 1 : 0
  }

  /*
   * name: the meta_data's name, such as : staff, reader, etc.
   * keyName: the key's name
   * data: the origin resultset
   */
  saveMetaData (name, rows) {
    // console.debug(`meta: ${name}, \t\tcount: ${rows ? rows.length : 0}`)

    // save to a map
    this.dataInArray.set(name, rows) // TODO: meta saved two copys !!!
    let tmp = new Map() // temp map to save the rows
    let cardList = CARD_TYPES.includes(name) ? new Map() : null
    let maxID = 0
    if (rows) {
      let def = this.defs && this.defs[name]
      let keyName = def ? def.fields.names[def.keyIndex] : name + '_id'
      keyName = this.dealSpecialId(keyName, name)
      for (let item of rows) {
        // save to data
        let keyValue = item[keyName]
        if (name !== 'staff_extend' && name !== 'vehicle_extend') {
          let spy = item['name'] ? xdata.spell.makePy(item['name']) : ''
          spy = spy ? spy[0] : ''
          item['spy'] = spy
        }

        if (name === 'setting' && keyValue === 15) {
          let shiftData = new Map()
          shiftData.set(keyValue, item)
          this.data[SHIFTTABLENAME] = shiftData
          continue
        }

        tmp.set(keyValue, item)

        // is card, save to cardIndex
        if (cardList) {
          let cardID = item['card_id']
          cardList.set(cardID, item)
          this.cardIndex.set(cardID, item)
        }

        // init the maxID
        if (keyValue > maxID) {
          maxID = keyValue
        }
      }
    }

    this.data[name] = tmp
    this.maxIDs[name] = maxID

    // if (['reader', 'traffic', 'speaker', 'turnout'].includes(name)) {
    //   xbus.trigger('DEVICE-INFO-UPDATED') // tell others to update the device info
    // }

    if (name === 'dept') {
      this.getMaxHMDeptID(rows)
    }

    if (cardList) {
      xbus.trigger('CARD-INFO-UPDATE', {
        type: name,
        data: cardList
      })
    }

    this.broadcastMetaUpdate(name, maxID, rows)
  }

  getMdtlength () {
    let arr = xdata.dexieDBStore.rows
    if (!arr) {
      arr = this.data.mdt_update && Array.from(this.data.mdt_update.values())
    }
    if (arr && Object.keys(this.data).length >= arr.length && !this.firstPull && arr.length !== 0) {
      console.log('=====================', Object.keys(this.data).length)
      this.firstPull = true
    }
  }

  async saveData (name, value, tableNames) {
    try {
      let table = xdata.dexieDBStore.db.table(name) || xdata.dexieDBStore.db[name]
      let rows = value || await table.toArray()
      let {isSaveMetaData, tableName} = this.dealSpecialCheckName(name)
      let keyname = name.indexOf('dat') < 0 ? tableName : tableName.slice(4)
      isSaveMetaData && this.saveMetaData(keyname, rows)
      this.getMdtlength()
      // xdata.dexieDBStore.progressBar(name, tableNames)
    } catch (error) {
      console.warn(`table ${name} does not exist! ${error}`)
    }
  }

  concatObject (obj1, obj2) {
    for (var key in obj2) {
      // obj1[key] = obj2[key]
      if (obj1.hasOwnProperty(key)) continue// 有相同的属性则略过
      obj1[key] = obj2[key]
    }
    return obj1
  }

  getCardInfo (cardID) {
    let cards = this.data['card']
    return cards ? cards.get(cardID) : null
  }

  getCardTypeID (cardID) {
    let card = this.getCardInfo(cardID)
    return card ? card.card_type_id : -1
  }

  getCardTypeInfo (cardID) {
    let ret = null

    let cardTypeID = this.getCardTypeID(cardID)
    cardTypeID = parseInt(cardTypeID, 10)
    if (cardTypeID >= 0) {
      ret = this.data['card_type'] && this.data['card_type'].get(cardTypeID)
    }

    return ret
  }

  getCardTypeName (cardID) {
    let typeInfo = this.getCardTypeInfo(cardID)
    if (typeInfo && typeInfo.name) {
      let name = typeInfo.name
      return name === 'CMJ' || name === 'JJJ' ? 'vehicle' : name
    } else {
      return undefined
    }
    // return typeInfo ? typeInfo.name : undefined
  }

  /**
   * 获得卡所绑定对象的信息
   * @param {*} cardID 卡号
   */
  getCardBindObjectInfo (cardID) { // such as staff or vehicle
    let cardTypeName = this.getCardTypeName(cardID)
    cardTypeName = cardTypeName === 'CMJ' || cardTypeName === 'JJJ' ? 'vehicle' : cardTypeName
    let baseInfoTable = this.data[cardTypeName]
    let objExtendInfo = this.cardIndex.get(cardID)
    let objID = objExtendInfo && objExtendInfo[cardTypeName + '_id']

    let objBaseInfo = baseInfoTable && baseInfoTable.get(objID)

    return this.concatObject(objExtendInfo, objBaseInfo)
  }

  // 根据卡号过滤部门
  filterByDept (cardID) {
    if (xdata.depts) {
      let obj = this.getCardBindObjectInfo(cardID)
      let deptID = obj && obj.dept_id
      if (deptID && xdata.depts.includes(deptID)) {
        return true
      }
      return false
    }
    return true
  }

  // 返回一张卡是否显示
  // return : 1 - display, 0 - hide
  needDisplay (cardID) {
    let ret = true
    let objRange = xdata.objRange
    let isCheck = xdata.isCheck
    if (objRange === 1 || isCheck === 1) { // obj.need_display = 0, 不显示
      let obj = this.getCardBindObjectInfo(cardID)
      if (obj && obj.need_display === 0) ret = false
    }

    return ret
  }

  getFieldByID (idName, idValue, fieldName) {
    let ret = idValue
    let r = endWithID.exec(idName)
    if (r) {
      let ds = this.data[r[1]]
      if (ds) {
        let row = (isNaN(parseInt(idValue, 10)) || (isNaN(Number(idValue)))) ? ds.get(idValue) : ds.get(parseInt(idValue, 10))
        if (row) {
          let label = row[fieldName]
          if (label) {
            ret = label
          }
        }
      }
    }
    return (isNaN(Number(ret, 10)) || idName === 'card_id') ? ret : parseInt(ret, 10)
  }

  /**
   * 从 'xxx_id' 字段获取所对应的名称(name字段)
   * 要求：
   * 1. 所有 id 字段必须为 xxx_id 的形式，其对应表的名字为 dat_xxx，如 map_id, 对应表为 dat_map
   * 2. 有一个 name 字段，如 dat_map 中，有一个 name 字段，是对 map_id 的名称
   * 则： getNameByID('map_id', 5) 可以获得 map_id = 5 的地图的名称
   *
   * @method getNameByID
   *
   * @param  {[type]}    idFieldName  [description]
   * @param  {[type]}    idFieldValue [description]
   *
   * @return {[type]}                   [description]
   */
  getNameByID (idFieldName, idFieldValue) {
    let fieldName = 'name'
    if (idFieldName === 'device_type_id' || idFieldName === 'card_type_id') {
      fieldName = 'detail' // device 和 card 的描述字段是 'detail'
    } else if (idFieldName === 'drivingface_id' || idFieldName === 'coalface_id') {
      idFieldName = 'work_face_id'
    }

    return this.getFieldByID(idFieldName, idFieldValue, fieldName)
  }

  updateDriverData (intradayDriver) {

  }

  // 根据卡号过滤部门
  filterDept(cardID) {
    if (xdata.depts) {
      let obj = this.getCardBindObjectInfo(cardID)
      let deptID = obj && obj.dept_id
      if (deptID && xdata.depts.includes(deptID)) {
        return true
      }
      return false
    }
    return true
  }

  // 过滤通过工号，因为一张卡可绑定不同的对象
  needDisplayByJobNumber (obj) { 
    let ret = true
    let objRange = xdata.objRange
    if (objRange === 1) {
      let name = obj.vehicle_id ? 'vehicle' : 'staff'
      let data = this.data[`${name}_extend`].get(obj[`${name}_id`])
      let needDisplay = data && data.need_display
      return !!needDisplay
    }
    return ret
  }

  /**
   * needDisplay: 过滤人员
   * filterDept: 过滤部门
   * operation: && || 
   * card_id: 需要判断是否过滤的卡号，最后一位
   * 如果只需要过滤一种，则只传一个参数，否则传两个或三个参数，第三个参数如果不传，默认为&&
   */
  isFilterData () {
    let args = [].slice.call(arguments)
    let length = args.length
    let cardID = args[args.length - 1]
    if (length >= 2) {
      let operation = args[2] || '&&'
      if (operation === '&&') return this.needDisplay(cardID) && this.filterDept(cardID)
      return this.needDisplay(cardID) || this.filterDept(cardID)
    } else {
       return this[args[0]](cardID)
    }
  }
  // 根据 cardID 获得绑定对象的名称（name）：人员 - 姓名；车辆 - 车牌
  getCardNameByID(cardID) {
    let name = null
    let objInfo = this.getCardBindObjectInfo(cardID)
    name = objInfo && objInfo.name
    return name
  }

  getCardBindName(cardID) {
    cardID = String(cardID)
    cardID = cardID.padStart(13, '00')
    let cardmark = cardID.slice(0, 3)
    let cardType = xdata.metaStore.data.card_type.get(parseInt(cardmark, 10))
    return cardType ? cardType.name : ''
  }

  getVehicleCategoryByTypeID(vehicleTypeID) {
    let ret = null
    let vehicleTypes = this.data['vehicle_type']
    let vehicleTypeObj = vehicleTypes && vehicleTypes.get(vehicleTypeID)
    if (vehicleTypeObj) {
      let vehicleCategorys = this.data['vehicle_category']
      ret = vehicleCategorys && vehicleCategorys.get(vehicleTypeObj.vehicle_category_id)
    }
    return ret
  }
  
  formatLoop(def, row, rule) {
    let ret = {}
    for (let i = 0; i < def.fields.names.length; i++) {
      let name = def.fields.names[i]

      if (i === def.keyIndex) { // key 不做转换
        ret[name] = row[name]
        continue
      }

      let type = def.fields.types[i]
      let value = row[name]
      if (xdata.isCheck === 1 && name === 'dept_id') continue
      if (xdata.isCheck === 1 && name === 'dept_id_ck') name = 'dept_id'
      value = this.formatField(name, value, type, rule)

      ret[name] = value
    }
    return ret
  }

  formatRecord(def, row, rule) { // rule: SHORT-DATE or not, etc.
    if (!def || !row) {
      return row
    }
    let name = def.name
    let basicExtend = null
    let basic = this.formatLoop(def, row, rule)
    if (name === 'staff' || name === 'vehicle') { // 车辆和人员 需要基础表信息和业务表信息拼起来 组成完整信息
      basicExtend = this.formatLoop(this.defs[name + '_extend'], row, rule)
    }
    return concatObject(basic, basicExtend)
  }

  formatField(name, value, type, rule) {
    if (value === null || value === undefined || value === '') {
      return ''
    }
    if (name == 'description' && value.indexOf("&") != -1) {
      let IdArr = value.split('&').map(item => this.getCardNameByID(item))
      value = IdArr.join('与')
    }
    let ret = value
    switch (type) {
      case 'NUMBER':
      case 'SELECT':
        if (endWithID.exec(name)) {
          ret = this.getNameByID(name, value)
        }
        break
      case 'DATETIME':
        let sformater = rule && rule === 'SHORT-DATE' ? 'MM-dd hh:mm' : 'yyyy-MM-dd hh:mm:ss'
        ret = new Date(value).format(sformater)
        break
      default:
        break
    }

    return ret
  }

  isChangeDeptCk (value, cardID) {
    if (xdata.isCheck === 1) {
      let staff = this.getCardBindObjectInfo(cardID)
      let deptID = staff ? staff.dept_id_ck : value
      value = deptID
    }
    return value
  }

  getVehicleDriver(vehicleNumber) {
    return this.driverData && this.driverData.get(vehicleNumber)
  }
  
  //  获得位置描述
  getPositionDesc(landmarkID, directionID, distance) {
    let ret = ''

    let landmarkName = this.getNameByID('landmark_id', landmarkID)
    if (landmarkName !== 0 && distance) {
      distance = distance.toFixed(2)
      ret = landmarkName
      let directionName = this.getNameByID('direction_mapper_id', directionID)
      if (directionName !== 0) {
        if (distance !== 0) {
          ret = landmarkName + directionName + distance + '米'
        }
      } else {
        if (distance !== 0) {
          ret = landmarkName + distance + '米'
        }
      }
    }

    return ret
  }

  formatStateArray(def, row, rule) { // rule: SHORT-DATE or not, etc.
    if (!def || !row) {
      return row
    }
    let ret = []
    for (let i = 0, len = def.fields.names.length; i < len; i++) {
      let name = def.fields.names[i]

      if (i === def.keyIndex) { // key 不做转换
        ret.push(row[i])
        continue
      }
      let type = def.fields.types[i]
      let value = row[i]
      if (name === 'area_id' && row[i] === 0) {
        value = '未识别区域'
      } else {
        if (name === 'dept_id') { // 虚拟部门信息转化
          value = this.isChangeDeptCk(value, row[def.fields.names.indexOf('card_id')])
        }
        value = this.formatField(name, value, type, rule)
      }

      if (name === 'work_time') { // 工作时间转化
        value = formatElapsedTime(value)
      }

      if (name === 'map_pos') { // 地图位置信息组装
        value = this.getPositionDesc(row[i], row[i + 1], row[i + 2])
      }
      ret.push(value)
    }

    return ret
  }

  formatnosignalcards(def, row, rule) {
    if (!def || !row) {
      return row
    }
    let ret = []
    for (let i = 0; i < def.fields.names.length; i++) {
      let name = def.fields.names[i]
      let type = def.fields.types[i]
      let value = row[CARD[name]]
      if (name === 'map_pos') {
        value = this.getPositionDesc(row[16], row[17], row[18])
      } else if (name === 'occupation_id') {
        let occupationID = this.getCardBindObjectInfo(row[0]) ? this.getCardBindObjectInfo(row[0]).occupation_id : '未识别岗位'
        value = this.formatField(name, occupationID, type, rule)
      } else if (name === 'state_biz') {
        value = this.formatField('state_biz_id', value, type, rule)
      } else if (name === 'state_card') {
        value = this.formatField('state_card_id', value, type, rule)
      } else if (name === 'work_time') {
        value = formatElapsedTime(value)
      } else {
        value = this.formatField(name, value, type, rule)
      }
      ret.push(value)
    }

    return ret
  }

  formatRecordArray(def, row, rule) {
    if (!def || !row) {
      return row
    }

    let ret = []
    for (let i = 0; i < def.fields.names.length; i++) {
      let name = def.fields.names[i]

      if (i === def.keyIndex) { // key 不做转换
        ret.push(row[name])
        continue
      }

      let type = def.fields.types[i]
      let value = row[name]
      value = this.formatField(name, value, type, rule)

      ret.push(value)
    }
    return ret
  }
}