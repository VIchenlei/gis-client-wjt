const tateQuery = {
  efficiency_overview: {
    name: 'efficiency_overview',
    label: '三率总览',
    sqlTmpl: {
      'overview-boot': `select round(sum(hsr.startup_rate) / count(hsr.startup_rate), 1) as worktime, work_date as stime from his_startup_rate hsr where work_date ${searchTime()}`,
      'overview-worktime': `select ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime from his_worktime_rate hwr where work_date ${searchTime()}`,
      'overview-rugular': `select round(sum(worktime)/sum(schedule_value)*100, 1) as worktime, stime from(select sum(detail_value) as worktime, schedule_value, work_face_id, date(start_time) as stime from his_regular_cycle_detail where start_time ${searchTime()} and end_time is not null group by work_face_id, stime)aa order by worktime;`,
      'dept_boot': `select workface_id, work_face_type as workface_type, round(sum(startup_rate)/count(startup_rate), 1) as worktime from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and work_date ${searchTime()} group by workface_id, work_face_type;`,
      'dept_worktime': `select ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime,  workface_id, work_face_type as workface_type from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and work_date ${searchTime()} group by workface_id, work_face_type;`,
      'dept_rugular': `select round(sum(worktime)/sum(schedule_value)*100, 1) as worktime, stime, dept_id from (select sum(detail_value) as worktime, schedule_value, work_face_id, date(start_time) as stime, dept_id from his_regular_cycle_detail where start_time ${searchTime()} and end_time is not null group by work_face_id, stime)aa group by dept_id order by worktime;`
    },
    searchTime: `${getMon()}`,
    termTime: `${getMonth()}`,
    autoExec: true
  }
}

function searchTime() {
  let y = new Date().getFullYear()
  let m = new Date().getMonth()
  let d = new Date().getDate() - 1
  let stime = `${y}-${m}-1 00:00:00`
  let ltime = `${y}-${m}-${d} 23:59:59`
  if (new Date().getDate() === 1) {
    stime = `${new Date(new Date(y, Number(m)-2, 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
    ltime = `${new Date(new Date(y, Number(m)-1, 1).getTime()).format('yyyy-MM-dd')} 23:59:59`
  }
  return `between '${stime}' and '${ltime}'`
}

function getMon(num) {
  let stime = ''
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  stime = `${year}-${month}`
  return stime
}

function getMonth(nMonth) { // nMonth: yyyy-MM
  let y = nMonth ? nMonth.split('-')[0] : new Date().getFullYear()
  let m = nMonth ? nMonth.split('-')[1] : new Date().getMonth()
  let shift = window.xdata && window.xdata.metaStore.data.shift && window.xdata.metaStore.data.shift.get(1)
  let shiftime = shift ? shift.start_time : '21:00:00'
  let sMonth = `${new Date(new Date(y, Number(m), 0).getTime()).format('yyyy-MM-dd')} ${shiftime}`
  let lMonth = `${new Date(new Date(y, Number(m) + 1, 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
  if (new Date().getDate() === 1) {
    sMonth = `${new Date(new Date(y, Number(m), 0).getTime()).format('yyyy-MM')}-01 00:00:00`
    lMonth = `${new Date(new Date(y, Number(m), 1).getTime()).format('yyyy-MM-dd')} 00:00:00`
  }
  return `between '${sMonth}' and '${lMonth}'`
}

export default tateQuery
