let askFileSql = {
  'rt_person_forbid_down_mine': `select fdm.staff_id, name, dept_id,start_time,oper_time,oper_user from rt_person_forbid_down_mine fdm LEFT JOIN dat_staff ds ON fdm.staff_id = ds.staff_id LEFT JOIN dat_staff_extend{CK} dse ON ds.staff_id = dse.staff_id where name is not null and status = 1 {exprString}{deptID};`,
  'credentials_staff': `SELECT credentials_staff_id, dcs.staff_id, ds.name, dd.name as dname, dcs.credentials_id, dcs.credentials_number, dcs.get_credentials_time,dcs.expire_time,dcs.warn_id FROM dat_credentials_staff dcs LEFT JOIN dat_staff ds ON ds.staff_id = dcs.staff_id LEFT JOIN dat_staff_extend{CK} dse ON dse.staff_id = ds.staff_id LEFT JOIN dat_dept{CK} dd ON dd.dept_id = dse.dept_id WHERE 1=1 AND ds.staff_id IS NOT NULL {exprString}{deptID};`,
  'tt_inspection_route_planning': `SELECT tt.staff_id, ds.name, dd.name as dname, STATUS, route_planning,reader_planning FROM tt_inspection_route_planning tt LEFT JOIN dat_staff ds ON tt.staff_id = ds.staff_id LEFT JOIN dat_staff_extend{CK} dse ON ds.staff_id = dse.staff_id LEFT JOIN dat_dept{CK} dd ON dd.dept_id = dse.dept_id WHERE 1=1 AND ds.staff_id IS NOT NULL {exprString}{deptID};`
}

let askFileDef = {
  'tt_inspection_route_planning': {
    name: 'tt_inspection_route_planning',
    label: '路径',
    table: 'tt_inspection_route_planning',
    keyIndex: 0,
    fields: {
      names: ['staff_id', 'name', 'dept_id', 'status', 'route_planning', 'reader_planning'],
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT', 'STRING', 'STRING'],
      labels: ['员工编号', '姓名', '部门', '状态', '路径信息', '分站计划'],
      enableNull: [false, false, true, false, false, true]
    }
  },
  'area': {
    name: 'area',
    label: '区域',
    table: 'dat_area',
    keyIndex: 0, // table中key值在 field 中的位置
    fields: {
      names: ['area_id', 'name', 'area_type_id', 'business_type', 'map_id', 'over_count_person', 'over_count_vehicle', 'over_time_person', 'over_speed_vehicle', 'path', 'angle', 'is_work_area', 'over_count_person_rp', 'need_display'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'SELECT', 'MORESELECT', 'NUMBER', 'SELECT'], // 字段类型
      labels: ['区域编号', '区域名称', '区域类型', '区域业务', '所属地图', '人数上限', '车辆上限', '人停留时长上限(分钟)', '车速上限(Km/h)', '区域定义', '车辆角度', '是否是工作区域', '区域核对人数上限', '是否对外展示'],
      enableNull: [false, false, false, false, false, false, false, false, false, false, true, true, true, false]
    }
  },
  'area_ischeck': {
    name: 'area',
    label: '区域',
    table: 'dat_area',
    keyIndex: 0, 
    fields: {
      names: ['area_id', 'name', 'area_type_id', 'business_type', 'map_id', 'over_count_person_rp', 'over_count_vehicle', 'over_time_person', 'over_speed_vehicle', 'path', 'angle', 'is_work_area'], // 字段
      types: ['NUMBER', 'STRING', 'SELECT', 'NUMBER', 'SELECT', 'NUMBER', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'SELECT'], // 字段类型
      labels: ['区域编号', '区域名称', '区域类型', '区域业务', '所属地图', '人数上限', '车辆上限', '人停留时长上限(分钟)', '车速上限(Km/h)', '区域定义', '车辆角度', '是否是工作区域'],
      enableNull: [false, false, false, false, false, false, false, false, false, false, true, true]
    }
  },
  'check_map': {
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
  },
  'map': {
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
  },
  'staff_software_update': {
    name: 'staff_software_update',
    label: '标识卡软件升级',
    table: 'staff_software_update',
    keyIndex: 0,
    fields: {
      names: ['card_id', 'card_type_id', 'ident', 'hw_version', 'dname', 'name'],
      types: ['NUMBER', 'SELECT', 'NUMBER', 'STRING', 'STRING', 'STRING'],
      labels: ['卡号', '卡类型', '卡标识', '版本', '部门', '名称'],
      selects: [false, true, false, true, true, true]
    }
  }
}

export { askFileSql, askFileDef }