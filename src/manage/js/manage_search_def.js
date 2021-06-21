/*
 *manageSearchDef 工作面作业计划、三率 rs-select-field组件所需配置
 */
const manageSearch = {
  coalface_work: {
    tableName: 'dat_coalface',
    rows: {
      field_label: '采煤面',
      field_name: 'coalface_id',
      field_value: '',
      field_enableNull: true
    }
  },
  drivingface_work: {
    tableName: 'dat_drivingface',
    rows: {
      field_label: '掘进面',
      field_name: 'drivingface_id',
      field_value: '',
      field_enableNull: true
    }
  },
  sanlv_schedule: {
    tableName: 'dat_work_face',
    rows: {
      field_label: '工作面',
      field_name: 'work_face_id',
      field_value: '',
      field_enableNull: true
    },
    sanlv: {
      tableName: 'sanlv',
      rows: {
        field_label: '三率',
        field_name: 'sanlv',
        field_value: '',
        field_enableNull: true
      }
    }
  },
  his_startup_detail: {
    sql: `select sum(real_startup_time) as svalue, date(start_up_time) as stime from his_startup_detail where start_up_time between '{sMonth} 00:00:00' and '{lMonth} 23:59:59' and work_face_id = {faceID} group by date(start_up_time);`
  },
  his_regular_cycle_detail: {
    sql: `select sum(detail_value)as svalue, date(start_time) as stime from his_regular_cycle_detail where start_time between '{sMonth} 00:00:00' and '{lMonth} 23:59:59' and work_face_id = {faceID} group by date(start_time);`
  },
  schedule_date: {
    sql: `select schedule_startup_time, schedule_mine_times, schedule_tunnelling_times, schedule_date as stime from dat_workface_scheduling where workface_id = {faceID} and schedule_date between '{sMonth}' and '{lMonth}' order by schedule_date;`
  }
}

export { manageSearch }