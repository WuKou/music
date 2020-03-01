<template>
  <div class="progress-bar" @click="progressClick" ref="progressBar">
    <div class="bar-inner" ref="barInner">
      <div class="progress" ref="progress"></div>
      <div class="circle-btn-wrapper" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd" ref="btnWrapper">
        <div class="circle-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
let btnWidth = 16
export default {
  name: 'ProgressBar',
  created() {
    this.touch = {}
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      let deltaX = e.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(this.$refs.barInner.clientWidth - btnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerProgress()
    },
    progressClick(e) {
      let rect = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = e.pageX - rect.left - btnWidth / 2
      let barWidth = this.$refs.barInner.getBoundingClientRect().width
      // 当点击的是进度条末尾时，减去按钮的宽度，防止超出进度条
      if (barWidth - offsetWidth < barWidth * 0.1) {
        offsetWidth = offsetWidth - btnWidth / 2
      }
      this._offset(offsetWidth)
      this._triggerProgress()
    },
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - btnWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    _offset(width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.btnWrapper.style.transform = `translate3d(${width}px,0,0)`
    },
    _triggerProgress() {
      let progressBarWidth = this.$refs.barInner.clientWidth - btnWidth
      let progressWidth = this.$refs.progress.clientWidth
      let percent = progressWidth / progressBarWidth
      this.$emit('triggerProgress', percent)
    }
  },
  watch: {
    percent(newValue) {
      if (newValue >= 0 && !this.touch.initiated) {
        let barWidth = this.$refs.barInner.clientWidth - btnWidth
        let progressWidth = barWidth * newValue
        this._offset(progressWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.progress-bar
  height: 30px
  display: flex
  align-items: center
  .bar-inner
    position: relative
    height: 4px
    width: 100%
    background: rgba(0, 0, 0, 0.3)
    .progress
      height: 100%
      width: 0
      background: $color-theme
    .circle-btn-wrapper
      position: absolute
      bottom: -7px
      .circle-btn
        width: 16px
        height: 16px
        border: 3px solid $color-text-l
        box-sizing: border-box
        border-radius: 50%
        background: $color-theme
</style>
