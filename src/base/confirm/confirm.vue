<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showConfirm" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{content}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="confirm">{{confirmBtnText}}</div>
            <div class="operate-btn" @click="cancel">{{cancelBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    content: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showConfirm: false
    }
  },
  methods: {
    show() {
      this.showConfirm = true
    },
    hide() {
      this.showConfirm = false
    },
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .confirm
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 9
    background-color $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation zoom 0.3s
    .confirm-wrapper
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      z-index 10
      .confirm-content
        width 270px
        border-radius 13px
        background-color $color-highlight-background
        .text
          display inline-block
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $font-size-large
          color: $color-text-l
        .operate
          display flex
          align-items center
          text-align center
          font-size $font-size-large
          .operate-btn
            flex 1
            line-height: 22px
            padding: 10px 0
            border-top: 1px solid $color-background-d
            color: $color-text-d
            &.left
              border-right: 1px solid $color-background-d

  @keyframes confirm-fadein
    0%
      opacity 0
    100%
      opacity 1

  @keyframes zoom
    0%
      transform scale(0)
    50%
      transform scale(1.1)
    100%
      transform scale(1)
</style>
