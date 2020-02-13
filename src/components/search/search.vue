<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searchHistory="searchHistory"
                         @selectItem="selectSearchHistory"
                         @deleteOne="deleteOne">
            </search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listenScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm content="确定清空搜索记录吗？"
             confirmBtnText="清空"
             @confirm="clear"
             @cancel="cancelClear"
             ref="confirm">
    </confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  name: 'Search',
  mixins: [playlistMixin],
  data() {
    return {
      query: '',
      hotKey: []
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    onQueryChange(query) {
      this.query = query.trim()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput() {
      this.$refs.searchBox.blur() // 让该元素失去焦点，使之在移动端键盘不会弹出来
    },
    saveSearch(item) {
      this.saveSearchHistory(this.query)
    },
    selectSearchHistory(query) {
      this.$refs.searchBox.setQuery(query)
    },
    deleteOne(query) {
      this.deleteSearchHistory(query)
    },
    clear() {
      this.clearSearchHistory()
      this.$refs.confirm.hide()
    },
    cancelClear() {
      this.$refs.confirm.hide()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      left 0
      right 0
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-theme
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            border: 1px solid $color-text-d
            background: $color-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-theme
            .text
              flex: 1
            .clear
              extend-click() // 扩展点击区域
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position fixed
      top 178px
      bottom 0
      left 0
      right 0
</style>
