import { getRows, getMessage, compare, formatFieldValue, encrypt, clone, trim, noTurnTxt } from '../../js/utils/utils'

// 获取合并页面下的数据
function getInfo (msg, value, cmd, key) {
  let result = []
  key = msg.def.name === 'sensor' ? 'work_face_id' : key
  if (cmd === 'INSERT') {
    let rows = getRows(null, msg.def, msg.maxid)
    let message = getMessage('INSERT', rows, msg.def, msg.maxid)
    result.push(message)
  } else {
    let datas = msg.rows.filter(item => item[key] === value)
    for (let i = 0; i < datas.length; i++) {
      let eitem = {}
      eitem['row'] = datas[i]
      let rows = getRows(eitem, msg.def, msg.maxid)
      let message = getMessage(cmd, rows, msg.def, msg.maxid)
      result.push(message)
    }
  }
  return result
}

// 新增分站时天线添加默认数据
function dealAntennaData (msg, antennaMsg, index) {
  let readerRow = msg.rows
  let rows = antennaMsg.rows
  for (let j = 0; j < rows.length; j++) {
    let row = rows[j]
    if (row.field_name === 'antenna_id') row.field_value += index - 1
    if (row.field_name === 'reader_id') row.field_value = readerRow[0].field_value
    if (row.field_name === 'name') row.field_value = `${readerRow[0].field_value}-${index}`
    if (row.field_name === 'idx') row.field_value = index
    if (row.field_name === 'x') row.field_value = readerRow[6].field_value
    if (row.field_name === 'y') row.field_value = msg.cmd === 'INSERT' ? readerRow[7].field_value : -readerRow[7].field_value
    if (row.field_name === 'z') row.field_value = 0
    if (row.field_name === 'angel') row.field_value = 0
  }
  return antennaMsg
}

function getMenus (ele, type, fieldName) {
  let fieldValue = ''
  if (!ele.root.classList.contains('hide')) {
    if (fieldName === 'business_type') {
      fieldValue = ele.getBusiness()
    } else if (fieldName === 'menus') {
      let menus = ele && ele.tags['rs-cascader-list'].checkedMenus
      let dataMenus = Array.from(xdata.metaStore.data.menu.values()).filter(item => item.level_id === 3)
      if (menus.length === dataMenus.length) {
        fieldValue = 0
      } else {
        fieldValue = menus && menus.join(';')
      }
    } else {
      let menus = ele.menus && Array.from(ele.menus.keys())
      fieldValue = menus && menus.join(';')
    }
  }
  return fieldValue
}

