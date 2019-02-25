import HttpRequest from '@/libs/axios'
import { Message } from 'iview'
import config from '@/config/index'
import { syGet } from '@/libs/thirdtool'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)
export default axios

/**
 * 查询字典列表
 * @param ids
 * @returns {*}
 */
export const Dict = (key) => {
  if (!key) {
    Message.warning('数据不允许为空')
    return
  }
  if (sessionStorage.getItem('dict_' + key)) {
    return Promise.resolve(JSON.parse(sessionStorage.getItem('dict_' + key)))
  }
  return axios.get('dict/subByKey/' + key).then(data => {
    sessionStorage.setItem('dict_' + key, JSON.stringify(data))
    return data
  }
  )
}

/**
 * 获取字典的值
 * @param ids
 * @returns {*}
 */
export const getDictVal = (key, val) => {
  if (!key || !val) {
    Message.warning('数据不允许为空')
    return
  }
  if (sessionStorage.getItem('dict_val_' + key + '_' + val)) {
    return sessionStorage.getItem('dict_val_' + key + '_' + val)
  }
  var dict = syGet('dict/detail?key=' + val + '&pkey=' + key)
  sessionStorage.setItem('dict_val_' + key + '_' + val, dict.name)
  return dict.name
}
