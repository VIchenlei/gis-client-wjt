let deviceUpdataDef = {
  'device_net_params': {
    label: '设备网络参数',
    name: 'device_net_params',
    keyIndex: 0,
    table: 'device_net_params',
    fields: {
      names: ['ip', 'netmask'], // 字段
      types: ['STRING', 'STRING'], // 字段类型
      labels: ['IP地址', '子网掩码']
    }
  },
  'network_configuration': {
    label: '网络参数信息',
    name: 'network_configuration',
    keyIndex: 0,
    table: 'network_configuration',
    fields: {
      names: ['deviceAddress', 'deviceType', 'ip', 'port', 'subnetMask', 'defaultGateway', 'mac', 'aimsIP1', 'aimsPort1', 'tdoaPort1', 'enable1', 'aimsIP2', 'aimsPort2', 'tdoaPort2', 'enable2', 'aimsIP3', 'aimsPort3', 'tdoaPort3', 'enable3'],
      types: ['NUMBER', 'SELECT', 'STRING', 'NUMBER', 'STRING', 'STRING', 'STRING', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'STRING', 'NUMBER', 'NUMBER', 'SELECT'],
      labels: ['设备ID', '设备类型', 'IP地址', '端口', '子网掩码', '默认网关', '物理地址MAC', '目标IP1', '目标端口1', 'TDOA端口1', '是否使用', '目标IP2', '目标端口2', 'TDOA端口2', '是否使用', '目标IP3', '目标端口3', 'TDOA端口3', '是否使用'],
      selects: [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  'device_configuration': {
    label: '设备参数信息',
    name: 'device_configuration',
    keyIndex: 0,
    table: 'device_configuration',
    fields: {
      names: ['deviceType', 'childDeviceAddress', 'uploadInterval', 'reconnectInterval', 'receivingFrequencyPoint1', 'receivingFrequencyPoint2', 'canid', 'trafficLightNums', 'programVersion', 'antennaDelay1', 'antennaDelay2', 'tdoaTimeFrame', 'isShowBackside', 'timeSynchronization', 'readerAreaID', 'trafficLightsFontShap', 'trafficLightsReverseShap', 'trafficLightsFontColor', 'trafficLightsReverseColor', 'uploadHartbeat', 'transmitPower1', 'communicationRate1', 'pulseReptFrequency1', 'preambleCode1', 'preambleCodeLength1', 'PAC1', 'transmitPower2', 'communicationRate2', 'pulseReptFrequency2', 'preambleCode2', 'preambleCodeLength2', 'PAC2', 'broadcastDuration', 'BlinkDuration', 'responseDuration', 'FinalDuration', 'afterPositionDormat', 'confictDormat', 'ACKDuration', 'checkingDuration', 'rangingDuration', 'dormancyStatus', 'signalDuration', 'positionPattern'],
      types: ['SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'NUMBER', 'SELECT'],
      labels: ['设备类型', '设备地址', '上传间隔', '重连间隔', '接收频点(第一路DW1000)', '接收频点(第二路DW1000)', 'CANID', '组内数量', '程序版本', '天线1延迟值', '天线2延迟值', 'TDOA时间节点', '红绿灯是否显示背面面板', '分站时间同步上级分站', '分站区域编号', '红绿灯正面显示形状', '红绿灯反面显示形状', '离线正面显示时长', '离线反面显示时长', '通信分站是否上传心跳', '第一路DW1000发射功率', '第一路DW1000通信速率', '第一路DW1000脉冲重复频率', '第一路DW1000前导码', '第一路DW1000长度', '第一路DW1000PAC', '第二路DW1000发射功率', '第二路DW1000通信速率', '第二路DW1000脉冲重复频率', '第二路DW1000前导码', '第二路DW1000长度', '第二路DW1000PAC', '广播时长', '设置Blink时长', '设置侦听Response时长', '设置侦听Final时长', '设置定位完成后休眠时长', '设置冲突时休眠时长', '设置侦听ACK时长', '设置Checking时长', '设置Ranging时长', '休眠状态', '侦听信号时长', '定位模式'],
      selects: [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  'software_configuration': {
    label: '设备软件信息',
    name: 'software_configuration',
    keyIndex: 0,
    table: 'software_configuration',
    fields: {
      names: ['deviceAddress', 'deviceType', 'ip', 'programVersion'],
      types: ['NUMBER', 'SELECT', 'STRING', 'STRING'],
      labels: ['设备编号', '设备类型', 'IP地址', '版本号'],
      selects: [false, true, false, false]
    }
  },
  'device_power': {
    name: 'device_power',
    label: '设备电源',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'device_type_id', 'ip', 'install_date'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'DATE'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备类型', 'IP地址', '安装日期'],
      enableNull: [false, false, false, false, false, false, false, false]
    }
  },
  'staff_software_update': {
    name: 'staff_software_update',
    label: '标识卡软件升级',
    table: 'staff_software_update',
    keyIndex: 0,
    fields: {
      names: ['card_id', 'card_type_id', 'ident', 'hw_version'],
      types: ['NUMBER', 'SELECT', 'NUMBER', 'STRING'],
      labels: ['卡号', '卡类型', '卡标识', '版本'],
      selects: [false, true, false, true]
    }
  }
}

const DEVICE_TYPE = [
  {
    id: 0,
    name: '不带IP分站'
  },
  {
    id: 1,
    name: '大分站'
  },
  {
    id: 2,
    name: '小分站'
  },
  {
    id: 3,
    name: '读卡分站'
  },
  {
    id: 4,
    name: '通信分站'
  },
  {
    id: 5,
    name: '红绿灯'
  },
  {
    id: 6,
    name: 'can中继'
  },
  {
    id: 7,
    name: '监控分站'
  },
  {
    id: 8,
    name: '通信基站'
  },
  {
    id: 9,
    name: 'PDOA分站'
  },
  {
    id: 10,
    name: '转发分站'
  },
  {
    id: 11,
    name: '报警控制器'
  },
  {
    id: 12,
    name: '隔爆电源'
  },
  {
    id: 13,
    name: '搜救仪'
  },
  {
    id: 145,
    name: '人员标识卡'
  },
  {
    id: 146,
    name: '车载定位器'
  },
  {
    id: 147,
    name: '自组网卡'
  },
  {
    id: 148,
    name: '采煤机卡'
  },
  {
    id: 149,
    name: '掘进机卡'
  },
  {
    id: 150,
    name: '模拟卡（小分站模拟车卡）'
  },
  {
    id: 151,
    name: '工装'
  }
]

const FIELD = {
  device_net_params: [
    {
      field_label: '目标IP设备ID',
      field_name: 'deviceAddress',
      field_type: 'STRING',
      field_enableNull: true
    },
    {
      field_label: '目标IP设备类型',
      field_name: 'deviceType',
      dataName: 'device_configuration',
      field_type: 'SELECT',
      field_enableNull: true
    }
  ],
  device_params: [
    {
      field_label: '目标IP设备ID',
      field_name: 'deviceAddress',
      field_type: 'STRING',
      field_enableNull: true
    },
    {
      field_label: '目标IP设备类型',
      field_name: 'deviceType',
      dataName: 'device_configuration',
      field_type: 'SELECT',
      field_enableNull: true
    },
    {
      field_label: '目标非IP设备ID',
      field_name: 'unIPDeviceAddress',
      field_type: 'STRING',
      field_enableNull: true
    },
    {
      field_label: '目标非IP设备类型',
      field_name: 'unIPDeviceType',
      dataName: 'device_configuration',
      field_type: 'SELECT',
      field_enableNull: true
    }
  ],
  device_software_update: [
    {
      field_label: '目标IP设备ID',
      field_name: 'deviceAddress',
      field_type: 'STRING',
      field_enableNull: true
    },
    {
      field_label: '目标IP设备类型',
      field_name: 'deviceType',
      dataName: 'device_configuration',
      field_type: 'SELECT',
      field_enableNull: true
    },
    {
      field_label: '目标非IP设备ID',
      field_name: 'unIPDeviceAddress',
      field_type: 'STRING',
      field_enableNull: true
    },
    {
      field_label: '目标非IP设备类型',
      field_name: 'unIPDeviceType',
      dataName: 'device_configuration',
      field_type: 'SELECT',
      field_enableNull: true
    }
  ]
}

export {deviceUpdataDef, DEVICE_TYPE, FIELD}
