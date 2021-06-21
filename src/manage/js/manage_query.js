let manageQuery = {
  'leader_scheduling': {
    sql: `select duty_date, dst.shift_type_id, dla.shift_id, dla.staff_id from dat_leader_arrange dla, dat_shift_type dst, dat_shift s, dat_staff ds LEFT JOIN dat_staff_extend dse ON dse.staff_id = ds.staff_id where dla.shift_id = s.shift_id and dla.staff_id = ds.staff_id and s.shift_type_id = dst.shift_type_id {exprString} {deptID} order by duty_date desc`,
    sqlName: 'leader_scheduling',
    countSql: `select count(1) as total from dat_leader_arrange dla, dat_shift_type dst, dat_shift s, dat_staff ds LEFT JOIN dat_staff_extend dse ON dse.staff_id = ds.staff_id where dla.shift_id = s.shift_id and dla.staff_id = ds.staff_id and s.shift_type_id = dst.shift_type_id {exprString} {deptID} order by duty_date desc`,
    searchName: '',
    field: 'staff_id'
  },
  'driver': {
    sql: `select v.vehicle_id, d.name da, dda.name,dda.driver_date,v.name vn,dda.shift_id from dat_driver_arrange dda,dat_vehicle v,dat_dept d where dda.driver_date={exprString} and dda.shift_type_id ={shiftType} and dda.vehicle_id = v.vehicle_id and dda.dept_id = d.dept_id;`,
    sqlName: 'curDayDriver',
    countSql: null,
    searchName: '',
    field: 'staff_id'
  }
}
export default manageQuery