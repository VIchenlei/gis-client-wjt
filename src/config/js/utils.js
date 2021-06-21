function judgeAreaIsneedDisplay(obj) {
  let areaID = obj.area_id
  let areas = xdata.metaStore.data.area
  let deviceArea = areas && areas.get(areaID)
  let deviceAreaNeedDisplay = deviceArea && parseInt(deviceArea.need_display, 10)
  if (xdata.isCheck === 1 && deviceAreaNeedDisplay === 0) return false
  return true
}

// 模糊搜索
function searchList(evt, root) {
  let target = evt.currentTarget
  let searchValue = target.value
  let trackListTags = root.querySelectorAll('.list-item')
  // this.isCardExist = false
  let regString = 'n*' + searchValue + 'n*'
  let Reg = new RegExp(regString, 'i')
  let noresult = root.querySelector('.noresult')
  let resultArr = []
  if (trackListTags) {
    for (let i = 0; i < trackListTags.length; i++) {
      let cardName = trackListTags[i].getAttribute('data-name')
      let cardSpell = trackListTags[i].getAttribute('card-spell').toLowerCase()
      if ((!Reg.test(cardName) && !Reg.test(cardSpell)) || cardName === null) {
        trackListTags[i].style.display = 'none'
      } else {
        trackListTags[i].style.display = 'block'
        resultArr.push(trackListTags[i])
      }
    }
  }
  if (resultArr.length <= 0) {
    noresult && noresult.classList.remove('hide')
  } else {
    noresult && noresult.classList.add('hide')
  }
}

export { judgeAreaIsneedDisplay, searchList }