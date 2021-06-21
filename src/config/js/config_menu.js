let configMenu = [
  {
    title: '组织管理',
    icon: 'icon-menu2',
    expand: false,
    isShow: true,
    menuID: 'CF-A',
    items: [
      {
        name: 'dept_ck',
        label: '虚拟部门管理',
        menuID: 'CF-A-001'
      },
      {
        name: 'dept',
        label: '部门管理',
        menuID: 'CF-A-002'
      },
      {
        name: 'group',
        label: '班组管理',
        menuID: 'CF-A-003'
      },
      {
        name: 'worktype',
        label: '工种管理',
        menuID: 'CF-A-004'
      },
      {
        name: 'occupation',
        label: '职务管理',
        menuID: 'CF-A-005'
      },
      {
        name: 'shift_type',
        label: '班制管理',
        menuID: 'CF-A-006'
      },
      {
        name: 'shift',
        label: '班次管理',
        menuID: 'CF-A-007'
      },
      {
        name: 'shift_setting',
        label: '考勤管理',
        menuID: 'CF-A-011'
      },
      {
        name: 'occupation_level',
        label: '级别管理',
        menuID: 'CF-A-008'
      },
      {
        name: 'education',
        label: '学历管理',
        menuID: 'CF-A-009'
      },
      {
        name: 'marry',
        label: '婚姻管理',
        menuID: 'CF-A-010'
      }
    ]
  },
  {
    title: '地图管理',
    icon: 'icon-map',
    isShow: true,
    menuID: 'CF-B',
    items: [
      {
        name: 'map',
        label: '地图',
        menuID: 'CF-B-001'
      },
      // {
      //   name: 'gis_layer',
      //   label: '地图图层管理',
      //   menuID: 'CF-B-002'
      // },
      {
        name: 'area',
        label: '分区管理',
        menuID: 'CF-B-003'
      },
      {
        name: 'area_persons_dynamic_thre',
        label: '区域人员停留上限管理',
        menuID: 'CF-B-004'
      },
      {
        name: 'landmark',
        label: '地标管理',
        menuID: 'CF-B-005'
      },
      {
        name: 'geofault',
        label: '地质断层管理',
        menuID: 'CF-B-006'
      },
      {
        name: 'goaf',
        label: '采空区管理',
        menuID: 'CF-B-007'
      }
    ]
  },
  {
    title: '设备管理',
    icon: 'icon-device',
    isShow: true,
    menuID: 'CF-C',
    items: [
      {
        name: 'device_net_params',
        label: '设备网络参数',
        menuID: 'CF-C-001'
      },
      {
        name: 'device_params',
        label: '设备参数',
        menuID: 'CF-C-002'
      },
      {
        name: 'device_software_update',
        label: '设备软件升级',
        menuID: 'CF-C-003'
      },
      {
        name: 'staff_software_update',
        label: '标识卡软件升级',
        menuID: 'CF-C-004'
      },
      {
        name: 'device_power',
        label: '电源设备管理',
        menuID: 'CF-C-005'
      }
    ]
  },
  {
    title: '分站管理',
    icon: 'icon-mange',
    isShow: true,
    menuID: 'CF-D',
    items: [
      {
        name: 'device_type',
        label: '设备类型管理',
        menuID: 'CF-D-001'
      },
      {
        name: 'device_state',
        label: '设备状态管理',
        menuID: 'CF-D-002'
      },
      {
        name: 'reader',
        label: '分站管理',
        menuID: 'CF-D-003'
      },
      {
        name: 'area_reader',
        label: '分站所属区域管理',
        menuID: 'CF-D-004'
      },
      {
        name: 'sensor_type',
        label: '传感器类型管理',
        menuID: 'CF-D-005'
      },
      // {
      //   name: 'sensor',
      //   label: '传感器管理',
      //   menuID: 'CF-D-006'
      // },
      {
        name: 'reader_rssi',
        label: '分站盲区间距管理',
        menuID: 'CF-D-007'
      },
    ]
  },
  {
    title: '红绿灯管理',
    icon: 'icon-traffic-light-2',
    isShow: true,
    menuID: 'CF-I',
    items: [
      {
        name: 'light',
        label: '红绿灯管理',
        menuID: 'CF-I-001'
      },
      {
        name: 'lights_group',
        label: '红绿灯组管理',
        menuID: 'CF-I-002'
      },
      {
        name: 'light_shape',
        label: '红绿灯形状管理',
        menuID: 'CF-I-003'
      },
      {
        name: 'light_rd_spec_process',
        label: '红绿灯分站特殊处理管理',
        menuID: 'CF-I-004'
      },
    ]
  },
  {
    title: '系统管理',
    icon: 'icon-setting-1',
    isShow: true,
    menuID: 'CF-E',
    items: [
      {
        name: 'user',
        label: '用户管理',
        menuID: 'CF-E-001'
      },
      {
        name: 'role',
        label: '角色管理',
        menuID: 'CF-E-002'
      },
      // {
      //   name: 'role_rank',
      //   label: '角色等级管理',
      //   menuID: 'CF-D-003'
      // },
      {
        name: 'op_type',
        label: '操作类型管理',
        menuID: 'CF-E-004'
      },
      {
        name: 'event_level',
        label: '告警级别',
        menuID: 'CF-E-005'
      },
      {
        name: 'event_type',
        label: '告警类型',
        menuID: 'CF-E-006'
      },
      {
        name: 'sosalarm',
        label: '声光告警',
        menuID: 'CF-E-007'
      },
      {
        name: 'setting',
        label: '系统设置',
        menuID: 'CF-E-008'
      },
      // {
      //   name: 'camera',
      //   label: '视频管理',
      //   menuID: 'CF-E-009'
      // },
      {
        name: 'ip_address',
        label: 'IP地址管理',
        menuID: 'CF-E-010'
      },
      {
        name: 'sanlv_standart',
        label: '三率标准表',
        menuID: 'CF-E-011'
      },
      {
        name: 'month',
        label: '月考勤日期管理',
        menuID: 'CF-E-012'
      },
      {
        name: 'att_rule',
        label: '考勤规则设置',
        menuID: 'CF-E-013'
      }
    ]
  },
  {
    title: '系统报表',
    icon: 'icon-stats',
    isShow: true,
    menuID: 'CF-F',
    items: [
      {
        name: 'operate_log',
        label: '操作日志',
        menuID: 'CF-F-001'
      },
      {
        name: 'his_staff_change',
        label: '历史人员变更',
        menuID: 'CF-F-002'
      }
    ]
  },
  {
    title: '信息管理',
    icon: 'icon-efficiency',
    isShow: true,
    menuID: 'CF-G',
    items: [
      {
        name: 'dept_info',
        label: '部门信息管理',
        menuID: 'CF-G-001'
      },
      {
        name: 'occupation_info',
        label: '职务信息管理',
        menuID: 'CF-G-002'
      }
    ]
  },
  {
    title: '配置项',
    icon: 'icon-poll',
    isShow: true,
    menuID: 'CF-H',
    items: [
      {
        name: 'font_size',
        label: '字体大小管理',
        menuID: 'CF-H-001'
      },
      {
        name: 'number_bars',
        label: '数据条数管理',
        menuID: 'CF-H-002'
      }
    ]
  }
]

export default configMenu
