<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background"><img width="100%" height="100%" :src="currentSong.image" /></div>
        <div class="top">
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle"
        @touchstart.prevent="middleTouchStart"
         @touchmove.prevent="middleTouchMove"
         @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper"><img class="image" :class="cdCls" :src="currentSong.image" ref="image" /></div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                v-for="(item, index) in currentLyric.lines"
                :key="index"
                :class="{ current: currentLine === index }"
                class="text">
                {{ item.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formate(currentTime) }}</span>
            <div class="progress-bar-wrapper"><progress-bar :percent="percent" @triggerProgress="triggerProgress" ref="progressBar"></progress-bar></div>
            <span class="time time-r">{{ formate(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon" :class="disableCls">
              <i class="icon-prev"  @click="prev"></i>
            </div>
            <div class="icon icon-m" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon">
              <i :class="favoriteIcon" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniWrapper">
            <img ref="miniImage" width="40" height="40" :src="currentSong.image" :class="cdCls" />
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist"><i class="icon-playlist"></i></div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <audio :src="currentSong.url" ref="audio"
    @playing="ready"
    @error="error"
    @timeupdate="updateTime"
    @ended="end"
    @pause="paused">
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Scroll from 'base/scroll/scroll'
import PlayList from 'components/playlist/playlist'
import Lyric from 'lyric-parser'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { favoriteMixin } from 'common/js/mixin'

const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g

export default {
  name: 'Player',
  mixins: [favoriteMixin],
  data() {
    return {
      playingLyric: '',
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLine: 0,
      currentShow: 'cd',
      isPureMusic: false,
      pureMusicLyric: ''
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : ''
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'playing',
      'currentIndex',
      'mode',
      'sequencelist',
      'currentSong'
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      let { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    afterLeave(el, done) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    // 计算大CD中心到小CD中心的偏移量
    _getPosAndScale() {
      let targetWidth = 40
      let width = window.innerWidth * 0.8
      let paddingTop = 80
      let paddingLeft = 40
      let paddingBottom = 30
      let scale = targetWidth / width
      let x = -(window.innerWidth / 2 - paddingLeft)
      let y = window.innerHeight - width / 2 - paddingTop - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    ready() {
      clearTimeout(this.timer)
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true
      this.canLyricPlay = true
      this.savePlayHistory(this.currentSong)
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    error() {
      clearTimeout(this.timer)
      this.songReady = true
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    end() {
      this.currentTime = 0
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    paused() {
      this.setPlayingState(false)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let currentIndex = this.currentIndex - 1
        if (currentIndex === -1) {
          currentIndex = this.playlist.length - 1
        }
        this.setCurrentIndex(currentIndex)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let currentIndex = this.currentIndex + 1
        if (currentIndex === this.playlist.length) {
          currentIndex = 0
        }
        this.setCurrentIndex(currentIndex)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequencelist)
      } else {
        list = this.sequencelist
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 待优化，还要考虑转换成小时的
    formate(interval) {
      interval = interval | 0
      let minute = (interval / 60) | 0
      let second = (interval % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    },
    triggerProgress(percent) {
      let currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = parseFloat(currentTime)
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.isPureMusic = !this.currentLyric.lines.length
        // 判断是不是纯音乐
        if (this.isPureMusic) {
          this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
          this.playingLyric = this.pureMusicLyric
        } else {
          if (this.playing && this.canLyricPlay) {
            // 这个时候有可能用户已经播放了歌曲，要切到对应位置
            this.currentLyric.seek(this.currentTime * 1000)
          }
        }
      })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLine = lineNum
      if (lineNum > 5) {
        let line = this.$refs.lyricLine[lineNum - 6] // 6是根据整个屏幕的歌词行数得来的，减6是为了让当前歌词处于屏幕中央，注意是lyricLine而不是lyricList
        this.$refs.lyricList.scrollToElement(line, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      let startX = e.touches[0].pageX
      let startY = e.touches[0].pageY
      this.touch.startX = startX
      this.touch.startY = startY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      let touch = e.touches[0]
      let deltaX = touch.pageX - this.touch.startX
      let deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) // 歌词列表的偏移量
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style.transitionDuration = 0
    },
    middleTouchEnd() {
      let opacity
      let offsetWidth
      // 从右向左滑
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          this.currentShow = 'lyric'
          opacity = 0
          offsetWidth = -window.innerWidth
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        // 从左向右滑
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      let time = 300
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style.transitionDuration = `${time}ms`
      this.touch.initiated = false
    },
    showPlaylist() {
      this.$refs.playlist.show()
    },
    syncWrapperTransform(wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return
      }
      let imageWrapper = this.$refs[wrapper]
      let image = this.$refs[inner]
      let wTransform = getComputedStyle(imageWrapper).transform
      let iTransform = getComputedStyle(image).transform
      imageWrapper.style.transform = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions(['savePlayHistory'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return
      }
      this.songReady = false
      this.canLyricPlay = false
      // 如果当前有歌词，则清空它
      if (this.currentLyric) {
        this.currentLyric.stop()
        // 重置为null
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLine = 0
      }
      this.$refs.audio.src = newSong.url
      this.$refs.audio.play()
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      // ?
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.songReady = true
      }, 5000)
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing(newValue) {
      if (!this.songReady) {
        return
      }
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newValue ? audio.play() : audio.pause()
      })
      if (!newValue) {
        if (this.fullScreen) {
          this.syncWrapperTransform('imageWrapper', 'image')
        } else {
          this.syncWrapperTransform('miniWrapper', 'miniImage')
        }
      }
    },
    fullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricList.refresh()
          this.$refs.progressBar.setProgressOffset(this.percent)
        }, 20)
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 1
    background: $color-background-dd
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -2
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-text-l
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text-l
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text-l
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            border-radius: 50%
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              &.play
                animation: rotate 20s linear infinite // linear表示动画播放的速度从头到尾是相等的，infinite表示无限循环播放动画
        // 为什么.playing-lyric-wrapper可以直接在图片下边位置？
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-ll
            font-size: $font-size-medium
            &.current
              color: $color-text-l
          .pure-music
            padding-top: 50%
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-ll
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-l
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0 auto
        padding: 10px 0
        .time
          color: $color-text-l
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        justify-content: space-evenly
        align-items: center
        .icon
          color: $color-text-l
          text-align: center
          &.disable
            color: $color-text-ll
          i
            font-size: 30px
        .icon-m
          text-align: center
          i
            font-size: 40px
        .icon-favorite
          color: $color-sub-theme
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    border-top: 1px solid #EEEEEE
    box-sizing: border-box // 防止按播放暂停时图标位置改变
    background: $color-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      .imgWrapper
        height: 100%
        width: 100%
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: #8ac6e59c
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0
  @keyframes rotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
</style>
