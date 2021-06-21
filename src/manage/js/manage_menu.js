let manageMenu = [
  {
    title: '人员管理',
    icon: 'icon-account',
    menuID: 'MA-A',
    isShow: true,
    items: [
      { name: 'staff', label: '人员基本信息管理', menuID: 'MA-A-001' },
      { name: 'staff_lamp', label: '员工矿灯管理', menuID: 'MA-A-002' },
      { name: 'sex', label: '人员性别管理', menuID: 'MA-A-003' }
    ]
  },
  {
    title: '资格证管理',
    icon: 'icon-newspaper',
    menuID: 'MA-B',
    isShow: true,
    items: [
      { name: 'credentials', label: '资格证类型管理', menuID: 'MA-B-001' },
      { name: 'credentials_staff', label: '人员资格证管理', menuID: 'MA-B-002' },
      { name: 'credentials_vehicle', label: '车辆资格证管理', menuID: 'MA-B-003' }
    ]
  },
  {
    title: '排班管理',
    icon: 'icon-arrange',
    menuID: 'MA-C',
    expand: false,
    isShow: true,
    items: [
      { name: 'driver', label: '司机排班', menuID: 'MA-C-001' },
      { name: 'leader_scheduling', label: '领导排班', menuID: 'MA-C-002' }
    ]
  },
  {
    title: '车辆管理',
    icon: 'icon-truck',
    menuID: 'MA-D',
    isShow: true,
    items: [
      { name: 'vehicle_type', label: '车辆类型管理', menuID: 'MA-D-001' },
      { name: 'vehicle', label: '车辆基本信息管理', menuID: 'MA-D-002' },
      { name: 'vehicle_category', label: '车辆类别管理', menuID: 'MA-D-003' },
      { name: 'vehicle_level', label: '车辆等级管理', menuID: 'MA-D-004' }
    ]
  },
  {
    title: '标识卡管理',
    icon: 'icon-card',
    menuID: 'MA-E',
    isShow: true,
    items: [
      { name: 'card_type', label: '标识卡类型管理', menuID: 'MA-E-001' },
      { name: 'state_card', label: '标识卡状态管理', menuID: 'MA-E-002' },
      { name: 'state_object', label: '绑定对象状态管理', menuID: 'MA-E-003' },
      { name: 'state_biz', label: '卡业务状态管理', menuID: 'MA-E-004' },
      { name: 'card', label: '标识卡注册管理', menuID: 'MA-E-005' }
    ]
  },
  {
    title: '工作面管理',
    icon: 'icon-hammer',
    menuID: 'MA-F',
    expand: false,
    isShow: true,
    items: [{ name: 'work_face', label: '工作面管理', menuID: 'MA-F-001' }]
  },
  {
    title: '综采面管理',
    icon: 'icon-hoist-2',
    menuID: 'MA-G',
    isShow: true,
    items: [
      { name: 'coalface', label: '综采面管理', menuID: 'MA-G-001' },
      { name: 'coalface_work', label: '综采面作业计划', menuID: 'MA-G-002' }
    ]
  },
  {
    title: '掘进面管理',
    icon: 'icon-crane-6',
    menuID: 'MA-H',
    isShow: true,
    items: [
      { name: 'drivingface', label: '掘进面管理', menuID: 'MA-H-001' },
      { name: 'drivingface_work', label: '掘进面作业计划', menuID: 'MA-H-002' }
    ]
  },
  {
    title: '三率管理',
    icon: 'icon-stats',
    menuID: 'MA-I',
    isShow: true,
    items: [{ name: 'sanlv_schedule', label: '三率结果值', menuID: 'MA-I-001' }]
  },
  {
    title: '禁止人员下井管理',
    icon: 'icon-account',
    menuID: 'MA-J',
    isShow: true,
    items: [{ name: 'rt_person_forbid_down_mine', label: '禁止人员下井管理', menuID: 'MA-J-001' }]
  },
  {
    title: '路径管理',
    icon: 'icon-line',
    menuID: 'MA-K',
    isShow: true,
    items: [
      { name: 'road_segment', label: '路径集', menuID: 'MA-K-001' },
      { name: 'tt_inspection_route_planning', label: '人员路线规划', menuID: 'MA-K-002' }
    ]
  },
  {
    title: '分站拓扑图',
    icon: 'icon-topology',
    menuID: 'MA-L',
    isShow: true,
    items: [
      {name: 'reader_topology', label: '分站拓扑图', menuID: 'MA-L-001'}
    ]
  }
]

export default manageMenu
