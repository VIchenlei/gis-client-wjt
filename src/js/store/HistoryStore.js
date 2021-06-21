const SEG_SIZE = 300 * 1000

export default class HistoryStore {
  constructor (gstore) {
    this.gstore = gstore
    this.segmentIndex = []
    this.segment = []
    this.sceneInfo = {}
    this.cards = []
    this.loadIndex = new Map()
    this.trackData = new Map()
    this.mapID = 5 // 默认地图id
  }

  initSegementIndex (startTime, endTime, mapID, cards, currentTime) {
    let duration = new Date(endTime) - new Date(startTime) // ms
    let n = Math.ceil((duration / SEG_SIZE))
    this.sceneInfo.duration = duration
    this.sceneInfo.startTime = startTime
    this.sceneInfo.endTime = endTime
    this.sceneInfo.segementCount = n
    this.sceneInfo.mapID = mapID
    this.sceneInfo.cards = cards
    this.sceneInfo.cur_time = currentTime

    for (let i = 0; i < n; i++) {
      this.segmentIndex[i] = {
        index: -1,
        preloaded: false
      }
    }
  }

  setSegment (i, data) {
    if (this.segmentIndex && this.segmentIndex[i]) {
      this.segmentIndex[i].index = this.segment.push(data) - 1
      this.segmentIndex[i].preloaded = true
    }
  }

  clearSegement () {
    this.segmentIndex = this.segmentIndex.slice(0, 0)
    this.segment = this.segment.slice(0, 0)
    this.sceneInfo = {}
    this.cards = []
  }

  clearCardsList () {
    this.cards = []
  }

  getSegementData (timePoint) {
    timePoint = timePoint * 1000
    let timeDistant = timePoint
    let i = Math.floor(timeDistant / SEG_SIZE)
    if (i < this.segmentIndex.length) {
      let index = this.segmentIndex[i].index
      let segment = this.segment[index]
      if (segment === undefined || segment.length === 0) {
        return []
      }
      let recUpperBoundary = this.checkBoundary(0, segment, timePoint - 1000, 'uppper')
      let recLowBoundary = this.checkBoundary(recUpperBoundary, segment, timePoint, 'low')
      let rows = segment.slice(recUpperBoundary, recLowBoundary)
      return rows
    } else {
      return []
    }
  }

  isPreloaded (index) {
    if (index < this.segmentIndex.length) {
      return this.segmentIndex[index].preloaded
    }
  }

  checkBoundary (UpperBoundary, segment, timePoint, type) {
    let timePointStart = (new Date(this.sceneInfo.startTime)).getTime()
    let timePointCurTime = null
    for (let i = UpperBoundary, len = segment.length; i < len; i++) {
      timePointCurTime = (new Date(segment[i].cur_time)).getTime()
      let tip = (UpperBoundary === 0 ? timePointStart + timePoint <= timePointCurTime : timePointStart + timePoint < timePointCurTime)
      if (tip) {
        return i
      }
    }
  }
}
