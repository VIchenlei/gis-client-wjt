let ToolItems = [{
  name: 'vehicle',
  iconName: 'icon-vehicle-big',
  label: '显示/隐藏车辆',
  cont: '车辆',
  class: 'active'
}, {
  name: 'staff',
  iconName: 'icon-staff-big',
  label: '显示/隐藏人员',
  cont: '人员',
  class: 'active'
}, {
  name: 'reader',
  iconName: 'icon-bstation',
  label: '显示/隐藏分站',
  cont: '分站',
  class: ''
}, 
// {
//   name: 'area_1',
//   iconName: 'icon-area',
//   label: '显示/隐藏区域',
//   cont: '区域',
//   class: ''
// }, 
// {
//   name: 'camera',
//   iconName: 'icon-camera',
//   label: '显示/隐藏摄像头',
//   cont: '摄像头',
//   class: ''
// }, 
{
  name: 'landmark',
  iconName: 'icon-landmarker',
  label: '显示/隐藏地标',
  cont: '地标',
  class: ''
}, 
{
  name: 'alarm',
  iconName: 'icon-alarm',
  label: '告警',
  cont: '告警',
  class: ''
},
{
  name: 'location',
  iconName: 'icon-location',
  label: '取消定位',
  cont: '取消定位',
  class: ''
}
]

let ToolEvtName = {
  'vehicle': 'MAP-SHOW-CARD',
  'staff': 'MAP-SHOW-CARD',
  'alarm': 'ALARM-LIST-SHOW',
  'area_1': 'MAP-SHOW-AREA',
  'location': ''
}

export { ToolItems, ToolEvtName }
