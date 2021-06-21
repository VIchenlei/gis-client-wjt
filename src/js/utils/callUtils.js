const CALLPERSON = function (stations, cards, callLeaveId, callTypeId) {
  return {
    'call_card_req': {
      cmd: 'call_card_req',
      data: {
        call_type_id: callTypeId || 0, // 全员呼叫:0 定员呼叫:1
        call_time_out: 5, // 呼叫时长5分钟
        call_level_id: callLeaveId || 1, // 呼叫类型 一般呼叫:1 紧急呼叫:2
        user_name: xdata.userName, // 呼叫人即登录者
        call_time: new Date().getTime(), // 呼叫时间戳
        stations: stations || [{stationid: 0}], // 分站 0为全员
        cards: cards || [{cardid: '0', cardtype: 1}] // 人员 0为全员
      }
    },
    'call_card_cancel_req': {
      cmd: 'call_card_cancel_req',
      data: {
        call_type_id: 0,
        user_name: xdata.userName,
        call_time: new Date().getTime(),
        stations: stations || [{stationid: 0}],
        cards: cards || [{cardid: '0', cardtype: 1}]
      }
    }
  }
}

export default CALLPERSON
