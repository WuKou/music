<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: { // 表示是否要监听滚动事件
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    directionLockThreshold: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scroll) {
        return
      }
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click,
        data: this.data,
        eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
        directionLockThreshold: this.directionLockThreshold
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => { // 外层是 better-scroll 事件
          this.$emit('scroll', pos) // 内层是在当前 Vue 实例上派发一个 scroll 事件
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // maxScrollY是scroll 最大纵向滚动位置。位置区间是 0 - maxScrollY，并且 maxScrollY 是负值。
          // +50意思就是让默认的最大纵向滚动位置少50,比如默认最大可以滚动的值是-100,+50之后就变成了 -50
          // 就是说,不需要滚动到最底部 -100 才能向下进行,滚到接近底部还有50的距离就可以,  这个值可以根据自己的想法设置
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
