const tabDefs = {
  rs_efficiency_overview: {
    name: 'rs_efficiency_overview',
    sqlTmpl: {
      'overview-boot': `select hsr.workface_id, work_face_type as workface_type, need_display, round(sum(hsr.startup_rate) / count(hsr.startup_rate), 1) as worktime, work_date as stime from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and need_display = 1 and work_date {exprString} group by work_date`,
      'overview-rugular': `select dept_id, round(sum(worktime)/sum(schedule_value) * 100, 1) as worktime, date(stime) as stime, need_display from (select sum(detail_value) as worktime, schedule_value, date(start_time) as stime, dept_id, need_display from his_regular_cycle_detail hrc left join dat_work_face dwf ON hrc.work_face_id = dwf.work_face_id WHERE start_time {exprString} and need_display = 1 group by date(start_time), hrc.work_face_id)aa group by aa.stime order by aa.stime`,
      'overview-worktime': `select hwr.workface_id, work_face_type as workface_type, need_display, ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime,  work_date as stime from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and need_display = 1 and work_date {exprString} group by work_date`,
      'dept_boot': `select workface_id, work_face_type as workface_type, need_display, rank, round(startup_rate, 1) AS worktime,work_date as stime from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and work_date {exprString} group by workface_id, work_date, work_face_type;`,
      'dept_rugular': `SELECT ROUND(SUM(worktime) / schedule_value * 100, 1) AS worktime, stime, dept_id, ROUND(sum(worktime),2) as sumnum, work_face_id, work_face_type, need_display, rank FROM (SELECT SUM(detail_value) AS worktime, schedule_value, DATE(start_time) AS stime, hrc.dept_id, dwf.work_face_id, dwf.work_face_type, dwf.need_display, dwf.rank FROM his_regular_cycle_detail hrc LEFT JOIN dat_work_face dwf on hrc.work_face_id = dwf.work_face_id WHERE start_time {exprString} GROUP BY DATE(start_time), work_face_id ORDER BY start_time)aa GROUP BY stime, dept_id ORDER BY stime;`,
      'dept_worktime': `select rate_id, ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime, workface_id, work_face_type as workface_type, work_date as stime, avg_valid_time as overWorktime, avg_invalid_time as overChecktime, need_display, rank from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and work_date {exprString} group by workface_id, work_date, work_face_type`
    }
  },
  rept_efficiency_manage: {
    name: 'rept_efficiency_manage',
    sqlTmpl: {
      'dept_boot': `select round(startup_rate, 1) as worktime, round(startup_time,2) as overWorktime,  round( schedule_work_time ,2) as overChecktime, workface_id, workface_type from his_startup_rate hsr where work_date between {exprString} group by workface_id, workface_type`,
      'analysis': `select Rpt_Type, dept_id, Analysis from rpt_sanlv_daily_main rsdm, rpt_sanlv_daily_detail rsdd where rsdm.ID = rsdd.MainID and rsdm.CreateDateTime between {exprString};`,
      'dept_rugular': `SELECT ROUND(SUM(worktime) / schedule_value * 100, 1) AS worktime, stime,dept_id, ROUND(SUM(worktime),1) AS sumnum,round(SUM(worktime), 2) as overWorktime, round(schedule_value, 2) as overChecktime, vehicle_type_id as vehicleTypeID, vehicle_id FROM (SELECT SUM(detail_value) AS worktime, schedule_value, DATE(start_time) AS stime, hrc.dept_id, hrc.vehicle_id,dv.vehicle_type_id FROM his_regular_cycle_detail hrc LEFT JOIN dat_vehicle dv ON hrc.vehicle_id = dv.vehicle_id WHERE DATE(start_time) between {exprString} GROUP BY DATE(start_time), vehicle_id ORDER BY start_time)aa GROUP BY stime, dept_id ORDER BY dept_id;`,
      'planing': `select workface_id,dwf.work_face_type,schedule_startup_time as boot_time,case when dwf.work_face_type = 1 then schedule_mine_times else schedule_tunnelling_times end as planing,schedule_date from dat_workface_scheduling dws, dat_work_face dwf where schedule_date between {exprString};`,
      'dept_worktime': `select round(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime, round(sum(avg_valid_time) / count(hwr.worktime_rate), 2) as overWorktime, round(sum(avg_invalid_time)/count(hwr.worktime_rate), 2) as overChecktime, workface_id, workface_type from his_worktime_rate hwr where work_date between {exprString} group by workface_id, workface_type;`
    }
  }
}

const TITLENAME = {'dept_boot': '队组开机率(%)', 'dept_worktime': '队组平均有效工时', 'dept_rugular': '队组正规循环率(%)'}

const rateDefs = {
  overViewRates: [
    {
      warpName: 'overviewBD',
      className: 'overview-BD',
      title: '开机率'
    },
    {
      warpName: 'overviewWD',
      className: 'overview-WD',
      title: '平均有效工时'
    },
    {
      warpName: 'overviewRD',
      className: 'overview-RD',
      title: '正规循环率'
    }
  ],
  deptRates: [
    {
      warpName: 'rate-dept_boot',
      className: 'dept_boot'
    },
    {
      warpName: 'rate-dept_worktime',
      className: 'dept_worktime'
    },
    {
      warpName: 'rate-dept_rugular',
      className: 'dept_rugular'
    }
  ]
}
export { tabDefs, TITLENAME, rateDefs }
