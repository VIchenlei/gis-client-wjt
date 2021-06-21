let toolbarItems = [ {
  icon: 'vehicle',
  name: '显示/隐藏车辆',
  class: 'active',
  menuID: 'MO-B-001'
}, {
  icon: 'staff',
  name: '显示/隐藏人员',
  class: 'active',
  menuID: 'MO-B-002'
}, {
  icon: 'visual',
  name: '图层显隐',
  menuID: 'MO-B-003'
}, {
  icon: 'magnifier',
  name: '自定义区域搜索人或车',
  menuID: 'MO-B-004'
}, {
  icon: 'measure',
  name: '测量',
  menuID: 'MO-B-005'
}, {
  icon: 'edit_map',
  name: '坐标',
  menuID: 'MO-B-006'
},
{
  icon: 'visualarea',
  name: '显示区域',
  menuID: 'MO-B-007'
},
{
  icon: 'switch_map',
  name: '切换地图',
  menuID: 'MO-B-008'
}
]

let visual = [{
  icon: 'reader',
  name: '分站',
  menuID: 'MO-B-009'
},
{
  icon: 'light',
  name: '红绿灯',
  menuID: 'MO-B-040'
},
{
  icon: 'fade_area',
  name: '分站盲区',
  menuID: 'MO-B-035'
},
// {
//   icon: 'camera',
//   name: '摄像头',
//   menuID: 'MO-B-010'
// },
{
  icon: 'landmark',
  name: '地标',
  menuID: 'MO-B-011'
},
{
  icon: 'reset',
  name: '全图',
  menuID: 'MO-B-012'
}, {
  icon: 'fault',
  name: '断层',
  menuID: 'MO-B-013'
}, 
// {
//   icon: 'underground',
//   name: '三线',
//   menuID: 'MO-B-014'
// },
{
  icon: 'areaStaff',
  name: '区域人员',
  class: 'active',
  menuID: 'MO-B-015'
},{
  icon: 'readerPath',
  name: '分站路径',
  menuID: 'MO-B-037'
},{
  icon: 'antenna',
  name: '天线',
  menuID: 'MO-B-041'
}
]

let visualarea = [{
  icon: 'area_1',
  name: '普通区域',
  menuID: 'MO-B-029'
}, {
  icon: 'area_3',
  name: '禁入区域',
  menuID: 'MO-B-030'
}, {
  icon: 'area_5',
  name: '猴车区域',
  menuID: 'MO-B-031'
}, {
  icon: 'area_6',
  name: '考勤区域',
  menuID: 'MO-B-032'
}, {
  icon: 'area_1001',
  name: '特殊区域',
  menuID: 'MO-B-033'
}, {
  icon: 'area_2000',
  name: '工作面区域',
  menuID: 'MO-B-034'
}]

let magnifier = [{
  icon: 'rect_query_vehicle',
  name: '矩形查车',
  menuID: 'MO-B-016'
}, {
  icon: 'circle_query_vehicle',
  name: '圆形查车',
  menuID: 'MO-B-017'
}, {
  icon: 'poly_query_vehicle',
  name: '多边形查车',
  menuID: 'MO-B-018'
}, {
  icon: 'rect_query_staff',
  name: '矩形查人',
  menuID: 'MO-B-019'
}, {
  icon: 'circle_query_staff',
  name: '圆形查人',
  menuID: 'MO-B-020'
}, {
  icon: 'poly_query_staff',
  name: '多边形查人',
  menuID: 'MO-B-021'
}]

let magnifierDef = {
  'rect_query_vehicle': {
    type: 2,
    shape: 'Box'
  },
  'circle_query_vehicle': {
    type: 2,
    shape: 'Circle'
  },
  'poly_query_vehicle': {
    type: 2,
    shape: 'Polygon'
  },
  'rect_query_staff': {
    type: 1,
    shape: 'Box'
  },
  'circle_query_staff': {
    type: 1,
    shape: 'Circle'
  },
  'poly_query_staff': {
    type: 1,
    shape: 'Polygon'
  }
}

let measure = [{
  icon: 'measure_length',
  name: '长度',
  menuID: 'MO-B-022'
}, {
  icon: 'measure_area',
  name: '面积',
  menuID: 'MO-B-023'
}, {
  icon: 'edit_area',
  name: '新增区域',
  menuID: 'MO-B-024'
}, {
  icon: 'edit_landmark',
  name: '新增地标',
  menuID: 'MO-B-025'
}, {
  icon: 'edit_forbid_area',
  name: '新增禁区',
  menuID: 'MO-B-026'
}, {
  icon: 'edit_forbid_bstation',
  name: '新增分站',
  menuID: 'MO-B-027'
}, {
  icon: 'edit_route_plan',
  name: '设定路线',
  menuID: 'MO-B-028'
},
{
  icon: 'edit_goaf',
  name: '新增采空区',
  menuID: 'MO-B-036'
},
{
  icon: 'edit_point',
  name: '新增相交点',
  menuID: 'MO-B-038'
},
{
  icon: 'delete_point',
  name: '删除相交点',
  menuID: 'MO-B-039'
}
]

let mapbarItems = [{
  icon: 'gaohe_pos',
  name: '高河'
}, {
  icon: 'gucheng_pos',
  name: '古城'
}, {
  icon: 'wangzhuang_pos',
  name: '王庄'
}, {
  icon: 'gaohe_dem',
  name: '地形显隐'
}
]

let statusNames = ['reader', 'light', 'camera', 'landmark', 'areaStaff', 'fault', 'underground', 'readerPath', 'area_1', 'area_3', 'area_5', 'area_6', 'area_1001', 'area_2000', 'edit_point',  'delete_point', 'antenna']
let tools = {toolbarItems, visual, magnifier, measure, visualarea, mapbarItems, magnifierDef, statusNames}

export { tools }
