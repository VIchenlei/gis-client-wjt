// 设备类型
const DEVICE_TYPE_OBJ = [
  {597: '所有设备'},
  {0: '不带IP分站'},
  {1: '大分站'},
  {2: '小分站'},
  {3: '读卡分站'},
  {4: '通信分站'},
  {5: '红绿灯'},
  {6: 'can中继'},
  {7: '监控分站'},
  {8: '通信基站'},
  {9: 'PDOA分站'},
  {10: '车载读卡分站'},
  {11: '报警控制器'},
  {12: '隔爆电源'},
  {13: '搜救仪'},
  {14: '设备位置检测器'},
  {15: 'CAN网桥'},
  {16: '检卡分站'},
  {17: '唯一性检测井口管理终端'},
  {18: 'TDOA时钟基准基站'},
  {145: '人员标识卡'},
  {146: '车载定位器'},
  {147: '自组网卡'},
  {148: '采煤机卡'},
  {149: '掘进机卡'},
  {150: '模拟卡（小分站模拟车卡）'},
  {151: '工装'}
]

// 子设备类型
const CHILD_DEVICE_TYPE = [
  {128: '大分站'},
  {0: '小分站'},
  {64: '红绿灯'},
  {32: '通信基站'},
  {16: 'PDOA分站'}
]

// DW1000频点
const RECEIVING_FREQUENCY_POINT = [
  {1: 'Channel1'},
  {2: 'Channel2'},
  {3: 'Channel3'},
  {4: 'Channel4'},
  {5: 'Channel5'},
  {7: 'Channel7'},
  {255: '此值无效'}
]

// DW1000发射功率
const TRANSMIT_POWER = [
  {224: '禁用射频/PA（关闭射频电路）'},
  {192: '0级 (最低)'},
  {199: '一级'},
  {130: '二级'},
  {98: '三级'},
  {105: '四级'},
  {112: '五级'},
  {42: '六级'},
  {11: '七级'},
  {18: '八级'},
  {24: '九级'},
  {31: '十级'}
]

// DW1000通信速率
const COMMUNICATION_RATE = [
  {17: '110kbps'},
  {133: '850kbps'},
  {104: '6.8Mbps'},
  {255: '此值无效'}
]

// DW1000脉冲重复频率
const PULSE_REPT_FREQUENCY = [
  {22: '16M PRF'},
  {100: '64M PRF'},
  {255: '此值无效'}
]

// DW1000前导码、前导码长度、PAC
const PREAMBLE_CODE = [
  {1: '1'},
  {2: '2'},
  {3: '3'},
  {4: '4'},
  {5: '5'},
  {6: '6'},
  {7: '7'},
  {8: '8'},
  {9: '9'},
  {10: '10'},
  {11: '11'},
  {12: '12'},
  {13: '13'},
  {14: '14'},
  {15: '15'},
  {16: '16'},
  {17: '17'},
  {18: '18'},
  {19: '19'},
  {20: '20'},
  {21: '21'},
  {255: '此值无效'}
]

const PREAMBLE_CODE_LENGTH = [
  {1: '4096'},
  {2: '2048'},
  {3: '1024'},
  {4: '512'},
  {5: '256'},
  {6: '128'},
  {7: '64'},
  {255: '此值无效'}
]

const PREAMBLE_CODE_PAC = [
  {8: '8'},
  {22: '16'},
  {50: '32'},
  {100: '64'},
  {255: '此值无效'}
]

// 定位刷新频率
const POSITION_REFRESH_FREQUENCY = [
  {1: '0.5Hz'},
  {2: '1Hz'},
  {3: '2Hz'},
  {4: '5Hz'},
  {5: '10Hz'},
  {6: '20Hz'},
  {7: '50Hz'},
  {8: '100Hz'},
  {255: '此值无效'}
]

// 电量下限
const POWER_LIMIT = [
  {5: 5},
  {10: 10},
  {15: 15},
  {20: 20},
  {25: 25},
  {30: 30}
]

// 温度上限
const TEM_LIMIT = [
  {70: 70},
  {75: 75},
  {80: 80},
  {85: 85},
  {90: 90},
  {95: 95}
]

const LIGHT_SHAP = [
  {1: '红色实心圆形'},
  {2: '红色空心圆形'},
  {3: '红色叉形'},
  {4: '绿色上箭头'},
  {5: '绿色下箭头'},
  {6: '绿色左箭头'},
  {7: '绿色右箭头'},
  {8: '红色闪烁'},
  {9: '绿色闪烁'},
  {10: '绿色全亮'},
  {11: '绿色全灰'},
  {12: '红色全亮'},
  {13: '红色全灭'},
  {255: '此值无效'}
]

const DEVICE_PARAMS = {
  'deviceType': DEVICE_TYPE_OBJ,
  'receivingFrequencyPoint1': RECEIVING_FREQUENCY_POINT,
  'receivingFrequencyPoint2': RECEIVING_FREQUENCY_POINT,
  'uploadHartbeat': [{0: '不上传'}, {1: '上传'}, {255: '此值无效'}],
  'childDeviceType': CHILD_DEVICE_TYPE,
  'isShowPanelLED': [{0: '不显示'}, {1: '显示'}, {255: '此值无效'}],
  'dormancyStatus': [{0: '深度休眠'}, {1: '休眠'}, {255: '此值无效'}],
  'transmitPower1': TRANSMIT_POWER,
  'transmitPower2': TRANSMIT_POWER,
  'communicationRate1': COMMUNICATION_RATE,
  'communicationRate2': COMMUNICATION_RATE,
  'pulseReptFrequency1': PULSE_REPT_FREQUENCY,
  'pulseReptFrequency2': PULSE_REPT_FREQUENCY,
  'preambleCode1': PREAMBLE_CODE,
  'preambleCode2': PREAMBLE_CODE,
  'preambleCodeLength1': PREAMBLE_CODE_LENGTH,
  'preambleCodeLength2': PREAMBLE_CODE_LENGTH,
  'PAC1': PREAMBLE_CODE_PAC,
  'PAC2': PREAMBLE_CODE_PAC,
  'positionRefreshFrequency1': POSITION_REFRESH_FREQUENCY,
  'positionRefreshFrequency2': POSITION_REFRESH_FREQUENCY,
  'positionPattern': [
      {1: 'TDOA'},
      {2: 'PDOA'},
      {3: 'TOF单天线'},
      {4: 'TOF双天线'},
      {255: '此值无效'}
    ],
  'unIPDeviceType': DEVICE_TYPE_OBJ,
  'isShowBackside': {0: '不显示', 1: '显示', 255: '此值无效'},
  'trafficLightsFontShap': LIGHT_SHAP,
  'trafficLightsReverseShap': LIGHT_SHAP
}

