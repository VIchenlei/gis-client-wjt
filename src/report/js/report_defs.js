/**
 * @description: 报表打印基础设置
 * @param {type}
 * @return:
 */
const printDef = {
  reptTable: [
    {label: '打印', name: 'printPDF', icon: 'icon-printer'},
    {label: '导出CSV', name: 'csv', icon: 'icon-file-excel'},
    {label: '导出PDF', name: 'pdf', icon: 'icon-file-pdf'}
  ],
  reptSpecial: [
    {label: '打印', name: 'printPDF', icon: 'icon-printer'},
    {label: '导出CSV', name: 'csv', icon: 'icon-file-excel'},
    {label: '导出PDF', name: 'pdf', icon: 'icon-file-pdf'}
  ],
  reptDeptMonth: [
    {label: '导出CSV', name: 'csv', icon: 'icon-file-excel'}
  ],
  worktimeDeptShift: [
    {label: '导出xlsx', name: 'xlsx', icon: 'icon-file-excel'}
  ],
  efficiencyManage: [
    {label: '导出xlsx', name: 'xlsx', icon: 'icon-file-excel'}
  ],
  vehicleDay: [
    {label: '导出CSV', name: 'csv', icon: 'icon-file-excel'}
  ]
}

/**
 * @description: rs-time-filter中type基础配置
 * @param {type}
 * @return:
 */
const timeTypeDefs = {
  MONTH: {
    type: 'MONTH',
    timeType: 'DATE',
    showSelect: true,
    showMonthCondition: true
  },
  DATE: {
    type: 'DATE',
    timeType: 'DATETIME',
    showSelect: true,
    showMonthCondition: false
  },
  DATETIME: {
    type: 'DATETIME',
    timeType: '',
    showSelect: false,
    showMonthCondition: false
  },
  DAY: {
    type: 'DATE',
    timeType: '',
    showSelect: false,
    showMonthCondition: false
  }
}

/**
 * @description: 特殊报表名称数组
 * @param {type}
 * @return:
 */
const specialRept = ['rs_efficiency_overview', 'v_vehicle_day', 'person_s_dept_month', 'rept_worktime_dept', 'rept_efficiency_manage', 'rugular_total', 'person_s_dept_day', 'rept_car_whole']

/**
 * @description: rs-condition-filter中select基础配置
 * @param {type}
 * @return:
 */
const selectDefs = {
  'is_enough': [
    {
      label: '足班',
      is_enough: 0
    },
    {
      label: '不足班',
      is_enough: 1
    }
  ],
  'is_auto': [
    {
      label: '正常',
      is_auto: 0
    },
    {
      label: '手动升井',
      is_auto: 1
    },
    {
      label: '强制升井',
      is_auto: 2
    }
  ],
  'query_choose': [
    {
      label: '一小时',
      query_choose: 1
    },
    {
      label: '六小时',
      query_choose: 6
    },
    {
      label: '一天',
      query_choose: 24
    }
  ]
}

/**
 * @description: rept-table中特殊的导出配置文件
 * @param {type}
 * @return:
 */
const printFields = {
  person_month: {
    names: ['staff_id', 'card_id', 'dept_id', 'm_count', 'work_time', 'avg_time', 'zero', 'eight', 'four'],
    types: ['SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER'],
    labels: ['姓名', '卡号', '部门名称', '次数', '合计时长', '平均时长', '0点班', '8点班', '4点班']
  }
}

/**
 * @description: 带图表的tableName的集合
 * @param {type}
 * @return:
 */
const graphNames = ['v_vehicle_month', 'person_month', 'v_vehicle_day', 'driver_dept_month', 'rept_car_whole']

