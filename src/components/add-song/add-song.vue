<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <span class="text">添加歌曲到列表</span>
        <span class="close" @click="hide"><i class="icon-close"></i></span>
      </div>
      <div class="search-box-wrapper"><search-box @query="onQueryChange" placeholder="搜索歌曲" ref="searchBox"></search-box></div>
      <div class="shortcut" v-show="!query">
        <switches :data="switchesText" @changeSwitch="changeSwitch" ref="switches"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" :data="playHistory" :key="0" v-if="currentIndex === 0" ref="playlist">
            <div class="list-inner"><song-list :songs="playHistory" @selectSong="selectSong"></song-list></div>
          </scroll>
          <scroll class="list-scroll" :data="searchHistory" :key="1" v-if="currentIndex === 1" ref="searchlist">
            <div class="list-inner"><search-list :searchHistory="searchHistory" @selectItem="selectSearchHistory" @deleteOne="deleteSearch"></search-list></div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query"><suggest :query="query" :showSinger="showSinger" @select="selectSuggest"></suggest></div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import TopTip from 'base/top-tip/top-tip'
import { mapGetters, mapActions } from 'vuex'
import Song from 'common/js/song'

export default {
  name: 'AddSong',
  data() {
    return {
      showFlag: false,
      switchesText: ['最近播放', '搜索历史'],
      currentIndex: 0,
      query: '',
      showSinger: false
    }
  },
  computed: {
    ...mapGetters(['playHistory', 'searchHistory'])
  },
  methods: {
    show() {
      this.showFlag = true
      this.refreshList()
    },
    hide() {
      this.showFlag = false
    },
    refreshList() {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.playlist.refresh()
        } else {
          this.$refs.searchlist.refresh()
        }
      }, 20)
    },
    changeSwitch(index) {
      this.$refs.switches.setIndex(index)
      this.currentIndex = index
    },
    onQueryChange(value) {
      this.query = value
    },
    selectSong(item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
        this.showTopTip()
      }
    },
    selectSearchHistory(query) {
      this.$refs.searchBox.setQuery(query)
    },
    selectSuggest() {
      if (this.query) {
        this.saveSearchHistory(this.query)
        this.showTopTip()
      }
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item)
    },
    showTopTip() {
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong', 'saveSearchHistory', 'deleteSearchHistory'])
  },
  components: {
    SearchBox,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Suggest,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.add-song
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background: $color-background
  z-index: 200
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
  .header
    position: relative
    text-align: center
    height: 44px
    .text
      line-height: 44px
      color: $color-text
      font-size: $font-size-large
    .close
      position: absolute
      top: 0
      right: 8px
      .icon-close
        display: inline-block
        padding: 12px
        font-size: 20px
        color: $color-theme
  .search-box-wrapper
    margin: 20px
  .shortcut
    .list-wrapper
      position: absolute
      top: 165px
      bottom: 0
      left: 0
      right: 0
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
  .search-result
    position: fixed
    top: 124px
    bottom: 0
    left: 0
    right: 0
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
