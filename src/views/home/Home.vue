<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <TabControl
        class="tab-control"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        v-show="isTabFixed"
      ></TabControl>
    <Scroll
      class="content"
      ref="Scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper 
        :banners="banners"
        @swiperImageLoad="swiperImageLoad" 
      ></home-swiper>
      <recommend :recommends="recommends"></recommend>
      <Feature></Feature>
      <TabControl
        class="tab-control"
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl"
      ></TabControl>
      <GoodsList :goods="showGoods"></GoodsList>
    </Scroll>
    <!-- 
      组件是不能监听点击的，如果需要则要加上.native
      监听组件的原生事件，必须给对应的事件加上.native修饰符，才能进行监听
    -->
    <BackTop @click.native="backClick" v-show="isShow"></BackTop>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import Recommend from "./childComps/Recommend";
import Feature from "./childComps/Feature";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/contents/tabControl/TabControl";
import GoodsList from "components/contents/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/contents/backtop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    Recommend,
    Feature,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      result: null,
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShow: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    

    const refresh = this.debounce(this.$refs.Scroll.scroll.refresh)

    // 3.监听GoodsListItem里面通过事件总线发射的事件
    this.$bus.$on('itemImageLoad', () => {
      /*
      更新内容高度，better-scroll会在图片加载之前计算好高度，并固定高度
      如果图片加载完成后，会改变高度这时需要手动刷新即refresh()
      直接调用refresh()函数，会被调用30次
      */
      // this.$refs.Scroll.scroll.refresh()
      refresh()
    })

    // 获取tabControl的offsetTop
    // 所有的组件都有一个属性$el: 用于获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop)
  },
  methods: {
    /**
     * 网络请求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // 直接将数组拼接在数组后面
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        this.$refs.Scroll.scroll.finishPullUp();
      });
    },
    /**
     * 事件监听相关方法
     */
     // 防抖函数，解决refresh()频繁调用
    debounce(func, delay) {
      let timer = null
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl.currentIndex = index
    },
    backClick() {
      // 点击按钮，回到顶部，最后一个参数是时延
      this.$refs.Scroll.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      // 判断backTop是否显示
      this.isShow = position.y <= -1500 ? true : false;

      // 判断tabControl是否吸顶
      this.isTabFixed = position.y <= (0-this.tabOffsetTop) ? true : false

    },
    // 上拉加载更多数据
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    // 监听轮播图片是否加载完毕
    swiperImageLoad() {
      // 获取tabControl的offsetTop
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  activated() {
    this.$refs.Scroll.scroll.scrollTo(0, this.saveY)
    this.$refs.Scroll.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.Scroll.scroll.y
  }
};
</script>


<style scoped>
/* style中的scoped表示样式只对当前组件起作用 */
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  /* 使用变量属性值 */
  background-color: var(--color-tint);
  color: white;
  /* position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9; */
}
.content {
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}
.tab-control {
  position: relative;
  z-index: 9;
}
/* .fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  z-index: 9;
} */
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>