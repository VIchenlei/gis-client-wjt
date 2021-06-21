
/**图例的配置文件 */
const LEGENDNAME = {'dept_boot': '开机率', 'dept_worktime': '工时利用率', 'dept_rugular': '正规循环率', 'overview-boot': '开机率概况', 'overview-worktime': '工时利用率概况', 'overview-rugular': '正规循环率概况'}

/**部门的三率名称 */
const DEPTEFFICIENCYS = ['dept_boot','dept_worktime','dept_rugular']

/**三率图表中线的颜色配置 */
const COLORDEFS = {
  'overview-boot': '#ff0000',
  'overview-worktime': '#00ff00',
  'overview-rugular': '#000099',
  'dept_boot': '#e66c3f',
  'dept_worktime': '#0ca875',
  'dept_rugular': '#241d67'
}

/**处理数据的配置 */
const SPLITDEFS = [
  {
    name: 'dept_boot',
    funName: 'splitDeptData',
    color: '#e66c3f'
  },
  {
    name: 'dept_worktime',
    funName: 'splitDeptData',
    color: '#0ca875'
  },
  {
    name: 'dept_rugular',
    funName: 'splitDeptData',
    color: '#241d67'
  },
  {
    name: 'overview-boot',
    funName: 'splitOverviewData'
  },
  {
    name: 'overview-worktime',
    funName: 'splitOverviewData'
  },
  {
    name: 'overview-rugular',
    funName: 'splitOverviewData'
  }
]
/*采煤面数字标识 */
const CM = 1

/*掘进面数字标识 */
const JJ = 2

/**选择对应的图例 */
function selectLegend (legend) {
  let msg = {}
  switch (legend.length) {
    case 3:
      msg[`${legend[1]}`] = false
    case 2:
      msg[`${legend[0]}`] = false
      break
  }
  return msg
}

/**根据deptID获取vehicleID以及workfaceID */
function getVehcileID (deptID) {
  let vehicleID = xdata.metaStore.data.vehicle_extend.values() && Array.from(xdata.metaStore.data.vehicle_extend.values()).filter(item => item.dept_id == deptID)
  vehicleID = vehicleID && vehicleID[0] && vehicleID[0].vehicle_id
  let vehicleTypeID = xdata.metaStore.data.vehicle.values() && Array.from(xdata.metaStore.data.vehicle.values()).filter(item => item.vehicle_id == vehicleID)
  vehicleTypeID = vehicleTypeID && vehicleTypeID[0] && vehicleTypeID[0].vehicle_type_id
  let face = vehicleTypeID === 26 ? xdata.metaStore.data.drivingface_vehicle : xdata.metaStore.data.coalface_vehicle
  face = face && Array.from(face.values()).filter(item => item.vehicle_id == vehicleID)
  let faceID = 0
  if (face && face.length > 0) {
    faceID = vehicleTypeID === 26 ? face[0].drivingface_id : face[0].coalface_id
  }
  return {
    vehicleID: vehicleID,
    workfaceID: faceID
  }
}

/**获取上一个月 */
function getBeforeMonth () {
  let y = new Date().getFullYear()
  let m = new Date().getMonth()
  let d = new Date().getDate()
  let beforeMonth = new Date(y, m-1, d).format('yyyy-MM')
  return beforeMonth
}

