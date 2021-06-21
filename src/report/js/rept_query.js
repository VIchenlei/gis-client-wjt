let reptQuery = {
  person_hour: {
    name: 'person_hour',
    label: '最近一小时人员出入井',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from rpt_att_staff ras left join dat_staff ds on ds.staff_id = ras.staff_id left join dat_staff_extend dse on dse.staff_id = ds.staff_id left join dat_shift da on da.shift_id = ras.shift_id INNER JOIN dat_dept dd ON dse.dept_id = dd.dept_id INNER JOIN dat_occupation doc ON dse.occupation_id = doc.occupation_id where 1=1 AND TIMESTAMPDIFF(MINUTE, ras.start_time, IFNULL(ras.end_time, CURRENT_TIMESTAMP())) >= 10 {exprString} order by ras.att_date desc,ras.start_time desc',
    fields: {
      names: ['date_format(ras.att_date,"%Y-%m-%d") as time', 'ds.staff_id', 'ds.name', 'ras.card_id', 'dd.name as dname', 'doc.name as oname', 'date_format(ras.start_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(ras.end_time, "%Y-%m-%d %H:%i:%s") as end_time', 'CASE WHEN ras.is_auto = 0 and ras.end_time is not null THEN "正常" WHEN ras.is_auto = 1 THEN "手动升井" WHEN ras.is_auto = 2 THEN "强制升井" ELSE " " END as auto', 'Concat(TIMESTAMPDIFF(HOUR, ras.start_time,ifnull(ras.end_time, current_timestamp())), ":",TIMESTAMPDIFF(MINUTE, ifnull(ras.start_time, current_timestamp()),ras.end_time) %60) as retention_time', 'da.short_name'],
      types: ['STRING', 'NUMBER', 'STRING', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING'],
      labels: ['日期', '员工编号', '姓名', '卡号', '所属部门', '职务', '入井时间', '升井时间', '升井方式', '工作时长', '班次']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'ras.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dse.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      name: 'ras.is_auto',
      label: '升井方式',
      type: 'CHECKBOX'
    },
    // {
    //   name: 'is_enough',
    //   label: '是否足班',
    //   type: 'RADIO'
    // }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'getHour',
        funFields: null
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person: {
    name: 'person',
    label: '人员出入井明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from rpt_att_staff ras left join dat_staff ds on ds.staff_id = ras.staff_id left join dat_staff_extend dse on dse.staff_id = ds.staff_id left join dat_shift da on da.shift_id = ras.shift_id INNER JOIN dat_dept dd ON dse.dept_id = dd.dept_id INNER JOIN dat_occupation doc ON dse.occupation_id = doc.occupation_id left join (select distinct card_id from his_card_batlog where 1=1 {batlogExprString}) aa on dse.card_id = aa.card_id where 1=1 AND TIMESTAMPDIFF(MINUTE, ras.start_time, IFNULL(ras.end_time, CURRENT_TIMESTAMP())) >= 10 {exprString} order by ras.att_date desc,ras.start_time desc',
    fields: {
      names: ['date_format(ras.att_date,"%Y-%m-%d") as time', 'ds.staff_id', 'ds.name', 'ras.card_id', 'dd.name as dname', 'doc.name as oname', 'date_format(ras.start_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(ras.end_time, "%Y-%m-%d %H:%i:%s") as end_time', 'CASE WHEN ras.is_auto = 0 and ras.end_time is not null THEN "正常" WHEN ras.is_auto = 1 THEN "手动升井" WHEN ras.is_auto = 2 THEN "强制升井" ELSE " " END as auto', 'Concat(TIMESTAMPDIFF(HOUR, ras.start_time,ifnull(ras.end_time, current_timestamp())), ":",TIMESTAMPDIFF(MINUTE, ifnull(ras.start_time, current_timestamp()),ras.end_time) %60) as retention_time', 'da.short_name', 'case when aa.card_id is null then "否" else "是" end as isbat'],
      types: ['STRING', 'NUMBER', 'STRING', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING'],
      labels: ['日期', '员工编号', '姓名', '卡号', '所属部门', '职务', '入井时间', '升井时间', '升井方式', '工作时长', '班次', '充放电']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'ras.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dse.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      name: 'ras.is_auto',
      label: '升井方式',
      type: 'CHECKBOX'
    },
    // {
    //   name: 'is_enough',
    //   label: '是否足班',
    //   type: 'RADIO'
    // },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.start_time'
        },
        label: '入井时间 - 入井时间'
      },
      {
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '入井时间-出井时间'
      },
      {
        start: {
          name: 'ras.end_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '出井时间-出井时间'
      }
      ]
    }

    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['ras.start_time', 'ras.start_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_area: {
    name: 'person_area',
    label: '人员进出区域明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from his_location_area_staff hlas inner join dat_staff ds on ds.staff_id = hlas.obj_id left join dat_area da on da.area_id = hlas.area_id left join dat_staff_extend dse on dse.staff_id = ds.staff_id INNER JOIN dat_dept dd on dse.dept_id = dd.dept_id INNER JOIN dat_occupation doc ON dse.occupation_id = doc.occupation_id INNER JOIN dat_area_type dat ON da.area_type_id = dat.area_type_id INNER JOIN dat_worktype dwt ON dse.worktype_id = dwt.worktype_id where 1=1 AND TIMESTAMPDIFF(MINUTE, hlas.enter_time, IFNULL(hlas.leave_time, CURRENT_TIMESTAMP())) >= 1 and hlas.area_id >= 0 {exprString} order by hlas.enter_time desc',
    fields: {
      names: ['dse.card_id', 'ds.staff_id', 'ds.name', 'dd.name as dname', 'doc.name as oname', 'dwt.name as worktype_name', 'da.name as aname', 'dat.name as atname', 'da.map_id', 'hlas.enter_time', 'hlas.leave_time', 'concat(timestampdiff(hour, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())), "时",timestampdiff(minute, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())) %60, "分",timestampdiff(second,hlas.enter_time,ifnull(hlas.leave_time,current_timestamp())) % 60,"秒") as retention_time'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '职务', '工种', '区域名称', '区域类型', '所属地图', '进入时间', '离开时间', '滞留时长']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'dse.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hlas.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'dse.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      name: 'dse.worktype_id',
      label: '工种',
      type: 'SELECT'
    },
    {
      name: 'da.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [
        {
          start: {
            name: 'hlas.enter_time'
          },
          end: {
            name: 'hlas.enter_time'
          },
          label: '进入时间-进入时间'
        },
        {
          start: {
            name: 'hlas.enter_time'
          },
          end: {
            name: 'hlas.leave_time'
          },
          label: '进入时间-离开时间'
        },
        {
          start: {
            name: 'hlas.leave_time'
          },
          end: {
            name: 'hlas.leave_time'
          },
          label: '离开时间-离开时间'
        }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hlas.enter_time', 'hlas.enter_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_location_area: {
    name: 'person_location_area',
    label: '人员区域时刻',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from(select hlas.area_id, count(distinct hlas.obj_id) as per_nums, hlas.map_id from his_location_area_staff hlas left join dat_staff_extend dse ON dse.staff_id = hlas.obj_id where hlas.area_id > 0 {exprString} group by hlas.area_id) aa',
    fields: {
      names: ['aa.area_id', 'aa.map_id', 'aa.per_nums'],
      types: ['SELECT', 'SELECT', 'NUMBER' ],
      labels: ['区域名称', '所属地图', '区域人数']
    },
    exprFields: [{
      name: 'hlas.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hlas.enter_time',
      label: '时刻',
      type: 'DATETIME'
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'momentTime',
        funFields: ['hlas.enter_time', 'hlas.leave_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_reader: {
    name: 'person_reader',
    label: '人员进出分站明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from his_location_reader_staff hlas inner join dat_staff ds on ds.staff_id = hlas.obj_id left join dat_reader dr on dr.reader_id = -hlas.area_id left join dat_area da on da.area_id = dr.area_id left join dat_staff_extend dse on dse.staff_id = ds.staff_id INNER JOIN dat_dept dd on dse.dept_id = dd.dept_id INNER JOIN dat_occupation doc on dse.occupation_id = doc.occupation_id INNER JOIN dat_reader_type drt on dr.reader_type_id = drt.reader_type_id where 1=1 and hlas.area_id < 0 {exprString} order by hlas.enter_time desc',
    fields: {
      names: ['dse.card_id', 'ds.staff_id as staff_id', 'ds.name', 'dd.name as dname', 'doc.name as oname', 'concat(dr.reader_id, "-",dr.name ) as nr_name', 'drt.name as rtname', 'da.map_id', 'hlas.enter_time', 'hlas.leave_time', 'concat(timestampdiff(hour, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())), "时",timestampdiff(minute, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())) %60, "分",timestampdiff(second,hlas.enter_time,ifnull(hlas.leave_time,current_timestamp())) % 60,"秒") as retention_time'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'STRING', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '职务', '分站名称', '分站类型', '所属地图', '进入时间', '离开时间', '滞留时长']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'dse.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dr.reader_id',
      label: '分站名称',
      type: 'SELECT'
    },
    {
      name: 'da.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      name: 'dse.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hlas.enter_time'
        },
        end: {
          name: 'hlas.enter_time'
        },
        label: '进入时间-进入时间'
      },
      {
        start: {
          name: 'hlas.enter_time'
        },
        end: {
          name: 'hlas.leave_time'
        },
        label: '进入时间-离开时间'
      },
      {
        start: {
          name: 'hlas.leave_time'
        },
        end: {
          name: 'hlas.leave_time'
        },
        label: '离开时间-离开时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hlas.enter_time', 'hlas.enter_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_absence: {
    name: 'person_absence',
    label: '人员未出勤明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from dat_staff ds left join dat_staff_extend dse2 on dse2.staff_id = ds.staff_id where ds.staff_id not in (select ras.staff_id from rpt_att_staff ras left join dat_staff_extend dse on dse.staff_id = ras.staff_id where 1=1 {exprString}){noexprString}',
    fields: {
      names: ['ds.staff_id', 'ds.name', 'dse2.card_id', 'dse2.dept_id', 'dse2.occupation_id'],
      types: ['NUMBER', 'STRING', 'STRING', 'SELECT', 'SELECT'],
      labels: ['员工编号', '姓名', '卡号', '部门', '职务']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'dse2.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse2.dept_id',
      label: '部门',
      type: 'SELECT'
    },
    {
      name: 'dse2.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'ras.att_date'
        },
        end: {
          name: 'ras.att_date'
        },
        label: '开始时间-结束时间'
      }]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'curretTime',
        funFields: ['ras.att_date']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_day: {
    name: 'person_day',
    label: '人员考勤日报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from rpt_att_staff as ras left join dat_staff as ds on ras.staff_id = ds.staff_id left join dat_staff_extend dse on dse.staff_id = ds.staff_id LEFT JOIN dat_shift da on da.shift_id = ras.shift_id INNER JOIN dat_dept dd ON dse.dept_id = dd.dept_id INNER JOIN dat_occupation doc ON dse.occupation_id = doc.occupation_id where 1=1 AND TIMESTAMPDIFF(MINUTE, ras.start_time, IFNULL(ras.end_time, CURRENT_TIMESTAMP())) >= 10 {exprString} group by ras.att_date,ras.staff_id,ras.shift_id,TIMESTAMPDIFF(MINUTE, IFNULL(ras.start_time, CURRENT_TIMESTAMP()),ras.end_time) >= da.min_minutes*60 order by min(ras.start_time) desc ',
    fields: {
      names: ['ras.card_id', 'ds.staff_id', 'ds.name', 'dd.name as dname', 'doc.name as oname', 'da.short_name as shift_name', 'date_format(min(ras.start_time),"%Y-%m-%d %H:%i:%s") as start_time', 'date_format(max(ras.end_time),"%Y-%m-%d %H:%i:%s") as end_time', 'count(ras.card_id) as m_count', 'cast(format(sum(timestampdiff(minute, ras.start_time, ras.end_time)/60.0), 1) as decimal(12,1)) as work_time', 'cast(format(sum(timestampdiff(minute, ras.start_time, ras.end_time))/60.0/count(ras.staff_id), 1) as decimal(12,1)) as avg_work_time'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'STRING', 'NUMBER', 'NUMBER'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '职务', '班次', '最早入井时间', '最后升井时间', '次数', '合计时长(时)', '平均时长(时)']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'ras.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dse.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      name: 'da.shift_id',
      label: '班次',
      type: 'SELECT'
    },
    // {
    //   name: 'is_enough',
    //   label: '是否足班',
    //   type: 'RADIO'
    // },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.start_time'
        },
        label: '最早入井时间-最早入井时间'
      },
      {
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '最早入井时间-最后升井时间'
      },
      {
        start: {
          name: 'ras.end_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '最后升井时间-最后升井时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['ras.start_time', 'ras.start_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_month: {
    name: 'person_month',
    label: '人员考勤月报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from ( select card_id,staff_id,att_date,start_time,timestampdiff(minute, min(start_time),max(ifnull(end_time, curtime()))) as dur, shift_id from rpt_att_staff where 1=1 {exprStringTime} group by card_id, att_date, shift_id) ras left join dat_staff ds on ds.staff_id = ras.staff_id left join dat_staff_extend dse on dse.staff_id = ras.staff_id left join dat_shift df on df.shift_id  = ras.shift_id where 1=1 and dse.staff_id is not null {exprString} group by ras.staff_id,ds.staff_id,dse.dept_id,dse.occupation_id order by dse.dept_id;',
    fields: {
      names: ['dse.staff_id', 'dse.card_id', 'dse.dept_id', 'date_format(ras.att_date, "%Y-%m") as month', 'count(ras.staff_id) as m_count', 'format(sum(dur/60.0),1) as work_time', 'format(sum(dur)/60.0/count(ras.staff_id),1) as avg_time', 'sum(case when df.short_name = 0 then 1 end) as zero', 'sum(case when df.short_name = 8 then 1 end) as eight', 'sum(case when df.short_name = 4 then 1 end) as four', 'group_concat(concat(month(ras.att_date) ,"-", day(ras.att_date),";", df.short_name )) as concat_day'],
      types: ['SELECT', 'SELECT', 'SELECT', 'MONTH', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'STRING'],
      labels: ['姓名', '卡号', '部门名称', '月份', '次数', '合计时长', '平均时长', '0点班', '8点班', '4点班', '上班']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'dse.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '部门名称',
      type: 'SELECT'
    },
    {
      type: 'MONTH',
      selectOptin: [{
        name: 'att_date',
        label: '月份'
      },
      {
        start: {
          name: 'att_date'
        },
        end: {
          name: 'att_date'
        },
        label: '开始时间-结束时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'dealMonth',
        funFields: ['att_date']
      }
    }],
    autoExec: true,
    needBreakdown: false,
    breakdown: { // 下钻配置
      opLabel: '明细', // 下钻按钮的文字
      targetQuery: 'month_detail',
      params: ['alarm_type_id', 'start_time', 'end_time'],
      exprList: [{
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '报警类型 = {alarm_type_id}',
        value: 'alarm_type_id = {alarm_type_id}'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 >= {start_time}',
        value: 'start_time >= "{start_time}"'
      },
      {
        type: 'EDITABLE',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 <= {end_time}',
        value: 'start_time <= "{end_time}"'
      }
      ]
    }
  },

  person_s_dept_day: {
    name: 'person_s_dept_day',
    label: '部门考勤日报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'SELECT {resultFields} FROM (SELECT ras.card_id, ras.staff_id,DATE_FORMAT(start_time,"%Y-%m-%d") day_time,shift_id,COUNT(shift_id) num, TIMESTAMPDIFF(MINUTE,start_time,end_time) minute_time, dse.dept_id, ras.start_time FROM rpt_att_staff ras left join dat_staff_extend dse on ras.staff_id = dse.staff_id  where 1=1 and dse.staff_id is not null and ras.end_time is not null {exprString} GROUP BY ras.card_id,ras.start_time,ras.shift_id )a GROUP BY a.card_id,a.day_time,a.shift_id;',
    fields: {
      names: ['a.staff_id', 'a.shift_id', 'a.num', 'a.dept_id', 'SUM(minute_time) as sm', 'case when sum(minute_time)>480 then "all" else "absence" end nn', 'a.start_time'],
      types: ['SELECT', 'SELECT', 'NUMBER', 'SELECT', 'STRING', 'STRING', 'DATETIME'],
      labels: ['部门名称', '全勤次数', '缺升井次数', '零点班次数', '八点班次数', '四点班次数', '平均工作时间(h)']
    },
    exprFields: [{
      name: 'dse.dept_id',
      label: '部门名称',
      type: 'SELECT'
    },
    {
      name: 'ras.att_date',
      label: '时间',
      type: 'DAY'
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'getDay',
        funFields: ['ras.att_date']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_s_dept_month: {
    name: 'person_s_dept_month',
    label: '部门考勤月报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'SELECT {resultFields} FROM (SELECT ras.card_id, ras.staff_id,DATE_FORMAT(start_time,"%Y-%m-%d") day_time,shift_id,COUNT(shift_id) num, TIMESTAMPDIFF(MINUTE,start_time,end_time) minute_time, dse.dept_id, ras.start_time FROM rpt_att_staff ras left join dat_staff_extend dse on ras.staff_id = dse.staff_id  where 1=1 and dse.staff_id is not null {exprString} GROUP BY ras.card_id,ras.start_time,ras.shift_id )a GROUP BY a.card_id,a.day_time,a.shift_id;',
    fields: {
      names: ['a.staff_id', 'a.shift_id', 'a.num', 'a.dept_id', 'SUM(minute_time) as sm', 'case when sum(minute_time)>480 then "all" else "absence" end nn', 'a.start_time'],
      types: ['SELECT', 'SELECT', 'NUMBER', 'SELECT', 'STRING', 'STRING', 'DATETIME'],
      labels: ['部门名称', '全勤次数', '缺升井次数', '零点班次数', '八点班次数', '四点班次数', '平均工作时间(h)']
    },
    exprFields: [{
      name: 'dse.dept_id',
      label: '部门名称',
      type: 'SELECT'
    },
    {
      type: 'MONTH',
      selectOptin: [{
        name: 'att_date',
        label: '月份'
      },
      {
        start: {
          name: 'att_date'
        },
        end: {
          name: 'att_date'
        },
        label: '开始时间-结束时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'dealMonth',
        funFields: ['ras.att_date']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_dept_period: {
    name: 'person_dept_period',
    label: '部门时段查询',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select dse.dept_id,count(distinct ras.staff_id) per_nums,sum(case when ras.shift_id = 1 then 1 else 0 end) shifta,sum(case when ras.shift_id = 2 then 1 else 0 end) shiftb,sum(case when ras.shift_id = 3 then 1 else 0 end) shiftc,round(sum(case when ras.shift_id = 1 then timestampdiff(minute,ras.start_time,ras.end_time) else 0 end)/60/sum(case when ras.shift_id = 1 then 1 else 0 end),2) worktimea, round(sum(case when ras.shift_id = 2 then timestampdiff(minute,ras.start_time,ras.end_time) else 0 end)/60/sum(case when ras.shift_id = 2 then 1 else 0 end),2) worktimeb,round(sum(case when ras.shift_id = 3 then timestampdiff(minute,ras.start_time,ras.end_time) else 0 end)/60/sum(case when ras.shift_id = 3 then 1 else 0 end),2) worktimec,count(*) nums,round(count(*)/count(distinct ras.staff_id),2) avg_num,round(sum(timestampdiff(MINUTE,ras.start_time,ras.end_time)/60),1) sum_time, round(sum(timestampdiff(minute,ras.start_time,ras.end_time))/60/ count(distinct ras.staff_id),2) avg_time, round(sum(timestampdiff(minute,ras.start_time,ras.end_time))/60/ count(distinct ras.staff_id),2) avg_worktime, min(ras.start_time) as start_time, max(ras.end_time) as end_time from rpt_att_staff ras left join dat_staff_extend dse on dse.staff_id = ras.staff_id where 1=1 {exprString} group by dse.dept_id) dp',
    fields: {
      names: ['dp.dept_id', 'dp.per_nums', 'dp.nums', 'dp.shifta', 'dp.shiftb', 'dp.shiftc', 'dp.worktimea', 'dp.worktimeb', 'dp.worktimec', 'dp.avg_num', 'dp.sum_time', 'dp.avg_time', 'dp.start_time', 'dp.end_time'],
      types: ['SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME'],
      labels: ['部门名称', '人数', '下井总人次', '零点班', '八点班', '四点班', '零点班平均时长(h)', '八点班平均时长(h)', '四点班平均时长(h)', '平均下井次数', '下井总时长(h)', '平均下井时长(h)', '最早下井时间', '最后出井时间']
    },
    exprFields: [{
      name: 'dse.dept_id',
      label: '部门名称',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.start_time'
        },
        label: '最早下井时间-最早下井时间'
      },
      {
        start: {
          name: 'ras.start_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '最早下井时间-最后出井时间'
      },
      {
        start: {
          name: 'ras.end_time'
        },
        end: {
          name: 'ras.end_time'
        },
        label: '最后出井时间-最后出井时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['ras.start_time', 'ras.start_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_well_overtime: {
    name: 'person_well_overtime',
    label: '人员井下超时告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 13) hed left join (select event_id,cur_time from his_event_data where stat = 100 and event_type_id = 13) hed1 on hed.event_id = hed1.event_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_staff_extend s on s.card_id = hed.obj_id left join dat_staff ds on ds.staff_id = s.staff_id left join rpt_att_staff ras on ras.staff_id = ds.staff_id and case when isnull(ras.end_time) then hed.cur_time > ras.start_time else hed.cur_time BETWEEN ras.start_time AND ras.end_time end left join dat_dept d on d.dept_id = s.dept_id left join (select distinct card_id from his_card_batlog where 1=1 {batlogExprString}) aa on hed.obj_id = aa.card_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['s.card_id', 'ds.name', 'ifnull(d.name, " ")', 's.occupation_id', 'hed.map_id', 'ifnull(date_format(ras.start_time, "%Y-%m-%d %H:%i:%s"), " ") as start_time', 'hed.cur_time', 'ifnull(date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s"), " ") as end_time', 'CONCAT(FLOOR(hed.limit_value/60), ":", MOD(hed.limit_value,60)) as limit_value', 'CONCAT(FLOOR(hed.cur_value/60), ":", MOD(hed.cur_value,60)) as cur_value', 'case when aa.card_id is null then "否" else "是" end as isbat'],
      types: ['NUMBER', 'STRING', 'STRING', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'DATETIME', 'STRING', 'STRING', 'STRING'],
      labels: ['卡号', '姓名', '所属部门', '职务', '所属地图', '入井时间', '开始告警时间', '结束告警时间', '规定时长', '实际时长', '充放电']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 's.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 's.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      name: 's.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_area_overtime: {
    name: 'person_area_overtime',
    label: '人员区域超时告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 15) hed left join (select event_id,cur_time from his_event_data where stat = 100 and event_type_id = 15) hed1 on hed.event_id = hed1.event_id left join dat_staff_extend s on s.card_id = hed.obj_id left join his_location_area_staff hlas on hlas.obj_id = s.staff_id and hed.cur_time between hlas.enter_time and hlas.leave_time and hlas.area_id = hed.area_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['hed.obj_id', 's.staff_id', 's.dept_id', 's.occupation_id', 'hed.area_id', 'hed.map_id', 'hlas.enter_time', 'hed.cur_time', 'hed1.cur_time as end_time', 'round(hed.limit_value/60, 2) as limit_value', 'round(hed.cur_value/60,2) as cur_value'],
      types: ['NUMBER', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'DATETIME', 'NUMBER', 'STRING'],
      labels: ['卡号', '姓名', '所属部门', '职务', '区域名称', '所属地图', '进入区域时间', '开始告警时间', '结束告警时间', '规定时长(时)', '实际时长(时)']
    },
    exprFields: [{
      name: 's.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 's.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 's.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 's.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      name: 's.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_well_overcount: {
    name: 'person_well_overcount',
    label: '人员井下超员告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 1) hed left join (select event_id,cur_time from his_event_data where stat = 100 and event_type_id = 1) hed1 on hed.event_id = hed1.event_id left join dat_staff_extend s on s.card_id = hed.obj_id left join dat_event_type et on hed.event_type_id = et.event_type_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['et.name', 'hed.limit_value', 'hed.cur_value', 'date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time'],
      types: ['STRING', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME'],
      labels: ['告警名称', '限制人员数', '实际人员数', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false, // 是否需要下钻？
    autoExec: true,
    breakdown: { // 下钻配置
      opLabel: '详情', // 下钻按钮的文字
      targetQuery: 'v_overcount_detail',
      params: ['start_time', 'end_time'],
      exprList: [{
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 >= {start_time}',
        value: 'att.start_time >= "{start_time}"'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 <= {end_time}',
        value: 'att.start_time <= "{end_time}"'
      }
      ]
    }
  },

  person_area_overcount: {
    name: 'person_area_overcount',
    label: '人员区域超员告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 3) hed left join (select event_id,cur_time from his_event_data where stat = 100 and event_type_id = 3) hed1 on hed.event_id = hed1.event_id left join dat_staff_extend s on s.card_id = hed.obj_id left join dat_event_type et on hed.event_type_id = et.event_type_id left join dat_area a on a.area_id = hed.area_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['et.name', 'a.name as an', 'hed.map_id', 'hed.limit_value', 'hed.cur_value', 'hed.cur_time', 'ifnull(date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s"), "") as end_time'],
      types: ['STRING', 'STRING', 'SELECT', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME'],
      labels: ['告警名称', '告警区域', '所属地图', '限制人员数', '实际人员数', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'a.area_id',
      label: '告警区域',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false, // 是否需要下钻？
    autoExec: true,
    breakdown: { // 下钻配置
      opLabel: '详情', // 下钻按钮的文字
      targetQuery: 'v_overcount_detail',
      params: ['start_time', 'end_time'],
      exprList: [{
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 >= {start_time}',
        value: 'att.start_time >= "{start_time}"'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 <= {end_time}',
        value: 'att.start_time <= "{end_time}"'
      }
      ]
    }
  },

  person_call_help: {
    name: 'person_call_help',
    label: '人员井下呼救告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (SELECT * FROM his_event_data WHERE stat = 0 AND event_type_id = 24) hed left join (SELECT event_id,cur_time FROM his_event_data WHERE stat = 100 AND event_type_id = 24) hed1 on hed.event_id = hed1.event_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_staff_extend s on s.card_id = hed.obj_id left join dat_staff ds on ds.staff_id = s.staff_id left join rpt_att_staff ras on ras.staff_id = ds.staff_id and hed.cur_time between ras.start_time and ras.end_time left join dat_dept d on d.dept_id = s.dept_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['s.card_id', 'ds.name', 's.dept_id', 's.occupation_id', 'hed.map_id', 'date_format(ras.start_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as cur_time', 'date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time'],
      types: ['STRING', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'DATETIME'],
      labels: ['卡号', '姓名', '所属部门', '职务', '所属地图', '入井时间', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 's.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 's.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 's.occupation_id',
      label: '职务',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_card_battery_alarm: {
    name: 'person_card_battery_alarm',
    label: '人卡电量低告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 12) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100 and event_type_id = 12)  hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id inner join dat_staff_extend ds on hed.obj_id = ds.card_id left join dat_staff dd on ds.staff_id = dd.staff_id left join dat_event_type et on hed.event_type_id = et.event_type_id left join (select distinct card_id from his_card_batlog where 1=1 {batlogExprString}) aa on hed.obj_id = aa.card_id where 1=1 {exprString} ',
    fields: {
      names: ['hed.obj_id as card_id', 'ds.staff_id', 'dd.name', 'ds.dept_id', 'hed.map_id', 'et.name as et_name', 'hed.cur_time', 'hed1.cur_time as hedc', 'case when aa.card_id is null then "否" else "是" end as isbat'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '所属地图', '告警类型', '开始告警时间', '结束告警时间', '充放电']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'hed.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'ds.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_fixed_alarm: {
    name: 'person_fixed_alarm',
    label: '人卡静止不动告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 32) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100 and event_type_id = 32)  hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id inner join dat_staff_extend ds on hed.obj_id = ds.card_id left join dat_staff dd on ds.staff_id = dd.staff_id left join dat_event_type et on hed.event_type_id = et.event_type_id where 1=1 {exprString} ',
    fields: {
      names: ['hed.obj_id as card_id', 'ds.staff_id', 'dd.name', 'ds.dept_id', 'hed.map_id', 'et.name as et_name', 'hed.cur_time', 'hed1.cur_time as hedc'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '所属地图', '告警类型', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'hed.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'ds.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_area_limited: {
    name: 'person_area_limited',
    label: '人员进入限制区域告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 19) hed left join (select event_id, cur_time from his_event_data where stat = 100 and event_type_id = 19) hed1 on hed.event_id = hed1.event_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_staff_extend s on s.card_id = hed.obj_id left join dat_staff ds on ds.staff_id = s.staff_id left join rpt_att_staff ras on ras.staff_id = ds.staff_id and hed.cur_time between ras.start_time and ras.end_time left join dat_area da on da.area_id = hed.area_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['hed.obj_id', 'ds.name', 's.dept_id', 'hed.area_id', 'da.area_type_id', 'hed.map_id', 'hed.cur_time', 'hed1.cur_time as end_time', 'timestampdiff(minute, hed.cur_time, hed1.cur_time) as retime'],
      types: ['NUMBER', 'STRING', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '姓名', '所属部门', '区域名称', '区域类型', '所属地图', '开始告警时间', '结束告警时间', '滞留时长（分钟）']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'sta.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 's.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },    
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_driver_car_limited: {
    name: 'person_driver_car_limited',
    label: '工作面司机与车卡距离告警',
    needDisplay: 1,
    // sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 22) hed left join (select event_id, cur_time from his_event_data where stat=100 and event_type_id = 22) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_vehicle dv on dv.vehicle_id = v.vehicle_id left join  (select * from dat_shift where shift_type_id = 1) s on (((s.start_time < s.end_time) and (time(hed.cur_time)  >= s.start_time and time(hed.cur_time)  < s.end_time)) or ((s.start_time > s.end_time) and (time(hed.cur_time) >=s.start_time or time(hed.cur_time) <s.end_time))) left join dat_driver_arrange dda on dda.vehicle_id = v.vehicle_id and dda.driver_date = date(hed.cur_time) and dda.shift_id = s.shift_id where 1=1 and dda.name is not null {exprString} order by hed.cur_time desc;',
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 37) hed left join (select event_id, cur_time from his_event_data where stat=100 and event_type_id = 37) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_vehicle dv on dv.vehicle_id = v.vehicle_id left join  (select * from dat_shift where shift_type_id = 1) s on (((s.start_time < s.end_time) and (time(hed.cur_time)  >= s.start_time and time(hed.cur_time)  < s.end_time)) or ((s.start_time > s.end_time) and (time(hed.cur_time) >=s.start_time or time(hed.cur_time) <s.end_time))) left join dat_driver_arrange dda on dda.vehicle_id = v.vehicle_id and dda.driver_date = date(hed.cur_time) and dda.shift_id = s.shift_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['v.card_id', 'dda.name', 'dda.dept_id', 'dv.vehicle_id', 'dv.vehicle_type_id', 'hed.area_id', 'hed.map_id', 'hed.cur_time', 'hed1.cur_time hcu', 'concat(timestampdiff(minute, hed.cur_time, ifnull(hed1.cur_time, current_timestamp()))%60, "分", timestampdiff(second, hed.cur_time, ifnull(hed1.cur_time, current_timestamp()))%60, "秒") as dur'],
      types: ['STRING', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '司机', '所属部门', '车牌名称', '车辆类型', '区域名称', '所属地图', '开始告警时间', '结束告警时间', '超距时长']
    },
    exprFields: [{
      name: 'dda.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'dda.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'v.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dda.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_id',
      label: '车牌名称',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],

    needBreakdown: false,
    autoExec: true
  },

  person_time: {
    name: 'person_time',
    label: '人员井下时刻明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select staff_id, start_time, end_time from rpt_att_staff where {exprString1}) aa left join dat_staff_extend dse on aa.staff_id = dse.staff_id left join dat_staff ds on aa.staff_id = ds.staff_id where 1=1 {exprString} order by aa.start_time;',
    fields: {
      names: ['aa.staff_id', 'ds.name', 'dse.card_id', 'dse.dept_id', 'dse.occupation_id'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'SELECT', 'SELECT'],
      labels: ['员工编号', '姓名', '卡号', '部门', '职务']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'dse.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '部门',
      type: 'SELECT'
    },
    {
      name: 'start_time',
      label: '时刻',
      type: 'DATETIME'
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'pmomentTime',
        funFields: ['start_time', 'end_time', 'begin_time', 'last_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  person_reader_detail: {
    name: 'person_reader_detail',
    label: '人员分站告警明细查询',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: {
      staff: {
        'alarmSql': `select s.staff_id as rsID,ds.name, hed.event_type_id, DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s") as start_time, DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time, "/" as auto from ( select * from his_event_data where stat = 0 ) hed left join ( select event_id,cur_time, event_type_id from his_event_data where stat = 100 ) hed1 on hed.event_id = hed1.event_id and hed.event_type_id = hed1.event_type_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_staff_extend s ON s.card_id = hed.obj_id left join dat_staff ds ON ds.staff_id = s.staff_id where 1=1 {exprString} order by hed.cur_time desc;`,
        'wellSql': `select s.staff_id as rsID,s.name , "升入井" as event_type_id, DATE_FORMAT(ras.start_time, "%Y-%m-%d %H:%i:%s") as start_time, DATE_FORMAT(ras.end_time, "%Y-%m-%d %H:%i:%s") as end_time, CASE WHEN ras.is_auto = 0 AND ras.end_time IS NOT NULL THEN "正常" WHEN ras.is_auto = 1 THEN "手动升井" WHEN ras.is_auto = 2 THEN "强制升井" ELSE " " END as auto from rpt_att_staff ras left join dat_staff s on s.staff_id = ras.staff_id where 1=1 {exprString} order by ras.start_time desc;`
      },
      reader: 'select cast(r.reader_id as signed) as rsID,r.name,hed.event_type_id, IFNULL(DATE_FORMAT(hed.cur_time, "%Y-%m-%d %H:%i:%s"), " ") as start_time, IFNULL(DATE_FORMAT(hed1.cur_time, "%Y-%m-%d %H:%i:%s"), " ") as end_time, "/" as auto from ( select * from his_event_data where stat=0) hed left join ( select event_id, obj_id, cur_time, event_type_id from his_event_data where stat=100 ) hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id and hed.event_type_id = hed1.event_type_id inner join dat_reader r ON hed.obj_id = r.reader_id where 1=1 {exprString} order by hed.cur_time desc;'
    },
    fields: {
      names: ['rsID', 'name', 'hed.event_type_id', 'start_time', 'end_time', 'auto'],
      types: ['NUMBER', 'STRING', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['ID', '名称', '类型', '开始时间', '结束时间', '升井方式']
    },
    exprFields: [{
      name: 's.staff_idORr.reader_id',
      label: '名称',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始时间-开始时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始时间-结束时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束时间-结束时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: false
  },

  person_leave_early: {
    name: 'person_leave_early',
    label: '人员早退告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 47) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100 and event_type_id = 47)  hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id inner join dat_staff_extend ds on hed.obj_id = ds.card_id left join dat_staff dd on ds.staff_id = dd.staff_id left join dat_event_type et on hed.event_type_id = et.event_type_id where 1=1 {exprString} ',
    fields: {
      names: ['hed.obj_id as card_id', 'ds.staff_id', 'dd.name', 'ds.dept_id', 'hed.map_id', 'et.name as et_name', 'hed.cur_time', 'hed1.cur_time as hedc'],
      types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME'],
      labels: ['卡号', '员工编号', '姓名', '所属部门', '所属地图', '告警类型', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'ds.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'ds.staff_id',
      label: '姓名',
      type: 'SELECT'
    },
    {
      name: 'hed.obj_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'ds.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  rept_car_whole: {
    name: 'rept_car_whole',
    label: '整体出车情况',
    needDisplay: 1,
    sqlTmpl: '',
    fields: {
      names: [],
      types: [],
      labels: []
    },
    exprFields: [{
      type: 'MONTH',
      selectOptin: [{
        name: 'rav.att_date',
        label: '月份'
      }]
    }],
    needBreakdown: false,
    autoExec: true
  },

  vehicle_updown_mine: {
    name: 'vehicle_updown_mine',
    label: '车辆出车明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from rpt_att_vehicle rav left join dat_vehicle dv on dv.vehicle_id = rav.vehicle_id left join dat_vehicle_extend dve on dve.vehicle_id = rav.vehicle_id left join dat_shift ds on ds.shift_id = rav.shift_id where 1=1 {exprString} and dv.vehicle_type_id <> 25 and dv.vehicle_type_id <> 26 order by rav.start_time desc;',
    fields: {
      names: ['rav.card_id', 'ds.short_name as shift_name', 'dve.dept_id', 'dv.vehicle_id', 'dv.vehicle_type_id', 'date_format(rav.start_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(rav.end_time, "%Y-%m-%d %H:%i:%s") as end_time'],
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME'],
      labels: ['车卡号', '班次', '所属部门', '车辆名称', '车辆类型', '出车时间', '回车时间']
    },
    exprFields: [{
      name: 'rav.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'dve.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'ds.shift_id',
      label: '班次',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'rav.start_time'
        },
        end: {
          name: 'rav.start_time'
        },
        label: '出车时间-出车时间'
      },
      {
        start: {
          name: 'rav.start_time'
        },
        end: {
          name: 'rav.end_time'
        },
        label: '出车时间-回车时间'
      },
      {
        start: {
          name: 'rav.end_time'
        },
        end: {
          name: 'rav.start_time'
        },
        label: '回车时间-回车时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['rav.start_time', 'rav.start_time']
      }
    }],
    needBreakdown: false, // 是否需要下钻？
    breakdown: { // 下钻配置
      opLabel: '轨迹', // 下钻按钮的文字
      targetQuery: 'v_track_detail',
      params: ['card_id', 'start_time', 'end_time'], // 注意：这里的参数，和下面的表达式需要一一对应，即第一个参数，对应第一个表达式
      exprList: [{
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '卡号 = {card_id}',
        value: 'card_id = {card_id}'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 >= {start_time}',
        value: 'cur_time >= "{start_time}"'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 <= {end_time}',
        value: 'cur_time <= "{end_time}"'
      }
      ]
    },
    autoExec: true // 当切换到当前报表时，是否自动执行查询操作
  },

  vehicle_no_updown_mine: {
    name: 'vehicle_no_updown_mine',
    label: '车辆未出车明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from dat_vehicle dv2 left join  dat_vehicle_extend dve on dve.vehicle_id = dv2.vehicle_id where dv2.vehicle_id not in (select rav.vehicle_id from rpt_att_vehicle rav left join dat_vehicle_extend dv on dv.vehicle_id = rav.vehicle_id where 1=1 {exprString}) {noexprString} and dv2.vehicle_type_id <> 25 and dv2.vehicle_type_id <> 26 and dve.card_id is not null',
    fields: {
      names: ['dve.card_id', 'dv2.vehicle_id', 'dv2.vehicle_type_id', 'dve.dept_id'],
      types: ['STRING', 'SELECT', 'SELECT', 'SELECT'],
      labels: ['车卡号', '车辆名称', '车辆类型', '部门']
    },
    exprFields: [{
      name: 'dve.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dv2.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'rav.att_date'
        },
        end: {
          name: 'rav.att_date'
        },
        label: '开始时间-结束时间'
      }]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['rav.att_date', 'rav.att_date']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  area: {
    name: 'his_area',
    label: '车辆进出区域明细',
    sign: 1,
    sqlTmpl: 'select {resultFields} from dat_vehicle dv left join dat_vehicle_extend dve on dve.vehicle_id = dv.vehicle_id left join his_location_area_vehicle hlav on dve.vehicle_id = hlav.obj_id left join dat_area da on da.area_id = hlav.area_id where 1=1 AND TIMESTAMPDIFF(SECOND,enter_time, IFNULL(leave_time, CURRENT_TIMESTAMP())) >= 20 and hlav.area_id >= 0 {exprString} order by hlav.enter_time desc;',
    fields: {
      names: ['dve.card_id', 'dv.vehicle_id', 'dv.vehicle_type_id', 'dve.dept_id', 'hlav.area_id', 'da.area_type_id', 'hlav.map_id', 'date_format(hlav.enter_time, "%Y-%m-%d %H:%i:%s") as start_time', 'date_format(hlav.leave_time, "%Y-%m-%d %H:%i:%s") as end_time', 'concat(timestampdiff(hour, enter_time, ifnull(leave_time, current_timestamp())), "时", timestampdiff(minute,enter_time, ifnull(leave_time, current_timestamp())) %60, "分", timestampdiff(second,enter_time, ifnull(leave_time, current_timestamp())) % 60,"秒") as retention_time'],
      types: ['STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['车卡号', '车辆名称', '车辆类型', '所属部门', '区域名称', '区域类型', '所属地图', '进入时间', '离开时间', '滞留时长']
    },
    exprFields: [{
      name: 'dve.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'dve.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      name: 'da.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hlav.map_id',
      label: '区域',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hlav.enter_time'
        },
        end: {
          name: 'hlav.enter_time'
        },
        label: '进入时间-进入时间'
      },
      {
        start: {
          name: 'hlav.enter_time'
        },
        end: {
          name: 'hlav.leave_time'
        },
        label: '进入时间-离开时间'
      },
      {
        start: {
          name: 'hlav.leave_time'
        },
        end: {
          name: 'hlav.leave_time'
        },
        label: '离开时间-离开时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hlav.enter_time', 'hlav.enter_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  v_reader: {
    name: 'v_reader',
    label: '车辆进出分站明细',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from his_location_reader_vehicle hlas inner join dat_vehicle ds on ds.vehicle_id = hlas.obj_id left join dat_reader dr on dr.reader_id = -hlas.area_id left join dat_area da on da.area_id = dr.area_id left join dat_vehicle_extend dse on dse.vehicle_id = ds.vehicle_id where 1=1 and hlas.area_id < 0 {exprString} order by hlas.enter_time desc',
    fields: {
      names: ['dse.card_id', 'ds.vehicle_id', 'dse.dept_id', 'concat(dr.name, "-", dr.reader_id) as nr_name', 'dr.reader_type_id', 'da.map_id', 'hlas.enter_time', 'hlas.leave_time', 'concat(timestampdiff(hour, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())), "时",timestampdiff(minute, hlas.enter_time, ifnull(hlas.leave_time, current_timestamp())) %60, "分",timestampdiff(second,hlas.enter_time,ifnull(hlas.leave_time,current_timestamp())) % 60,"秒") as retention_time'],
      types: ['NUMBER', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['车卡号', '车牌名称', '所属部门', '分站名称', '分站类型', '所属地图', '进入时间', '离开时间', '滞留时长']
    },
    exprFields: [{
      name: 'dse.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'ds.vehicle_id',
      label: '车牌名称',
      type: 'SELECT'
    },
    {
      name: 'dse.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'dr.reader_id',
      label: '分站名称',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hlas.enter_time'
        },
        end: {
          name: 'hlas.enter_time'
        },
        label: '进入时间-进入时间'
      },
      {
        start: {
          name: 'hlas.enter_time'
        },
        end: {
          name: 'hlas.leave_time'
        },
        label: '进入时间-离开时间'
      },
      {
        start: {
          name: 'hlas.leave_time'
        },
        end: {
          name: 'hlas.leave_time'
        },
        label: '离开时间-离开时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hlas.enter_time', 'hlas.enter_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  v_vehicle_day: {
    name: 'v_vehicle_day',
    label: '车辆考勤日报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from rpt_att_vehicle rav left join dat_vehicle dv on rav.vehicle_id = dv.vehicle_id left join dat_vehicle_extend dve on dve.vehicle_id = dv.vehicle_id LEFT JOIN dat_vehicle_type dvt on dv.vehicle_type_id = dvt.vehicle_type_id LEFT JOIN dat_driver_arrange dda ON rav.vehicle_id = dda.vehicle_id AND rav.att_date = dda.driver_date LEFT JOIN dat_shift dsh ON dsh.shift_id = rav.shift_id where 1=1 {exprString} and dv.vehicle_type_id <> 25 and dv.vehicle_type_id <> 26 GROUP BY rav.start_time,dv.vehicle_id order by dv.vehicle_id,rav.start_time;',
    fields: {
      names: ['dv.name as vname', 'dvt.name as vtname', 'dda.name', 'dve.dept_id', 'date_format(rav.start_time, "%Y-%m-%d %H:%i") as stime', 'date_format(rav.end_time, "%Y-%m-%d %H:%i") as etime', 'format(sum(timestampdiff(minute, rav.start_time, rav.end_time)/60.0), 1) as work_time'],
      types: ['SELECT', 'STRING', 'STRING', 'SELECT', 'DATETIME', 'DATETIME', 'NUMBER'],
      labels: ['车辆名称', '车辆类型', '司机', '所属部门', '最早出车时间', '最后回车时间', '合计时长(时)']
    },
    exprFields: [{
      name: 'dve.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      name: 'dsh.shift_id',
      label: '班次',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'rav.start_time'
        },
        end: {
          name: 'rav.start_time'
        },
        label: '最早出车时间-最早出车时间'
      },
      {
        start: {
          name: 'rav.start_time'
        },
        end: {
          name: 'rav.end_time'
        },
        label: '最早出车时间-最后回车时间'
      },
      {
        start: {
          name: 'rav.end_time'
        },
        end: {
          name: 'rav.end_time'
        },
        label: '最后回车时间-最后回车时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['rav.start_time', 'rav.start_time']
      }
    }],
    needBreakdown: true,
    autoExec: true,
    breakdown: { // 下钻配置
      opLabel: '明细', // 下钻按钮的文字
      targetQuery: 'v_vehicle_day_detail',
      params: ['vehicle_id', 'date_format(min(rav.start_time), "%m-%d %H:%i") as start_time', 'date_format(max(rav.end_time), "%m-%d %H:%i") as end_time'],
      exprList: [{
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '车辆名称 = {vehicle_id}',
        value: 'dv.vehicle_id = {vehicle_id}'
      },
      {
        type: 'FIXED',
        logicLabel: '并且',
        logicValue: 'and',
        label: '开始时间 >= {date_format(min(rav.start_time), "%m-%d %H:%i")}',
        value: 'date_format(rav.start_time, "%m-%d %H:%i") >= "{date_format(min(rav.start_time), "%m-%d %H:%i")}"'
      },
      {
        type: 'EDITABLE',
        logicLabel: '并且',
        logicValue: 'and',
        label: '结束时间 <= {date_format(max(rav.end_time), "%m-%d %H:%i")}',
        value: 'date_format(rav.end_time, "%m-%d %H:%i") <= "{date_format(max(rav.end_time), "%m-%d %H:%i")}"'
      }
      ]
    }
  },

  v_vehicle_month: {
    name: 'v_vehicle_month',
    label: '车辆考勤月报',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select vehicle_id,att_date,timestampdiff(minute, min(start_time),max(ifnull(end_time, curtime()))) as dur,shift_id from rpt_att_vehicle group by vehicle_id, att_date, shift_id) rav left join dat_vehicle dv on rav.vehicle_id = dv.vehicle_id left join dat_vehicle_extend dve on dve.vehicle_id = dv.vehicle_id left join dat_shift ds on ds.shift_id = rav.shift_id where 1=1 {exprString} and dv.vehicle_type_id <> 25 and dv.vehicle_type_id <> 26 group by dv.vehicle_id,dv.vehicle_type_id,date_format(rav.att_date, "%Y-%m") order by dve.dept_id;',
    fields: {
      names: ['dv.vehicle_id', 'dv.vehicle_type_id', 'dve.dept_id', 'date_format(rav.att_date, "%Y-%m") as month', 'count(rav.vehicle_id) as m_count', 'format(sum(dur/60.0), 1) as work_time', 'format(sum(dur/60.0)/count(rav.vehicle_id), 1) as avg_work_time', 'group_concat(concat(month(rav.att_date) ,"-", day(rav.att_date),";", ds.short_name )) as concat_day'],
      types: ['SELECT', 'SELECT', 'SELECT', 'MONTH', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING'],
      labels: ['车牌名称', '车辆类型', '部门名称', '月份', '次数', '合计时长', '平均时长', '工作']
    },
    exprFields: [{
      name: 'dve.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_id',
      label: '车牌名称',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      type: 'MONTH',
      selectOptin: [{
        name: 'rav.att_date',
        label: '月份'
      },
      {
        start: {
          name: 'rav.att_date'
        },
        end: {
          name: 'rav.att_date'
        },
        label: '开始时间-结束时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'dealMonth',
        funFields: ['rav.att_date']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  v_overspeed: {
    name: 'v_overspeed',
    label: '车辆超速告警',
    sign: 1,
    needDisplay: 1,
    // sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 22) hed left join (select event_id, cur_time from his_event_data where stat=100 and event_type_id = 22) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_vehicle dv on dv.vehicle_id = v.vehicle_id left join  (select * from dat_shift where shift_type_id = 1) s on (((s.start_time < s.end_time) and (time(hed.cur_time)  >= s.start_time and time(hed.cur_time)  < s.end_time)) or ((s.start_time > s.end_time) and (time(hed.cur_time) >=s.start_time or time(hed.cur_time) <s.end_time))) left join dat_driver_arrange dda on dda.vehicle_id = v.vehicle_id and dda.driver_date = date(hed.cur_time) and dda.shift_id = s.shift_id where 1=1 and dda.name is not null {exprString} order by hed.cur_time desc;',
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and (event_type_id IN (21,22))) hed left join (select event_id, cur_time from his_event_data where stat=100 and (event_type_id IN (21,22))) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_vehicle dv on dv.vehicle_id = v.vehicle_id left join  (select * from dat_shift where shift_type_id = 1) s on (((s.start_time < s.end_time) and (time(hed.cur_time)  >= s.start_time and time(hed.cur_time)  < s.end_time)) or ((s.start_time > s.end_time) and (time(hed.cur_time) >=s.start_time or time(hed.cur_time) <s.end_time))) left join dat_driver_arrange dda on dda.vehicle_id = v.vehicle_id and dda.driver_date = date(hed.cur_time) and dda.shift_id = s.shift_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['v.card_id', 'dda.name', 'dda.dept_id', 'dv.vehicle_id', 'dv.vehicle_type_id', 'hed.area_id', 'hed.map_id', 'hed.limit_value', 'hed.cur_value', 'hed.cur_time', 'hed1.cur_time as hcu', 'concat(TIMESTAMPDIFF(minute, hed.cur_time, ifnull(hed1.cur_time, current_timestamp()))%60, "分", TIMESTAMPDIFF(second, hed.cur_time, ifnull(hed1.cur_time, current_timestamp()))%60, "秒") as dur'],
      types: ['STRING', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['车卡号', '司机', '所属部门', '车辆名称', '车辆类型', '区域名称', '所属地图', '限制车速(Km/h)', '实际车速(Km/h)', '开始告警时间', '结束告警时间', '超时时长']
    },
    exprFields: [{
      name: 'v.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'dda.dept_id',
      label: '所属部门',
      type: 'SELECT'
    },
    {
      name: 'v.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'dv.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  v_area_limited: {
    name: 'vehicle_enter_limit_area',
    label: '出入禁止区域',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat = 0 and event_type_id = 20) hed left join (select event_id, cur_time from his_event_data where stat = 100 and event_type_id = 20) hed1 on hed.event_id = hed1.event_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_vehicle_extend s on s.card_id = hed.obj_id left join dat_vehicle ds on ds.vehicle_id = s.vehicle_id left join rpt_att_vehicle ras on ras.vehicle_id = ds.vehicle_id and hed.cur_time between ras.start_time and ras.end_time left join dat_driver_arrange dda on dda.driver_date = date_format(hed.cur_time, "%Y-%m-%d") and dda.vehicle_id = ds.vehicle_id left join dat_area da on da.area_id = hed.area_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['hed.obj_id', 'ds.vehicle_id', 'dda.name', 'ds.vehicle_type_id', 's.dept_id', 'hed.area_id', 'da.area_type_id', 'hed.map_id', 'hed.cur_time', 'ifnull(date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s"),"") as end_time', 'timestampdiff(minute, hed.cur_time, hed1.cur_time) as retime'],
      types: ['NUMBER', 'SELECT', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME', 'STRING'],
      labels: ['卡号', '车辆名称', '司机', '车辆类型', '所属部门', '区域名称', '区域类型', '所属地图', '开始告警时间', '结束告警时间', '滞留时长(分钟)']
    },
    exprFields: [{
      name: 'v.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'ds.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'ds.vehicle_type_id',
      label: '车辆类型',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  t_s_distance_limited: {
    name: 'tbm_substation_distance_limited',
    label: '掘进机与分站距离超限告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 28) hed left join (select event_id, cur_time from his_event_data where stat=100 and event_type_id = 28) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v ON v.card_id = hed.obj_id left join dat_drivingface_vehicle ddv ON ddv.vehicle_id = v.vehicle_id left join dat_drivingface ddf on ddf.drivingface_id = ddv.drivingface_id where 1=1 {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['v.card_id', 'v.vehicle_id', 'hed.area_id', 'hed.map_id', 'hed.limit_value', 'hed.cur_value', 'hed.cur_time', 'hed1.cur_time as hcu'],
      types: ['NUMBER', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME' ],
      labels: ['卡号', '车辆名称', '工作面名称', '所属地图', '告警阈值', '告警当前值', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'v.card_id',
      label: '卡号',
      type: 'SELECT'
    },
    {
      name: 'v.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '工作面名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  c_e_zhuiwei: {
    name: 'car_end_zhuiwei',
    label: '车辆追尾告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from ( select * from his_event_data where stat=0 and event_type_id = 36) hed left join (select event_id, cur_time from his_event_data where stat=100 and event_type_id = 36) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id where 1=1 and v.card_id is not null {exprString} order by hed.cur_time desc;',
    fields: {
      names: ['v.card_id', 'v.vehicle_id', 'hed.description', 'hed.area_id', 'hed.map_id', 'hed.cur_time', 'hed1.cur_time as hcu'],
      types: ['NUMBER', 'SELECT', 'STRING', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME' ],
      labels: ['车卡号', '车辆名称', '追尾描述', '区域名称', '所属地图', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'v.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'v.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '区域名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  c_g_limited: {
    name: 'car_geofault_limited',
    label: '地质断层距离告警',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 38) hed left join ( select event_id, cur_time from his_event_data where stat=100 and event_type_id = 38) hed1 on hed.event_id = hed1.event_id left join dat_vehicle_extend v on v.card_id = hed.obj_id left join dat_geofault dg on dg.geofault_id = hed.landmark_dist where 1=1 {exprString} order by hed.cur_time DESC;',
    fields: {
      names: ['v.card_id', 'v.vehicle_id', 'hed.area_id', 'hed.map_id', 'dg.geofault', 'hed.limit_value', 'hed.cur_value', 'hed.cur_time', 'hed1.cur_time as hcu'],
      types: ['NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME' ],
      labels: ['车卡号', '车辆名称', '工作面名称', '所属地图', '断层名称', '告警阈值', '告警当前值', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'v.card_id',
      label: '车卡号',
      type: 'SELECT'
    },
    {
      name: 'v.vehicle_id',
      label: '车辆名称',
      type: 'SELECT'
    },
    {
      name: 'hed.area_id',
      label: '工作面名称',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  alarm_reader: {
    name: 'alarm_reader',
    label: '分站通信异常报警明细',
    sqlTmpl: `select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 6) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100 and event_type_id = 6) hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_reader r on hed.obj_id = r.reader_id where 1=1 {exprString} order by hed.cur_time desc;`,
    fields: {
      names: ['CAST(hed.obj_id AS signed) as obj_id', 'r.name', 'hed.map_id', 'et.event_type_id', 'ifnull(date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s"), "") as start_time', 'ifnull(date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s"), "") as end_time'],
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME'],
      labels: ['分站号', '分站名称', '所属地图', '报警类型', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'r.reader_id',
      label: '分站号',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  alarm_reader_charge: {
    name: 'alarm_reader_charge',
    label: '分站供电告警明细',
    sqlTmpl: `select {resultFields} from (select * from his_event_data where stat=0 and event_type_id = 33) hed left join (select event_id, obj_id, cur_time from his_event_data where stat=100 and event_type_id = 33) hed1 on hed.event_id = hed1.event_id and hed.obj_id = hed1.obj_id left join dat_event_type et on hed.event_type_id = et.event_type_id inner join dat_reader r on hed.obj_id = r.reader_id where 1=1 {exprString} order by hed.cur_time desc;`,
    fields: {
      names: ['cast(hed.obj_id AS signed) as obj_id', 'r.name', 'hed.map_id', 'et.event_type_id', 'ifnull(date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s"), " ") as start_time', 'ifnull(date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s"), " ") as end_time'],
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'DATETIME', 'DATETIME'],
      labels: ['分站号', '分站名称', '所属地图', '报警类型', '开始告警时间', '结束告警时间']
    },
    exprFields: [{
      name: 'r.reader_id',
      label: '分站号',
      type: 'SELECT'
    },
    {
      name: 'hed.map_id',
      label: '地图',
      type: 'SELECT'
    },    
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed.cur_time'
        },
        label: '开始告警时间-开始告警时间'
      },
      {
        start: {
          name: 'hed.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '开始告警时间-结束告警时间'
      },
      {
        start: {
          name: 'hed1.cur_time'
        },
        end: {
          name: 'hed1.cur_time'
        },
        label: '结束告警时间-结束告警时间'
      }
      ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: {
        funName: 'intervalTime',
        funFields: ['hed.cur_time', 'hed.cur_time']
      }
    }],
    needBreakdown: false,
    autoExec: true
  },

  rs_efficiency_overview: {
    name: 'rs_efficiency_overview',
    label: '三率总览',
    sqlTmpl: {
      'overview-boot': `select hsr.workface_id, work_face_type as workface_type, need_display, round(sum(hsr.startup_rate) / count(hsr.startup_rate), 1) as worktime, work_date as stime from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and need_display = 1 and work_date {exprString} group by work_date`,
      'overview-rugular': `select dept_id, round(sum(worktime)/sum(schedule_value) * 100, 1) as worktime, date(stime) as stime, need_display from (select sum(detail_value) as worktime, schedule_value, date(start_time) as stime, dept_id, need_display from his_regular_cycle_detail hrc left join dat_work_face dwf ON hrc.work_face_id = dwf.work_face_id WHERE start_time {exprString} and need_display = 1 group by date(start_time), hrc.work_face_id)aa group by aa.stime order by aa.stime`,
      'overview-worktime': `select hwr.workface_id, work_face_type as workface_type, need_display, ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime,  work_date as stime from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and need_display = 1 and work_date {exprString} group by work_date`,
      'dept_boot': `select workface_id, work_face_type as workface_type, need_display, rank, round(startup_rate, 1) AS worktime,work_date as stime from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and work_date {exprString} group by workface_id, work_date, work_face_type;`,
      'dept_rugular': `SELECT ROUND(SUM(worktime) / schedule_value * 100, 1) AS worktime, stime, dept_id, ROUND(sum(worktime),2) as sumnum, work_face_id, work_face_type, need_display, rank FROM (SELECT SUM(detail_value) AS worktime, schedule_value, DATE(start_time) AS stime, hrc.dept_id, dwf.work_face_id, dwf.work_face_type, dwf.need_display, dwf.rank FROM his_regular_cycle_detail hrc LEFT JOIN dat_work_face dwf on hrc.work_face_id = dwf.work_face_id WHERE start_time {exprString} GROUP BY DATE(start_time), work_face_id ORDER BY start_time)aa GROUP BY stime, dept_id ORDER BY stime;`,
      'dept_worktime': `select rate_id, ROUND(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime, workface_id, work_face_type as workface_type, work_date as stime, avg_valid_time as overWorktime, avg_invalid_time as overChecktime, need_display, rank from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and work_date {exprString} group by workface_id, work_date, work_face_type`
    },
    fields: {
      names: '',
      types: '',
      labels: ''
    },
    exprFields: [{
      type: 'MONTH',
      selectOptin: [{
        name: 'month',
        label: '月份'
      }]
    }],
    exprList: [
      {
        type: 'EDITABLE',
        label: '所有',
        value: {
          funName: 'getMonth',
          funFields: null
        }
      }
    ],
    autoExec: true
  },

  rept_efficiency_manage: {
    name: 'rept_efficiency_manage',
    label: '管理调度日报',
    sqlTmpl: {
      'dept_boot': `select round(startup_rate, 1) as worktime, round(startup_time,2) as overWorktime,  round( schedule_work_time ,2) as overChecktime, workface_id, work_face_type as workface_type, need_display, rank from his_startup_rate hsr, dat_work_face dwf where hsr.workface_id = dwf.work_face_id and work_date between {exprString} group by workface_id, workface_type`,
      'analysis': `select Rpt_Type, rsdd.work_face_id, Analysis, work_face_type, rsdm.ID from rpt_sanlv_daily_main rsdm, rpt_sanlv_daily_detail rsdd, dat_work_face dwf where rsdm.ID = rsdd.MainID and rsdd.work_face_id = dwf.work_face_id and rsdm.CreateDateTime between {exprString};`,
      'dept_rugular': `SELECT ROUND(SUM(worktime) / schedule_value * 100, 1) AS worktime, stime,dept_id, ROUND(SUM(worktime),1) AS sumnum,round(SUM(worktime), 2) as overWorktime, round(schedule_value, 2) as overChecktime, work_face_type AS workface_type, work_face_id, need_display, rank FROM (SELECT SUM(detail_value) AS worktime, schedule_value, DATE(start_time) AS stime, hrc.dept_id, hrc.work_face_id, dv.work_face_type, need_display, rank FROM his_regular_cycle_detail hrc LEFT JOIN dat_work_face dv ON hrc.work_face_id = dv.work_face_id WHERE DATE(start_time) between {exprString} GROUP BY DATE(start_time), work_face_id ORDER BY start_time)aa GROUP BY stime, dept_id ORDER BY dept_id;`,
      'planing': `select workface_id,work_face_type,schedule_startup_time as boot_time,case when work_face_type = 1 then schedule_mine_times else schedule_tunnelling_times end as planing,schedule_date from dat_workface_scheduling dws left join dat_work_face dwf on dws.workface_id = dwf.work_face_id where schedule_date between {exprString};`,
      'dept_worktime': `select round(sum(hwr.worktime_rate) / count(hwr.worktime_rate), 1) as worktime, round(sum(avg_valid_time) / count(hwr.worktime_rate), 2) as overWorktime, round(sum(avg_invalid_time)/count(hwr.worktime_rate), 2) as overChecktime, workface_id, work_face_type as workface_type, need_display, rank from his_worktime_rate hwr, dat_work_face dwf where hwr.workface_id = dwf.work_face_id and work_date between {exprString} group by workface_id, work_face_type;`
    },
    fields: {
      names: [],
      types: [],
      labels: []
    },
    exprFields: [{
      name: 'day',
      label: '查询日期',
      type: 'DAY'
    }],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    autoExec: true
  },

  rept_worktime_dept: {
    name: 'rept_worktime_dept',
    label: '队组班次工作面时长表',
    sqlTmpl: `select {resultFields} from his_worktime_rate hwr left join his_worktime_rate_detail hwrd on hwr.rate_id = hwrd.rate_id left join dat_work_face dwf on hwr.workface_id = dwf.work_face_id where 1=1 {exprString}`,
    fields: {
      names: ['hwrd.staff_count as num', 'hwrd.avg_valid_time as worktime', 'hwrd.shift_id', 'hwr.workface_id', 'work_face_type as workface_type'],
      types: ['NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['人数', '平均时长', '班次', '工作面ID', '工作面属性']
    },
    exprFields: [{
      name: 'hwr.work_date',
      label: '时间',
      type: 'DAY'
    }],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    needBreakdown: false,
    autoExec: true
  },

  worktime_detail_table: {
    name: 'worktime_detail_table',
    label: '工时详情',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: `SELECT {resultFields} FROM (SELECT SUM(real_work_time) AS worktime,hwd.staff_id, DATE(start_work_time) AS stime,schedule_work_time, dept_id, hwd.shift_id,start_work_time as start_time, end_work_time as end_time, dse.need_display FROM his_worktime_detail hwd LEFT JOIN dat_staff_extend dse ON hwd.staff_id=dse.staff_id WHERE {exprString} AND proc_tag = 1 {exprStringDept} GROUP BY staff_id, DATE(start_work_time), shift_id) aa LEFT JOIN (select staff_id, sum(motionless_time) as dtime, date(start_time) as att_date, start_time, end_time, shift_id from his_motionless_detail where {exprStringLess} group by staff_id, date(start_time)) bb ON aa.staff_id = bb.staff_id AND aa.stime = bb.att_date AND aa.shift_id = bb.shift_id`,
    fields: {
      names: ['aa.staff_id', 'aa.dept_id', 'date_format(stime,"%Y-%m-%d")', 'case when bb.dtime then (worktime-bb.dtime) else worktime end as worktime', 'bb.dtime as dtime', 'aa.start_time', 'aa.end_time', 'aa.shift_id'],
      types: ['SELECT', 'SELECT', 'STRING', 'NUMBER', 'NUMBER', 'DATETIME', 'DATETIME', 'SELECT'],
      labels: ['姓名', '队组', '日期', '工作时长(h)', '无效时长(h)', '进入区域时间', '出区域时间', '班次']
    },
    exprFields: [{
      name: 'dept_id',
      label: '队组',
      type: 'SELECT'
    },
    {
      name: 'shift_id',
      label: '班次',
      type: 'SELECT'
    },
    {
      name: 'start_work_time',
      label: '时间',
      type: 'DAY'
    }
    ],
    exprList: [
      // { type: 'FIXED', label: '所有', value: { funName: 'getDayTime', funFields:['start_work_time']}}
    ],
    needBreakdown: false,
    autoExec: true
  },

  rugular_total: {
    name: 'rugular_total',
    label: '三率综合数据',
    sqlTmpl: {
      'dept_rugular': `SELECT ROUND(SUM(worktime) / schedule_value * 100, 1) AS worktime, stime, dept_id, ROUND(sum(worktime),2) as sumnum, vehicle_type_id, vehicle_id FROM (SELECT SUM(detail_value) AS worktime, schedule_value, DATE(start_time) AS stime, hrc.dept_id, hrc.vehicle_id,dv.vehicle_type_id FROM his_regular_cycle_detail hrc left join dat_vehicle dv on hrc.vehicle_id = dv.vehicle_id WHERE DATE(start_time) between {exprString} GROUP BY DATE(start_time), vehicle_id ORDER BY start_time)aa GROUP BY stime, dept_id ORDER BY stime;`,
      'displacement': `select dept_id, hdp.position_data as position_data, avg_distance from his_draw_position hdp left join dat_vehicle_extend dve on hdp.vehicle_id = dve.vehicle_id where DATE(write_time) between {exprString};`,
      'gasment': `select aa.dept_id, hsd.sensor_id, concat_ws(',', date_format(hsd.write_time, "%Y-%m-%d %H:%i:%S"),hsd.data_value) as switch_data, write_time, sensor_type_id from his_sensor_data hsd inner join ( select sensor_id, sensor_type_id, dve.dept_id from dat_sensor ds, dat_vehicle_extend dve where ds.vehicle_id = dve.vehicle_id)aa on hsd.sensor_id = aa.sensor_id and DATE(hsd.write_time) between {exprString};`,
      'bootswitch': `select hsd.dept_id, concat_ws(',', date_format(hsd.start_up_time, "%Y-%m-%d %H:%i:%S"),1) as open_data, concat_ws(',', date_format(case when hsd.shut_down_time is null then now() else hsd.shut_down_time end, "%Y-%m-%d %H:%i:%S"),0) as close_data from his_startup_detail hsd where DATE(hsd.start_up_time) between {exprString} order by hsd.dept_id, hsd.start_up_time;`
    },
    fields: {
      names: [],
      types: [],
      labels: []
    },
    exprFields: [{
      name: 'day',
      label: '查询日期',
      type: 'DAY'
    }],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    autoExec: true
  },
  operate_log: {
    name: 'operate_log',
    label: '操作日志',
    sqlTmpl: 'select {resultFields} from his_op_log where 1=1 {exprString} order by op_time desc',
    fields: {
      names: ['op_id', 'user_id', 'op_time', 'ip', 'op_type_id', 'ifnull(detail, " ")'],
      types: ['NUMBER', 'STRING', 'DATETIME', 'STRING', 'SELECT', 'STRING'],
      labels: ['编号', '用户', '操作时间', 'IP', '操作类型', '内容']
    },
    exprFields: [{
      name: 'user_id',
      label: '用户',
      type: 'SELECT'
    },
    {
      name: 'op_type_id',
      label: '操作类型',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'op_time'
        },
        end: {
          name: 'op_time'
        },
        label: '开始时间-结束时间'
      } ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    needBreakdown: false, // 是否需要下钻？
    autoExec: true
  },

  his_staff_change: {
    name: 'his_staff_change',
    label: '历史人员变更记录',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: `SELECT {resultFields} FROM his_staff_op_log hso LEFT JOIN dat_staff_extend dse ON dse.staff_id = hso.staff_id WHERE 1=1 AND (detail IS NOT NULL && detail != '') {exprString} order by dse.staff_id, hso.lastUpdate desc;`,
    fields: {
      names: ['hso.staff_id', 'CASE WHEN op_log = "INSERT" THEN "新增" WHEN op_log = "UPDATE" THEN "更新" WHEN op_log = "DELETE" THEN "删除" END as op_log', 'hso.detail', 'hso.user_id', 'hso.lastUpdate'],
      types: ['STRING', 'STRING', 'STRING', 'STRING', 'DATETIME'],
      labels: ['员工编号', '操作方式', '操作内容', '操作用户', '操作时间']
    },
    exprFields: [{
      name: 'hso.staff_id',
      label: '员工编号',
      type: 'SELECT'
    },
    {
      name: 'hso.user_id',
      label: '操作人',
      type: 'SELECT'
    },
    {
      type: 'DATE',
      selectOptin: [{
        start: {
          name: 'hso.lastUpdate'
        },
        end: {
          name: 'hso.lastUpdate'
        },
        label: '开始操作时间-结束操作时间'
      } ]
    }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }]
  },
  his_alarm: {
    name: 'his_alarm',
    label: '定位系统告警查询',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: null,
    fields: {
      names: ['event_type_id', 'obj', 'objName', 'map_id', 'numberID', 'cardID', 'deptName', 'date_format(hed.cur_time, "%Y-%m-%d %H:%i:%s") as cur_time', 'date_format(hed1.cur_time, "%Y-%m-%d %H:%i:%s") as end_time'],
      types: ['SELECT', 'STRING', 'STRING', 'SELECT', 'NUMBER', 'STRING', 'STRING', 'DATETIME', 'DATETIME'],
      labels: ['告警类型', '告警对象', '名称', '所属地图', '编号', '卡号', '部门', '开始告警时间', '结束告警时间']
    },
    exprFields: [
      {
        name: 'event_type_id',
        label: '告警类型',
        type: 'SELECT'
      },
      {
        type: 'DATE',
        selectOptin: [{
          start: {
            name: 'hed.cur_time'
          },
          end: {
            name: 'hed.cur_time'
          },
          label: '开始告警时间-开始告警时间'
        },
        {
          start: {
            name: 'hed.cur_time'
          },
          end: {
            name: 'hed1.cur_time'
          },
          label: '开始告警时间-结束告警时间'
        },
        {
          start: {
            name: 'hed1.cur_time'
          },
          end: {
            name: 'hed1.cur_time'
          },
          label: '结束告警时间-结束告警时间'
        }
        ]
      }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }]
  },
  his_unique_alarm: {
    name: 'his_unique_alarm',
    label: '通道告警查询',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'select {resultFields} from his_unique_event_data hued left join dat_staff ds on ds.staff_id = hued.staff_id left join dat_staff_extend dse on dse.staff_id = hued.staff_id where 1=1 {exprString} order by hued.cur_time desc',
    fields: {
      names: ['hued.staff_id', 'ds.name', 'dse.card_id', 'dse.dept_id', 'hued.channel', 'hued.detail', 'hued.cur_time'],
      types: ['STRING', 'STRING', 'STRING', 'SELECT', 'STRING', 'STRING', 'DATETIME'],
      labels: ['员工编号', '姓名', '卡号', '所属部门', '通道号', '告警详情', '告警时间']
    },
    exprFields: [
      {
        name: 'hued.staff_id',
        label: '员工编号',
        type: 'SELECT'
      },
      {
        name: 'hued.staff_id',
        label: '姓名',
        type: 'SELECT'
      },
      {
        name: 'dse.card_id',
        label: '卡号',
        type: 'SELECT'
      },
      {
        name: 'dse.dept_id',
        label: '所属部门',
        type: 'SELECT'
      },
      {
        name: 'detail',
        label: '内容详细',
        type: 'STRING'
      },
      {
        type: 'DATE',
        selectOptin: [{
          start: {
            name: 'hued.cur_time'
          },
          end: {
            name: 'hued.cur_time'
          },
          label: '开始时间-结束时间'
        }]
      }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    autoExec: true
  },
  his_device_net_params: {
    name: 'his_device_net_params',
    label: '设备网络参数台账',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'SELECT {resultFields} FROM dat_device_net_params WHERE 1=1 {exprString} ORDER BY deviceType',
    fields: {
      names: ['deviceAddress', 'deviceType', 'ip', 'subnetMask', 'defaultGateway', 'aimsIP1', 'aimsPort1', 'tdoaPort1', 'enable1', 'aimsIP2', 'aimsPort2', 'tdoaPort2', 'enable2', 'aimsIP3', 'aimsPort3', 'tdoaPort3', 'enable3', 'mac'],
      types: ['NUMBER', 'SELECT', 'STRING', 'STRING', 'STRING', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['设备地址', '设备类型', '本机IP', '子网掩码', '默认网关', '目标IP1', '目标端口1', 'TDOA端口1', '是否使用', '目标IP2', '目标端口2', 'TDOA端口2', '是否使用', '目标IP3', '目标端口3', 'TDOA端口3', '是否使用', 'MAC']
    },
    exprFields: [
      {
        name: 'deviceAddress',
        label: '设备编号',
        type: 'SELECT'
      },
      {
        name: 'deviceType',
        label: '设备类型',
        type: 'SELECT'
      }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    autoExec: true
  },
  his_device_params: {
    name: 'his_device_params',
    label: '设备参数台账',
    sign: 1,
    needDisplay: 1,
    sqlTmpl: 'SELECT {resultFields} FROM dat_device_params WHERE 1=1 {exprString} ORDER BY deviceType',
    fields: {
      names: ['deviceAddress', 'deviceType', 'childDeviceAddress', 'uploadInterval', 'reconnectInterval', 'receivingFrequencyPoint1', 'receivingFrequencyPoint2', 'canid', 'trafficLightNums', 'programVersion', 'antennaDelay1', 'antennaDelay2', 'tdoaTimeFrame', 'isShowBackside', 'timeSynchronization', 'readerAreaID', 'trafficLightsFontShap', 'trafficLightsReverseShap', 'trafficLightsFontColor', 'trafficLightsReverseColor', 'uploadHartbeat', 'transmitPower1', 'communicationRate1', 'pulseReptFrequency1', 'preambleCode1', 'preambleCodeLength1', 'PAC1', 'transmitPower2', 'communicationRate2', 'pulseReptFrequency2', 'preambleCode2', 'preambleCodeLength2', 'PAC2', 'broadcastDuration', 'BlinkDuration', 'responseDuration', 'FinalDuration', 'afterPositionDormat', 'confictDormat', 'ACKDuration', 'checkingDuration', 'rangingDuration', 'dormancyStatus', 'signalDuration', 'positionPattern'],
      types: ['NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'NUMBER', 'SELECT'],
      labels: ['设备编号', '设备类型', '设备地址', '上传间隔', '重连间隔', '接收频点(第一路DW1000)', '接收频点(第二路DW1000)', 'CANID', '组内数量', '程序版本', '天线1延迟值', '天线2延迟值', 'TDOA时间节点', '红绿灯是否显示背面面板', '分站时间同步上级分站', '分站区域编号', '红绿灯正面显示形状', '红绿灯反面显示形状', '离线正面显示时长', '离线反面显示时长', '通信分站是否上传心跳', '第一路DW1000发射功率', '第一路DW1000通信速率', '第一路DW1000脉冲重复频率', '第一路DW1000前导码', '第一路DW1000长度', '第一路DW1000PAC', '第二路DW1000发射功率', '第二路DW1000通信速率', '第二路DW1000脉冲重复频率', '第二路DW1000前导码', '第二路DW1000长度', '第二路DW1000PAC', '广播时长', '设置Blink时长', '设置侦听Response时长', '设置侦听Final时长', '设置定位完成后休眠时长', '设置冲突时休眠时长', '设置侦听ACK时长', '设置Checking时长', '设置Ranging时长', '休眠状态', '侦听信号时长', '定位模式']
    },
    exprFields: [
      {
        name: 'deviceAddress',
        label: '设备编号',
        type: 'SELECT'
      },
      {
        name: 'deviceType',
        label: '设备类型',
        type: 'SELECT'
      }
    ],
    exprList: [{
      type: 'FIXED',
      label: '所有',
      value: '1=1'
    }],
    autoExec: true
  }
}

export default reptQuery
