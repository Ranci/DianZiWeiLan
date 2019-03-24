import axios from 'axios'
// const baseUrl = 'https://122.112.236.124'
// const baseUrl = 'http://10.112.136.194:8080'
// const baseUrl = 'http://10.112.20.181:8080'
// const baseUrl = 'http://10.112.20.181:8080'
const baseUrl = 'http://10.112.10.121:8080'
const instance = axios.create()
instance.defaults.timeout = 6000
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
instance.interceptors.request.use((config) => {
  instance.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  return config
}, (error) => {
  return Promise.reject(error)
})

export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  // 查询所有设备类型信息
  getHomePage (params) {
    return fetch(`${baseUrl}/fence/interface/mainpage/query_mainpage`, params)
  },
  // 查询所有设备类型信息
  getDeviceType (params) {
    return fetch(`${baseUrl}/fence/interface/device_type/query_device_type`, params)
  },
  // 查询设备信息
  getDevice (params) {
    return fetch(`${baseUrl}/fence/interface/device/query_device`, params)
  },
  // 增加设备
  addDevice (params) {
    return fetch(`${baseUrl}/fence/interface/device/add_device`, params)
  },
  // 删除设备
  deleteDevice (params) {
    return fetch(`${baseUrl}/fence/interface/device/delete_device`, params)
  },
  // 修改设备
  editDevice (params) {
    return fetch(`${baseUrl}/fence/interface/device/update_device`, params)
  },
  // 查询电子签到
  getAttendance (params) {
    return fetch(`${baseUrl}/fence/interface/attendance/query_attendance`, params)
  },
  // 创建电子签到
  addAttendance (params) {
    return fetch(`${baseUrl}/fence/interface/attendance/add_attendance`, params)
  },
  // 删除电子签到
  deleteAttendance (params) {
    return fetch(`${baseUrl}/fence/interface/attendance/delete_attendance`, params)
  },
  // 删除电子签到
  editAttendance (params) {
    return fetch(`${baseUrl}/fence/interface/attendance/update_attendance`, params)
  },
  // 查询所有角色
  getRole (params) {
    return fetch(`${baseUrl}/fence/interface/admin/query_admin`, params)
  },
  // 查询电子围栏
  getFence (params) {
    return fetch(`${baseUrl}/fence/interface/fence/query_fence`, params)
  },
  // 创建电子围栏
  addFence (params) {
    return fetch(`${baseUrl}/fence/interface/fence/add_fence`, params)
  },
  // 查询所有触发条件信息
  getAllCondition (params) {
    return fetch(`${baseUrl}/fence/interface/condition/query_all_condition`, params)
  },
  // 查询警报信息
  getAlarm (params) {
    return fetch(`${baseUrl}/fence/interface/alarm/query_alarm`, params)
  },
  // 查询所有警报信息
  getAllAlarm (params) {
    return fetch(`${baseUrl}/fence/interface/alarm/query_all_alarm`, params)
  },
  // 删除警报信息
  deleteAlarm (params) {
    return fetch(`${baseUrl}/fence/interface/alarm/del_alarm`, params)
  },
  // 处理警报信息
  handleAlarm (params) {
    return fetch(`${baseUrl}/fence/interface/alarm/deal_alarm`, params)
  }
}
