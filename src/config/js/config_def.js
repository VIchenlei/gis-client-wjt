let config = {
  sensor: {
    def: {
      name: 'sensor',
      label: '传感器表',
      table: 'dat_sensor',
      keyIndex: 0,
      fields: {
        names: ['sensor_id', 'sensor_type_id', 'data_source', 'work_face_id', 'driver_alarm_threshold', 'alarm_threshold', 'readers', 'drivers', 'x', 'y', 'z', 'sensor_desc'],
        types: ['NUMBER', 'SELECT', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING'],
        labels: ['编号', '传感器类型', '数据源', '绑定工作面', '通知司机告警阈值', '撤离告警阈值', '绑定分站', '绑定司机', '坐标x', '坐标y', '坐标z', '备注'],
        enableNull: [false, false, false, false, false, false, true, true, true, true, true, true]
      }
    }
  },
  font_size: {
    def: {
      name: 'font_size',
      label: '字体大小',
      table: 'font_size',
      keyIndex: 0,
      fields: {
        names: ['id', 'fontSize'],
        types: ['NUMBER', 'NUMBER'],
        labels: ['编号', '字体倍数'],
        enableNull: [false, false]
      }
    }
  },
  number_bars: {
    def: {
      name: 'number_bars',
      label: '数据条数',
      table: 'number_bars',
      keyIndex: 0,
      fields: {
        names: ['id', 'dataNumber'],
        types: ['NUMBER', 'NUMBER'],
        labels: ['编号', '数据条数'],
        enableNull: [false, false]
      }
    }
  },
  area_ischeck: {
    def: {
      name: 'area',
      label: '区域',
      table: 'dat_area',
      keyIndex: 0, 
      fields: {
        names: ['area_id', 'name', 'area_type_id', 'business_type', 'map_id', 'over_count_person_rp', 'over_count_vehicle', 'over_time_person', 'over_speed_vehicle', 'path', 'angle', 'is_work_area', 'leave_time', 'att_rule_id'], // 字段
        types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'SELECT', 'MORESELECT', 'SELECT'], // 字段类型
        labels: ['区域编号', '区域名称', '区域类型', '区域业务', '所属地图', '人数上限', '车辆上限', '人停留时长上限(分钟)', '车速上限(Km/h)', '区域定义', '车辆角度', '是否是工作区域', '班次早退时间', '区域考勤规则'],
        enableNull: [false, false, false, false, false, false, false, false, false, false, true, true, true, false]
      }
    }
  },
  credentials_staff: {
    def: {
      name: 'credentials_staff',
      label: '资格证信息管理',
      table: 'dat_credentials_staff',
      keyIndex: 0,
      fields: {
        names: ['credentials_staff_id', 'staff_id', 'name', 'dept_id', 'credentials_id', 'credentials_number', 'get_credentials_time', 'expire_time', 'warn_id'], // 字段
        types: ['NUMBER', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'STRING', 'DATE', 'DATE', 'SELECT'], // 字段类型
        labels: ['编号', '员工编号', '姓名', '部门', '证件类型', '证件编号', '取证时间', '到期时间', '是否提醒'],
        enableNull: [false, false, true, false, false, false, true, true, true]
      }
    }
  },
  area: {
    def: {
      name: 'area',
      label: '区域',
      table: 'dat_area',
      keyIndex: 0, // table中key值在 field 中的位置
      fields: {
        names: ['area_id', 'name', 'area_type_id', 'business_type', 'map_id', 'over_count_person', 'over_count_vehicle', 'over_time_person', 'over_speed_vehicle', 'path', 'angle', 'is_work_area', 'leave_time', 'over_count_person_rp', 'need_display', 'att_rule_id'], // 字段
        types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'SELECT', 'MORESELECT', 'NUMBER', 'SELECT', 'SELECT'], // 字段类型
        labels: ['区域编号', '区域名称', '区域类型', '区域业务', '所属地图', '人数上限', '车辆上限', '人停留时长上限(分钟)', '车速上限(Km/h)', '区域定义', '车辆角度', '是否是工作区域', '班次早退时间', '区域核对人数上限', '是否对外展示', '区域考勤规则'],
        enableNull: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false]
      }
    }
  },
  check_map: {
    def: {
      name: 'map',
      label: '地图',
      table: 'dat_map',
      keyIndex: 0, // table中key值在 field 中的位置
      fields: {
        names: ['map_id', 'name', 'url', 'layers', 'map_type', 'scale', 'detail', 'state_id', 'default_map', 'judge_id', 'x', 'y', 'width', 'height', 'minX', 'minY', 'maxX', 'maxY'], // 字段, md5用于更新地图
        types: ['NUMBER', 'STRING', 'STRING', 'STRING', 'STRING', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'], // 字段类型
        labels: ['地图编号', '地图名称', '地图网址', '图层', '类型',  '伸缩比例', '详细描述', '是否有效', '是否默认地图', '是否平铺', '中心x', '中心y', '地图宽', '地图高', '左边界', '上边界', '右边界', '下边界'],
        enableNull: [false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
      }
    }
  },
  map: {
    def: {
      name: 'map',
      label: '地图',
      table: 'dat_map',
      keyIndex: 0, // table中key值在 field 中的位置
      fields: {
        names: ['map_id', 'name', 'url', 'check_layers', 'layers', 'map_type', 'scale', 'detail', 'state_id', 'default_map', 'judge_id', 'x', 'y', 'width', 'height', 'minX', 'minY', 'maxX', 'maxY'], // 字段, md5用于更新地图
        types: ['NUMBER', 'STRING', 'STRING', 'STRING',  'STRING', 'STRING', 'NUMBER', 'STRING', 'SELECT', 'SELECT', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'], // 字段类型
        labels: ['地图编号', '地图名称', '地图网址', '检查图层', '图层', '类型',  '伸缩比例', '详细描述', '是否有效', '是否默认地图', '是否平铺', '中心x', '中心y', '地图宽', '地图高', '左边界', '上边界', '右边界', '下边界'],
        enableNull: [false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
      }
    }
  },
  vehicle_type: {
    def: {
      name: 'vehicle_type',
      label: '车辆类型',
      table: 'dat_vehicle_type',
      keyIndex: 0, // table中key值在 field 中的位置
      fields: {
        names: ['vehicle_type_id', 'name', 'rank', 'capacity', 'vehicle_category_id', 'vehicle_level_id', 'att_rule_id'], // 字段
        types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'SELECT', 'SELECT', 'SELECT'], // 字段类型
        labels: ['车辆类型编号', '车辆类型名称', '车辆类型排序', '车辆载荷能力(吨)', '车辆类型', '车辆等级', '车辆考勤规则'],
        enableNull: [false, false, false, false, false, false, false]
      }
    }
  }
}

export {config}