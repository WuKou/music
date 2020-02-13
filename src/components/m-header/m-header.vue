<template>
  <div class="m-header">
    <h1 class="text">Sky Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style lang="stylus" scoped >
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    color: $color-background
    background: $color-theme
    font-size: 0
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
      margin-left: 12px
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: #fff
</style>
