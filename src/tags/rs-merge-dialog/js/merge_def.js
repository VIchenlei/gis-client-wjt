let mergeMsg = {
  reader:{
    firstTitle:'分站基本信息',
    sencondTitle:'天线基本信息',
    thirdTitle:'分站覆盖范围基本信息',
    firstHideField: ['angle', 'z', 'enable_simulate_card'],
    sencondHideField: ['antenna_id', 'reader_id', 'name', 'z', 'angle'],
    thirdHideField: ['reader_id', 'id', 'tof_flag', 'b_z', 'e_z'],
    sencondName: 'antenna',
    thirdName: 'reader_path_tof_n'
  },
  coalface:{
    firstTitle:'综采面基础数据',
    sencondTitle:'综采面采煤机管理',
    thirdTitle:'传感器管理',
    firstHideField: ['x_offset', 'y_offset', 'limit_speed', 'plan_day'],
    sencondHideField: ['coalface_id'],
    thirdHideField: ['sensor_id', 'work_face_id', 'z'],
    sencondName: 'coalface_vehicle',
    thirdName: 'sensor'
  },
  drivingface:{
    firstTitle:'掘进面基础数据',
    sencondTitle:'掘进面掘进机管理',
    thirdTitle:'传感器管理',
    pointTitle: '掘进面基准点',
    warnTitle: '掘进面告警点',
    firstHideField: ['base_point_z', 'icon_x', 'icon_y', 'icon_z', 'plan_day', 'drivingface_type', 'driver_dist', 'driver_dist_time'],
    sencondHideField: ['drivingface_id', 'big_reader_id', 'relay_small_reader_id'],
    thirdHideField: ['sensor_id', 'work_face_id', 'z'],
    pointHideField: ['drivingface_id','drp_id'],
    warnHideField: ['warning_point_id', 'drivingface_id', 'point_z'],
    sencondName: 'drivingface_vehicle',
    thirdName: 'sensor',
    pointName: 'drivingface_ref_point',
    warnName: 'drivingface_warning_point'
  }
}


export { mergeMsg }
