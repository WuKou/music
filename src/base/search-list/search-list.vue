<template>
  <div class="search-list" v-show="searchHistory.length">
    <transition-group name="list" tag="ul">
      <li v-for="(item, index) in searchHistory" :key="index" @click="selectItem(item)" class="search-item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searchHistory: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    deleteOne(item) {
      this.$emit('deleteOne', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-d
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
