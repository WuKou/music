<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="randomPlaySongs">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" :probeType="probeType" :listenScroll="listenScroll"  @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper" ref="list">
        <song-list :songs="songs" @selectSong="selectSong"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40

export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  // 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted() {
    this.imageHeight = this.$refs.bgImg.clientHeight
    this.minTranslate = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})` // 为什么不用<img :src='xxx'>?而要通过这种形式?
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectSong(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    randomPlaySongs() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let scale = 1
      let zIndex = 0
      let percent = Math.abs(newY / this.imageHeight)
      // 当列表还可以继续向上顶时，取newY，当列表不能再继续向上顶时，取this.minTranslate
      let translateY = Math.max(this.minTranslate, newY)
      let blur = 0
      // 列表向下拉时
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 3
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
      this.$refs.filter.style.backdrop = `blur(${blur}px)`
      if (newY < this.minTranslate) { // 列表已经向上拉到最顶端
        zIndex = 1
        this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px` // 注意加上单位
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.playBtn.style.display = 'none'
      } else { // 列表向上拉还没到最顶端
        this.$refs.bgImg.style.height = 0
        this.$refs.bgImg.style.paddingTop = '70%' // 注意加上''
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImg.style.transform = `scale(${scale})`
      this.$refs.bgImg.style.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 4
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-background
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 4
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-background
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 1
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-background
          color: $color-background
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position relative
      height 100%
      background $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-wrapper
        position fixed
        width 100%
        top 50%
        transform translateY(-50%)
</style>
