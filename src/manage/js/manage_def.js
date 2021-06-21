const manageDef = {
  'leader_scheduling': {
    rows: '',
    def: {
      label: '领导排班',
      name: 'leader_arrange',
      keyIndex: 3,
      table: 'dat_leader_arrange',
      fields: {
        labels: ['排班日期', '班制', '班次', '姓名'],
        names: ['duty_date', 'shift_type_id', 'shift_id', 'staff_id'], // 字段
        types: ['DATE', 'SELECT', 'SELECT', 'NUMBER'], // 字段类型
        enableNull: [false, false, false, false]
      }
    }
  },
  'driver1': {
    rows: '',
    def: {
      label: '司机排班',
      name: 'drive_arrange',
      keyIndex: 0,
      table: 'dat_drive_arrange',
      fields: {
        labels: ['车牌号', '日期', '早班', '中班', '晚班'],
        names: ['number', 'date_format(driver_date,"%Y-%m-%d")', '"早"', '"中"', '"晚"'], // 字段
        types: ['STRING', 'STRING', 'STRING', 'STRING', 'STRING'], // 字段类型
        enableNull: [false, true, true, true, true]
      }
    },
    sql: `SELECT number,date_format(driver_date,"%Y-%m-%d"),MAX(CASE tb2.shift WHEN "1" THEN name ELSE " " END) AS "早",MAX(CASE tb2.shift WHEN "2" THEN name ELSE " " END) AS "中",MAX(CASE tb2.shift WHEN "3" THEN name ELSE " " END) AS "晚" FROM(SELECT s.name,v.name number,IFNULL(shift_id,"total") shift,driver_date FROM dat_driver_arrange dda INNER JOIN dat_staff s ON dda.staff_id = s.staff_id INNER JOIN dat_vehicle v ON dda.vehicle_id = v.vehicle_id WHERE driver_date = "{pdfTime}" GROUP BY dda.vehicle_id, shift_id, driver_date WITH ROLLUP HAVING driver_date IS NOT NULL)tb2 GROUP BY tb2.number, tb2.driver_date WITH ROLLUP HAVING driver_date IS NOT NULL`
  },
  'driver2': {
    rows: '',
    def: {
      label: '司机排班',
      name: 'drive_arrange',
      keyIndex: 0,
      table: 'dat_drive_arrange',
      fields: {
        labels: ['车牌号', '早班', '中班', '晚班', '夜班'],
        names: ['card', 'mor', 'mid', 'nig', 'gra'], // 字段
        types: ['NUMBER', 'STRING', 'STRING', 'STRING', 'STRING'], // 字段类型
        enableNull: [false, true, true, true, true]
      }
    },
    sql: `SELECT number,MAX(CASE tb2.shift WHEN "1" THEN name ELSE " " END) AS "早",MAX(CASE tb2.shift WHEN "2" THEN name ELSE " " END) AS "中",MAX(CASE tb2.shift WHEN "3" THEN name ELSE " " END) AS "晚", MAX(CASE tb2.shift WHEN "4" THEN name ELSE " " END) AS "夜" FROM(SELECT s.name,v.name number,IFNULL(shift_id,"total") shift,driver_date FROM dat_driver_arrange dda INNER JOIN dat_staff s ON dda.staff_id = s.staff_id INNER JOIN dat_vehicle v ON dda.vehicle_id = v.vehicle_id WHERE driver_date = "{pdfTime}" GROUP BY dda.vehicle_id, shift_id, driver_date WITH ROLLUP HAVING driver_date IS NOT NULL)tb2 GROUP BY tb2.number, tb2.driver_date WITH ROLLUP HAVING driver_date IS NOT NULL`
  }
}

export default manageDef