function treatPoint (fieldValue) {
  if (typeof fieldValue === 'string') {
    fieldValue = fieldValue.replace(/^\"|\"$/g, '')
    fieldValue = `${Number(fieldValue.split(',')[0]).toFixed(2)},${-Number(fieldValue.split(',')[1])}`
  }

  return fieldValue
}

function treatCoord (fieldValue) {
  return -Number(fieldValue)
}

function treatDownMine (fieldName, fieldValue, self) {
  if (fieldName === 'oper_time') fieldValue = `'${new Date().format('yyyy-MM-dd hh:mm:ss')}'`
  if (fieldName === 'oper_user') fieldValue = `'${xdata.userName}'`
  return fieldValue
}

function treatDynamicThre (self) {
  let starttime = self.refs['start_time'].refs['start_time'].value
  let endtime = self.refs['end_time'].refs['end_time'].value
  let ymd = new Date().format('yyyy-MM-dd')
  if (new Date(`${ymd} ${endtime}`).getTime() <= new Date(`${ymd} ${starttime}`).getTime()) {
    let xmsg = '开始时间不能小于等于结束时间'
    window.xMessage.open(xmsg)
  }
}

function treatName (tableName, fieldValue, self) {
  if (tableName === 'tt_inspection_route_planning' && self.cmd === 'INSERT') {
    let value = self.refs['staff_id'].refs['staff_id'].value
    fieldValue = xdata.metaStore.getNameByID('staff_id', value)
  }
  return fieldValue
}

function treatVehicleID (tableName, fieldValue, self) {
  if (tableName === 'dat_reader') {
    let rsMergeDialogTbale = self.parent.tags['rs-merge-dialog-table'][0]
    let selectIndex = rsMergeDialogTbale.refs['device_type_id'].refs['device_type_id'].getAttribute('name')
    fieldValue = Number(selectIndex) !== 10 ? null : fieldValue
  }
  return fieldValue
}

function getRoutePlan (fieldName, fieldValue, cmd) {
  let routePlan = ''
  if (fieldName === 'route_planning') {
    let values = fieldValue.split(';')
    for (let i = 0; i < values.length; i++) {
      if (values[i].length === 0) continue
      let value = values[i].split(',')
      if (i === 0) {
        routePlan += `${value[0]},${value[1]},${value[2]},${-value[3]},${value[4]},${-value[5]}`
      } else if (0< i && i < values.length - 1) {
        routePlan += `${values.length > 2 ? ';' : ''}${value[0]},${value[1]};`
      } else if (i === values.length - 1) {
        routePlan += `${values.length === 2 ? ';' : ''}${value[0]},${value[1]},${value[2]},${-value[3]},${value[4]},${-value[5]}`
      }
    }
  }
  return routePlan
}

function treatLightRd(fieldName, fieldValue, self) {
  if (['reader_id', 'light_id'].includes(fieldName)) {
    fieldValue = self.refs[fieldName].refs[fieldName].getAttribute('data-type')
  }
  return fieldValue
}

// 编辑、新增特殊处理
function specialTreat (fieldType, fieldName, fieldValue, self) {
  let tableName = self.tableName

  const treatFieldName = {
    bpoint: treatPoint(fieldValue),
    epoint: treatPoint(fieldValue),
    y: treatCoord(fieldValue),
    b_y: treatCoord(fieldValue),
    e_y: treatCoord(fieldValue),
    vehicle_id: treatVehicleID(tableName, fieldValue, self),
    name: treatName(tableName, fieldValue, self),
    is_check: (function (fieldValue) {
      return xdata.isCheck === 1 ? 1 : fieldValue
    })(fieldValue),
    pwd: (function (fieldValue, self) {
      let userName = self.refs['user_id'] && self.refs['user_id'].refs['user_id'].value
      return encrypt(userName, fieldValue)
    })(fieldValue, self),
    staff_id: (function (fieldName, self) {
      const staffID = self.refs[fieldName].refs[fieldName] && self.refs[fieldName].refs[fieldName].getAttribute('data-type')
      return Number(staffID)
    })(fieldName, self),
    vehicle_id: (function (fieldName, self) {
      let vehicleID = self.refs[fieldName].refs[fieldName] && self.refs[fieldName].refs[fieldName].getAttribute('data-type')
      vehicleID = vehicleID || fieldValue
      return Number(vehicleID)
    })(fieldName, self),
    brief_name: (function (tableName, fieldValue, self) {
      if (tableName === 'dat_reader') {
        let rsMergeDialogTbale = self.parent.tags['rs-merge-dialog-table'][0]
        fieldValue = fieldValue === '' ? rsMergeDialogTbale && rsMergeDialogTbale.refs['reader_id'].refs['reader_id'].value : fieldValue
      }
      return fieldValue
    })(tableName, fieldValue, self),
    over_count_person: (function (fieldValue, self) {
      return self.cmd === 'INSERT' ? null : fieldValue
    })(fieldValue, self),
    route_planning:  getRoutePlan(fieldName, fieldValue, self.cmd)
  }

  if (treatFieldName[fieldName]) fieldValue = treatFieldName[fieldName]
  if (fieldType !== 'SELECT') {
    if (fieldName === 'card_id') {
      fieldValue = fieldValue
    } else {
      fieldValue = formatFieldValue(fieldType, fieldValue)
    }
  }

  if (tableName === 'rt_person_forbid_down_mine') fieldValue = treatDownMine(fieldName, fieldValue, self)
  if (tableName === 'dat_area_persons_dynamic_thre') treatDynamicThre(self)
  if (tableName === 'dat_light_rd_spec_process') fieldValue = treatLightRd(fieldName, fieldValue, self)

  return fieldValue
}

// 录入对话框字段隐藏
function isHideField (name, row, fields) {
  let names = null
  let fieldName = row.field_name
  const tableNames = ['dat_coalface', 'dat_coalface_vehicle', 'd，at_drivingface', 'dat_drivingface_vehicle', 'dat_sensor', 'dat_drivingface_ref_point', 'dat_drivingface_warning_point', 'dat_reader', 'dat_antenna', 'dat_reader_path_tof_n']
  if (tableNames.includes(name)) {
    if (fields && fields.includes(fieldName)) return 'hide'
  }
  switch (name) {
    case 'rt_person_forbid_down_mine':
      names = ['id', 'name', 'dept_id', 'lastUpdate', 'oper_user', 'oper_time']
      if (names.includes(fieldName)) return 'hide'
      break
    case 'tt_inspection_route_planning':
      if (fieldName === 'name') return 'hide'
      break
    case 'occupation_info':
      names = ['shortname', 'occupation_level_id', 'rank']
      if (names.includes(fieldName)) return 'hide'
      break
    case 'dept_info':
      names = ['abbr', 'address', 'phone', 'rank', 'dept_info', 'hm_dept_id']
      if (names.includes(fieldName)) return 'hide'
      break
    case 'dat_credentials_staff':
      names = ['name', 'dept_id']
      if (names.includes(fieldName)) return 'hide'
      break
    case 'dat_user':
      if (xdata.isCheck === 1 && fieldName === 'is_check') return 'hide'
      break
    // case 'dat_vehicle_category':
    //   if (fieldName === 'color') return 'hide'
    //   break
  }
  if (xdata.isCheck === 1 && ['need_display', 'hm_dept_id'].includes(fieldName)) return 'hide'
  return ''
}

function getTextValue (msg) {
  let { row, tableName, cmd } = msg
  let { field_name, field_value } = row
  if (tableName === 'dat_drivingface_vehicle' && field_name === 'shake_threshold' && cmd === 'INSERT') {
    if (!field_value) return 20
  } else if (['rt_person_forbid_down_mine', 'dat_leader_arrange', 'tt_inspection_route_planning', 'dat_credentials_staff'].includes(tableName) && field_name === 'staff_id') {
    return cmd === 'INSERT' ? '' : xdata.metaStore.getNameByID(field_name, field_value)
  } else if (tableName === 'dat_card' && field_name === 'card_id' && cmd === 'INSERT') {
    // 标识卡新增卡号展示为前缀 00*
    const cardTypes = xdata.metaStore.data.card_type && Array.from(xdata.metaStore.data.card_type.values())
    field_value = cardTypes && cardTypes[0].card_type_id
    return `00${field_value}`
  } else if (tableName === 'dat_user' && cmd === 'INSERT' && field_name === 'pwd') {
    return 123
  } else {
    if (field_value) {
      if (['y', 'b_y', 'e_y'].includes(field_name) && cmd !== 'INSERT') {
        field_value = -Number(field_value)
      }
      if (['bpoint', 'epoint'].includes(field_name)) {
        field_value = `${field_value.split(',')[0]},${-Number(field_value.split(',')[1])}`
      }
      if (field_name === 'route_planning') {
        console.log(field_name, msg)
      }
    }
    if (field_name === 'hm_dept_id') {
      if (cmd === 'INSERT' || (cmd === 'UPDATE' && !field_value)) field_value = xdata.metaStore.hmDeptIDMax
    }
    return field_value
  }
}

// 编辑状态下Y坐标取反 用来与输入框中的Y坐标对比
function dealNegateValue (oldValue, fieldName, optype) {
  let names = ['y', 'b_y', 'e_y']
  if (names.includes(fieldName)) {
    return oldValue = -Number(oldValue)
  } else if (['bpoint', 'epoint'].includes(fieldName)) {
    return oldValue = `${oldValue.split(',')[0]},${-Number(oldValue.split(',')[1])}`
  } else if (fieldName === 'staff_id' && !optype) {
    return oldValue = xdata.metaStore.getNameByID('staff_id', oldValue)
  } else if (fieldName === 'route_planning') {
    return oldValue = getRoutePlan(fieldName, oldValue)
  }
  return oldValue
}

// 更新对话框数据
function updateData (msg, self) {
  const { rows } = msg
  if (self.topicName === 'tt_inspection_route_planning') {
    let rsSpliceInput = self.refs[rows.name]
    rsSpliceInput && rsSpliceInput.updateData(rows)
  }

  if (['goaf', 'area'].includes(self.topicName)) {
    let path = self.refs['path'] && self.refs['path'].refs['path']
    const row = rows && rows.filter(row => row.field_name === 'path')[0]
    path.value = row && row.field_value
  }
}

/**
 * 获取传入坐标点的最近的路径
 * pointObj: 传入的坐标点 {x: 100, y: 100}
 * pathGather: 路径表
 * length: 需要返回的路径条数
*/
function getPointshortPath (pointObj, pathGather, length) {
  let roadPathGather = clone(pathGather)
  roadPathGather = roadPathGather.map(item => {
        let bpoint = item.bpoint.split(',')
        item.bpoint = {
            x: Number(Number(bpoint[0]).toFixed(1)),
            y: -Number(Number(bpoint[1]).toFixed(1))
        }
        let epoint = item.epoint.split(',')
        item.epoint = {
            x: Number(Number(epoint[0]).toFixed(1)),
            y: -Number(Number(epoint[1]).toFixed(1))
        }
    let disAS = pointToLineDistance(pointObj.x, pointObj.y, item.bpoint.x, item.bpoint.y, item.epoint.x, item.epoint.y)[0]
        item.distance = disAS
        return item
    })

  roadPathGather.sort(function (a, b) {
        return a.distance - b.distance
    })
    return roadPathGather.slice(0, length)
}

/* 求点到直线的距离函数
* xx,yy 所画线段x,y
*/
function pointToLineDistance (xx, yy, x1, y1, x2, y2) {
  let ang1, ang2, ang, m
  let result = 0

  // 分别计算三条边的长度
  const a = Math.sqrt((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy))
  if (a === 0) {
    return [0, {
      x: x1,
      y: y1
    }]
  }
  const b = Math.sqrt((x2 - xx) * (x2 - xx) + (y2 - yy) * (y2 - yy))
  if (b === 0) {
    return [0, {
      x: x2,
      y: y2
    }]
  }
  const c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  // 如果线段是一个点则退出函数并返回距离
  if (c === 0) {
    result = a
    return [result, {
      x: x1,
      y: y1
    }]
  }

  // 如果点(xx,yy到点x1,y1)这条边短
  if (a < b) {
    // 如果直线段AB是水平线。得到直线段AB的弧度
    if (y1 === y2) {
      if (x1 < x2) {
        ang1 = 0
      } else {
        ang1 = Math.PI
      }
    } else {
      m = (x2 - x1) / c
      if (m - 1 > 0.00001) {
        m = 1
      }

      ang1 = Math.acos(m)
      if (y1 > y2) {
        ang1 = Math.PI * 2 - ang1
      } // 直线(x1,y1)-(x2,y2)与折X轴正向夹角的弧度
    }

    m = (xx - x1) / a
    if (m - 1 > 0.00001) {
      m = 1
    }

    ang2 = Math.acos(m)
    if (y1 > yy) {
      ang2 = Math.PI * 2 - ang2
    } // 直线(x1,y1)-(xx,yy)与折X轴正向夹角的弧度

    ang = ang2 - ang1
    if (ang < 0) {
      ang = -ang
    }

    if (ang > Math.PI) {
      ang = Math.PI * 2 - ang
    }

    // 如果是钝角则直接返回距离
    if (ang > Math.PI / 2) {
      return [a, {
        x: x1,
        y: y1
      }]
    }

    // 返回距离并且求得当前距离所在线段的坐标
    if (x1 === x2) {
      return [b * Math.sin(ang), {
        x: x1,
        y: yy
      }]
    } else if (y1 === y2) {
      return [b * Math.sin(ang), {
        x: xx,
        y: y1
      }]
    }

    // 直线的斜率存在且不为0的情况下
    let x = 0,
      y = 0
    const k1 = ((y2 - y1) / (x2 - x1))
    const kk = -1 / k1
    const bb = yy - xx * kk
    const b1 = y2 - x2 * k1
    x = (b1 - bb) / (kk - k1)
    y = kk * x + bb
    return [a * Math.sin(ang), {
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1))
    }]
  }
  // 如果两个点的纵坐标相同，则直接得到直线斜率的弧度
  if (y1 === y2) {
    if (x1 < x2) {
      ang1 = Math.PI
    } else {
      ang1 = 0
    }
  } else {
    m = (x1 - x2) / c
    if (m - 1 > 0.00001) {
      m = 1
    }
    ang1 = Math.acos(m)
    if (y2 > y1) {
      ang1 = Math.PI * 2 - ang1
    }
  }
  m = (xx - x2) / b
  if (m - 1 > 0.00001) {
    m = 1
  }

  ang2 = Math.acos(m) // 直线(x2-x1)-(xx,yy)斜率的弧度
  if (y2 > yy) {
    ang2 = Math.PI * 2 - ang2
  }

  ang = ang2 - ang1
  if (ang < 0) {
    ang = -ang
  }

  if (ang > Math.PI) {
    ang = Math.PI * 2 - ang
  } // 交角的大小

  // 如果是对角则直接返回距离
  if (ang > Math.PI / 2) {
    return [b, {
      x: x2,
      y: y2
    }]
  }

  // 如果是锐角，返回计算得到的距离,并计算出相应的坐标
  if (x1 === x2) {
    return [b * Math.sin(ang), {
      x: x1,
      y: yy
    }]
  } else if (y1 === y2) {
    return [b * Math.sin(ang), {
      x: xx,
      y: y1
    }]
  }

  // 直线的斜率存在且不为0的情况下
  let x = 0,
    y = 0
  const k1 = ((y2 - y1) / (x2 - x1))
  const kk = -1 / k1
  const bb = yy - xx * kk
  const b1 = y2 - x2 * k1
  x = (b1 - bb) / (kk - k1)
  y = kk * x + bb
  return [b * Math.sin(ang), {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1))
  }]
}

