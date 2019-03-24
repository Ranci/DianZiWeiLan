import axios from 'axios'
const baseUrl = 'https://122.112.236.124'
// const baseUrl = 'http://10.112.136.194:8080'

// const baseUrl = 'http://10.112.20.181:8080'

// const baseUrl = 'https://122.112.236.124'

const instance = axios.create()
instance.defaults.timeout = 10000
instance.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'multipart/form-data'
  return config
}, (error) => {
  return Promise.reject(error)
})
export function fetch (url, params, config) {
  return new Promise((resolve, reject) => {
    instance.post(url, params, config)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  uploaddianziweilan (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/dianziweilan_manager/import_dianziweilan`, params, { responseType: 'blob' })
  },
  // 网关信息-批量导入设备信息
  uploadDevice (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/device/import_device`, params, { responseType: 'blob' })
  },
 // 批量导入设备类型功能信息
  uploadDeviceTypeFunction (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/device_type/import_device_type`, params, { responseType: 'blob' })
  }
}