/**获取三率总览中的查询time */
function searchTime (isCurrtMonth, type, nMonth) {
  if (isCurrtMonth) {
    let y = new Date().getFullYear()
    let m = new Date().getMonth() + 1
    let d = new Date().getDate()
    let shift = xdata.metaStore.data.shift && xdata.metaStore.data.shift.get(1)
    let shiftime = shift ? shift.start_time : '23:59:59'
    let currtTime = new Date().format('hh:mm:ss')
    let stime = type ? `${new Date(new Date(y, Number(m) - 1, 0).getTime()).format('yyyy-MM-dd')} ${shiftime}` : `${new Date(new Date(y, Number(m) - 1, 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
    let ltime = `${new Date(new Date(y, Number(m) - 1, d).getTime()).format('yyyy-MM-dd')} ${currtTime}`
    if (new Date().getDate() === 1 && !nMonth) {
      stime = type ? `${new Date(new Date(y, Number(m) - 2, 0).getTime()).format('yyyy-MM-dd')} ${shiftime}` : `${new Date(new Date(y, Number(m) - 1, 0).getTime()).format('yyyy-MM')}-01 00:00:00`
      ltime = `${new Date(new Date(y, Number(m) - 2, d).getTime()).format('yyyy-MM-dd')} ${currtTime}`
    }
    return `between '${stime}' and '${ltime}'`
  } else {
    let y = nMonth ? nMonth.split('-')[0] : new Date().getFullYear()
    let m = nMonth ? nMonth.split('-')[1] : new Date().getMonth() + 1
    let shift = xdata.metaStore.data.shift && xdata.metaStore.data.shift.get(1)
    let shiftime = shift ? shift.start_time : '23:59:59'
    let sMonth = type ? `${new Date(new Date(y, Number(m) - 1, 0).getTime()).format('yyyy-MM-dd')} ${shiftime}` : `${new Date(new Date(y, Number(m) - 1, 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
    let lMonth = `${new Date(new Date(y, m, 0).getTime()).format('yyyy-MM-dd')} 23:59:59`
    return `between '${sMonth}' and '${lMonth}'`
  }
}

/*获取部门名称*/
function getDeptName (row) {
  let workfaceType = row.workfaceType
  let workfaceID = row.workfaceID
  let vehicles = workfaceType === CM ? xdata.metaStore.data.coalface_vehicle : xdata.metaStore.data.drivingface_vehicle
  let vehicle = vehicles && vehicles.get(workfaceID)
  vehicle = vehicle && vehicle.vehicle_id
  let vehicleExtend = xdata.metaStore.data.vehicle_extend
  let dept = vehicle && vehicleExtend && vehicleExtend.get(vehicle)
  dept = dept && dept.dept_id
  let faces = xdata.metaStore.data.work_face
  let face = faces && faces.get(workfaceID) && faces.get(workfaceID).name
  let deptname = dept ? xdata.metaStore.getNameByID('dept_id', dept) : ''
  return face && `${face}-${deptname}`
}
  
/*获取指定月份的天数 */
function currentMonthdays (time) {
  let len = 0
  if (time != new Date(new Date().getTime()).format('yyyy-MM')) {
    len = new Date(new Date(time).getFullYear(), new Date(time).getMonth() + 1, 0).getDate()
  } else if( time == new Date(new Date().getTime()).format('yyyy-MM')) {
    len = new Date().getDate()
  }
  return len
}

/**三率详情中的sql配置 */
let detailSql = {
	'displacement': `select concat(write_time, ',', avg_distance) as position_data, avg_distance, max_distance, min_distance from his_draw_position hdp where write_time {timeString} and work_face_id = {workfaceID};`,
	'gasment': `select hsd.sensor_id, concat_ws(',', date_format(hsd.write_time, "%Y-%m-%d %H:%i:%S"),hsd.data_value) as switch_data, write_time, sensor_type_id from his_sensor_data hsd inner join ( select sensor_id, sensor_type_id from dat_sensor ds where work_face_id = {workfaceID})aa on hsd.sensor_id = aa.sensor_id and hsd.write_time {timeString};`,
	'bootswitch': `select hsd.dept_id, concat_ws(',', date_format(hsd.start_up_time, "%Y-%m-%d %H:%i:%S"),1) as open_data, concat_ws(',', date_format(case when hsd.shut_down_time is null then now() else hsd.shut_down_time end, "%Y-%m-%d %H:%i:%S"),0) as close_data from his_startup_detail hsd where hsd.dept_id = {deptID} and hsd.start_up_time {timeString};`,
  'rugularAverage': `select round(sum_detail_value / sum_schedule_value * 100, 1) as worktime, sum_date as stime from his_regular_cycle_sum hrcs where hrcs.work_face_id = {workfaceID} and hrcs.sum_date between {timeString};`,
  'bootAnalysis': `select work_face_id, MainID, Analysis from rpt_sanlv_daily_detail rsdd left join rpt_sanlv_daily_main rsdm on rsdm.ID = rsdd.MainID where CreateDateTime = date(now()) and work_face_id = {workfaceID} and Rpt_Type = 1 order by ID desc limit 1;`,
	'rugularAnalysis': `select * from rpt_sanlv_daily_detail rsdd left join rpt_sanlv_daily_main rsdm on rsdm.ID = rsdd.MainID where CreateDateTime = date(now()) and work_face_id = {workfaceID} and Rpt_Type = 2 order by ID desc limit 1;`,
	'worktimeAnalysis': `select * from rpt_sanlv_daily_detail rsdd left join rpt_sanlv_daily_main rsdm on rsdm.ID = rsdd.MainID where CreateDateTime = date(now()) and work_face_id = {workfaceID} and Rpt_Type = 3 order by ID desc limit 1;`
}

/** 三率详情中获取查询时间*/
function getTimeObj(time, defaultTime) {
  let dealTime = time, timeString = null
  if (!time) {
    let d = new Date().getDate()
    if (new Date(defaultTime).getMonth() !== new Date().getMonth()) {
      time = new Date(new Date(new Date(defaultTime).getFullYear(), new Date(defaultTime).getMonth() + 1, 0).getTime()).format('yyyy-MM-dd')
    } else {
      time = `${defaultTime}-${d}`
    }
    dealTime = new Date(new Date(time).getTime()).format('MM-dd')
  }
  let rugularAverageTime = `'${defaultTime}-1' and '${time}'`
  let currtTime = new Date(time).format('yyyy-MM-dd') ==  new Date().format('yyyy-MM-dd') ? new Date().format('hh:mm:ss') : '23:59:59' 
  timeString = `between '${time} 00:00:00' and '${time} ${currtTime}'`
  dealTime = new Date(new Date(time).getTime()).format('MM-dd')
  return {
    timeString: timeString,
    time: dealTime,
    rugularAverageTime: rugularAverageTime
  }
}

/*正规率组件中的获取正规循环率以及平均正规循环率的echarts数据 */
function echartDate (rows, name, title) {
  let color = name === 'dept-rugular' ? '#0167ff' : '#26cc41'
  let zIndex = name === 'dept-rugular' ? 3 : 2
  let msg = {
    id: name,
    name: title,
    data: rows,
    type: 'line',
    z: zIndex,
    smooth: true,
    showAllSymbol: true,
    itemStyle: {
      normal: {
        color: color,
        lineStyle: {
          color: color,
        }
      }
    }
  }
  return msg
}

/**正规率组件中的获取位置信息数据 */
function getPositionData (displacement, totalLength) {
  let positiondata = []
  let dataArr = []
  let dataMax = []
  let dataMin = []
  displacement.forEach(item => {	
    let datas = item.position_data.split(';')
    if (!!!datas[datas.length - 1]) {
      datas.pop()
    }
    dataArr.push(item.avg_distance)
    dataMax.push(item.max_distance)
    dataMin.push(item.min_distance)
    if (!!!datas) return
    let data = datas[0].split(',')
    if (data.length < 2) return
    positiondata.push(data)
  })
  let max = Math.max.apply(Math, dataArr)
  let maxM = Math.max.apply(Math, dataMax)
  max = maxM > max ? maxM : max + 5
  max = totalLength ? totalLength : Math.ceil(max)
  let min = Math.min.apply(Math, dataArr)
  let minM = Math.min.apply(Math, dataMin)
  min = minM !== 0 && minM < min ? minM : min
  min = Math.floor(min) <= 5 ? 0 : Math.floor(min)
  dataArr = null, dataMax = null, dataMin = null
  return {
    positiondata: positiondata,
    max: max,
    min: min
  }
}

/*worktime-eff中的柱状图配置 */
function barCharts (rows, color, id, name) {
  return {
    id: id,
    name: name,
    data: rows,
    type: 'bar',
    barGap: '5%',
    yAxisIndex: 1,
    itemStyle: {
      normal: {
        color: color
      }
    }
  }
}

export { LEGENDNAME, DEPTEFFICIENCYS, COLORDEFS, SPLITDEFS, CM, JJ, selectLegend, getVehcileID, getBeforeMonth, searchTime, getDeptName, currentMonthdays, detailSql, getTimeObj, echartDate, getPositionData, barCharts }
