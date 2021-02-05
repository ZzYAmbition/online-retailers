<template>
  <div id="detail">
    <DetailNavBar></DetailNavBar>
    <DetailSwiper :topImages="topImgs"></DetailSwiper>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'

import {getDetails, Goods, Shop} from 'network/details'
export default {
  name: 'Details',
  components: {
    DetailNavBar,
    DetailSwiper
  },
  data() {
    return {
      iid: null,
      topImgs: [], // 顶部轮播图地址
      goods: {},
      shop: {}
    }
  },
  created() {

    // 保存传入的iid
    this.iid = this.$route.params.iid

    // 根据iid请求详情数据
    getDetails(this.iid).then(res => {
      const data = res.result
      // 获取顶部轮播图的地址
      this.topImgs = data.itemInfo.topImages

      // 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 获取店铺信息
      this.shop = new Shop(data.shopInfo)
    })
  },
}
</script>

<style>

</style>