function getReaderPathOfMsg (readerMsg, cmd, length) {
  let pathGather = clone(Array.from(xdata.metaStore.data.road_segment.values()))
  let readerRow = readerMsg.rows
  let readPoint = {
    x: Number(readerRow[6].field_value),
    y: Number(readerRow[7].field_value)
  }
  let shortPath = getPointshortPath(readPoint, pathGather, length)
  let table = {
    def: xdata.metaStore.defs['reader_path_tof_n'],
    rows: xdata.metaStore.dataInArray.get('reader_path_tof_n'),
    maxid: xdata.metaStore.maxIDs['reader_path_tof_n']
  }
  let maxid = table.maxid
  let keyValue = readerMsg.rows[0].field_value
  let readerPathMsg = []
  for (let i = 0; i < shortPath.length; i++) {
    let bpoint = shortPath[i].bpoint
    let epoint = shortPath[i].epoint
    let pathMsg = getInfo(table, null, cmd, 'reader_id')[0]
    let rows = pathMsg.rows
    for (let j = 0; j < rows.length; j++) {
      let row = rows[j]
      if (row.field_name === 'reader_id') {
        row.field_value = keyValue
      }
      if (row.field_name === 'b_x') {
        row.field_value = bpoint.x
      }
      if (row.field_name === 'b_y') {
        row.field_value = bpoint.y
      }
      if (row.field_name === 'e_x') {
        row.field_value = epoint.x
      }
      if (row.field_name === 'e_y') {
        row.field_value = epoint.y
      }
      if (row.field_name === 'spacing_ratio') {
        row.field_value = 0
      }
      if (row.field_name === 'tof_flag') {
        row.field_value = i
      }
    }
    readerPathMsg.push(pathMsg)
  }
  return readerPathMsg
}

