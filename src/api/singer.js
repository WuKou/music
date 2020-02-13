import { commonParams } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getSinger() {
  const url = debug ? '/api/getSingerList' : '106.53.71.64/music/api/getSingerList'

  const params = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return axios.get(url, {
    params
  }).then(res => res.data)
}

export function getSingerDetail(singerId) {
  const url = debug ? '/api/getSingerDetail' : '106.53.71.64/music/api/getSingerDetail'

  const params = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return axios.get(url, {
    params
  }).then(res => res.data)
}