const alarmSqlDef = {
  staff: `select hed.event_type_id, hed.obj_id as obj, ds.name as objName, hed.map_id, ds.staff_id as numberID, s.card_id as cardID,d.name as deptName, date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as cur_time, date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time from (select * from his_event_data where stat = 0 {eventString}) hed left join (select event_id,cur_time from his_event_data where stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id left join dat_event_type et on hed.event_type_id = et.event_type_id left join dat_staff_extend s on s.card_id = hed.obj_id left join dat_staff ds on ds.staff_id = s.staff_id left join rpt_att_staff ras on ras.staff_id = ds.staff_id and hed.cur_time between ras.start_time and ras.end_time left join dat_dept d ON d.dept_id = s.dept_id where 1=1 {exprString}`,
  vehicle: `select hed.event_type_id, hed.obj_id as obj, dv.name as objName, hed.map_id, dv.vehicle_id as numberID, v.card_id as cardID,d.name as deptName, date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as cur_time, date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time from (select * from his_event_data where stat=0 {eventString}) hed left join ( select event_id, cur_time from his_event_data where stat=100 {eventString}) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_vehicle dv on dv.vehicle_id = v.vehicle_id left join dat_dept d on d.dept_id = v.dept_id left join (select * from dat_shift where shift_type_id = 1) s on (((s.start_time < s.end_time) AND (TIME(hed.cur_time) >= s.start_time AND TIME(hed.cur_time) < s.end_time)) OR ((s.start_time > s.end_time) AND (TIME(hed.cur_time) >=s.start_time OR TIME(hed.cur_time) <s.end_time))) left join dat_driver_arrange dda on dda.vehicle_id = v.vehicle_id AND dda.driver_date = DATE(hed.cur_time) AND dda.shift_id = s.shift_id where 1=1 {exprString}`,
  area: `SELECT hed.event_type_id, hed.obj_id as obj, s.name as objName, hed.map_id, s.area_id as numberID, '' as cardID,'' as deptName, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") AS cur_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") AS end_time FROM (SELECT * FROM his_event_data WHERE stat = 0 {eventString}) hed LEFT JOIN (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id LEFT JOIN dat_event_type et ON hed.event_type_id = et.event_type_id LEFT JOIN dat_area s ON s.area_id = hed.obj_id WHERE 1=1 {exprString}`,
  reader: `SELECT hed.event_type_id, hed.obj_id as obj, s.name as objName, hed.map_id, s.reader_id as numberID, '' as cardID,'' as deptName, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") AS cur_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") AS end_time FROM (SELECT * FROM his_event_data WHERE stat = 0 {eventString}) hed LEFT JOIN (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id LEFT JOIN dat_event_type et ON hed.event_type_id = et.event_type_id LEFT JOIN dat_reader s ON s.reader_id = hed.obj_id WHERE 1=1 {exprString}`,
  sensor: `SELECT hed.event_type_id, hed.obj_id as obj, ds.sensor_desc as objName, hed.map_id, ds.sensor_id as numberID, '' as cardID,'' as deptName, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") AS cur_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") AS end_time FROM (SELECT * FROM his_event_data WHERE stat = 0 {eventString}) hed LEFT JOIN (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id LEFT JOIN dat_event_type et ON hed.event_type_id = et.event_type_id left join dat_sensor ds on ds.sensor_id = hed.obj_id WHERE 1=1 {exprString}`,
  light: `SELECT hed.event_type_id, hed.obj_id as obj, ds.name as objName, hed.map_id, ds.light_id as numberID, '' as cardID,'' as deptName, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") AS cur_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") AS end_time FROM (SELECT * FROM his_event_data WHERE stat = 0 {eventString}) hed LEFT JOIN (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id LEFT JOIN dat_event_type et ON hed.event_type_id = et.event_type_id left join dat_light ds on ds.light_id = hed.obj_id WHERE 1=1 {exprString}`,
  other: `SELECT hed.event_type_id, hed.obj_id as obj, '' as objName, hed.map_id, '' as numberID, '' as cardID,'' as deptName, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") AS cur_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") AS end_time FROM (SELECT * FROM his_event_data WHERE stat = 0 {eventString}) hed LEFT JOIN (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 {eventString}) hed1 ON hed.event_id = hed1.event_id LEFT JOIN dat_event_type et ON hed.event_type_id = et.event_type_id WHERE 1=1 {exprString}`, 
}
export { timeTypeDefs, printDef, specialRept, selectDefs, printFields, graphNames, alarmSqlDef }
