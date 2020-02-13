<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showPlayList">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <p class="text">{{ modeTxt }}</p>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :data="sequencelist" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li v-for="(item, index) in sequencelist" :key="index" class="item" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)"><i class="icon-delete"></i></span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide"><span>关闭</span></div>
      </div>
      <confirm ref="confirm" @confirm="clear" @cancel="cancel" content="是否清空播放列表？"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { favoriteMixin } from 'common/js/mixin'

export default {
  name: 'PlayList',
  mixins: [favoriteMixin],
  data() {
    return {
      showPlayList: false,
      refreshDelay: 120
    }
  },
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    modeTxt() {
      return this.mode === playMode.sequence ? '顺序播放' : (this.mode === playMode.random ? '随机播放' : '单曲循环')
    },
    ...mapGetters([
      'sequencelist',
      'playlist',
      'mode',
      'currentSong'
    ])
  },
  methods: {
    show() {
      this.showPlayList = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showPlayList = false
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    clear() {
      this.clearSonglist()
      this.hide()
    },
    cancel() {
      this.$refs.confirm.hide()
    },
    deleteOne(item) {
      this.deleteSong(item)
    },
    getCurrentIcon(item) {
      return item.id === this.currentSong.id ? 'icon-play' : ''
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
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent(currentSong) {
      let index = this.sequencelist.findIndex((song) => {
        return song.id === currentSong.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'clearSonglist',
      'insertSong',
      'deleteSong'
    ]),
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (!this.showPlayList || newVal.id === oldVal.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newVal)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.playlist
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background-color: $color-background-d
  z-index 200
  &.list-fade-enter-active, &.list-fade-leave-active
    transition: opacity 0.3s
    .list-wrapper
      transition: all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform: translate3d(0, 100%, 0)
  .list-wrapper
    position: absolute
    bottom: 0
    left: 0
    right: 0
    background-color: $color-background
    .list-header
      position: relative
      padding: 20px 30px 10px 20px
      .title
        display: flex
        align-items: center
        .icon
          margin-right: 10px
          font-size: 30px
          color: $color-theme
        .text
          flex: 1
          font-size: $font-size-medium
          color: $color-text-l
        .clear
          extend-click()
          .icon-clear
            font-size: $font-size-medium
            color: $color-text-d
    .list-content
      max-height: 240px
      overflow: hidden
      .item
        display: flex
        align-items: center
        height: 40px
        padding: 0 30px 0 20px
        overflow: hidden
        &.list-enter-active, &.list-leave-active
          transition: all 0.1s
        &.list-enter, &.list-leave-to
          height: 0
        .current
          flex: 0 0 20px
          width: 20px
          font-size: $font-size-small
          color: $color-theme-d
        .text
          flex: 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
        .like
          extend-click()
          margin-right: 15px
          font-size: $font-size-small
          color: $color-theme
          .icon-favorite
            color: $color-sub-theme
        .delete
          extend-click()
          font-size: $font-size-small
          color: $color-theme
    .list-operate
      width: 140px
      margin: 20px auto 30px auto
      .add
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-theme
        border-radius: 100px
        color: $color-theme
        .icon-add
          margin-right: 5px
          font-size: $font-size-small-s
        .text
          font-size: $font-size-small
    .list-close
      text-align: center
      line-height: 50px
      background: $color-theme
      font-size: $font-size-medium-x
      color: $color-background
</style>
