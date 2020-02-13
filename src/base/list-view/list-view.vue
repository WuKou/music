<template>
  <scroll :data="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll" class="list-view" ref="listView">
    <ul>
      <li v-for="(group, index) in list" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div v-show="fixedTitle" class="list-fixed" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList"
        :key="index"
        :data-index="index"
        class="item"
        :class="{ current: index === currentIndex }">
        {{ item }}
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!list.length"><loading></loading></div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'ListView',
  props: {
    list: {
      type: Array,
      default() {
        // 不要写成default: []
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.probeType = 3 // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
    this.listenScroll = true
    this.listHeight = []
  },
  computed: {
    shortcutList() {
      return this.list.map(item => {
        return item.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.list[this.currentIndex] ? this.list[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = e.target.dataset.index
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0 // num | 0，当 num 是正数的时候，相当于 Math.floor(num)
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },
    refresh() {
      this.$refs.listView.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      let height = 0
      let list = this.$refs.listGroup
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    list() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // console.log(newY)
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      let listHeight = this.listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (height1 <= Math.abs(newY) && Math.abs(newY) < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(val) {
      let fixedTop = val > 0 && val < TITLE_HEIGHT ? val - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.list-view
  position: relative
  height: 100%
  width: 100%
  overflow: hidden
  background-color: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      border-top: 1px solid $color-theme
      border-bottom: 1px solid $color-theme
      box-sizing: border-box
      font-size: $font-size-small
      color: $color-theme
      background: $color-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-text-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-background
      font-size: $font-size-small
      &.current
        color: $color-theme
        font-size: $font-size-medium-x
  .fixed
    position: fixed
    top: 87px
    left: 0
    right: 0
    display: block
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  .list-fixed
    position: absolute
    top: -1px
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      border-top: 1px solid $color-theme
      border-bottom: 1px solid $color-theme
      box-sizing: border-box
      font-size: $font-size-small
      color: $color-theme
      background: $color-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
