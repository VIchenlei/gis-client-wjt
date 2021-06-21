import md5 from 'js-md5'
import numberTurnText from '../def/number_turn_text_def'
import fuzzySearch from '../def/fuzzy_search'
const ALARMICON = 'MO-A-002'
window.PAGE_SIZE = 10
/**
 * 如果是字符串，则转为 JSON 对象，否则保持不变
 *
 * @method toJson
 *
 * @param  {[type]} data [description]
 *
 * @return {[type]}      [description]
 */
function toJson (data) {
  if (typeof data === 'object') {
    return data
  }

  let ret = null
  if (data && (typeof data === 'string')) {
    try {
      ret = JSON.parse(data)
    } catch (error) {
      console.warn('Can NOT parse the input data to be JSON : ', data)
    }
  } else {
    console.warn('The input data\'s type is NOT string : ', data)
  }

  return ret
}

function isPC () {
  let userAgentInfo = navigator.userAgent
  let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (let v = 0, len = Agents.length; v < len; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * usage:
 * let x = new Date()
 * x.format('yyyy-MM-dd hh:mm:ss')
 *
 * @method format
 *
 * @param  {[type]} format [description]
 *
 * @return {[type]}        [description]
 */
Date.prototype.format = function (format) { // eslint-disable-line
  let o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

// 合并两个对象
function concatObject (obj1, obj2) {
  for (var key in obj2) {
    // obj1[key] = obj2[key]
    if (obj1.hasOwnProperty(key)) continue// 有相同的属性则略过
    obj1[key] = obj2[key]
  }
  return obj1
}

function getAlarmShow () {
  let isShow = false
  let result = xdata.menus && xdata.menus.find(item => {
    return item.includes(ALARMICON)
  })
  if (!xdata.hasMenus || result) isShow = true
  return isShow
}

/**
 * md5加密
 * @param {String} username 用户名
 * @param {String} userpwd 密码
 * @param {Any} salt 盐值
 */
function encrypt (username, userpwd, salt) {
  let value = salt ? `${username}-${userpwd}:${salt}` : `${username}-${userpwd}`
  const start = 5, end = 16
  return md5(value).slice(start, end)
}

/**
 * [clone 深度克隆对象]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function formatString (str) {
  str = trim(str)
  str = str.replace(/(\n|\r)/g, '')
  return str
}

// 删除前后空格
function trim (str) {
  return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
}

function getIpNum (ipAddress) {
  let ip = ipAddress.split('.')
  let a = parseInt(ip[0])
  let b = parseInt(ip[1])
  let c = parseInt(ip[2])
  let d = parseInt(ip[3])
  let ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d
  return ipNum
}

function isInnerIP (userIp, begin, end) {
  return (userIp >= begin) && (userIp <= end)
}

// 判断是内网还是外网访问
async function judgeURL (IP) {
  let userIP = IP || xdata.userIP
  let reg = /(http|ftp|https|www):\/\//g // 去掉前缀
  let isInner = true
  if (userIP) {
    userIP = userIP.replace(reg, '')
    let reg1 = /\:+/g // 替换冒号为一点
    userIP = userIP.replace(reg1, '.')
    userIP = userIP.split('.')
    let ipAddress = `${userIP[0]}.${userIP[1]}.${userIP[2]}.${userIP[3]}`
    let ipNum = getIpNum(ipAddress)
    let ips = (xdata.metaStore.data.ip_address && Array.from(xdata.metaStore.data.ip_address.values())) || await xdata.dexieDBStore.db.table('dat_ip_address').toArray()
    // let ips = xdata.metaStore.data.ip_address && Array.from(xdata.metaStore.data.ip_address.values())
    ips = ips || []
    for (let i = 0; i < ips.length; i++) {
      let ip = ips[i]
      let begin = ip.ip_begin && getIpNum(ip.ip_begin)
      let end = ip.ip_end && getIpNum(ip.ip_end)
      isInner = isInnerIP(ipNum, begin, end)
      if (isInner) {
        // return isInner
        break
      }
    }
  }
  console.log('是否是内网:' + isInner)
  return isInner
}

function toTextBySelect (data, name, topicName, row) {
  topicName = ['his_device_net_params', 'his_device_params'].includes(topicName) ? topicName.slice(4) : topicName
  if (numberTurnText.hasOwnProperty(topicName) && numberTurnText[topicName].hasOwnProperty(name)) {
    return noTurnTxt(topicName, name, data)
  } else if (['vehicle_type', 'area'].includes(topicName) && name === 'att_rule_id') {
    const key = `${topicName}_id`
    const keyValue = row[key] // 车辆类型、区域ID
    const obj = xdata.metaStore.data[`att_rule_${topicName}`] && xdata.metaStore.data[`att_rule_${topicName}`].get(keyValue)
    const attRuleID = obj && obj.att_rule_id
    const attRuleObj = xdata.metaStore.data.att_rule && xdata.metaStore.data.att_rule.get(attRuleID)
    const attRuleName = attRuleObj ? attRuleObj.name : ''
    return attRuleName
  } else if (topicName === 'light_rd_spec_process' && ['shape_id', 'color_id'].includes(name)) {
    let byName = name === 'shape_id' ? 'light_shape' : 'light_color'
    let keyName = name === 'shape_id' ? 'shape_name' : 'color_name'
    let selectData = xdata.metaStore.data[byName]
    return selectData && selectData.get(data) && selectData.get(data)[keyName]
  } else {
    if (name === 'dept_id_ck' && topicName === 'staff') {
      let deptCks = xdata.metaStore.data.dept_ck
      return deptCks && deptCks.get(data) && deptCks.get(data).name
    }
    return xdata.metaStore.getNameByID(name, data)
  }
}

function dealMenus (type, data, topicName) {
  let store = xdata.metaStore
  let menus = topicName === 'user' ? store.data.dept : store.data.menu
  if (menus) {
    data = data && data.split(';')
    let resName = ''
    if (topicName === 'user' && data.includes('0')) return '全矿所有'
    if (topicName === 'role' && data.includes('0')) return '全部功能'
    data && data.forEach(item => {
      if (topicName === 'user') item = parseInt(item, 10)
      let list = menus.get(item) ? menus.get(item).name : item
      resName += `${list};`
    })
    return resName
  }
}

// 路径集Y坐标取反展示
function getcoodValue (values) {
  values = values.split(',')
  let texts = ''
  for (let i = 0; i < values.length; i++) {
    if (i === 1) values[i] = -Number(values[i])
    texts += i < values.length - 1 ? `${values[i]},` : `${values[i]}`
  }
  return texts
}

function toTextByString (type, data, name, topicName) {
  if (['menus', 'access_id'].includes(name)) return dealMenus(type, data, topicName)
  if (topicName === 'road_segment' && ['bpoint', 'epoint'].includes(name)) return getcoodValue(data)
  if (['person', 'person_hour'].includes(topicName) && name.includes('retention_time') && data) {
    let times = data.split(':');
    let minutes = times[0].length === 1 ? `0${times[0]}` : times[0]
    let seconds = times[1].length === 1 ? `0${times[1]}` : times[1]
    data = `${minutes}:${seconds}`
  }
  return data
}

function getBusiness (name, values) {
  let businesses = xdata.metaStore.data.area_business
  if (!values || !businesses) return values
  businesses = Array.from(businesses.values())
  values = values.toString(2).padStart(12, 0).split('').reverse()
  let result = ''
  for (let i = 0; i < values.length; i++) {
    if (parseInt(values[i], 10)) {
      let res = businesses[i] ? businesses[i].name : ''
      result += res ? `${res};` : ''
    }
  }
  return result
}

function toTextByNumber (type, data, name, topicName) {
  if (name === 'staff_id' && topicName === 'leader_arrange') return xdata.metaStore.getNameByID(name, data)
  if (name === 'y') return -Number(data)
  if (topicName === 'area') {
    if (name == 'angle' && data) return data.toFixed(2)
    if (name === 'business_type') return getBusiness(name, data)
  }
  return data
}

function changeToTextByType (type, data, name, topicName, row) {
  if (!data && data !== 0 && !(['vehicle_type', 'area'].includes(topicName) && name === 'att_rule_id')) return ''
  if (data === ' ') return ''
  if (type === 'DATETIME') return new Date(data).format('yyyy-MM-dd hh:mm')
  if (type === 'MONTH') return new Date(data).format('yyyy-MM')
  if (type === 'NOYEARDATETIME') return new Date(data).format('MM-dd hh:mm')
  if (type === 'DATE') return new Date(data).format('yyyy-MM-dd')
  if (type === 'SELECT') return toTextBySelect(data, name, topicName, row)
  if (type === 'COLOR') return ''
  if (type === 'STRING') return toTextByString(type, data, name, topicName)
  if (type === 'NUMBER') return toTextByNumber(type, data, name, topicName)
  return data
}

function composeUpdateDBReq (dbOp, name, keyValue, sqlstring) {
  return {
    cmd: 'update', // update, CMD.META.UPDATE
    data: {
      op: dbOp, // INSERT, UPDATE, DELETE
      name: name,
      id: keyValue,
      sql: sqlstring
    }
  }
}

function convertSVGPath2Coord (pathString, split, substring, isreverse) {
  let coordinates = []
  split = split || ' '
  let paths = pathString.split(split)
  for (let path of paths) {
    let point = path.split(',')
    let x = substring ? Number(point[0]) : Number(point[0].substring(1))
    let y = isreverse ? Number(point[1]) : -Number(point[1])
    if (isNaN(x) || isNaN(y)) return coordinates
    coordinates.push([x, y])
  }

  return coordinates
}

function judgeAreaIsneedDisplay (obj) {
  let areaID = obj.area_id
  let areas = xdata.metaStore.data.area
  let deviceArea = areas && areas.get(areaID)
  let deviceAreaNeedDisplay = deviceArea && parseInt(deviceArea.need_display, 10)
  if (xdata.isCheck === 1 && deviceAreaNeedDisplay === 0) return false
  return true
}

// 根据name过滤队组，返回队组过滤sql
function getAccessSql (defName) {
  let dse2 = ['person_absence']
  let s = ['person_well_overtime', 'person_area_overtime', 'person_well_overcount', 'person_area_overcount', 'person_call_help', 'person_area_limited', 'vehicle_enter_limit_area']
  let dve = ['vehicle_updown_mine', 'vehicle_no_updown_mine', 'his_area', 'v_vehicle_day', 'v_vehicle_month', 'driver_dept_day', 'driver_dept_month', 'vehicle_check']
  let v = ['v_overspeed', 'tbm_substation_distance_limited', 'car_end_zhuiwei', 'car_geofault_limited']
  let ds = ['person_card_battery_alarm', 'person_fixed_alarm']
  let aa = ['worktime_detail_table']
  let bt = ['TrackList']
  let accessResult = xdata.depts
  let sql = ''
  let field = ''
  if (accessResult && accessResult != '') {
    switch (true) {
      case dse2.includes(defName):
        field = 'dse2.dept_id'
        break
      case s.includes(defName):
        field = 's.dept_id'
        break
      case dve.includes(defName):
        field = 'dve.dept_id'
        break
      case v.includes(defName):
        field = 'v.dept_id'
        break
      case ds.includes(defName):
        field = 'ds.dept_id'
        break
      case aa.includes(defName):
        field = 'aa.dept_id'
        break
      case bt.includes(defName):
        field = 'bt.dept_id'
        break
      default:
        field = 'dse.dept_id'
        break
    }
    for (let i = 0; i < accessResult.length; i++) {
      let concatstr = accessResult.length > 1 ? ' and (' : ' and '
      i === 0 ? sql += concatstr + field + '=' + Number(accessResult[i]) : sql += ' OR ' + field + '=' + Number(accessResult[i])
    }
    sql += accessResult.length > 1 ? ')' : ''
  }
  return sql
}

// 根据name过滤人车，返回人车过滤sql
function getDisplaySql (defName) {
  let dse2 = ['person_absence']
  let s = ['person_well_overtime', 'person_area_overtime', 'person_well_overcount', 'person_area_overcount', 'person_call_help', 'person_area_limited', 'vehicle_enter_limit_area']
  let ds = ['person_card_battery_alarm', 'person_fixed_alarm']
  let aa = ['worktime_detail_table']
  let dve = ['vehicle_updown_mine', 'vehicle_no_updown_mine', 'his_area', 'v_vehicle_day', 'v_vehicle_month', 'driver_dept_day', 'vehicle_check', 'driver_dept_month']
  let v = ['v_overspeed', 'vehicle_exception', 'driver_car_limited', 'person_driver_car_limited', 'tbm_substation_distance_limited', 'car_end_zhuiwei', 'car_geofault_limited']
  let sql = ''
  let field = ''
  switch (true) {
    case dse2.includes(defName):
      field = 'dse2.need_display'
      break
    case s.includes(defName):
      field = 's.need_display'
      break
    case ds.includes(defName):
      field = 'ds.need_display'
      break
    case aa.includes(defName):
      field = 'aa.need_display'
      break
    case dve.includes(defName):
      field = 'dve.need_display'
      break
    case v.includes(defName):
      field = 'v.need_display'
      break
    default:
      field = 'dse.need_display'
      break
  }
  sql += ` and ${field} = 1 `
  return sql
}

/* 虚拟部门 */
function getSqlByIsCheck (tableName, sqlString) {
  if (/^person/.test(tableName) && xdata.isCheck === 1) {
    if (tableName === 'person_reader_detail') {
      sqlString.staff.alarmSql = sqlString.staff.alarmSql.replace(/_dept/g, '_dept_ck').replace(/_staff_extend/g, '_staff_extend_ck')
    } else {
      sqlString = sqlString.replace(/_dept/g, '_dept_ck').replace(/_staff_extend/g, '_staff_extend_ck')
    }
  }
  return sqlString
}

function getMon (num) {
  let stime = ''
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth()
  let year2 = year
  if (month < 9) {
    month = '0' + (month + 1)
  }

  stime = '"' + year2 + '-' + month + '"'
  return stime
}

function dealMonth (chooseTime) {
  let time = chooseTime || getMon()
  let month_data = xdata.metaStore.data.month && Array.from(xdata.metaStore.data.month.values())
  let month_start = month_data && month_data[0] ? month_data[0].start_time : 1
  let month_end = month_data && month_data[0] ? month_data[0].end_time : 31
  let choose_year = new Date(time).getFullYear()
  let endYear = choose_year
  let choose_month = new Date(time).getMonth() + 1
  let endMonth = choose_month
  let month_num = new Date(choose_year, choose_month, 0).getDate()
  month_start = month_start >= month_num ? month_num : month_start
  month_end = month_end >= month_num ? month_num : month_end
  if (month_start >= month_end) {
    if (choose_month === 12) {
      endMonth = 1
      end_year = choose_year + 1
    } else {
      endMonth = choose_month + 1
    }
  }
  let choose_start = new Date(time).format('yyyy-MM') + '-' + month_start
  let choose_end = endYear + '-' + endMonth + '-' + month_end
  return `"${choose_start}" and "${choose_end}"`
}

function getRows (values, def, maxid) {
  values = values ? values.row : null
  let rows = []
  let length = def.fields.names.length

  for (let i = 0; i < length; i++) {
    let v = values ? values[def.fields.names[i]] : ''
    if (!values && i == def.keyIndex && def.name !== 'user') { // 新增记录，id 为 最大id+1
      v = maxid ? maxid + 1 : ''
    } else if (def.fields.types[i] === 'DATE') {
      v = v ? new Date(v).format('yyyy-MM-dd') : ''
    } else if (def.fields.types[i] === 'MORESELECT') {
      v = values && values['area_id']
    }
    let enableNull = def.fields.enableNull
    enableNull = enableNull && enableNull[i]
    let row = {
      field_name: def.fields.names[i],
      field_value: v,
      field_type: def.fields.types[i],
      field_label: def.fields.labels[i],
      field_enableNull: enableNull
    }
    rows.push(row)
  }
  return rows
}

function isNullArr (obj) {
  let isNull = obj.every(item => !item)
  return isNull
}

// 对象排序
function objKeySort (obj, referObj) {
  let newObj = {}
  let values = []
  for (let i = 0; i < referObj.length; i++) {
    let objValue = (obj[referObj[i]] || obj[referObj[i]] === 0) ? obj[referObj[i]] : null
    values.push(objValue)
    newObj[referObj[i]] = objValue
  }
  let isNull = isNullArr(values)
  return isNull ? null : newObj
}

// 数字与文字转换，传入value是中文字符时，需要转换成数字，则type === 'key'
function noTurnTxt (sheetName, nameTxt, value, type) {
  if (numberTurnText.hasOwnProperty(sheetName)) {
    let hasTurnName = numberTurnText[sheetName][nameTxt]
    if (hasTurnName) {
      if (type) {
        let values = Object.values(hasTurnName)
        let keys = Object.keys(hasTurnName)
        return keys[values.indexOf(value)]
      } else {
        if (Array.isArray(hasTurnName)) {
          for (let i = 0; i < hasTurnName.length; i++) {
            let hasTurnObj = hasTurnName[i]
            for (let rec in hasTurnObj) {
              if (hasTurnObj[rec] === value) return value
              if (Object.prototype.toString(hasTurnObj) === '[object Object]') {
                if (rec == value) return hasTurnObj[rec]
              }
            }
          }
        } else {
          return hasTurnName[value]
        }
      }
    }
  }
  if (nameTxt === 'y') {
    value = -Number(value)
  }
  if (sheetName === 'vehicle_type' && nameTxt === 'vehicle_level_id' && value === 0) {
    return ' '
  }
  if (sheetName === 'reader_path_tof_n' && nameTxt === 'reader_id') {
    return xdata.metaStore.getNameByID('reader_id', value)
  }
  if (sheetName === 'patrol_path' && name === 'patrol_type_id') {
    let pathTypeData = Array.from(xdata.metaStore.data.patrol_path_type)
    pathTypeData.filter(item => {
      if (item[1].patrol_type_id === value) {
        value = item[1].name
      }
    })
  }
  return value
}

function inquireDB (name, sql, countSql) {
  window.xhint.showLoading()
  let message = ['workface_scheduling_echarts', 'curDayDriver'] ? {
    cmd: 'query',
    data: {
      name: name,
      sql: sql
    }
  } : {
    cmd: 'query',
    data: {
      name: name,
      sql: sql,
      pageSize: 10000,
      pageIndex: 0,
      total: -1,
      countSql: countSql
    }
  }
  xbus.trigger('REPT-FETCH-DATA', {
    req: message,
    def: {
      name: name
    }
  })
}

function fontDataChange (update) {
  if (window.localStorage.fontDataNumber) {
    let fontDataParse = JSON.parse(window.localStorage.fontDataNumber)
    window.FONT_SIZE = fontDataParse[0].fontSize
    window.PAGE_SIZE = fontDataParse[0].dataNumber
  } else {
    let fontDataNumber = [{
      id: 1,
      fontSize: 1,
      dataNumber: 10
    }]
    window.FONT_SIZE = fontDataNumber[0].fontSize
    window.PAGE_SIZE = fontDataNumber[0].dataNumber
    let fontDataStringify = JSON.stringify(fontDataNumber)
    window.localStorage.setItem('fontDataNumber', fontDataStringify)
  }
  document.getElementsByTagName('html')[0].style.fontSize = (FONT_SIZE * 6.25) + 'rem'
  if (update) {
    let msg = {
      type: 'success',
      message: '修改成功'
    }
    window.xMessage.open(msg)
  }
}

function initPagination (rows, pageindex) {
  let total = rows ? rows.length : 0
  let totalPage = Math.ceil(total / PAGE_SIZE)
  let pageIndex = 0
  if (pageindex) {
    if (pageindex === totalPage) {
      pageIndex = pageindex - 1
    } else {
      pageIndex = pageindex
    }
  } else {
    pageIndex = 0
  }
  return {
    'total': total,
    'totalPage': totalPage,
    'pageIndex': pageIndex
  }
}

function copySubRows (rows, pageIndex) {
  pageIndex = pageIndex || 0
  let start = pageIndex * PAGE_SIZE
  let end = (pageIndex + 1) * PAGE_SIZE
  return rows && rows.slice(start, end)
}

function computeMonthDays (stime, etime) {
  let month1 = [1, 3, 5, 7, 8, 10, 12] // 31天的月份
  let month2 = [4, 6, 9, 11] // 30天的月份
  let searchYear = Number(stime.split('-')[0])
  let month_start = Number(stime.split('-')[2])
  let month_end = Number(etime.split('-')[2])
  let searchSMonth = Number(stime.split('-')[1])
  let searchEMonth = Number(etime.split('-')[1])
  let daysArr = []
  let days = 0
  let len = 0
  if (month1.includes(Number(searchSMonth))) {
    len = 31
  } else if (month2.includes(Number(searchSMonth))) {
    len = 30
  } else {
    len = (searchYear % 4 == 0 && searchYear % 100 !== 0 || searchYear % 400 == 0) ? 29 : 28
  }

  if (month_start < month_end && searchEMonth == searchSMonth) {
    days = month_end - month_start + 1
  } else if (month_start == month_end && searchEMonth == searchSMonth) {
    days = 1
  } else {
    days = len + 1 - month_start + month_end
  }
  if (searchSMonth == searchEMonth) {
    for (let j = month_start; j < (days + month_start); j++) {
      if (j > len) {
        daysArr.push(`${searchEMonth}-${j % len}`)
      } else {
        daysArr.push(`${searchEMonth}-${j}`)
      }
    }
  } else {
    for (let i = month_start; i <= len; i++) {
      daysArr.push(`${searchSMonth}-${i}`)
    }
    for (let i = 1; i <= month_end; i++) {
      daysArr.push(`${searchEMonth}-${i}`)
    }
  }

  return {
    days: days,
    daysArr: daysArr,
    month_start: month_start,
    month_end: month_end
  }
}

function computeDays (searchYear, searchMonth) {
  searchMonth = Number(searchMonth)
  let month1 = [1, 3, 5, 7, 8, 10, 12] // 31天的月份
  let month2 = [4, 6, 9, 11] // 30天的月份
  let month_data = xdata.metaStore.data.month && Array.from(xdata.metaStore.data.month.values())
  let month_start = month_data && month_data[0] ? month_data[0].start_time : 1
  let month_end = month_data && month_data[0] ? month_data[0].end_time : 31
  let daysArr = []
  let days = 0
  let len = 0
  if (month1.includes(Number(searchMonth))) {
    len = 31
  } else if (month2.includes(Number(searchMonth))) {
    len = 30
  } else {
    len = (searchYear[0] % 4 == 0 && searchYear[0] % 100 !== 0 || searchYear[0] % 400 == 0) ? 29 : 28
  }

  if (month_start < month_end) {
    if (month_end > len) {
      days = len - month_start + 1
    } else {
      days = month_end - month_start + 1
    }
  } else {
    days = len + 1 - month_start + month_end
  }
  for (let j = month_start; j < (days + month_start); j++) {
    if (j > len) {
      daysArr.push(`${searchMonth}-${j % len}`)
    } else {
      daysArr.push(`${searchMonth}-${j}`)
    }
  }
  return {
    days: days,
    daysArr: daysArr,
    month_start: month_start,
    month_end: month_end
  }
}

function getMonth (nMonth, type) {
  let y = nMonth ? nMonth.split('-')[0] : new Date().getFullYear()
  let m = nMonth ? nMonth.split('-')[1] : new Date().getMonth() + 1
  let shift = xdata.metaStore.data.shift && xdata.metaStore.data.shift.get(1)
  let shiftime = shift ? shift.start_time : '23:59:59'
  let sMonth = type ? `${new Date(new Date(y, Number(m) - 1, 0).getTime()).format('yyyy-MM-dd')} ${shiftime}` : `${new Date(new Date(y, Number(m) - 1, 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
  let lMonth = `${new Date(new Date(y, m, 0).getTime()).format('yyyy-MM-dd')} 23:59:59`
  return `between '${sMonth}' and '${lMonth}'`
}

function getDeptID (row) {
  const CM = 1
  let workfaceType = Number(row.workface_type)
  let workfaces = workfaceType === CM ? xdata.metaStore.data.coalface_vehicle : xdata.metaStore.data.drivingface_vehicle
  let workfaceID = workfaces && workfaces.get(row.workface_id)
  let vehicleID = workfaceID && workfaceID.vehicle_id
  let vehicles = xdata.metaStore.vehicles
  let vehicle = vehicles && vehicleID && vehicles.get(vehicleID)
  let deptID = vehicle && vehicle.dept_id
  return deptID
}

function paddingLeft (i) {
  let ret = '' + i
  if (i < 10) {
    ret = '0' + i
  }

  return ret
}

function formatElapsedTime (ms) {
  if (ms <= 0) return '00:00:00'
  const h = 60 * 60 * 1000
  const m = 60 * 1000
  const s = 1000
  let hh = Math.floor(ms / h)
  let mm = Math.floor(ms % h / m)
  let ss = Math.floor(ms % h % m / s)
  let shh = paddingLeft(hh)
  let smm = paddingLeft(mm)
  let sss = paddingLeft(ss)
  return shh + ':' + smm + ':' + sss
}

function getSortType (type, name) {
  let names = ['staff_id','coalface_id','drivingface_id']
  let sortType = type !== 'NUMBER' && type !== 'SELECT' && 'chinese'
  if (names.includes(name)) return ''
  return sortType
}

/**
 *  name: 按照哪个字段来排序
 *  type: 是否中文排序，是中文排序传参，不是不用传参
 *  reverse: 是否逆序
 *  */
function compare (name, type, reverse, minor) {
  return function (o, p) {
    var a, b
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      a = o[name]
      b = p[name]
      if (a === b) {
        return minor ? minor(o, p) : 0
      }
      if (typeof a === typeof b) {
        if (type) { // 中文排序
          if (reverse) {
            return b.localeCompare(a, 'zh-Hans-CN')
          } else {
            return a.localeCompare(b, 'zh-Hans-CN')
          }
        } else {
          if (reverse) {
            return a > b ? -1 : 1
          } else {
            return a < b ? -1 : 1
          }
        }
      }
      if (reverse) {
        return typeof a > typeof b ? -1 : 1
      } else {
        return typeof a < typeof b ? -1 : 1
      }
    }
  }
}

function formatFieldValue (type, value) {
  let ret = null
  switch (type) {
    case 'NUMBER':
    case 'SELECT':
      ret = +value // Number
      break
    case 'geom':
    case 'POLYGON':
      ret = value ? 'GEOMFROMTEXT(' + value + ')' : ret// 空间几何
      break
    default:
      value = value && formatString(value)
      ret = /"([^"]*)"/g.test(value) ? value : `"${value}"` // String
      break
  }
  return ret
}

function editDetail (fieldName, value, detail, tableName, table) {
  let defs = xdata.metaStore.defs[tableName], fields = defs.fields, names = fields.names, labels = fields.labels
  let index = names.indexOf(fieldName)
  if (index < 0 && table) {
    defs = xdata.metaStore.defs[table], fields = defs && defs.fields, names = defs && fields.names, labels = defs && fields.labels
    index = names && names.indexOf(fieldName)
  }
  let label = labels && labels[index]
  if (label) detail += `${label}:${value};`
  return detail
}

function getMessage (cmd, rows, def, maxid) {
  return {
    cmd: cmd,
    name: def.name,
    table: def.table,
    title: def.label,
    key: def.fields.names[parseInt(def.keyIndex)], // key field name
    maxid: maxid,
    rows: rows
  }
}

function metaUpdateRes (res, topicName, cmd, nameList) {
  nameList = nameList || []
  let dlgTips = null
  let updateRes = null
  if (res.data.name === topicName || res.data.name.includes(topicName)) {
    if (res.code === 0) {
      let resultText = null
      switch (cmd) {
        case 'INSERT':
          resultText = '添加成功'
          break
        case 'UPDATE':
          resultText = '修改成功'
          break
        case 'DELETE':
          resultText = '删除成功'
          break
      }
      dlgTips = resultText
      updateRes = true
    } else {
      dlgTips = res.msg
      updateRes = false
    }
    let msg = {
      type: res.code === 0 ? 'success' : 'error',
      message: dlgTips
    }
    dlgTips && window.xMessage.open(msg)
    return updateRes
  }
}

function testMapID (testMapID, defaultMapID) {
  if (testMapID === defaultMapID) return true
  return false
}

// 获取排序文字名称 2019-05-20 chenl
function checkClick (target, nodename) {
  if (nodename === 'th') {
    return target.firstElementChild && target.firstElementChild.innerText
  } else if (nodename === 'span') {
    return target.innerText
  } 
  else if (nodename === 'img') {
    return target.parentElement.querySelector('span').innerText
  }
}

function show (root) {
  let ele = root.querySelector('.dlg-window').classList
  let dlBgEle = root.querySelector('.dlg-bg').classList
  dlBgEle.remove('zoomNone')
  dlBgEle.add('zoomToOut')
  ele.add('zoomIn')
  ele.remove('zoomOut')
}

// 补全 13 位的卡号
function composeCardID (prefix, sid) {
  let len = (sid + '').length
  let ss = ''.padEnd(10 - len, '0')
  return prefix + ss + sid
}

function checkMapGis (name, value) {
  if (['url', 'inner_url'].includes(name)) {
    const reg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/ig
    return reg.test(value) || !value ? '' : '请输入正确的网址'
  }
  if (name === 'layers') {
    const reg = /[a-zA-Z0-9:]/ig
    return reg.test(value) || !value ? '' : '请输入正确的图层名'
  }
}

function checkWorkfaceScheduling (name, value) {
  const now = `${new Date(new Date().getTime()).format('yyyy-MM-dd')} 00:00:00`
  if (['start_time', 'end_time'].includes(name)) {
    return new Date(value).getTime() < new Date(now).getTime() ? '不能修改早于今天的数据' : ''
  }
  if (name === 'schedule_startup_time') return value <= 0 || value >= 24 ? '请输入0-24小时内的数字' : ''
  if (['schedule_tunnelling_times', 'schedule_mine_times'].includes(name)) {
    if (value <= 0) return '请输入一个大于0的数'
    if (name === 'schedule_tunnelling_times') value > 15 ? '请输入小于15排的数值' : ''
    if (name === 'schedule_mine_times') value > 10 ? '请输入小于10刀的数值' : ''
  }
}

function checkDetial (name, value, evt, self) {
  if (['start_time', 'end_time', 'start_up_time', 'shut_down_time'].includes(name)) {
    const today = new Date(new Date(opts.riotValue).getTime()).format('yyyy-MM-dd')
    const inputValue = new Date(new Date(value).getTime()).format('yyyy-MM-dd')
    if (today != inputValue) {
      return '输入的时间与修改时间不符'
    } else {
      self.inputBlur(evt, value)
      return ''
    }
  }
}

function checkSensor (name, value) {
  if (name === 'data_source') {
    const reg = /^[0-9]{1,}$/
    return reg.test(value) ? '' : '请输入一个数值'
  }
  if (['driver_alarm_threshold', 'alarm_threshold'].includes(name)) return value <= 0 ? '请输入一个大于0的数' : ''
}

function checkShortName (name, value) {
  if (name === 'shortname') return value.length > 6 ? '内容长度不能超过6个字' : ''
}

function addBusinesslogic (value, self, evt) {
  const name = self.fieldName
  const tableName = self.opts.dataName
  let info = self.info
  const needAddlogic = ['dat_rules', 'his_maintenance', 'dat_map', 'dat_area', 'dat_ip_address', 'dat_workface_scheduling', 'his_regular_cycle_detail', 'his_startup_detail', 'dat_sensor', 'dat_lights_group', 'dat_month', 'dat_reader', 'dat_gis_layer', 'tt_inspection_route_planning', 'dat_staff', 'dat_card_type', 'dat_worktype', 'dat_occupation', 'dat_power_levels', 'dat_road_segment', 'dat_device_power']
  if (needAddlogic.includes(tableName)) {
    const checkLogic = {
      dat_rules: (function (name, value) {
        if (name === 'status') return value === '0' || value === '1' ? '' : '请输入0或1'
      })(name, value),
      his_maintenance: (function (name, value) {
        if (['maintain', 'maintain_leader'].includes(name)) {
          const reg = /^[\u4e00-\u9fa5]{1,}$/g
          return reg.test(value) || !value ? '' : '请输入正确姓名'
        }
      })(name, value),
      dat_map: checkMapGis(name, value),
      dat_area: (function (name, value) {
        if (name === 'path') {
          const reg = /[A-Za-z0-9,' ']/ig
          return reg.test(value) || !value ? '' : '请输入正确的路径'
        }
      })(name, value),
      dat_ip_address: (function (name, value) {
        if (['ip_begin', 'ip_end'].includes(name)) {
          const reg = /[0-9.]/ig
          return reg.test(value) || !value ? '' : '请输入正确的IP地址'
        }
      })(name, value),
      dat_workface_scheduling: checkWorkfaceScheduling(name, value),
      his_regular_cycle_detail: checkDetial(name, value, evt, self),
      his_startup_detail: checkDetial(name, value, evt, self),
      dat_sensor: checkSensor(name, value),
      dat_lights_group: (function (name, value) {
        if (name === 'scope') return value < 0 ? '请输入一个大于或等于0的数' : ''
      })(name, value),
      dat_month: (function (name, value) {
        if (name === 'id') return value <= 0 ? '请输入一个大于0的数' : ''
        if (['start_time', 'end_time'].includes(name)) return value <= 0 || value > 31 ? '请输入1-31之间的数' : ''
      })(name, value),
      dat_occupation: checkShortName(name, value),
      dat_worktype: checkShortName(name, value),
      dat_power_levels: (function (name, value) {
        if (['id', 'power_levels_id', 'device_power_id', 'battery_number', 'battery_type', 'rated_voltage', 'discharge_voltage', 'capacity', 'discharge_voltage_cycle', 'discharge_voltage_time', 'power_status'].includes(name)) {
          const reg = /^[0-9]*$/
          return !reg.test(value) ? '请输入数字' : ''
        }
      })(name, value), 
      dat_road_segment: (function (name, value) {
        if (['bpoint', 'epoint'].includes(name)) {
          // 检验拼接x,y录入是否正确 小数点后最多保留2位
          const reg = /^(([1-9]+[\d])|(([1-9]+[\d]*(.[0-9]{1,2})?))),(([1-9]+[\d])|(([1-9]+[\d]*(.[0-9]{1,2})?)))$/g
          return !reg.test(value) ? (value ? '请输入正确的坐标' : '输入框不能为空') : ''
        }
      })(name, value),
      dat_device_power: (function (name, value) {
        if (name === 'power_model') {
          // 检验拼接x,y录入是否正确 小数点后最多保留2位
          return value ? '' : info
        }
      })(name, value),
    }
    info = checkLogic[tableName]
  }
  if (/^dat_/ig.test(tableName) && !['dat_staff'].includes(tableName)) {
    const oldValue = self.root.getAttribute('data-oldvalue')
    if (name === 'name' && oldValue !== value) {
      value = trim(value)
      let tablename = tableName.slice(4)
      let table = xdata.metaStore.data[tablename]
      let isHas = table && Array.from(table.values()).some(item => item.name === value)
      let name = evt.item.field_value
      return isHas && value != name ? '该名称已被注册' : ''
    }
  }
  return info
}

// 获取元素到文档顶部的距离
function getPoint (obj) {
  let t = obj.offsetTop
  while (obj = obj.offsetParent) {
    t += obj.offsetTop
  }
  return t
}

// 设置下拉结果框位置
function setPosition (target, parent, self) {
  let targetTop = getPoint(target)
  let selectTop = self.root.scrollHeight
  let ulWap = self.root.querySelector('.ul-warp')
  let x = target.parentElement.offsetLeft
  let y = target.parentElement.offsetTop
  let width = target.parentElement.offsetWidth
  let height = target.parentElement.offsetHeight
  let scrollHeight = parent.scrollHeight
  ulWap.style.width = width + 'px'
  ulWap.style.left = x + 'px'
  let bottom = scrollHeight - targetTop + height + y
  if (scrollHeight - targetTop + height + y < selectTop) {
    self.root.style.top = y - height - selectTop + 10 + 'px'
  } else {
    self.root.style.top = y + height + 5 + 'px'
  }
}

// 检查是否有人员考勤业务
function checkPerson (areaID) {
  let isPersonBusiness = false
  let areas = xdata.metaStore.data.area && Array.from(xdata.metaStore.data.area.values())
  if (areaID) areas = areas.filter(area => area.area_id === areaID)
  for (let i = 0; i < areas.length; i++) {
    const area = areas[i]
    const businessType = area.business_type
    const business = businessType.toString(2).padStart(12, 0).split('').reverse()
    const personBusiness = parseInt(business[4])
    if (personBusiness === 1) isPersonBusiness = true
    break
  }
  return isPersonBusiness
}

// 编辑状态下设备类型为普通分站过滤掉虚拟分站、反之过滤掉普通分站
function filterItem (fieldValue, items, tableName, fieldName) {
  if (tableName === 'dat_reader') {
    if (fieldName === 'device_type_id' && fieldValue !== '') {
      items = items.filter(item => {
        if (fieldValue === 1 && item.value === 1) return item
        if (fieldValue !== 1 && item.value !== 1) return item
      })
    }
    if (fieldName === 'area_id') {
      items = items.filter(item => item.value !== 0)
    }
  } else if (tableName === 'dat_area') {
    // 判断区域是否存在区域已绑定人员考勤业务，人员考勤业务绑定井下区域
    let isPersonBusiness = false
    const areas = xdata.metaStore.data.area && Array.from(xdata.metaStore.data.area.values())
    if (areas && areas.length > 0) {
      for (let i = 0; i < areas.length; i++) {
        isPersonBusiness = checkPerson(areas[i].area_id)
        if (isPersonBusiness) break
      }
    }
    if (!isPersonBusiness) return items
    items = items.filter(item => {
      if (fieldValue !== 4 && item.value !== 4) return item
      if (fieldValue === 4 && item.value === 4) return item
    })
  } else if (tableName === 'dat_credentials' && fieldName === 'card_type_id') {
    items = items.filter(item => item.value === 1 || item.value === 2)
  } else if (['dat_staff', 'dat_vehicle', 'dat_credentials_staff', 'dat_credentials_vehicle'].includes(tableName) && fieldName === 'credentials_id') {
    let credentials = xdata.metaStore.data.credentials && Array.from(xdata.metaStore.data.credentials.values())
    items = items.filter((item, i) => {
      let cardTypeID = credentials && credentials[i].card_type_id
      if (tableName.includes('staff') && cardTypeID === 1) return item
      if (tableName.includes('vehicle') && cardTypeID === 2) return item
    })
  }
  return items
}

// 选择区域修改对应的区域列表
function changeCheckBox (self) {
  let { fieldName } = self
  let names = ['area_type_id', 'role_rank_id', 'card_type_id']
  if (!names.includes(fieldName)) return
  let input = self.refs[fieldName]
  let selectedValue = input && input.getAttribute('name')
  selectedValue = Number(selectedValue) || self.index
  let parenTag = self.parent

  if (fieldName === 'area_type_id') {
    let value = parseInt(selectedValue, 10)
    let checklistTag = parenTag.refs['business_type']
    parenTag.refs['business_type'].updateSelect(value)
  }
}

// 人员、车辆添加ident
function getIdent (row, name) {
  let cardID = row['card_id']
  let type = name === 'staffs' ? '001' : '002'
  let ident = cardID && cardID.toString().substr(3)
  ident = parseInt(ident, 10)
  return ident
}

/*过滤队组 */
function filterTeam (rows, name, type) {
  rows = rows && rows.filter(item => {
    let deptID = item.dept_id || (xdata.metaStore[name].get(item[type]) && xdata.metaStore[name].get(item[type]).dept_id)
    if (!xdata.depts || xdata.depts.includes(deptID)) return item
  })
  return rows
}

/*
  *rows:[] 检索结果集
  *keys:[]
  *desc:检索展示的字段
*/
function getSerachData (fieldName, datas, self) {
  let rows = null, keys = null, desc = null, keyName = null
  let name = fieldName
  const names = ['staffs', 'drivers', 'staff_id', 'vehicles', 'vehicle_id']
  if (names.includes(fieldName)) {
    name = fieldName.includes('vehicle') ? 'vehicles' : 'staffs'
    keyName = fieldName.includes('vehicle') ? 'vehicle_id' : 'staff_id'
  } else if (fieldName === 'select_card') {
    name = 'card'
    keyName = 'card_id'
  } else if (fieldName === 'hw_version') {
    name = 'card'
    keyName = 'hw_version'
  } else if (fieldName.includes('reader')) {
    name = 'reader'
  } else if (fieldName.includes('light')) {
    name = 'light'
  }

  let fuzzy = fuzzySearch[name]
  rows = names.includes(fieldName) ? xdata.metaStore[name] && Array.from(xdata.metaStore[name].values()) : xdata.metaStore.data[name] && Array.from(xdata.metaStore.data[name].values())

  if (fieldName === 'select_card' && self.opts.dataName === 'basicSearch') {
    let cardTypeID = self.parent.opts.name === 'staff' ? 1 : 2
    rows = rows && rows.filter(item => item.card_type_id === cardTypeID)
  } 
  if (['staffs', 'vehicles'].includes(name)) {
    rows = datas || rows // 实时人员车辆
    rows = filterTeam(rows, name, keyName)
    rows && rows.forEach(e => {
      e['ident'] = getIdent(e, name)
    })
  }

  keys = fuzzy.keys
  desc = fieldName === 'select_card' ? 'card_id' : fuzzy.desc
  desc = fieldName === 'hw_version' ? 'hw_version' : fuzzy.desc

  if (self && self.parent && self.parent.tableName === 'dat_light_rd_spec_process') {
    if (['reader_id', 'light_id'].includes(fieldName)) {
      let dittoname = clone(rows)
      dittoname.forEach(e => {
        e.name = `${e[fieldName]}-${xdata.metaStore.getNameByID(`${fieldName}`, e[fieldName])}`
      })
      rows = dittoname
    }
  }

  return {rows, keys, desc}
}

/*
  *过滤黑名单、队组
  *rows:[]
  *key类型string, key='staff_id'/'vehicle_id'
  *key类型array, key=['staff_id'/'vehicle_id']
  *
*/
function getDisPlayList (rows, key, tableName) {
  let list = []
  if (tableName === 'dat_leader_arrange') return rows
  if (key.includes('staff_id') || key.includes('vehicle_id')) {
    let name = null, type = null, prefixName = null
    if (Array.isArray(key)) {
      prefixName = key.includes('staff_id') ? 'staff' : 'vehicle'
    } else {
      prefixName = key === 'staff_id' ? 'staff' : 'vehicle'
    }
    name = `${prefixName}s`
    type = `${prefixName}_id`
    if (xdata.isCheck === 1) {
      let obj = xdata.metaStore[name]
      rows.forEach(row => {
        if (obj.get(row[type])) list.push(row)
      })
      return filterTeam(list, name, type)
    } else {
      return filterTeam(rows, name, type)
    }
  }
  return rows
}

function messageTip (tips, type) {
  type = type || 'error'
  let msg = {
    type: type,
    message: tips
  }
  window.xMessage.open(msg)
}

// 获取分站所属区域数据
function concatAreaReader () {
  let areas = xdata.metaStore.dataInArray.get('area')
  let readers = xdata.metaStore.data.reader && Array.from(xdata.metaStore.data.reader.values())
  readers = readers && JSON.parse(JSON.stringify(readers))
  let rows = []
  if (!areas) return rows
  for (let i = 0; i < areas.length; i++) {
    let area = areas[i]
    let areaID = area.area_id
    if (xdata.isCheck === 1 && area.need_display === 0) continue
    if (areaID !== 0) {
      let areaReaders = ''
      readers.forEach((reader, index) => {
        let readerAreaID = reader.area_id
        if (areaID === readerAreaID) {
          let readerID = reader.reader_id
          areaReaders += `;${readerID}`
        }
      })
      areaReaders = areaReaders.replace(';', '')
      rows.push({
        area_id: areaID,
        name: area.name,
        readers: areaReaders
      })
    }
  }
  return rows
}

function isRepeat(arr) {
  var hash = {};
  for (var i in arr) {
      if (hash[arr[i]]){
          return true; 
      }
      hash[arr[i]] = true;
  }
  return false;
}

function resetAll() {
  xdata.cardStore.reset()
  xdata.locateStore.reset()
  window.isShowReader = false
  window.isShowLandMarker = false
  window.isShowLight = false
  xdata.metaStore.fadeAreaArr.clear()
}

// 用于下拉框展示字段
function getRecName(topicName, fieldName) {
  let recName = 'name'
  const recFn = {
    device_power: (function (fieldName) {
      if (fieldName === 'device_power_id') return 'device_power_id'
    })(fieldName),
    device_type:(function (fieldName) {
      if (fieldName === 'device_type_id') return 'detail'
    })(fieldName)
  }
  recName = recFn[topicName] ? recFn[topicName] : recName
  return recName
}

export { toJson, isPC, encrypt, clone, concatObject, judgeURL, getAlarmShow, changeToTextByType, composeUpdateDBReq, getRows, objKeySort, noTurnTxt, trim, getAccessSql, getDisplaySql, getSqlByIsCheck, dealMonth, getMon, inquireDB, getMessage, fontDataChange, initPagination, copySubRows, computeMonthDays, computeDays, getMonth, getDeptID, getSortType, compare, formatFieldValue, editDetail, metaUpdateRes, formatElapsedTime, testMapID, convertSVGPath2Coord, judgeAreaIsneedDisplay, checkClick, show, composeCardID, addBusinesslogic, setPosition, checkPerson, filterItem, changeCheckBox, getSerachData, getDisPlayList, getIdent, filterTeam, messageTip, concatAreaReader, formatString, isRepeat, resetAll, getRecName }