const numberTurnText = {
  'reader': {
    'enable_simulate_card': {0: '是', 1: '否'},
    'state': { 0: '启用', 1: '停用'},
    'need_power_alarm': {0: '否', 1: '是'},
    'dimension': {1: '一维', 2: '二维'}
  },
  'rt_person_forbid_down_mine': {'status': {0: '否', 1: '是'}
  },
  'work_face': {
    'need_display': {0: '不显', 1: '显'},
    'work_face_type': {1: '采煤面', 2: '掘进面'}
  },
  'coalface': {
    'head_y_pos': {1: '大头', 2: '小头'}
  },
  'drivingface_warning_point': {
    'isvalid': {0: '无效', 1: '有效'}
  },
  'geofault': {
    'workface_type': {1: '采煤面', 2: '掘进面'}
  },
  'light': {
    'special_flag': {0: '正常', 1: '特殊'},
    'physics_light_direction': {0: '反面', 1: '正面'},
    'state': {0: '正常', 1: '故障'}
  },
  'rules': {
    'status': { 0: '否', 1: '是'}
  },
  'area': {
    'is_work_area': {0: '否', 1: '是'},
    'need_display': {0: '检查用户不可见', 1: '所有用户可见'}
  },
  'event_type': {
    'is_show': {0: '是', 1: '否'}
  },
  'sanlv_standart': {
    'sanlv_standart_id': {1: '开机率', 2: '工时利用率', 3: '正规循环率'}
  },
  'lights_group': {
    'state': {0: '正常', 1: '故障'}
  },
  'drivingface_vehicle': {
    'state': {0: '无效', 1: '有效'}
  },
  'coalface_vehicle': {
    'state': {0: '无效', 1: '有效'}
  },
  'user': {
    'is_check': {0: '非检查用户', 1: '检查用户'}
  },
  'credentials_staff': {
    'warn_id': {0: '是', 1: '否'}
  },
  'vehicle_extend': {
    'power_alarm': {0: '不推送', 1: '推送'}
  },
  'map': {
    'default_map': {0:'否', 1: '是'},
    'judge_id': {0: '否', 1: '是'},
    'state_id': {0: '启用', 1: '停用'}
  },
  'sosalarm': {
    'is_showSoundLight': {0: '否', 1: '是'},
    'light': {1: '弱', 2: '中', 3: '高'},
    'sound': {1: '低频', 2: '中频', 3: '高频'}
  },
  'tt_inspection_route_planning': {
    'status': {0: '启用', 1: '停用'}
  },
  'goaf': {
    'need_display': {0: '检查用户不可见', 1: '所有用户可见'}
  },
  'device_params': DEVICE_PARAMS,
  'device_configuration': DEVICE_PARAMS,
  'device_software_update': DEVICE_PARAMS,
  'network_configuration': {
    'deviceType': DEVICE_TYPE_OBJ,
    'enable1': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}],
    'enable2': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}],
    'enable3': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}]
  },
  'device_net_params': {
    'deviceType': DEVICE_TYPE_OBJ,
    'enable1': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}],
    'enable2': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}],
    'enable3': [{0: '不使用'}, {1: '使用'}, {255: '此值无效'}]
  },
  'software_configuration': {
    'deviceType': DEVICE_TYPE_OBJ
  },
  'real_time_debug': {
    'deviceType': DEVICE_TYPE_OBJ
  },
  'power_levels': {
    'battery_type': {
      1: '三元锂',
      2: '铁锂电',
      3: '镍氢电池',
    }
  },
  'device_power': {
    'power_limit': POWER_LIMIT,
    'temperature_limit': TEM_LIMIT
  },
  'staff': {
    'is_vip': {0: '否', 1: '是'}
  },
  'card': {
    'state_id': {0: '启用', 1: '停用'}
  },
  'setting': {
    'value': {'1': '按入井时刻计算', '2': '按班次有效时长计算'}
  },
  'shift_setting': {
    'value': {'1': '按入井时刻计算', '2': '按班次有效时长计算'}
  },
  'credentials_staff': {
    'warn_id': {0: '提醒', 1: '不提醒'}
  },
  'credentials_vehicle': {
    'warn_id': {0: '提醒', 1: '不提醒'}
  },
  'credentials_vehicle': {
    'warn_id': {0: '提醒', 1: '不提醒'}
  },
  'vehicle_category': {
    'color': {
      0: 'green',
      1: 'yellow',
      2: 'red'
    }
  },
  'his_unique_alarm': {
    'channel': {
      1: 1, 
      2: 2,
      3: 3,
      4: 4
    }
  },
  'light_rd_spec_process': {
    'reader_state': {0: '无定位数据', 1: '有定位数据'},
  }
}

export default numberTurnText
