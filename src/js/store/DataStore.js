import PY from './Py.js'

import MetaStore from './MetaStore.js'
import DexieDBStore from './DexieDBStore.js'
import MapStore from './MapStore.js'
import AlarmStore from './AlarmStore.js'
import AntennaStore from './AntennaStore.js'
import AreaListStore from './AreaListStore.js'
import CallStore from './CallStore.js'
import DeviceStore from './DeviceStore.js'
import HelpmeStore from './HelpmeStore.js'
import DragCardStore from './DragCardStore.js'
import CardStore from './CardStore.js'
import HistoryStore from './HistoryStore.js'
import LocateStore from './LocateStore.js'
import TrackStore from './TrackStore.js'
import PersonOnCarStore from './PersonOnCarStore.js'
import ReaderPathStore from './ReaderPathStroe.js'
import DeviceUpdateStore from './DeviceUpdateStore.js'
import TrafficLightsStore from './TrafficLightsStore.js'

export default class DataStore {
  constructor () {
    this.userName = null // save the login user name
    this.userOldName = null
    this.roleID = null
    this.lastUpdate = null // the last socket.io communication time.
    this.collectorStatus = -1  // 未连接
    this.reconnect = false // 监测重连
    this.hasMenus = false
    this.spell = PY
    this.metaStore = new MetaStore(this)
    this.dexieDBStore = new DexieDBStore(this)
    this.mapStore = new MapStore(this)
    this.alarmStore = new AlarmStore(this)
    this.antennaStore = new AntennaStore(this)
    this.areaListStore = new AreaListStore(this)
    this.callStore = new CallStore(this)
    this.deviceStore = new DeviceStore(this)
    this.dragCardStore = new DragCardStore(this)
    this.cardStore = new CardStore(this)
    this.helpmeStore = new HelpmeStore(this)
    this.historyStore = new HistoryStore(this)
    this.locateStore = new LocateStore(this)
    this.trackStore = new TrackStore(this)
    this.PersonOnCarStore = new PersonOnCarStore(this)
    this.readerPathStore = new ReaderPathStore(this)
    this.deviceUpdateStore = new DeviceUpdateStore(this)
    this.TrafficLightsStore = new TrafficLightsStore(this)
  }

  userinfoUpdate (msg) {
    let oldUserName = sessionStorage.getItem("oldName")
    if (oldUserName === null || oldUserName !== msg.name) {
      if (oldUserName !== null && oldUserName !== msg.name) {
        let msg = {
          cmd: 'afresh_metadata',
          data: {
            mdtdata: [],
            objRange: xdata.objRange
          }
        }
        xbus.trigger('AFRESH-METADATA', msg)
      }
      sessionStorage.setItem("oldName", msg.name)
    }
    this.userName = msg.name
    this.roleID = msg.roleId
    this.userDept = msg.deptID + ''  // MUST be string, 0 为所有
    this.userIP = msg.userIP
    this.accessID = msg.accessID
    this.objRange = msg.objRange
    this.isCheck = msg.isCheck
    this.isControl = true // 控制人车新增导入特殊判断是否执行
    this.menus = msg.menus
    this.hasMenus = msg.menus && msg.menus.length > 0
    this.transerMenus = msg.transerMenus
    let accesses = this.accessID ? this.accessID.split(';') : ['0']
    let depts = !accesses.includes('0') ? accesses : ''
    depts = depts ? depts.map(item => Number(item)) : ''
    this.depts = depts
    this.init()
  }

  init () {
    xbus.on('COLLECTOR-STATUS', (msg) => {
      this.collectorStatus = msg.data.status
      xbus.trigger('COLLECTOR-STATUS-UPDATE')
    })
  }
}