// 录入框禁用
function isDisabled (topicName, row, key, self) {
  const { field_name } = row
  if (topicName === 'sanlv_schedule') return 'disabled'
  if (['coalfaceWork', 'drivingfaceWork'].includes(topicName)) return ''
  if (topicName === 'reader' && field_name === 'vehicle_id') {
    let row = self.rows.find(item => item.field_name === 'device_type_id')
    let selectIndex = row.field_value
    return selectIndex !== 10 ? 'disabled' : ''
  }
  if (topicName === 'leader_arrange') {
    if (field_name === 'shift_type_id') return 'disabled'
    if (field_name === 'staff_id') return ''
  }
  if (field_name === key) return self.cmd === 'INSERT' ? '' : 'disabled'
  if (topicName === 'card') {
    return field_name === 'card_id' ? 'disabled' : ''
  }
  if (topicName === 'network_configuration') {
    return field_name === 'port' ? 'disabled' : ''
  }
  if (topicName === 'device_configuration') {
    if (field_name === 'programVersion') return 'disabled'

    const keyRow = !!self.rows && self.rows.find(item => item.field_name === self.tableKeyName)
    const keyValue = keyRow && keyRow.field_value
    if (keyValue === 12 && !['childDeviceAddress', 'canid'].includes(field_name)) return 'disabled'

    if (keyValue === 5 && !['childDeviceAddress', 'uploadInterval', 'reconnectInterval', 'canid', 'trafficLightNums', 'isShowBackside', 'trafficLightsFontShap', 'trafficLightsReverseShap', 'trafficLightsFontColor', 'trafficLightsReverseColor', 'uploadHartbeat'].includes(field_name)) return 'disabled'

    if ([145, 146, 147, 148, 149, 150].includes(keyValue) && !['childDeviceAddress', 'receivingFrequencyPoint1', 'antennaDelay1', 'transmitPower1', 'communicationRate1', 'pulseReptFrequency1', 'preambleCode1', 'preambleCodeLength1', 'PAC2', 'broadcastDuration', 'BlinkDuration', 'responseDuration', 'FinalDuration', 'afterPositionDormat', 'confictDormat', 'ACKDuration', 'checkingDuration', 'rangingDuration'].includes(field_name)) return 'disabled'

    if (keyValue === 11 && !['reconnectInterval', 'childDeviceAddress', 'uploadHartbeat'].includes(field_name)) return 'disabled'
  }
  return ''
}

