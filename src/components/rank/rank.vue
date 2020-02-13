<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="topList" ref="toplist">
      <ul>
        <li v-for="(item, index) in topList" :key="index" class="item" @click="selectItem(item)">
          <div class="icon"><img width="100" height="100" v-lazy="item.picUrl" /></div>
          <ul class="songlist">
            <li v-for="(song, index) in item.songList" :key="index" class="song">
            {{ index + 1 }}.{{ song.songname }}—{{ song.singername }}
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-wrapper" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRank } from 'api/rank'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'

export default {
  name: 'Rank',
  mixins: [playlistMixin],
  created() {
    this._getRank()
  },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.topId}`
      })
      this.setTopList(item)
    },
    _getRank() {
      getRank().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.rank
  position: fixed
  top: 88px
  bottom: 0
  left: 0
  right: 0
  .topList
    height: 100%
    overflow: hidden
    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      &:last-child
        padding-bottom: 20px
      .icon
        flex: 0 0 100px
        width: 100px
        height: 100px
        background: $color-theme
      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-background
        color: $color-text
        font-size: $font-size-small
        .song
          no-wrap()
          line-height: 26px
  .loading-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
