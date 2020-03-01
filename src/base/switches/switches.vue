<template>
  <ul class="switch">
    <li v-for="(item, index) in data" :key="index" class="item" :class="{ current: index === currentIndex }" @click="selectItem(index)">
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Switches',
  data() {
    return {
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(index) {
      this.$emit('changeSwitch', index)
    },
    setIndex(index) {
      this.currentIndex = index
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.switch
  display: flex
  align-items: center
  width: 70%
  margin: 0 auto
  border: 1px solid $color-theme
  border-radius: 5px
  .item
    flex: 1
    text-align: center
    padding: 8px
    color: $color-theme
    font-size: $font-size-medium
    &.current
      background: $color-theme
      color: $color-background
</style>
