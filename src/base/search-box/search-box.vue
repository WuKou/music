<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" />
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-background
  border-bottom: 1px solid $color-text-d
  .icon-search
    font-size: 24px
    color: $color-text-d
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    color: $color-text
    font-size: $font-size-medium
    outline: 0
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-text-d
</style>
