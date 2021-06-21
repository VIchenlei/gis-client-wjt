const searchList = [
  {
    field_name: 'staffs',
    field_label: '员工',
    field_type: 'SELECT',
    field_enableNull: true,
    show: true,
    name: 'ds.name' // 按检索导出人员信息使用
  },
  {
    field_name: 'vehicles',
    field_label: '车辆',
    field_type: 'SELECT',
    field_enableNull: true,
    show: true,
    name: 'dv.name'
  },
  {
    field_name: 'dept',
    field_label: '部门',
    field_type: 'SELECT',
    field_enableNull: true,
    show: true,
    name: 'd.dept_id'
  },
  {
    field_name: 'select_card',
    field_label: '卡号',
    field_type: 'SELECT',
    field_enableNull: true,
    show: true,
    name: 'd.card_id'
  }
]

export default searchList
