import axios from 'axios'
const baseUrl = 'https://122.112.236.124'
// const baseUrl = 'http://10.112.136.194:8080'
// const baseUrl = 'http://10.112.20.181:8080'
// 服务器： 10.110.15.235
const instance = axios.create()
instance.defaults.timeout = 10000
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
  /**
   * 登陆接口
   * **/
  toLogin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/login`, params)
  }
}
