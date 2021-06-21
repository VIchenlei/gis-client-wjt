const basicMessageMenu = {
  'staff': [{
      value: 'staff_staff_extend',
      name: 'staff_staff_extend',
      label: '员工信息批导入'
    },
    {
      value: 'staff_extend',
      name: 'staff_extend',
      label: '员工信息批修改'
    },
    {
      value: 'csv',
      name: 'staff',
      label: '员工信息批导出'
    },
    {
      value: 'dat_credentials_staff',
      name: 'dat_credentials_staff',
      label: '资格证信息'
    },
    {
      value: 'csv',
      name: 'credentials_staff',
      label: '资格证信息批导出'
    }
  ],
  'vehicle': [{
      value: 'vehicle_vehicle_extend',
      name: 'vehicle_vehicle_extend',
      label: '车辆信息批导入'
    },
    {
      value: 'csv',
      name: 'vehicle',
      label: '车辆信息批导出'
    },
    {
      value: 'dat_credentials_vehicle',
      name: 'dat_credentials_vehicle',
      label: '资格证信息'
    },
    {
      value: 'csv',
      name: 'credentials_vehicle',
      label: '资格证信息批导出'
    }
  ],
  'device_power': [{
      value: 'device_power',
      name: 'dat_device_power',
      label: '电源设备批导入'
    },
    {
      value: 'power_levels',
      name: 'dat_power_levels',
      label: '多路电池批导入'
    },
    {
      value: 'csv',
      name: 'device_power',
      label: '电源设备批导出'
    },
    {
      value: 'csv',
      name: 'power_levels',
      label: '多路电池批导出'
    }
  ]
}

export default basicMessageMenu