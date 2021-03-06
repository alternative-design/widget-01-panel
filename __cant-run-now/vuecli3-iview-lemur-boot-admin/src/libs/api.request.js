import HttpRequest from '@/libs/axios'
import config from '@/config/index'
import { Message } from 'iview'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)
export default axios

/**
 * GET 请求
 * @param path
 * @constructor
 */
export const G = (path) => {
  if (!path) {
    Message.warning('地址不允许为空')
    return
  }
  return axios.get(path)
}

/**
 * Post 请求
 * @param path
 * @param data
 * @constructor
 */
export const P = (path, data) => {
  if (!path) {
    Message.warning('地址不允许为空')
    return
  }
  return axios.post(path, data)
}

/**
 * 删除数据,批量删除
 * @param ids
 * @returns {*}
 */
export const D = (path, ids) => {
  if (!ids || ids.length === 0) {
    Message.warning('数据不允许为空')
    return
  }
  return axios.post(path + '/deleteBatchIds', ids)
}

/**
 * 查询列表
 * @param path
 * @param params
 * @returns {*}
 */
export const L = (path, params) => {
  return axios.post(path + '/list', params)
}

/**
 * 查询单个对象
 * @param path
 * @param id
 * @returns {*}
 */
export const R = (path, id) => {
  if (!params) {
    Message.warning('数据不允许为空')
    return
  }
  return axios.get(path + '/detail/' + id)
}

/**
 * 新增对象
 * @param path
 * @param params
 * @returns {PromiseLike<T> | Promise<T>}
 */
export const C = (path, params) => {
  if (!params) {
    Message.warning('数据不允许为空')
    return
  }
  return axios.post(path + '/create', params).then(data => {
    if (data) {
      Message.success('新增成功')
      return data
    }
  })
}

/**
 * 修改对象
 * @param path
 * @param params
 * @returns {PromiseLike<T> | Promise<T>}
 */
export const U = (path, params) => {
  if (!params) {
    Message.warning('数据不允许为空')
    return
  }
  return axios.post(path + '/update', params).then(data => {
    if (data) {
      Message.success('修改成功')
      return data
    }
  })
}
