import Dexie from 'dexie'
import specialTable from '../def/special_table_key_def.js'
const DB_NAME = 'YaLocDataInBrowserDB'

export default class DexieDBStore {
  constructor (gstore) {
    this.db = null
    this.forceUpdateMetadata = false // 是否是强制拉取数据
    this.data = new Map()
    this.forceData = new Map() // 存储强制更新数据的表名

    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    xbus.on('OPEN-LOCAL-DB', () => {
      this.openLocalDb()
    })

    xbus.on('PULL_META_LENGTH', (res) => {
      if (res.code === 0) {
        xbus.trigger('PROGRESS-BAR-CLOSE')
      }
    })
  }

  progressBar (name, tableNames) {
    let self = this
    this.len = tableNames ? tableNames.length : this.rows.length
    if (self.forceUpdateMetadata) {
      self.forceData.set(name, true)
      xbus.trigger('PROGRESS-BAR', {
        name,
        size: self.forceData.size,
        length: self.rows.length
      })
    }
    console.log(name, self.forceData.size, this.len);
    if (self.forceData.size >= this.rows.length) {
      self.forceUpdateMetadata = false
    }
  }

  async openLocalDb () {
    this.db = new Dexie(DB_NAME)
    try {
      this.db && await this.db.open()
    } catch (error) {
      return console.warn('No data is stored yet!')
    }
    this.version = this.db.verno
    let data = await this.db.table('mdt_update').toArray()
    for (let i = 0, len = data.length; i < len; i++) {
      let tableGroup = data[i],
        tableName = tableGroup.tableName
      await xdata.metaStore.saveData(tableName)
    }
    xdata.metaStore.handleTable()
  }

  inquireDB (name, sql) {
    let message = {
      cmd: 'query',
      data: {
        name: name,
        sql: sql
      }
    }
    xbus.trigger('REPT-FETCH-DATA', {
      req: message,
      def: {
        name: name
      }
    })
  }

  initDB (name) {
    let len = name.length, defName = name.slice(4, len), defData = xdata.metaStore.defs[defName]
    let sqlStr = defData && defData.fields.names
    sqlStr = sqlStr || '*'
    let sql = `select ${sqlStr} from ${name}`
    let sqlname = name
    this.data.set(sqlname, true)
    this.inquireDB(sqlname, sql)
  }

  async getArray (name) {
    let self = this
    let arr = self.db[name] && await self.db[name].toArray()
    if (arr && arr.length <= 0) { // 只有objectStore，但是没有对应基础表数据
      self.initDB(name) // 拉取所有数据
    }
  }

  storeDATA (name, value, upmethod, tableNames) {
    let storename
    try {
      storename = this.db[name] || this.db.table(name)
    } catch (error) {
      console.warn(`Table ${name} not exist`)
    }

    if (storename) {
      this.db.transaction('rw', storename, async () => {
        if (value) {
          // 全量更新，先删除，再put ？实时页面是否存在问题

          if (upmethod == 'DELETE' || name === 'dat_reader_path_tof_n') {
            await storename.clear()
          }
          for (let i = 0; i < value.length; i++) {
            await storename.put(value[i])
          }
        } else {
          await storename.clear()
        }
      }).then(async () => {
        console.log(`added ${storename.name}`)
        await xdata.metaStore.saveData(name, storename.toArray()._value, tableNames)
        if (this.forceUpdateMetadata) {
          this.progressBar(name, tableNames)
        }
        xdata.metaStore.handleTable(name.slice(4), value)
      }).catch(e => {
        console.warn(`更新元数据${name}失败`)
      })
    }
  }

  // datname: dat_xxx    defname: xxx
  async openDB (datname, rows) {
    // 强制更新 ？ 删除本地indexDB ：关闭数据库
    if (this.forceUpdateMetadata) {
      // await this.db.delete()
      // this.version = 1
      this.forceUpdateMetadata = true
    }
    this.db.isOpen() && this.db.close()

    let self = this
    this.name = datname
    this.rows = rows
    this.db = new Dexie(DB_NAME)
    // let storenames = rows
    let msg = {}
    msg[datname] = 'tableName'
    let version = parseInt(this.version, 10)
    version = version ? parseInt(version, 10) : 1

    if (!rows) return
    for (let i = 0, len = rows.length; i < len; i++) { // objectStore
      let storename = rows[i]
      let name = storename.tableName
      let key = null
      if (!this.db[name]) {
        let defname = name.indexOf('dat') < 0 ? name : name.slice(4)
        let def = xdata.metaStore.defs[defname]
        if (def) {
          key = def.fields.names[def.keyIndex]
        } else {
          key = specialTable[defname] || `${name.slice(4)}_id`
        }
        if (name === 'dat_leave') {
          key = '++n'
        }
      }
      msg[name] = key
    }

    this.db.version(version).stores(msg)
    this.db.version(version + 1).stores(msg)
    await this.db.open()
    let data = await this.db.table('mdt_update').toArray()
    if (this.db.isOpen()) {
      let msg = {
        cmd: 'pull_down_metadata',
        data: {
          mdtdata: data,
          objRange: xdata.objRange
        }
      }
      xbus.trigger('PULL-DOWN-METADATA', msg)
    }

    for (let i = 0, len = rows.length; i < len; i++) {
      let storename = rows[i]
      let name = storename.tableName
      self.getArray(name, storename)
    }
    self.dbstore = true
    self.storeDATA(self.name, self.rows) // 每次更新indexDB中dat_mdt_update表
    xdata.metaStore.handleTable()
  }
}
