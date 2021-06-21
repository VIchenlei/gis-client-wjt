let allMt = {
  staff_staff_extend: {
    name: 'staff/staff_extend',
    label: '员工信息管理',
    table: 'dat_staff/dat_staff_extend',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['staff_id', 'name', 'dept_id', 'dept_id_ck', 'worktype_id', 'occupation_id', 'lampNo', 'certification', 'blood', 'birthday', 'card_id', 'marry_id', 'education_id', 'telephone', 'address'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'DATE', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING'], // 字段类型
      labels: ['员工编号', '姓名', '部门', '虚拟部门', '工种', '职务', '灯架号', '身份证号', '血型', '出生日期', '卡号', '婚姻状况', '学历', '联系电话', '地址'],
      enableNull: [false, false, true, true, true, true, true, false, true, true, false, true, true, true, true]
    }
  },
  vehicle_vehicle_extend: {
    name: 'vehicle/vehicle_extend',
    label: '车辆信息管理',
    table: 'dat_vehicle/dat_vehicle_extend',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['vehicle_id', 'name', 'vehicle_type_id', 'card_id', 'dept_id', 'group_id', 'shift_type_id'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'SELECT', 'SELECT'], // 字段类型
      labels: ['车辆编号', '名称', '类型', '卡号', '部门', '组号', '班次'],
      enableNull: [false, false, false, false, true, true, true]
    }
  },
  device_power: {
    label: '设备电源',
    name: 'device_power',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'reader_id', 'device_type_id', 'ip', 'install_date', 'power_limit', 'temperature_limit', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备名称', '设备类型', 'IP地址', '安装日期', '电量下限(%)', '温度上限(℃)', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z'],
      enableNull: [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, true]
    }
  }
}

let anyMt = {
  staff_staff_extend: {
    name: 'staff/staff_extend',
    label: '员工信息管理',
    table: 'dat_staff/dat_staff_extend',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['staff_id', 'name', 'dept_id_ck', 'worktype_id', 'occupation_id', 'lampNo', 'certification', 'blood', 'birthday', 'card_id', 'marry_id', 'education_id', 'telephone', 'address'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'DATE', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING'], // 字段类型
      labels: ['员工编号', '姓名', '部门', '工种', '职务', '灯架号', '身份证号', '血型', '出生日期', '卡号', '婚姻状况', '学历', '联系电话', '地址'],
      enableNull: [false, false, true, true, true, true, false, true, true, false, true, true, true, true]
    }
  },
  vehicle_vehicle_extend: {
    name: 'vehicle/vehicle_extend',
    label: '车辆信息管理',
    table: 'dat_vehicle/dat_vehicle_extend',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['vehicle_id', 'name', 'vehicle_type_id', 'card_id', 'dept_id', 'group_id', 'shift_type_id'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'SELECT'], // 字段类型
      labels: ['车辆编号', '名称', '类型', '卡号', '部门', '组号', '班次'],
      enableNull: [false, false, false, false, true, true, true]
    }
  },
  device_power: {
    label: '设备电源',
    name: 'device_power',
    table: 'dat_device_power',
    keyIndex: 0,
    fields: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'reader_id', 'device_type_id', 'ip', 'install_date', 'power_limit', 'temperature_limit', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备名称', '设备类型', 'IP地址', '安装日期', '电量下限(%)', '温度上限(℃)', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z'],
      enableNull: [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, true]
    }
  }
}

let childTag = {
  credentials: {
    name: 'credentials_staff',
    label: '资格证信息管理',
    table: 'dat_credentials_staff',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['staff_id', 'name', 'dept_id'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT'], // 字段类型
      labels: ['员工编号', '姓名', '部门']
    }
  },
  dat_credentials_staff: {
    name: 'credentials_staff',
    label: '资格证信息管理',
    table: 'dat_credentials_staff',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['credentials_staff_id', 'staff_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time','warn_id'], // 字段
      types: ['NUMBER', 'NUMBER', 'SELECT', 'STRING', 'DATE', 'DATE','SELECT'], // 字段类型
      labels: ['编号', '员工编号', '证件类型', '证件编号', '取证时间', '到期时间','是否提醒'],
      enableNull: [false, false, false, true, true, true, true]
    }
  },
  dat_credentials_vehicle: {
    name: 'credentials_vehicle',
    label: '资格证信息管理',
    table: 'dat_credentials_vehicle',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['credentials_vehicle_id', 'vehicle_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time','warn_id'], // 字段
      types: ['NUMBER', 'NUMBER', 'SELECT', 'STRING', 'DATE', 'DATE','SELECT'], // 字段类型
      labels: ['编号', '车辆编号', '证件类型', '证件编号', '取证时间', '到期时间','是否提醒'],
      enableNull: [false, false, false, false, true, true, true, true]
    }
  }
}

let askFileMsg = {
  'credentials_staff': {
    title: '人员资格证信息',
    sql: `select dcs.staff_id, dcs.credentials_id, dcs.credentials_number, dcs.get_credentials_time,dcs.expire_time,dcs.warn_id from dat_credentials_staff dcs left join dat_staff ds on ds.staff_id = dcs.staff_id left join dat_staff_extend d on d.staff_id = ds.staff_id where 1=1 {needDisplay} and ds.staff_id is not null {diffDepts};`
  },
  'staff': {
    title: '人员基本信息',
    sql: `select ds.staff_id, ds.name, {exprString} d.worktype_id, d.occupation_id, d.lampNo, concat(ds.certification, '\t'), ds.blood, ds.birthday, d.card_id, ds.marry_id, ds.education_id, ds.telephone, ds.address from dat_staff ds left join dat_staff_extend d on d.staff_id = ds.staff_id where 1=1 {needDisplay} {diffDepts};`
  },
  'credentials_vehicle': {
    title: '车辆资格证信息',
    sql: `select dcs.vehicle_id, dcs.credentials_id, dcs.credentials_number, dcs.get_credentials_time,dcs.expire_time,dcs.warn_id from dat_credentials_vehicle dcs left join dat_vehicle ds on ds.vehicle_id = dcs.vehicle_id left join dat_vehicle_extend d on d.vehicle_id = ds.vehicle_id where 1=1 {needDisplay} and ds.vehicle_id is not null {diffDepts};`
  },
  'vehicle': {
    title: '车辆基本信息',
    sql: `select dv.vehicle_id, dv.name, dv.vehicle_type_id, d.card_id, d.dept_id, d.group_id, d.shift_type_id from dat_vehicle dv left join dat_vehicle_extend d on d.vehicle_id = dv.vehicle_id where 1=1 {needDisplay} {diffDepts};`
  }
}