// 工作面作业计划获取对话框的value
function getValue (i, rows, tag) {
  const fieldName = rows[i].field_name
  const fieldType = rows[i].field_type
  const ele = tag.refs[fieldName].refs[fieldName]
  let value = null
  if (fieldType === 'SELECT') {
    value = ele && ele.getAttribute('name')
  } else {
    value = ele && ele.value
    value = value ? trim(value) : value
  }
  value = formatFieldValue(fieldType, value)
  return value
}

// 获取工作面作业计划、三率sql
function getWorkFaceSql (cmd, rows, self) {
  let startTime = getValue(3, rows, self)
  let time = new Date(new Date(startTime).getTime()).format('yyyy-MM')
  startTime = Number(new Date(new Date(startTime).getTime()).format('d'))
  let endTime = cmd === 'INSERT' ? getValue(4, rows, self) : getValue(3, rows, self)
  endTime = Number(new Date(new Date(endTime).getTime()).format('d'))

  let workfaceID = getValue(0, rows, self)
  let type = rows[0].field_name
  type = type.includes('coalface') ? 1 : 2
  let scheduleNumName = type === 1 ? 'schedule_mine_times' : 'schedule_tunnelling_times'
  let scheduleTime = getValue(1, rows, self)
  let scheduleNum = getValue(2, rows, self)
  let values = ''

  for (let i = startTime; i <= endTime; i++) {
    let t = `${time}-${i}`
    if (i === startTime) {
      values = `(${workfaceID}, ${scheduleTime}, ${scheduleNum}, '${t}')`
    } else {
      values += `,(${workfaceID}, ${scheduleTime}, ${scheduleNum}, '${t}')`
    }
  }

  let sql = `REPLACE INTO dat_workface_scheduling (workface_id, schedule_startup_time, ${scheduleNumName}, schedule_date) VALUES ${values}`
  return sql
}

