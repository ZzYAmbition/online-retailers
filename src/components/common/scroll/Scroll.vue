<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  data() {
    return {
      scroll: null
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // 一般不要用querySelector获取元素，因为有可能有多个相同的元素
    // 用ref
    // click用于设定div等元素是否可以点击

    // 创建better-scroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      click: true,
      pullUpLoad: this.pullUpLoad
    })
    console.log(this.scroll )

    // 监听滚动的位置
    this.scroll.on('scroll', position => {
      this.$emit('scroll', position)
    })
    // 监听滚动到底部
    if(this.pullUpLoad) {
      
    // 监听上拉事件
    this.scroll.on('pullingUp', () => {
      console.log('上拉加载更多')
      this.$emit('pullingUp')
    })
    }
  },
}
</script>

<style scoped>

</style>