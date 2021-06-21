
import { clone, messageTip } from '../../../js/utils/utils.js'
import { getRoutePlan } from '../../../manage/js/utils.js'

function isShowDelIcon(fieldName) {
  if (fieldName === 'reader_planning') return true
  return false
}

function initSetValue(fieldName, rows) {
  if (fieldName === 'over_speed_vehicle') {
    rows = []
    let vehicleCates = xdata.metaStore.data.vehicle_category && Array.from(xdata.metaStore.data.vehicle_category.values())
    if (vehicleCates && vehicleCates.length > 0) {
      for (let i = 0; i < vehicleCates.length; i++) {
        const data = vehicleCates[i]
        let { name, spy, over_speed, vehicle_category_id } = data
        let fieldName = `${spy.toLocaleLowerCase()}speed`
        let fieldLabel = `${name}速度`
        rows.push({
          field_name: fieldName,
          field_label: fieldLabel, 
          field_value: over_speed,
          field_type: 'NUMBER',
          field_enableNull: true,
          key: vehicle_category_id
        })
      }
    } 
  }
  return rows
}

function getFormatTime(time) {
  let values = ''
  let times = time.split(':')
  for (let i = 0; i < times.length; i++) {
    values+= i === 0 ? `${times[i]}` : `:${times[i]}`
  }
  return values
}

// 初始化录入框特殊处理展示
function getInitValue(values, fieldName, self) {
  if (fieldName === 'route_planning' && self.parent.cmd !== 'INSERT' && !self.parent.isNegate) {
    values = getRoutePlan(fieldName, values)
  }

  let lists = []
  if (isNaN(values)) {
    values = fieldName === 'reader_planning' ? values.split(',') : values.split(';')
  }
  if (fieldName === 'over_speed_vehicle') {
    if (!isNaN(values)) return self.lists
    let rows = self.lists[0]
    for (let i = 0; i < rows.length; i++) {
      let value = values[i] || `${rows[i].key},${rows[i].field_value}`
      value = isNaN(self.values) ? value.split(',')[1] : values
      rows[i].field_value = parseInt(value, 10)
    }
    lists = [rows]
  } else if (fieldName === 'route_planning') {
    for (let i = 0; i < values.length; i++) {
      if (values[i] === "") continue
      let value = values[i].split(',')
      let datas = clone(self.list)
      datas = i === 0 || i === values.length-1 ? datas : datas = datas.slice(0,2)
      for (let j = 0; j < datas.length; j++) {
        datas[j].field_value = datas[j].field_name === 'stay_time' ? Number(value[j])/60 : value[j]
      }
      lists.push(datas)
    }
  } else if (fieldName === 'reader_planning') {
    for (let i = 0; i < values.length; i++) {
      let value = values[i].split('&')
      let datas = clone(self.list)
      for (let j = 0; j < datas.length; j++) {
        datas[j].field_value = value[j]
        if (['plan_one_time', 'plan_two_time'].includes(datas[j].field_name) && value[j] !== undefined) {
          datas[j].field_value = getFormatTime(value[j])
        }
      }
      lists.push(datas)
    }
  }
  
  return lists
}

// 获取录入框值
function getInputValue(fieldName, self) {
  let values = ''
  let isEnter = true
  for (let index = 0; index < self.lists.length; index++) {
    const list = self.lists[index]
    for (let idx = 0; idx < list.length; idx++) {
      const item = list[idx]
      const { field_name, field_type, key } = item
      let input = self.refs[`${field_name}${index}`].refs[field_name]
      let value = field_type === 'SELECT' ? input.getAttribute('name') : input.value
      if (fieldName === 'over_speed_vehicle') {
        values += `;${key},${value}`
      } else if (fieldName === 'route_planning') {
        if (field_name === 'stay_time') value = Number(value)*60
        if (value === '') isEnter = false
        values += idx < list.length-1 ? `${value},` : `${value}${index < self.lists.length-1 ? ';' : ''}`   
      } else if (fieldName === 'reader_planning') {
        let readerId = self.refs[`${list[0].field_name}${index}`].refs[list[0].field_name].getAttribute('data-type')
        let time1 = self.refs[`${list[1].field_name}${index}`].refs[list[1].field_name].value
        let time2 = self.refs[`${list[2].field_name}${index}`].refs[list[2].field_name].value
        let isTip = (readerId && time1 === '' && time2 === '') || (!readerId && (time1 !== '' || time2 !== ''))
        if (isTip) {
          let tips = '请填写完整的分站计划'
          messageTip(tips)
          return null
        }
        if (readerId && field_name === 'reader_id') value = readerId
        values += idx < list.length-1 ? `${value}${self.refs[`${list[idx+1].field_name}${index}`].refs[list[idx+1].field_name].value === '' ? '' : '&'}` : `${value}${index < self.lists.length-1 ? ',' : ''}` 
      }
    }
  }
  values = fieldName === 'over_speed_vehicle' ? values.replace(';', '') : values
  if (!isEnter) return ''
  return values
}

export { isShowDelIcon, getInitValue, getInputValue, initSetValue }