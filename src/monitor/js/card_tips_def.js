let cardsDef = {
  staff: {
    fields: {
      labels: ['卡号', '工号', '姓名', '性别', '部门', '工种', '职务'],
      names: ['card_id', 'staff_id', 'name', 'sex_id', 'dept_id', 'worktype_id', 'occupation_id'], 
      types: ['NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER'],
      enableNull: [false, false, false, false, false, false, false]
    }
  },
  vehicle: {
    fields: {
      labels: ['卡号', '车牌', '类型', '部门'],
      names: ['card_id', 'name', 'vehicle_type_id', 'dept_id'], 
      types: ['NUMBER', 'STRING', 'SELECT', 'SELECT'],
      enableNull: [false, false, false, false]
    }
  }
}

let currentStatusDef = {
  staff: {
    fields: {
      labels: ['下井', '时长', '电量', '状态', '时间', '位置', '东经', '北纬', '海拔'],
      names: ['down_time', 'work_time', 'state_card', 'state_object', 'rec_time', 'map_pos', 'longitude', 'latitude', 'altitude'], 
      types: ['DATETIME', 'NUMBER', 'NUMBER', 'NUMBER', 'DATETIME', 'STRING', 'NUMBER', 'NUMBER', 'STRING'],
      enableNull: [false, false, false, false, false, false, false, false, false]
    }
  },
  vehicle: {
    fields: {
      labels: ['出车', '时长', '司机', '速度', '电量', '状态', '时间', '位置', '东经', '北纬', '海拔'],
      names: ['down_time', 'work_time', 'driver', 'speed', 'state_card', 'state_object', 'rec_time', 'map_pos', 'longitude', 'latitude', 'altitude'], 
      types: ['DATETIME', 'NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'DATETIME', 'STRING', 'NUMBER', 'NUMBER', 'STRING'],
      enableNull: [false, false, false, false, false, false, false, false, false, false, false]
    }
  }
}

let cardState = {
  card_id: 0,
  card_type_id: 1,
  object_id: 2,
  latitude: 3,
  longitude: 4,
  y: 5,
  down_time: 6, //下井时间
  enter_area_time: 7, //进入区域时间
  rec_time: 8, //接收时间
  work_time: 9, //工作时长
  map_id: 10, //地图
  area_id: 11, //区域
  dept_id: 12, //部门
  state_card: 13, //电量
  state_object: 14, //运动状态
  state_biz: 15, //状态
  speed: 16, //速度
  map_pos: 17, //位置
  driver: 18, //司机
  tel: 19, //电话
  altitude: 20 //海拔
}

let personOnCarDef = {
  fields: {
    labels: ['工号', '姓名', '卡号', '部门'],
    names: ['staff_id', 'name', 'card_id', 'dept_id'], 
    types: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER'],
    enableNull: [false, false, false, false]
  }
}

export { cardsDef, currentStatusDef, cardState, personOnCarDef }