// 录入信息新增sql特殊处理
function treatInsertSql (keyValue, fields, values, self, otherSql) {
  const { cmd, tableName, rows } = self
  let sql = `INSERT into ${tableName} (${fields}) VALUES(${values})`
  if (tableName === 'dat_workface_scheduling') {
    sql = getWorkFaceSql(cmd, rows, self)
  } else if (['tt_inspection_route_planning', 'dat_area_persons_dynamic_thre'].includes(tableName)) {
    sql = `REPLACE into ${tableName} (${fields}) VALUES(${values})`
  } else if (tableName === 'rt_person_forbid_down_mine') {
    let endYear = new Date().getFullYear() + 1
    let endtime = `${endYear}-${new Date().format('MM-dd hh:mm:ss')}`
    fields += `,end_time, status`
    values += `,'${endtime}', 1`
    sql = `INSERT into ${tableName} (${fields}) VALUES(${values})`
  } else if (tableName === 'dat_leader_arrange') {
    fields += `,user_id`
    values += `,'${xdata.userName}'`
    sql = `INSERT into ${tableName} (${fields}) VALUES(${values})`
  } else if (['dat_vehicle_type', 'dat_area'].includes(tableName)) {
    if (xdata.isCheck === 1 && tableName === 'dat_area') {
      fields += ','
      values += ','
      fields += 'over_count_person'
      values += 40
    }
    sql = `INSERT into ${tableName} (${fields}) VALUES(${values})`
    if (otherSql) {
     return {
        sql: sql,
        otherSql: otherSql
      }
    }
  }
  return sql
}

