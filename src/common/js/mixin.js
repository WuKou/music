import { mapGetters, mapActions } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newValue) {
      this.handlePlaylist(newValue)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const favoriteMixin = {
  computed: {
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'currentSong',
      'favoriteList'
    ])
  },
  methods: {
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteSong(song)
      } else {
        this.saveFavoriteSong(song)
      }
    },
    ...mapActions([
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  }
}
