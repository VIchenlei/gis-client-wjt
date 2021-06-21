import OlMapWorkLayer from './OlMapWorkLayer.js'

export default class OlMapTrackLayer extends OlMapWorkLayer {
  constructor (workspace) {
    super(workspace)
    this.hopDuration = 100
    this.layer = this.initLayer(workspace.workspace)
  }

  initLayer (container) {
  }

  registerEventHandler (canvas) {
    canvas.addEventListener('click', (evt) => {
      let t = evt.target
      if (t.tagName === 'circle') {
        console.log('CLICK on the line')
      }
    }, false)
  }
}
