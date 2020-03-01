<template>
  <transition name="slider">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'SingerDetail',
  created() {
    this._getDetail()
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  methods: {
    _getDetail() {
      getSingerDetail(this.singer.id).then((res) => {
        // 刷新页面的时候，内层中的 vuex 是没有 singer.id 的，所以退回到 singer 页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item // 对象的解构赋值，拿到item里面的musicData属性
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .slider-enter-active, .slider-leave-active
    transition: all 0.3s
  .slider-enter, .slider-leave
    transform: translate3d(100%, 0, 0)
</style>
