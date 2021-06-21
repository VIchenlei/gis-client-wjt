// menuID与dat_menu表关联，顺序必须一一对应
let shortcutItems = [
  {
    name: 'alarm',
    iconName: 'icon-warning',
    label: '告警',
    onmobile: true,
    isShow: true,
    menuID: 'MO-A-002'
  },
  // {
  //   name: 'personCards',
  //   iconName: 'icon-cards',
  //   label: '一人带多卡',
  //   onmobile: false,
  //   isShow: false,
  //   menuID: 'KJ-B00'
  // },
  {
    name: 'location',
    iconName: 'icon-location',
    label: '取消定位',
    onmobile: true,
    isShow: true,
    menuID: 'MO-A-003'
  }, {
    name: 'sendcall',
    iconName: 'icon-megaphone',
    label: '发起呼叫',
    onmobile: true,
    isShow: false,
    menuID: 'MO-A-004'
  }, {
    name: 'stopcall',
    iconName: 'icon-stop-call',
    label: '停止呼叫',
    onmobile: true,
    isShow: false,
    menuID: 'MO-A-005'
  }, {
    name: 'handupMine',
    iconName: 'icon-street-view',
    label: '手动升井',
    onmobile: false,
    isShow: false,
    menuID: 'MO-A-006'
  }, {
    name: 'leave',
    iconName: 'icon-directions-run',
    label: '一键撤离',
    onmobile: true,
    isShow: false,
    menuID: 'MO-A-007'
  }, {
    name: 'staffcurve',
    iconName: 'icon-staff-curve',
    label: '人员数量历史曲线',
    onmobile: false,
    isShow: false,
    menuID: 'MO-A-008'
  },{
    name: 'accompany',
    iconName: 'icon-accompany',
    label: '陪同',
    onmobile: false,
    isShow: false,
    menuID: 'MO-A-013'
  },
  {
    name: 'geowarn',
    iconName: 'icon-geofault',
    label: '地质断层告警设置',
    onmobile: false,
    isShow: false,
    menuID: 'MO-A-009'
  },
  {
    name: 'aboutus',
    iconName: 'icon-about',
    label: '关于',
    onmobile: true,
    isShow: true,
    menuID: 'MO-A-010'
  },
  {
    name: 'fullscreen',
    iconName: 'icon-fullscreen',
    label: '全屏',
    onmobile: false,
    isShow: true,
    menuID: 'MO-A-011'
  }
]

export default shortcutItems
