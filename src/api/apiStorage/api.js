import axios from 'axios'

const baseUrl = 'https://122.112.236.124'
// const baseUrl = 'http://10.112.136.194:8080'

// const baseUrl = 'http://10.112.20.181:8080'

// 服务器： 10.110.15.235
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
  // 查询网关入库记录
  getInStorageInfo (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_purchase_dianziweilan`, params)
  },
  // 查询网关出库记录
  getOutStorageInfo (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_sale_dianziweilan`, params)
  },
  // 更新网关信息入库
  editIndianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/update_purchase_dianziweilan`, params)
  },
  // 更新网关信息出库
  editOutdianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/update_sale_dianziweilan`, params)
  },
  // 删除网关入库记录
  deleteIndianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/delete_purchase`, params)
  },
  // 删除网关出库记录
  deleteOutdianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/delete_sale`, params)
  },
  // 查询网关库存
  getdianziweilanStorageMana (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_stock_dianziweilan`, params)
  },
  // 网关入库
  addIndianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/purchase_dianziweilan`, params)
  },
  // 网关出库
  addOutdianziweilanStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/sale_dianziweilan`, params)
  },
  // 硬件信息-查询设备库存信息
  getDeviceStock (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_stock_device`, params)
  },
   // 硬件信息-查询设备出库
  getDeviceStockOut (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_sale`, params)
  },
   // 硬件信息-查询设备入库
  getDeviceStockIn (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/query_purchase`, params)
  },
   // 硬件信息-更新设备出库
  editOutDeviceStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/update_sale_device`, params)
  },
  // 硬件信息-更新设备入库
  editInDeviceStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/update_purchase_device`, params)
  },
   // 硬件信息-设备出库
  deviceStockOut (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/sale_device`, params)
  },
  // 硬件信息-设备入库
  deviceStockIn (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/purchase_device`, params)
  },
  // 硬件信息-删除设备入库
  deleteInDeviceStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/delete_purchase`, params)
  },
  // 硬件信息-删除设备出库
  deleteOutDeviceStorage (params) {
    return fetch(`${baseUrl}/dianziweilan/interface/inventory/delete_sale`, params)
  }
}
