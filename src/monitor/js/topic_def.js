// 地图左侧列表的相关定义
const TOPIC = {
  VEHICLE_BY_AREA: 'vehicleByArea',
  STAFF_BY_DEPT: 'staffByDept',
  STAFF_BY_AREA: 'staffByArea',
  STAFF_BY_LEVEL: 'staffByLevel',
  CALL_LIST: 'callList',
  READER_LIST: 'readerList',
  HELP_ME_LIST: 'helpList',
}

let TopicDef = {}
TopicDef[TOPIC.VEHICLE_BY_AREA] = {
  name: TOPIC.VEHICLE_BY_AREA,
  iconName: 'icon-bus-vehicle',
  label: '车辆按区域分布',
  tagName: 'group-list',  // topic 对应的 tag 名称
  class: 'active'
}
TopicDef[TOPIC.STAFF_BY_DEPT] = {
  name: TOPIC.STAFF_BY_DEPT,
  iconName: 'icon-person',
  label: '人员按部门分布',
  tagName: 'group-list',
  class: ''
}
TopicDef[TOPIC.STAFF_BY_AREA] = {
  name: TOPIC.STAFF_BY_AREA,
  iconName: 'icon-area-staff',
  label: '人员按区域分布',
  tagName: 'group-list',
  class: ''
}
TopicDef[TOPIC.STAFF_BY_LEVEL] = {
  name: TOPIC.STAFF_BY_LEVEL,
  iconName: 'icon-job-staff',
  label: '人员按岗位分布',
  tagName: 'group-list',
  class: ''
}
TopicDef[TOPIC.CALL_LIST] = {
  name: TOPIC.CALL_LIST,
  iconName: 'icon-megaphone-1',
  label: '人员呼叫',
  tagName: 'call-person-list',
  class: ''
}
// TopicDef[TOPIC.READER_LIST] = {
//   name: TOPIC.READER_LIST,
//   iconName: 'icon-reader',
//   label: '分站列表',
//   tagName: 'reader-list',
//   class: ''
// }
TopicDef[TOPIC.HELP_ME_LIST] = {
  name: TOPIC.HELP_ME_LIST,
  iconName: 'icon-help-car',
  label: '呼救列表',
  tagName: 'help-side-list',
  class: ''
}
export { TOPIC, TopicDef }