let allMsg = {
  'staff': {
    table: {
      names: ['staff_id', 'name', 'dept_id', 'dept_id_ck', 'worktype_id', 'occupation_id', 'lampNo', 'certification', 'blood', 'birthday', 'card_id', 'marry_id', 'education_id', 'telephone', 'address'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'DATE', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING'], // 字段类型
      labels: ['员工编号', '姓名', '部门', '虚拟部门', '工种', '职务', '灯架号', '身份证号', '血型', '出生日期', '卡号', '婚姻状况', '学历', '联系电话', '地址']
    }
  },
  'vehicle': {
    table: {
      names: ['vehicle_id', 'name', 'vehicle_type_id', 'card_id', 'dept_id', 'group_id', 'shift_type_id'],
      types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'SELECT', 'SELECT'],
      labels: ['车辆编号', '名称', '类型', '卡号', '部门', '组号', '班次']
    }
  },
  'credentials_staff': {
    table: {
      names: ['staff_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time', 'warn_id'],
      types: ['SELECT', 'SELECT', 'STRING', 'DATE', 'DATE', 'SELECT'],
      labels: ['员工姓名', '证件类型', '证件编号', '取证时间', '到期时间', '是否提醒'],
    }
  },
  'credentials_vehicle': {
    table: {
      names: ['vehicle_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time', 'warn_id'],
      types: ['SELECT', 'SELECT', 'STRING', 'DATE', 'DATE', 'SELECT'],
      labels: ['车辆名称', '证件类型', '证件编号', '取证时间', '到期时间', '是否提醒'],
    }
  },
  'device_power': {
    table: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'reader_id', 'device_type_id', 'ip', 'install_date', 'power_limit', 'temperature_limit', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备名称', '设备类型', 'IP地址', '安装日期', '电量下限(%)', '温度上限(℃)', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z']
    }
  }
}

let anyMsg = {
  'staff': {
    table: {
      names: ['staff_id', 'name', 'dept_id_ck', 'worktype_id', 'occupation_id', 'lampNo', 'certification', 'blood', 'birthday', 'card_id', 'marry_id', 'education_id', 'telephone', 'address'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'STRING', 'STRING', 'DATE', 'NUMBER', 'SELECT', 'SELECT', 'STRING', 'STRING'], // 字段类型
      labels: ['员工编号', '姓名', '部门', '工种', '职务', '灯架号', '身份证号', '血型', '出生日期', '卡号', '婚姻状况', '学历', '联系电话', '地址']
    }
  },
  'vehicle': {
    table: {
      names: ['vehicle_id', 'name', 'vehicle_type_id', 'card_id', 'dept_id', 'group_id', 'shift_type_id'],
      types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'SELECT', 'SELECT'],
      labels: ['车辆编号', '名称', '类型', '卡号', '部门', '组号', '班次']
    }
  },
  'credentials_staff': {
    table: {
      names: ['staff_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time', 'warn_id'],
      types: ['SELECT', 'SELECT', 'STRING', 'DATE', 'DATE', 'SELECT'],
      labels: ['员工姓名', '证件类型', '证件编号', '取证时间', '到期时间', '是否提醒'],
    }
  },
  'credentials_vehicle': {
    table: {
      names: ['vehicle_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time', 'warn_id'],
      types: ['SELECT', 'SELECT', 'STRING', 'DATE', 'DATE', 'SELECT'],
      labels: ['车联名称', '证件类型', '证件编号', '取证时间', '到期时间', '是否提醒'],
    }
  },
  'device_power': {
    table: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage', 'device_id', 'reader_id', 'device_type_id', 'ip', 'install_date', 'power_limit', 'temperature_limit', 'map_id', 'area_id', 'x', 'y', 'z'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT', 'STRING', 'DATE', 'SELECT', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压', '设备编号', '设备名称', '设备类型', 'IP地址', '安装日期', '电量下限(%)', '温度上限(℃)', '所属地图', '所属区域', '坐标x', '坐标y', '坐标z']
    }
  }
}

//table中初始化时需要展示的字段
let basicMsg = {
  'staff': {
    table: {
      names: ['staff_id', 'name', 'ident', 'dept_id', 'dept_id_ck'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'SELECT', 'SELECT'],
      labels: ['员工编号', '姓名', '卡号', '部门', '虚拟部门']
    }
  },
  'vehicle': {
    table: {
      names: ['vehicle_id', 'name', 'ident', 'dept_id'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'SELECT'],
      labels: ['车辆编号', '车辆名称', '卡号', '部门']
    }
  },
  'device_power': {
    table: {
      names: ['device_power_id', 'power_model', 'power_number', 'reted_supply_voltage'],
      types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER'],
      labels: ['电源编号', '电源型号', '电源序号', '额定供电电压']
    }
  }
}

export { allMt, anyMt, allMsg, anyMsg, childTag, askFileMsg, basicMsg }