import { CARD } from '../../js/def/state.js'
import SceneData from './SceneData.js'

const INIT_SPEED = 60
const TICK_LENGTH = 1000 
let card = ['', 2, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0]

export default class Ticker {
  constructor (player, map, ctrl) {
    this.player = player
    this.map = player.map
    this.ctrl = player.ctrl
    this.timer = -1
    this.data = null
    this.previewCursor = null
    this.trackTime = null
    this.SceneData = new SceneData(this)
    this.speed = INIT_SPEED
    this.startTime = -1 
    this.endTime = -1 
    this.tick = -1 
    this.totalTick = 0 
  }

  initTrack (opts) {

    this.mapID = opts.mapID || 5
    this.mapType = opts.type || 'HISTORY'
    this.playCmd = opts.cmd === 'HistoryScene' ? 'scene' : 'track'
    this.data = opts.rows || null
    this.startTime = opts.startTime || 0 
    this.endTime = opts.endTime || 0 
    this.realDuration = this.getRealDuration(this.data) / 1000 || 0 
    this.totalTick = ((new Date(opts.endTime)).getTime() - (new Date(opts.startTime)).getTime()) / 1000 || 0
    this.gotoStartPoint()
    this.drawCardIcon()
  }

  drawCardIcon () {
    if (this.data && this.data.length > 0) {
      let rec = this.buildCardMoveRec(this.data[0], this.data[this.data.length - 1], 'FIRST')
      this.map.drawCardIcon(rec)
    }
  }

  gotoStartPoint () {
    this.isPlaying = false
    this.speed = this.speed ? this.speed : INIT_SPEED
    this.updateTick(0)
    this.previewCursor = this.getFirstCursor(this.data)
  }

  getSceneDataByTick () {
    this.SceneData.checkSegement(this.tick * 1000, 'jump', 'scene', 1)
    let row = this.SceneData.getSegementData(this.tick)
    for (let i = 0,len = row.length; i < len; i++) {
      let rec = this.buildCardMoveRec(row[i])
      this.map.jumpCard(rec, 'jump')
    }
    if (row.length !== 0) {
      let cards = xdata.historyStore.cards
      this.deleteCards(cards)
    }
  }

  gotoHere (percent, type) {
    this.stopTimer()
    let tick = Math.ceil(this.totalTick * percent)
    this.updateTick(tick)
    this.ctrl.jumpTo(tick)
    if (this.playCmd === 'scene') {
      this.getSceneDataByTick()
      if (this.data.length === 0) { 
        this.map.cardLayer.vehicleLayerSource.clear()
        this.map.cardLayer.staffLayerSource.clear()
      }
    } else {
      let cursor = this.getCursor(this.data, { index: 0, isMoved: false }, this.trackTime, type)
      if (cursor && cursor.isMoved) {
        this.previewCursor = cursor
        let row = this.data[cursor.index]
        let rec = this.buildCardMoveRec(row)
        this.map.jumpCard(rec, 'jump')
        this.map.updateTrackTime(this.trackTime)
      }
    }
  }

  deleteCards (cards) {
    let msg = {
      cards: cards,
      mapID: this.mapID
    }
    msg && this.map.cardLayer.deleteCardsInHisPlayer(msg)
    xdata.historyStore.clearCardsList()
  }

  getFirstCursor (data) {
    let cursor = null
    if (this.data && this.data.length > 0) {
      cursor = { index: 0, isMoved: true }
    }
    return cursor
  }

  reLoadMap (mapID, row) {
    this.map.reloadMap(mapID)
    this.trackLayer = this.map.mapService.workspace.trackLayer
    this.trackLayer.drawWholeTrack({
      cardID: this.data[0].card_id,
      rows: this.data
    }, 'PatrolPath')
    let rec = this.buildCardMoveRec(row)
    this.map.drawCardIcon(rec)
  }

