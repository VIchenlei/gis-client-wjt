import { filterTeam } from '../../js/utils/utils'
import numberTurnText from '../../js/def/number_turn_text_def.js'
/**
 *
 * @param {*} dateString1 开始事件
 * @param {*} dateString2 结束时间
 */
function getDaysBetween (dateString1, dateString2) {
  const startDate = Date.parse(dateString1)
  const endDate = Date.parse(dateString2)
  const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

/**
 * rs-time-filter组件获取默认时间
 * @param {*} sign start/end标识
 * @param {*} timeType 时间类型
 * @param {*} oldValue 默认值
 * @param {*} tableName table名称
 */
function getSearchDate (sign, timeType, oldValue, tableName) {
  let time = null
  let defaultDay = 7
  let oldStartDate = oldValue ? oldValue[0] : null
  let oldEndDate = oldValue ? oldValue[1] : null
  if (timeType === 'DATETIME') {
    if (sign === 'start') {
      let timeParam = tableName === 'person_reader_detail' ? new Date().getTime() - 14 * 24 * 60 * 60 * 1000 : new Date().toLocaleDateString()
      time = new Date(oldStartDate || timeParam).format('yyyy-MM-dd hh:mm:ss')
    } else {
      time = oldEndDate ? new Date(oldEndDate).format('yyyy-MM-dd hh:mm:ss') : new Date().format('yyyy-MM-dd hh:mm:ss')
    }
  } else {
    let timeInterval = sign === 'start' ? defaultDay * 24 * 60 * 60 * 1000 : 0
    time = new Date(new Date().getTime() - timeInterval).format('yyyy-MM-dd')
  }
  return time
}

/**
 * 检查开始时间以及结束时间，返回提示信息
 * @param {*} stime 开始时间
 * @param {*} etime 结束时间
 * @param {*} timeType 时间类型
 */
function showTimeFilterHint (stime, etime, timeType) {
  let tipsText = ''
  if (!stime || !etime) {
    tipsText = '请选择查询日期'
  } else {
    if (new Date(stime).getTime() > new Date().getTime()) {
      tipsText = '开始时间不能大于当前时间'
    }
    if (new Date(stime).getTime() > new Date(etime).getTime()) {
      tipsText = '开始时间不能大于结束时间'
    }
    if (timeType === 'date') {
      let month1 = new Date(stime).getMonth()
      let month2 = new Date(etime).getMonth()
      let day1 = new Date(stime).getDate()
      let day2 = new Date(etime).getDate()
      let days = getDaysBetween(stime, etime)
      if ((month1 < month2 && day1 < day2) || days > 31) tipsText = '请输入正确的时间范围(小于30天)'
    }
  }
  return tipsText
}

/**
 * @description: 获取每页显示数据条数
 * @param {type} tabName
 * @return: page_size
 */
function reptPageGetPageSize (tabName) {
  let page_size = PAGE_SIZE ? PAGE_SIZE : 10
  const SIZE100000 = ['rept_worktime_dept', 'person_s_dept_month', 'v_vehicle_day', 'person_s_dept_day']
  if (SIZE100000.includes(tabName)) {
    page_size = 100000
  } else if (tabName === 'person_reader_detail') {
    page_size = 0
  }
  return page_size
}

/**
 * @description: 获取rs-condition-filter中模糊查询的数据
 * @param {type} tabName
 * @return: page_size
 */
function getSearchArrShow (ident, name, tableName) {
  let isJoin = name.includes('OR')
  let searchArr = []
  if (isJoin) {
    let fieldsName = isJoin ? name.split('OR') : null
    for (let i = 0; i < fieldsName.length; i++) {
      let fieldName = fieldsName[i].indexOf('.') === -1 ? fieldsName[i] : fieldsName[i].split('.')[1]
      let ident = fieldName.replace('_id', '')
      let searchData = ident === 'staff' ? xdata.metaStore.staffs && Array.from(xdata.metaStore.staffs.values()) : xdata.metaStore.data[ident] && Array.from(xdata.metaStore.data[ident].values())
      searchArr.push(searchData)
    }
    searchArr = searchArr.flat()
  } else {
    if ((ident === 'staff' || ident === 'staff_number' || ident === 'vehicle')) {
      const typeName = ident === 'vehicle' ? 'vehicles' : 'staffs'
      searchArr = xdata.metaStore[typeName] && Array.from(xdata.metaStore[typeName].values())
    } else if (ident === 'deviceType'){
      let deviceTypeArr = numberTurnText['real_time_debug']['deviceType']
      searchArr = deviceTypeArr.map((item)=> {
        let dealObj = {}
        let key = Object.keys(item)[0]
        let keyValue = item[Object.keys(item)[0]]
        dealObj['deviceType'] = key
        dealObj['name'] = keyValue
        return dealObj
      })
    } else {
      searchArr = xdata.metaStore.data[ident] && Array.from(xdata.metaStore.data[ident].values())
    }
    if (ident === 'card') {
      if (/person/.test(tableName)) {
        searchArr = searchArr && searchArr.filter(item => item.card_type_id === 1)
      } else {
        searchArr = searchArr && searchArr.filter(item => item.card_type_id !== 1)
      }
    }
  }
  let isShowResultList = !!['dept', 'occupation', 'area', 'shift'].includes(ident)
  return {
    searchArr: searchArr,
    isShowResultList: isShowResultList
  }
}

function getSql (def, choosed, earlyTime, currentTime) {
  let readers = ''

  if (def.msg.reader_id) {
    def.msg.reader_id.forEach(reader => {
      readers += ` or dr.reader_id = ${reader.reader_id}`
    })
    readers = readers.replace('or', '')
  }

  let sqlTmpl = {
    vehicle: {
      v_reader: {
        isReaders: `and (${readers}) AND hlas.enter_time>= '${earlyTime}' and hlas.enter_time <= '${currentTime}'`,
        notReaders: `and ds.vehicle_id = ${choosed && choosed.vehicle_id} and hlas.enter_time >= '${earlyTime}' and hlas.enter_time <= '${currentTime}'`
      },
      vehicle_updown_mine: `and dv.vehicle_id = ${choosed && choosed.vehicle_id} and dv.vehicle_type_id = ${choosed && choosed.vehicle_type_id} and rav.start_time >= '${earlyTime}' and rav.start_time <= '${currentTime}'`
    },
    staff: {
      person_reader: {
        isReaders: `and (${readers}) AND hlas.enter_time>= '${earlyTime}' and hlas.enter_time <= '${currentTime}'`,
        notReaders: `and ds.staff_id = ${choosed && choosed.staff_id} and hlas.enter_time >= '${earlyTime}' and hlas.enter_time <= '${currentTime}'`
      },
      person: `and ds.staff_id = ${choosed && choosed.staff_id} and dse.dept_id = ${choosed && choosed.dept_id} and dse.occupation_id = ${choosed && choosed.occupation_id} and ras.start_time >= '${earlyTime}' and ras.start_time <= '${currentTime}'`
    }
  }
  let sql = sqlTmpl[def.msg.name][def.msg.report]
  if (typeof sql === 'object') {
    if (def.msg.reader_id) return sql.isReaders
    return sql.notReaders
  }
  return sql
}

/**
 * @description: 修改def配置
 * @param {type} def
 * @return:
 */
function searchchoose (def) {
  // let sqlfield = null
  let sqlexpr = null
  let arr = null
  let currentTime = def.msg.endTime || `${new Date().format('yyyy-MM-dd')} 00:00:00`
  let earlyTime = def.msg.startTime || `${new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd')} 23:59:59`
  let cardID = def.msg.cardID

  let choosed = xdata.metaStore.getCardBindObjectInfo(cardID)
  def.autoExec = true
  // let sqlnames = def.fields.names
  // for (let i = 0, len = sqlnames.length; i < len; i++) {
  //   if (i === 0) {
  //     sqlfield = sqlnames[i]
  //   } else {
  //     sqlfield += ',' + sqlnames[i]
  //   }
  // }
  sqlexpr = getSql(def, choosed, earlyTime, currentTime)
  arr = {
    staff_id: choosed && choosed.staff_id,
    vehicle_id: choosed && choosed.vehicle_id,
    dept_id: choosed && choosed.dept_id,
    vehicle_type_id: choosed && choosed.vehicle_type_id,
    reader_id: def.msg.reader_id,
    defaultTime: [`${earlyTime}`, `${currentTime}`]
  }
  // def.sqlTmpl = def.sqlTmpl.replace('{resultFields}', sqlfield).replace('{exprString}', sqlexpr)
  // def.sqlTmpl = def.sqlTmpl.replace('{exprString}', sqlexpr)
  def.isDealSqlTmp = true
  def.dealSqlTmpl = def.sqlTmpl.replace('{exprString}', sqlexpr)
  def['choosepreset'] = arr
}

/* 人车编号、名称、卡号、部门检索过滤队组 */
function getSearchDisplayList (datas, key) {
  let list = null
  let name = null
  let type = null
  if (['staff_number', 'staff_id', 'vehicle_id'].includes(key)) {
    let prefixName = key.includes('staff') ? 'staff' : 'vehicle'
    name = `${prefixName}s`
    type = `${prefixName}_id`
    list = filterTeam(datas, name, type)
  } else if (key === 'dept_id') {
    list = filterTeam(datas, 'dept', key)
  } else {
    list = datas
  }
  return list
}

function chooseSqlByType (eventTypeId) {
  let eventName = 'other'
  if ([7,9,11,12,13,15,17,19,24,25,26,30,32,37,47,48].includes(eventTypeId)) {
    eventName = 'staff'
  } else if ([14,16,18,20,21,22,23,28,36,38].includes(eventTypeId)) {
    eventName = 'vehicle'
  } else if ([1,2,3,4].includes(eventTypeId)) {
    eventName = 'area'
  } else if ([6,10,33,39].includes(eventTypeId)) {
    eventName = 'reader'
  } else if ([34,35].includes(eventTypeId)) {
    eventName = 'sensor'
  } else if ([8].includes(eventTypeId)) {
    eventName = 'light'
  }
  return eventName
}

export {
  getSearchDate,
  showTimeFilterHint,
  reptPageGetPageSize,
  getSearchArrShow,
  searchchoose,
  getSearchDisplayList,
  chooseSqlByType
}
