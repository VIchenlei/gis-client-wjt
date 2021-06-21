export default class CallStore {
	constructor (gstore) {
		this.gstore = gstore // global store

		this.callcardList = new Map()
		this.selfcallCardList = new Map()

		this.callingCards = new Map()
		this.callingStations = new Map()
		this.states = new Map()

		this.registerGlobalEventHandlers()
	}

	registerGlobalEventHandlers () {
    let self = this
		xbus.on('CALL-CARD-LIST', (msg) => {
			let mySelf = xdata.userName
      for (let i = 0, len = msg.length; i < len; i++) {
        let row = msg[i]
				let key = `${row[0]}-${row[2] || row[1]}`
        let obj = row[2] || xdata.metaStore.getCardBindObjectInfo(row[1])
        let isFilter = row[1] != 0 ? xdata.metaStore.isFilterData('needDisplay', 'filterDept', '&&', row[1]) : true
        if (row[2] !== 0) isFilter = false
        if (isFilter) {
          obj = obj && obj.name ? obj.name : row[1]
          row.push(obj)
          this.states.set(key, row)
          if (row[0] === mySelf && row[5] === 2) {
            self.callcardList.set(key, row)
            row.push('myself')
          } else {
            row.push('')
          }
        }
			}
			xbus.trigger('SHOW-CALL-LIST', (msg))
		})

		xbus.on('CAll-CARD-REMOVE', (data) => {
      if (data.cards) {
        if (parseInt(data.cards[0].cardid, 10) === 0) {
          self.states.clear()
          self.selfcallCardList.clear()
        } else {
					this.removeCall(data, 'card')
        }
      } else {
				this.removeCall(data, 'station')
      }
      xbus.trigger('SHOW-CALL-LIST')
		})
		
		// 呼叫确认
		xbus.on('CALL-CARD-CONFIRM', data => {
      if (!data) return
      let datas = this.states && Array.from(this.states.values())
      let cardID = data.card_id
      let isInCallList = datas.find(item => item[1] === cardID)
      if (isInCallList) { // 非全员呼叫
        datas.forEach(item => {
          if (item[1] === cardID) {
            !item[8] && item.push(1)
          }
        })
      } else { // 全员呼叫
        let time = new Date(data.confirm_time).getTime()
        let msg = ['', cardID, , time, , , , , 1]
        this.states.set(`admin-${cardID}`, msg)
      }
      xbus.trigger('SHOW-CALL-LIST')
    })
	}

	removeCall (datas, name) {
		let data = datas[`${name}s`]
    let userName = datas.user_name
		for (let i = 0; i < data.length; i++) {
			let objID = data[i][`${name}id`]
			let key = `${userName}-${objID}`
			this.states.delete(key)
			this.selfcallCardList.delete(key)
		}
	}
}