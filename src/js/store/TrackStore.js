export default class TrackStore {
  constructor (gstore) {
    this.gstore = gstore
    this.tracks = new Map()
    this.beWatched = null
  }
  
  set (id, track) {
    this.tracks.set(id, track)
  }

  get (id) {
    return this.tracks.get(id)
  }

  getInArray () {
    return Array.from(this.tracks.values())
  }

  delete (id) {
    this.tracks.delete(id)
  }

  clear () {
    this.tracks.clear()
  }

  has (id) {
    return this.tracks.has(id)
  }

  isTracking (id) {
    return this.has(id)
  }
  
  isWatched (id) {
    return this.beWatched === id
  }

  getWatchedCard (id) {
    return this.beWatched
  }

  setWatchedCard (id) {
    this.beWatched = id
  }
}
