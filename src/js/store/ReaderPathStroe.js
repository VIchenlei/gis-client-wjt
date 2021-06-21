export default class ReaderPathStore {
  constructor () {
    this.showReaderPath = new Map()
  }

  add (readerID) {
    this.showReaderPath.set(readerID, true)
  }

  delete (readerID) {
    this.showReaderPath.delete(readerID)
  }

  switchShow (msg) {
    const { name, checked } = msg
    checked ? this.add(name) : this.delete(name)
  }
}