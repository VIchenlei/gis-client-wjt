let reptMenu = [
  {
    title: '人员报表查询',
    icon: 'icon-stats',
    menuID: 'RP-A',
    items: [
      { name: 'person_hour', label: '最近一小时人员出入井', isShow: false, menuID: 'RP-A-001' },
      { name: 'person', label: '人员出入井明细', isShow: true, menuID: 'RP-A-002' },
      { name: 'person_area', label: '人员进出区域明细', isShow: true, menuID: 'RP-A-003' },
      { name: 'person_location_area', label: '人员区域时刻', isShow: true, menuID: 'RP-A-004' },
      { name: 'person_reader', label: '人员进出分站明细', isShow: true, menuID: 'RP-A-005' },
      { name: 'person_absence', label: '人员未出勤明细', isShow: true, menuID: 'RP-A-006' },
      { name: 'person_day', label: '人员考勤日报', isShow: true, menuID: 'RP-A-007' },
      { name: 'person_month', label: '人员考勤月报', isShow: true, menuID: 'RP-A-008' },
      { name: 'person_s_dept_day', label: '部门考勤日报', isShow: true, menuID: 'RP-A-009' },
      { name: 'person_s_dept_month', label: '部门考勤月报', isShow: true, menuID: 'RP-A-010' },
      { name: 'person_dept_period', label: '部门时段查询', isShow: true, menuID: 'RP-A-011' },
      { name: 'person_well_overtime', label: '人员井下超时告警', isShow: true, menuID: 'RP-A-012' },
      { name: 'person_area_overtime', label: '人员区域超时告警', isShow: true, menuID: 'RP-A-013' },
      { name: 'person_well_overcount', label: '人员井下超员告警', isShow: true, menuID: 'RP-A-014' },
      { name: 'person_area_overcount', label: '人员区域超员告警', isShow: true, menuID: 'RP-A-015' },
      { name: 'person_call_help', label: '人员井下呼救告警', isShow: true, menuID: 'RP-A-016' },
      { name: 'person_card_battery_alarm', label: '人卡电量低告警', isShow: true, menuID: 'RP-A-017' },
      { name: 'person_fixed_alarm', label: '人卡静止不动告警', isShow: true, menuID: 'RP-A-018' },
      { name: 'person_area_limited', label: '人员进入限制区域告警', isShow: true, menuID: 'RP-A-019' },
      { name: 'person_driver_car_limited', label: '工作面司机与车卡距离告警', isShow: true, menuID: 'RP-A-020' },
      { name: 'person_time', label: '人员井下时刻明细', isShow: true, menuID: 'RP-A-021' },
      { name: 'person_reader_detail', label: '人员分站告警明细查询', isShow: true, menuID: 'RP-A-022' },
      { name: 'person_leave_early', label: '人员早退告警', isShow: true, menuID: 'RP-A-023' },
    ]
  },
  {
    title: '车辆报表查询',
    icon: 'icon-vehicle',
    menuID: 'RP-B',
    items: [
      { name: 'rept_car_whole', label: '整体出车情况', isShow: true, menuID: 'RP-B-001' },
      { name: 'vehicle_updown_mine', label: '车辆出车明细', isShow: true, menuID: 'RP-B-002' },
      { name: 'vehicle_no_updown_mine', label: '车辆未出车明细', isShow: true, menuID: 'RP-B-003' },
      { name: 'area', label: '车辆进出区域明细', isShow: true, menuID: 'RP-B-004' },
      { name: 'v_reader', label: '车辆进出分站明细', isShow: true, menuID: 'RP-B-005' },
      { name: 'v_vehicle_day', label: '车辆考勤日报', isShow: true, menuID: 'RP-B-006' },
      { name: 'v_vehicle_month', label: '车辆考勤月报', isShow: true, menuID: 'RP-B-007' },
      { name: 'v_overspeed', label: '车辆超速告警', isShow: true, menuID: 'RP-B-008' },
      { name: 'v_area_limited', label: '车辆进入禁止区域告警', isShow: true, menuID: 'RP-B-009' },
      { name: 't_s_distance_limited', label: '掘进机与分站距离超限告警', isShow: true, menuID: 'RP-B-010' },
      { name: 'c_e_zhuiwei', label: '车辆追尾告警', isShow: true, menuID: 'RP-B-011' },
      { name: 'c_g_limited', label: '地质断层距离告警', isShow: true, menuID: 'RP-B-012' }
    ]
  },
  {
    title: '设备报表查询',
    icon: 'icon-facility',
    menuID: 'RP-C',
    items: [
      { name: 'alarm_reader', label: '分站通信异常报警明细', isShow: true, menuID: 'RP-C-001' },
      { name: 'alarm_reader_charge', label: '分站供电告警明细', isShow: true, menuID: 'RP-C-002' }
    ]
  },
  {
    title: '三率报表查询',
    icon: 'icon-efficiency',
    menuID: 'RP-D',
    items: [
      { name: 'rs_efficiency_overview', label: '三率总览', isShow: true, menuID: 'RP-D-001' },
      { name: 'rept_efficiency_manage', label: '三率管理调度日报', isShow: true, menuID: 'RP-D-002' },
      { name: 'rept_worktime_dept', label: '队组班次工作面时长表', isShow: true, menuID: 'RP-D-003' },
      { name: 'worktime_detail_table', label: '工时详情', isShow: true, menuID: 'RP-D-004' }
    ]
  },
  {
    title: '告警报表查询',
    icon: 'icon-alarm',
    menuID: 'RP-E',
    items: [
      { name: 'his_alarm', label: '定位系统告警查询', isShow: true, menuID: 'RP-E-001' },
      { name: 'his_unique_alarm', label: '通道告警查询', isShow: true, menuID: 'RP-E-002' },
    ]
  },
  {
    title: '设备台账查询',
    icon: 'icon-device',
    menuID: 'RP-F',
    items: [
      { name: 'his_device_net_params', label: '设备网络参数台账', isShow: true, menuID: 'RP-F-001' },
      { name: 'his_device_params', label: '设备参数台账', isShow: true, menuID: 'RP-F-002' },
    ]
  }
]

export default reptMenu
