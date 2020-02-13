<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <switches :data="switches" ref="switches" @changeSwitch="changeSwitch"></switches>
      </div>
      <div class="playBtn" @click="randomPlaySongs">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" :data="favoriteList" class="list-scroll" v-if="currentIndex === 0">
          <div class="list-inner">
            <song-list :songs="favoriteList" @selectSong="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playlist" :data="playHistory" class="list-scroll" v-if="currentIndex === 1">
          <div class="list-inner">
            <song-list :songs="playHistory" @selectSong="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import NoResult from 'base/no-result/no-result'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  name: 'UserCenter',
  mixins: [playlistMixin],
  data() {
    return {
      switches: ['我喜欢的', '最近听的'],
      currentIndex: 0
    }
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playlist && this.$refs.playlist.refresh()
    },
    back() {
      this.$router.back()
    },
    changeSwitch(index) {
      this.currentIndex = index
      this.$refs.switches.setIndex(index)
    },
    selectSong(song) {
      this.insertSong(song)
    },
    randomPlaySongs() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      this.randomPlay({ list })
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .user-center
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background $color-background
    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .header
      height 62px
      display flex
      align-items center
      .back
        position absolute
        top 10px
        left 6px
        .icon-back
          display inline-block
          padding: 10px
          font-size: $font-size-large-x
          color: $color-theme
    .playBtn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 10px auto
      text-align: center
      border: 1px solid  $color-text-d
      color: $color-text-d
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position absolute
      left 0
      right 0
      top 115px
      bottom 0
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
