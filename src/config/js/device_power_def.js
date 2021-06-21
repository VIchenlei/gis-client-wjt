/*电源设备展示部分字段*/
const devicePowerDef = {
  'device_power': {
    label: '设备电源',
    name: 'device_power',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压'],
      enableNull: [false, false, false, false, false, false]
    }
  }
}

/*电源设备展示全部字段*/
const devicePowerMoreDef = {
  'device_power': {
    label: '设备电源',
    name: 'device_power',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'reader_id', 'device_type_id', 'ip', 'install_date', 'power_limit', 'temperature_limit', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备名称', '设备类型', 'IP地址', '安装日期', '电量下限(%)', '温度上限(℃)', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z'],
      enableNull: [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false]
    }
  }
}

const updateDef = {
  'power': {
    label: '实时数据',
    name: 'power',
    fields: {
      labels: ['设备地址', '设备类型', '强制放电', '交流供电状态', '交流供电电压（v）', '电池当前电压（v）', '电池当前电流（mA）', '电池当前电量', '电池当前温度（℃）', '电池累计充放电次数', '电池累计充放电时间（h）', '功率器件当前温度（℃）', '直流输出电压（v）'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'COLOR', 'NUMBER', 'NUMBER', 'NUMBER', 'COLOR', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'],
      names: ['deviceAddress', 'deviceType', 'power_rode', 'excharge_state', 'supply_voltage', 'voltage', 'electricity', 'power', 'temperature', 'charge_discharge_num', 'charge_discharge_time', 'power_temperature', 'dc_voltage'],
      enableNull: [true, true, true, true, true, true, true, true, true, true, true, true, true]
    }
  }
}

/*电路信息导入*/
const powerLevelsDef = {
  'dat_power_levels': {
    name: 'power_levels',
    label: '多路电池信息',
    table: 'dat_power_levels',
    keyIndex: 0,
    fields: {
      names: ['id', 'power_levels_id', 'device_power_id', 'battery_number', 'battery_model', 'battery_type', 'rated_voltage', 'discharge_voltage', 'capacity', 'discharge_voltage_cycle', 'discharge_voltage_time'],
      types: ['NUMBER', 'NUMBER', 'SELECT', 'NUMBER', 'STRING', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['编号','电路编号', '电源编号', '电池编号', '电池型号', '电池类型', '额定电压', '放电截止电压', '标称容量(mAH)', '强制放电周期', '标准放电时间'],
      enableNull: [false, false, false, false, false, false, false, false, false, false, false]
    }
  }
}

export { devicePowerDef, devicePowerMoreDef, updateDef, powerLevelsDef }