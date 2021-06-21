const spliceDef = {
  'over_speed_vehicle': [
    // {field_name: 'rcspeed', field_label: '人车速度', field_value: '', field_type: 'NUMBER', field_enableNull: true, key: 1},
    // {field_name: 'lcspeed', field_label: '料车速度', field_value: '', field_type: 'NUMBER', field_enableNull: true, key: 2},
    // {field_name: 'tzcspeed', field_label: '特种车速度', field_value: '', field_type: 'NUMBER', field_enableNull: true, key: 3},
  ],
  'reader_planning': [
    {field_name: 'reader_id', field_label: '分站编号', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'plan_one_time', field_label: '计划到达时间1', field_value: '', field_type: 'TIME', field_enableNull: true},
    {field_name: 'plan_two_time', field_label: '计划到达时间2', field_value: '', field_type: 'TIME', field_enableNull: true},
  ],
  'route_planning': [
    {field_name: 'id', field_label: '路径编号', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'stay_time', field_label: '停留时长', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'b_x', field_label: '起始点x', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'b_y', field_label: '起始点y', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'e_x', field_label: '结束点x', field_value: '', field_type: 'NUMBER', field_enableNull: true},
    {field_name: 'e_y', field_label: '结束点y', field_value: '', field_type: 'NUMBER', field_enableNull: true},
  ]
}
export { spliceDef }