// 录入信息编辑sql特殊处理
function treatUpdateSql (keyValue, sql, self, otherSql) {
  const { cmd, tableName, tableKeyName, rows } = self
  if (tableName === 'dat_workface_scheduling') {
    sql = getWorkFaceSql(cmd, rows, self)
  } else if (tableName === 'dat_leader_arrange') {
    sql = `UPDATE ${tableName} set ${sql} where ${tableKeyName}=${rows[3].field_value} and ${rows[2].field_name} = ${rows[2].field_value} and ${rows[0].field_name} = '${rows[0].field_value}'`
  } else if (['dat_vehicle_type', 'dat_area'].includes(tableName)) {
    sql = sql ? `UPDATE ${tableName} set ${sql} where ${tableKeyName}=${keyValue}` :  ``
    let sqlObj = {}
    if (sql) sqlObj['sql'] = sql
    if (otherSql) sqlObj['otherSql'] = otherSql
    return sqlObj
  } else {
    sql = `UPDATE ${tableName} set ${sql} where ${tableKeyName}=${keyValue}`
  }

  return sql
}

// 根据工作面id获取名称
function getDelBlankId (value, name) {
  if (['coalface_id', 'drivingface_id'].includes(name)) {
    const face_type = name === 'coalface_id' ? 1 : 2
    const faces = Array.from(xdata.metaStore.data.work_face.values())
    const row = faces && faces.find(item => item.name === value && item.work_face_type === face_type)
    return row && row.work_face_id
  } else if (name === 'sanlv_standart_id') {
    return +noTurnTxt('sanlv_standart', name, value, 'key')
  }
  return value && trim(value.toString())
}

// 导入字段特殊处理
function getImportFieldValue (type, value, name) {
  const tablename = name.replace('_id', '').replace('_ck', '')
  const table = xdata.metaStore.data[tablename]
  if (['coalface_id', 'drivingface_id'].includes(name)) {
    return +getDelBlankId(value, name)
  }
  if (name == 'sanlv_standart_id') {
    return +noTurnTxt('sanlv_standart', name, value, 'key')
  }
  if (name === 'install_date') {
    return value ? `"${new Date(value).format('yyyy-MM-dd')}"` : value
  }
  if (name === 'dept_id_ck') name = 'dept_id'
  const row = table && Array.from(table.values()).find(item => item.name == value || item.detail == value)
  return row && +row[name]
}

