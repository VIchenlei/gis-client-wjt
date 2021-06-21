
export default class AntennaStore {
  constructor () {
    this.showAntenna = new Map()
  }

  add (readerID) {
    this.showAntenna.set(readerID, true)
  }

  delete (readerID) {
    this.showAntenna.delete(readerID)
  }

  switchShow (msg) {
    const { name, checked } = msg
    checked ? this.add(name) : this.delete(name)
  }
}