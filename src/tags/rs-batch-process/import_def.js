// 导入特殊配置
let importDef = {
  rt_person_forbid_down_mine: {
    label: '禁止下井人员表',
    name: 'rt_person_forbid_down_mine',
    keyIndex: 0,
    table: 'rt_person_forbid_down_mine',
    fields: {
      labels: ['员工编号', '姓名', '部门'],
      names: ['staff_id', 'name', 'dept_id'],
      types: ['NUMBER', 'STRING', 'SELECT'],
      enableNull: [false, false, false]
    }
  },
  credentials_staff: {
    name: 'credentials_staff',
    label: '人员资格证信息管理',
    table: 'dat_credentials_staff',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['credentials_staff_id', 'staff_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time','warn_id'], // 字段
      types: ['NUMBER', 'NUMBER', 'SELECT', 'STRING', 'DATE', 'DATE','SELECT'], // 字段类型
      labels: ['编号', '员工编号', '证件类型', '证件编号', '取证时间', '到期时间','是否提醒'],
      enableNull: [false, false, false, true, true, true, true]
    }
  },
  credentials_vehicle: {
    name: 'credentials_vehicle',
    label: '车辆资格证信息管理',
    table: 'dat_credentials_vehicle',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['credentials_vehicle_id', 'vehicle_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time','warn_id'], // 字段
      types: ['NUMBER', 'NUMBER', 'SELECT', 'STRING', 'DATE', 'DATE','SELECT'], // 字段类型
      labels: ['编号', '车辆编号', '证件类型', '证件编号', '取证时间', '到期时间','是否提醒'],
      enableNull: [false, false, false, false, true, true, true, true]
    }
  },
  dat_device_power: {
    label: '设备电源',
    name: 'device_power',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'device_type_id', 'ip', 'install_date', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备类型', 'IP地址', '安装日期', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z'],
      enableNull: [false, false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  dat_power_levels: {
    name: 'power_levels',
    label: '多路电池信息',
    table: 'dat_power_levels',
    keyIndex: 0,
    fields: {
      names: ['power_levels_id', 'device_power_id', 'battery_number', 'battery_model', 'battery_type', 'rated_voltage', 'discharge_voltage', 'capacity', 'discharge_voltage_cycle', 'discharge_voltage_time'],
      types: ['NUMBER', 'SELECT', 'NUMBER', 'STRING', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电路编号', '电源编号', '电池编号', '电池型号', '电池类型', '额定电压', '放电截止电压', '标称容量(mAH)', '强制放电周期', '标准放电时间'],
      enableNull: [false, false, false, false, false, false, false, false, false, false]
    }
  },
  reader: {
    name: 'reader',
    label: '分站',
    table: 'dat_reader',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['reader_id', 'reader_type_id', 'name', 'brief_name', 'map_id', 'area_id', 'x', 'y', 'z', 'angle', 'state', 'ip', 'device_type_id', 'dimension', 'enable_simulate_card', 'need_power_alarm'], // 字段
      types: ['NUMBER', 'SELECT', 'STRING', 'STRING', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'SELECT', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT'], // 字段类型
      labels: ['分站编号', '分站类型', '分站名称', '分站简称', '所属地图', '所属区域', '坐标X', '坐标Y', '坐标Z', '分站仰角', '分站状态', 'IP', '设备类型', '定位维度', '是否可以模拟成定位卡', '掉电告警'],
      enableNull: [false, false, false, true, false, false, false, false, true, false, false, true, false, false, false, false]
    }
  }
}

export default importDef