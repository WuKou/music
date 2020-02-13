import { commonParams } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getSearchResult(query, perpage, page, zhida) {
  const url = debug ? '/api/getSearch' : '106.53.71.64/music/api/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    n: perpage, // 表示每一页返回的数据个数
    perpage,
    p: page, // 表示当前处于返回的数据中的第几页
    catZhida: zhida ? 1 : 0, // 表示要不要返回歌手的数据
    _: (Math.random() + '').replace('0.', ''),
    uin: '',
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getHotKey(txt) {
  const url = debug ? '/api/getHotKey' : '106.53.71.64/music/api/getHotKey'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