  buildCardMoveRec (row, lastRow, state) {
    if (!row) {
      return null
    }

    let rec = [...card]
    let mapID = row.map_id
    if (mapID !== this.map.mapID) {
      return this.reLoadMap(mapID, row)
    }

    rec[CARD.card_id] = row.card_id
    rec[CARD.x] = row.x
    rec[CARD.y] = row.y
    rec[CARD.map_id] = row.map_id
    rec[CARD.area_id] = row.area_id
    rec[CARD.state_biz] = 0
    rec[CARD.object_id] = this.getLabel(row.card_id)
    rec[CARD.mark_id] = row.landmark_id
    rec[CARD.mark_direction] = row.direction_mapper_id
    rec[CARD.mark_distance] = row.landmark_dist
    rec[CARD.speed] = (row.speed).toFixed(0)
    rec[CARD.rec_time] = new Date(row.cur_time).getTime()
    rec[CARD.set_move] = 0
    rec[CARD.end_time] = new Date(row.end_time).getTime()
    if (state) {
      this.downTime = new Date(row.cur_time).getTime()
    }
    rec[CARD.down_time] = this.downTime
    if (lastRow) {
      let lastTime = new Date(lastRow.cur_time).getTime()
      let duration = lastTime - rec[CARD.down_time]
      this.workTime = duration
    }
    rec[CARD.work_time] = this.workTime
    xbus.trigger('HIS-POSITION-DATA', { data: rec })// 每次移动时更新card-tips数据

    return rec
  }

  setSpeed (speed) {
    if(speed === 70){
      this.speed = this.totalTick/60
    }else{
      this.speed = speed
    }
  }

  getLabel (cardID) {
    let obj = xdata.metaStore.getCardBindObjectInfo(cardID)
    let label = obj && obj.name ? obj.name : cardID
    label = obj && obj.group_id === 1 ? obj.name : label
    return label
  }

  getRealDuration (data) {
    let duration = -1
    if (data && data.length > 0) {
      let start = data[0].cur_time
      let end = data[data.length - 1].cur_time
      duration = new Date(end) - new Date(start)  // ms
    }

    return duration
  }

  updateTick (tick) {
    this.tick = tick
    this.trackTime = new Date(this.startTime).getTime() + this.tick * 1000
    this.map.updateTrackTime(this.trackTime)
  }

  tickMap () {
    if (this.playCmd === 'scene') {
      this.SceneData.checkSegement(this.tick, 'play', this.playCmd, 0)
      let rows = this.SceneData.getSegementData(this.tick)
      if (rows.length > 0) {
        xbus.trigger('CARD-MOVE', (rows))
      }
    } else {
      let cursor = this.getCursor(this.data, this.previewCursor, this.trackTime)
      if (cursor && cursor.isMoved) {
        this.previewCursor = cursor
        let row = this.data[cursor.index]
        let rec = this.buildCardMoveRec(row)
        this.map.doTick(rec)
      }
    }
  }

  startTimer () {
    if (this.timer >= 0) {
      this.stopTimer()
    }
    let self = this
    this.timer = window.setInterval(() => {
      self.updateTick(self.tick + self.speed)
      if (self.tick >= self.totalTick) {
        self.tick = self.totalTick
        self.stopTimer()
      }

      self.tickMap()
      self.preLoadSceneData()
      self.ctrl.doTick(self.tick)
    }, TICK_LENGTH)

    this.isPlaying = true
  }

  stopTimer () {
    if (this.timer >= 0) {
      window.clearInterval(this.timer)
      this.timer = -1
      this.isPlaying = false
    }
  }

  preLoadSceneData () { 
    let data = this.SceneData.getSegementData(this.tick)
    if (this.playCmd === 'scene' && !data || data.length === 0) {
      this.getSceneDataByTick()
    }
  }

  togglePlay () {
    this.isPlaying = !this.isPlaying
    this.isPlaying ? this.startPlay() : this.pausePlay()
  }

  startPlay () {
    this.startTimer()
  }

  pausePlay () {
    this.stopTimer()
  }

  stopPlay () {
    this.stopTimer()
    this.gotoStartPoint()
    this.ctrl.initTrack()
    this.map.initTrack()
    this.map.updateTrackTime(this.trackTime)
    if (this.playCmd === 'scene') {
      let cards = xdata.historyStore.cards
      this.deleteCards(cards)
    } else {
      if (this.data && this.data[0]) {
        let row = this.data[0]
        let lastRow = this.data[this.data.length - 1]
        let rec = this.buildCardMoveRec(row, lastRow, 'FIRST')
        this.map.jumpCard(rec, 'stop')
      }
    }
    this.timer = -1
    this.tick = -1
  }
  
  getCursor (rows, preCursor, deadline, type) {
    if (!rows) {
      return null
    }
    let count = rows.length
    let i = preCursor.index + 1
    let turnKey = false
    for (; i < count; i++) {
      let row = rows[i]
      let nodeTime = new Date(row.cur_time).getTime()
      if (nodeTime > deadline) {
        break
      }
    }
    let index = i === count ? count - 1 : i - 1 
    let isMoved = true
    if (index === preCursor.index) isMoved = false
    return {
      index: index,
      isMoved: isMoved
    }
  }
}
