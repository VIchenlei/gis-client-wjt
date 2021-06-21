/**
 * @description: 报表打印基础设置
 * @param {type} 
 * @return: 
 */
const queryTrackDef = {
  'attendance': {
    'staff': {
      sql: `select ras.card_id, ras.staff_id, date_format(ras.start_time, "%Y-%m-%d %H:%i:%s") as start_time, date_format(ras.end_time, "%Y-%m-%d %H:%i:%s") as end_time, ifnull(dl1.name,'') as sname, ddm1.name as sdir, ras.landmark_distance_start as sdis,ifnull(dl2.name,'') as ename, ddm2.name as edir, ras.landmark_distance_end as edis from (select ras.* from rpt_att_staff ras where ras.staff_id = {objID}{timeExpr}) ras left join dat_landmark dl1 on ras.landmark_id_start = dl1.landmark_id left join dat_landmark dl2 on ras.landmark_id_end = dl2.landmark_id left join dat_direction_mapper ddm1 on ras.landmark_direction_start = ddm1.direction_mapper_id left join dat_direction_mapper ddm2 on ras.landmark_direction_end = ddm2.direction_mapper_id order by ras.start_time desc;`,
      timeExpr: ` and ras.start_time >= "{startTime}" and ras.start_time <= "{endTime}" and TIMESTAMPDIFF(SECOND, start_time, end_time) >= 10`
    },
    'vehicle': {
      sql: `select rav.* from (select rav.card_id, date_format(rav.start_time, "%Y-%m-%d %H:%i:%s") as start_time, date_format(rav.end_time, "%Y-%m-%d %H:%i:%s") as end_time, rav.vehicle_id, rav.name, rav.att_date, rav.shift_id,ifnull(dl1.name,'') as sname, ddm1.name as sdir, rav.landmark_distance_start as sdis, ifnull(dl2.name,'') as ename,ddm2.name as edir,rav.landmark_distance_end as edis from(select rav.*, v.name from rpt_att_vehicle rav, dat_vehicle v where rav.vehicle_id=v.vehicle_id and rav.vehicle_id={objID}{timeExpr}) rav left join dat_landmark dl1 on rav.landmark_id_start = dl1.landmark_id left join dat_landmark dl2 on rav.landmark_id_end = dl2.landmark_id left join dat_direction_mapper ddm1 on rav.landmark_direction_start = ddm1.direction_mapper_id left join dat_direction_mapper ddm2 on rav.landmark_direction_end = ddm2.direction_mapper_id) rav left join dat_driver_arrange dda on rav.vehicle_id =dda.vehicle_id and rav.att_date=dda.driver_date and rav.shift_id=dda.shift_id order by rav.start_time desc;`,
      timeExpr: ` and start_time >= "{startTime}" and start_time <= "{endTime}" and TIMESTAMPDIFF(SECOND, start_time, end_time) >= 10`
    }
  },
  'notattendance': {
    'staff': {
      sql: `select bt.staff_id, bt.card_id, begin_time, ifnull(last_time, current_timestamp()) last_time, speed, begin_pt, hl.area_id, map_id, direction, location_flag from his_location_staff_ hl,dat_staff_extend bt where hl.obj_id=bt.staff_id and bt.staff_id IN ({objID}){timeExpr} ORDER BY begin_time;`,
      timeExpr: ` and begin_time >= "{startTime}" and begin_time <= "{endTime}"`
    },
    'vehicle': {
      sql: `select dve.vehicle_id, dve.card_id, begin_time, ifnull(last_time, current_timestamp()) last_time, speed, begin_pt, area_id, map_id, direction, location_flag from his_location_vehicle_ hlv, dat_vehicle_extend dve where hlv.obj_id = dve.vehicle_id and dve.vehicle_id = {objID}{timeExpr} order by begin_time;`,
      timeExpr: ` and begin_time >= "{startTime}" and begin_time < "{endTime}"`
    }
  }
}

let sqlDefs = {
  'staff': {
    sql: `select hed.event_type_id, date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as start_time, date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time, de.dept_id, de.staff_id, de.card_id, hed.dis_type from (select * from his_event_data where stat=0) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100) hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id inner join dat_staff_extend de on hed.obj_id = de.card_id left join dat_staff dd on de.staff_id = dd.staff_id left join dat_event_type dt on hed.event_type_id = dt.event_type_id where 1=1 {exprString}`
  },
  'vehicle': {
    sql: `select hed.event_type_id, date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as start_time, date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time, de.dept_id, de.vehicle_id, de.card_id, hed.dis_type from (select * from his_event_data where stat=0) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend de on de.card_id = hed.obj_id where 1=1 {exprString} order by hed.cur_time desc`
  }
}
export { queryTrackDef, sqlDefs }
