import axios from 'axios'
const baseUrl = 'https://122.112.236.124'
// const baseUrl = 'http://10.210.70.164:8080'
// const baseUrl = 'http://10.112.20.181:8080'
// const baseUrl = 'http://10.112.10.121:8080'
const instance = axios.create()
instance.defaults.timeout = 6000
instance.interceptors.request.use((config) => {
  instance.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  return config
}, (error) => {
  return Promise.reject(error)
})
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.log(url)
        reject(error)
      })
  })
}
export default {
  // 查询管理员列表
  getAdmin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/query_admin`, params)
  },
  // 下拉列表-查询所有管理员
  getAllAdmin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/query_all_admin`, params)
  },
  // 用户修改密码
  changePwd (params) {
    return fetch(`${baseUrl}/fence/interface/admin/update_password`, params)
  },
  // 添加管理员
  addAdmin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/add_admin`, params)
  },
  // 修改管理员信息
  editAdmin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/update_admin`, params)
  },
  // 删除管理员
  deleteAdmin (params) {
    return fetch(`${baseUrl}/fence/interface/admin/delete_admin`, params)
  },
  // 查询用户组
  getUserGroup (params) {
    return fetch(`${baseUrl}/fence/interface/group/query_group`, params)
  },
  // 查询所有用户组
  getAllUserGroup (params) {
    return fetch(`${baseUrl}/fence/interface/group/query_all_group`, params)
  },
  // 查询用户组用户
  getUser (params) {
    return fetch(`${baseUrl}/fence/interface/group/query_group_info`, params)
  },
  // 添加用户组
  addUserGroup (params) {
    return fetch(`${baseUrl}/fence/interface/group/add_group`, params)
  },
  // 修改用户组
  editUserGroup (params) {
    return fetch(`${baseUrl}/fence/interface/group/update_group`, params)
  },
  // 删除用户组
  deleteUserGroup (params) {
    return fetch(`${baseUrl}/fence/interface/group/delete_group`, params)
  }
}
