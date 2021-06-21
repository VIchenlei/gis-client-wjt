export default class HelpmeService {
  constructor () {
    this.registerGlobalEventHandlers()
  }

  registerGlobalEventHandlers () {
    let hmStore = xdata.helpmeStore

    xbus.on('HELPME-REQ', (msg) => {
      let row = msg
      let obj = xdata.metaStore.getCardBindObjectInfo(row.obj_id)
      row.name = obj && obj.name ? obj.name : ''
      if (msg.status == 0) {
        if (!hmStore.helpbasic.has(row.obj_id)) {
          if (!hmStore.hms.has(row.obj_id)) {
            if (!hmStore.helpms.has(row.obj_id)) {
              hmStore.helpms.set(row.obj_id, row)
            }
          }
          
          if (!hmStore.hms.has(row.obj_id)) {
            hmStore.hms.set(row.obj_id, row)
            xbus.trigger('HELPME-LIST-CHANGED')
    
            let msg1 = {
              cards: [row.obj_id],  
              type: 'ALARM'
            }
            window.cardStartLocating(msg1)
          }
          hmStore.helpbasic.set(row.obj_id, row) // 基准表
        }
      } else { 
        hmStore.helpbasic.delete(row.obj_id)
      }   
    })

    xbus.on('HELPME-DONE', (msg) => {
      hmStore.hms.delete(msg.data.id)
      hmStore.helpms.delete(msg.data.id)
      let msg1 = {
        cards: [msg.data.id],
        type: 'HELP'
      }
      window.cardStopLocating(msg1)
      xbus.trigger('HELPME-LIST-CHANGED')
    })

    xbus.on('HELPME-UPDATE', () => {
      if (hmStore.helpms.size > 0) {
        hmStore.helpms.forEach((item,index) => {
          let objId = item.obj_id
          let obj = xdata.metaStore.getCardBindObjectInfo(objId)
          item.name = obj && obj.name ? obj.name : ''
          hmStore.helpms.set(index, item)
        })
        xbus.trigger('HELPME-LIST-CHANGED')
      }
    })
  }
}