function checkCertification (value, key) {
  const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Za-z])$/
  if (reg.test(value) || value === '') {
    if (value) {
      let staffs = xdata.metaStore.data.staff && Array.from(xdata.metaStore.data.staff.values())
      let obj = staffs && staffs.find(item => trim(item.certification) === value)
      if (obj && obj.staff_id !== key) {
        return '身份证号重复'
      }
    }
  } else {
    return '请输入正确的身份证号'
  }
}

// 获取车辆、区域绑定考勤规则sql，早退sql
function getOtherSql (field_name, self) {
  let sql = '',
      tips = ''

  if (self.tableName === 'dat_area' && field_name === 'att_rule_id') {
    let areaTypeID = self.refs['area_type_id'].refs['area_type_id'].getAttribute('name')
    areaTypeID = parseInt(areaTypeID, 10)
    let businessID = self.refs['business_type'].getBusiness()
    if (!businessID) tips = '请选择正确的区域业务'
    let businessType = businessID && (businessID).toString(2).padStart(12, 0).split('').reverse()
    let isVehicleArea = businessType && businessType[5] == 1 ? true : false
    let areaID = self.refs['area_id'].refs['area_id'].value
    areaID = parseInt(areaID, 10)
    if (!areaID && areaID !==0) tips = '请输入正确的区域编号'

    if (areaTypeID === 6 || isVehicleArea) {
      let attRuleID = self.refs['att_rule_id'].refs['att_rule_id'].getAttribute('name')
      attRuleID = parseInt(attRuleID, 10)
      if (!attRuleID) tips = '请检查考勤规则是否正确'

      sql = self.cmd === 'INSERT' ? `INSERT INTO dat_att_rule_area (area_id, att_rule_id) VALUES (${areaID}, ${attRuleID})` : `REPLACE into dat_att_rule_area (att_rule_id, area_id) VALUES(${attRuleID}, ${areaID})`

      return { sql, tips }
    }
    if (areaTypeID !== 6 && !isVehicleArea && self.cmd === 'UPDATE') {
      sql = `delete from dat_att_rule_area where area_id =${areaID}`
      return { sql, tips }
    }
    return true
  } else if (self.tableName === 'dat_vehicle_type' && field_name === 'att_rule_id') {
    let vehicleTypeID = self.refs['vehicle_type_id'].refs['vehicle_type_id'].value
    vehicleTypeID = parseInt(vehicleTypeID, 10)
    if (!vehicleTypeID) tips = '请输入正确的车辆类型编号'

    let attRuleID = self.refs['att_rule_id'].refs['att_rule_id'].getAttribute('name')
    attRuleID = parseInt(attRuleID, 10)
    if (!attRuleID) tips = '请检查考勤规则是否正确'

    sql = self.cmd === 'INSERT' ? `INSERT INTO dat_att_rule_vehicle_type (vehicle_type_id, att_rule_id) VALUES (${vehicleTypeID}, ${attRuleID})` : `REPLACE into dat_att_rule_vehicle_type (att_rule_id, vehicle_type_id) VALUES(${attRuleID}, ${vehicleTypeID})`

    return { sql, tips }
  } else if (self.tableName === 'dat_area' && field_name === 'leave_time') {
    let areaID = self.refs['area_id'] && self.refs['area_id'].refs['area_id'].value
    let leaveObj = self.refs['leave_time'] && self.refs['leave_time'].getSql(areaID)
    sql = leaveObj && leaveObj.sql
    tips = leaveObj && leaveObj.tips
    return { sql, tips }
  }

  return null
}

export { getInfo, specialTreat, isHideField, getTextValue, dealAntennaData, dealNegateValue, getMenus, updateData, getPointshortPath, pointToLineDistance, getReaderPathOfMsg, isDisabled, treatUpdateSql, treatInsertSql, getDelBlankId, getImportFieldValue, getRoutePlan, checkCertification, getOtherSql }
