const path = require('path') //path 模块提供用于处理文件路径和目录路径的实用工具。
const bodyParser = require('body-parser')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir) // __dirname:获得当前执行文件所在目录的完整目录名
}

module.exports = {
  devServer: {
    before (app) {
      app.get('/api/getDiscList', function(req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => { // response 是 axios 返回的响应对象
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getTopBanner', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const jumpPrefix = 'https://y.qq.com/n/yqq/album/'

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          if (response.code === 0) {
            const slider = []
            const content = response.focus.data && response.focus.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                const item = content[i]
                const sliderItem = {}
                sliderItem.id = item.id
                sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                sliderItem.picUrl = item.pic_info.url
                slider.push(sliderItem)
              }
            }
            res.json({
              code: 0,
              data: {
                slider
              }
            })
          } else {
            res.json(response)
          }
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getSongList', function(req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getSingerList', function(req, res) {
         const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
         axios.get(url, {
           headers: {
           referer: 'https://c.y.qq.com/',
           host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => res.json(response.data))
          .catch(e => console.log(e))
      }),
      app.get('/api/getSingerDetail', function(req, res) {
         const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
         axios.get(url, {
           headers: {
           referer: 'https://c.y.qq.com/',
           host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => res.json(response.data))
          .catch(e => console.log(e))
      }),
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/ // 这里之后细看
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getRank', function(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getMusicList', function(req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      }),
      app.get('/api/getSearch', function(req, res) {
         const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
         axios.get(url, {
           headers: {
           referer: 'https://c.y.qq.com/',
           host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => res.json(response.data))
          .catch(e => console.log(e))
      }),
      app.get('/api/getHotKey', function(req, res) {
         const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
         axios.get(url, {
           headers: {
           referer: 'https://c.y.qq.com/',
           host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => res.json(response.data))
          .catch(e => console.log(e))
      })
     }
    },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  },
  publicPath: ''
}
