<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listenScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore || !result.length"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { getSearchResult } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Singer from 'common/js/singer'
import { mapActions, mapMutations } from 'vuex'

const perpage = 20
const TYPE_SINGER = 'singer'

export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true,
      pullup: true,
      beforeScroll: true
    }
  },
  methods: {
    search() {
      this.hasMore = true
      this.page = 1
      getSearchResult(this.query, perpage, this.page, this.showSinger).then((res) => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then((res) => {
            this.result = res
          })
          this._checkMore(res.data.song)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSearchResult(this.query, perpage, this.page, this.showSinger).then((res) => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then((result) => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data.song)
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    listenScroll() {
      this.$emit('listenScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    getIconCls(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}—${item.singer}`
      }
    },
    _checkMore(song) {
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        if (isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapActions([
      'insertSong'
    ]),
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        return
      }
      this.result = []
      this.search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: fixed
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
