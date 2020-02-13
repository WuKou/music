<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import { getMusicList } from 'api/rank'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'

export default {
  name: 'topList',
  data() {
    return {
      musicList: {},
      songs: []
    }
  },
  computed: {
    title() {
      return this.toplist.title
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'toplist'
    ])
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.toplist.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(songs) {
      let ret = []
      songs.forEach((item) => {
        const musicData = item.data
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
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
