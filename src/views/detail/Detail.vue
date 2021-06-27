<template>
  <div id="detail" >
    <detail-nav-bar  class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :pull-up-load="true" @scroll="contentScroll" :probe-type="3" >
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar  @addCart="addToCart"/>
    <back-top @click.native="backclick" v-show="isShowBackTop"/>
  </div>

</template>

<script>
import DetailNavBar from "@/views/detail/childCompa/DetailNavBar";
import DetailSwiper from "@/views/detail/childCompa/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childCompa/DetailBaseInfo";
import DetailGoodsInfo from "@/views/detail/childCompa/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childCompa/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childCompa/DetailCommentInfo";
import goodsList from "@/components/content/goods/goodsList";
import goodsListItem from "@/components/content/goods/goodsListItem";
import BackTop from "@/components/content/backTop/backTop";
import DetailBottomBar from "@/views/detail/childCompa/DetailBottomBar";

import {getDetail, Goods , Shop, GoodsParam ,getRecommend,} from "@/network/detail";
import DetailShopInfo from "@/views/detail/childCompa/DetailShopInfo";
import Scroll from "@/components/common/scroll/Scroll";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin";
import Toast from "@/components/common/toast/Toast";


export default {
  name: "detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs:[],
      grtThemeTopY:null,
      currentIndex : 0,
      isShowBackTop: false,
    }
  },
  created() {
    //保存传入的iid
    // console.log(this.$route.params);
    this.iid = this.$route.params.iid

    //根据iid请求详情数据
    getDetail(this.iid).then(res => {

      const data = res.result
      this.topImages = data.itemInfo.topImages
      //获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //3创建店铺信息对象
      this.shop = new Shop(data.shopInfo)

      //4保存 商品的详情数据
      this.detailInfo = data.detailInfo
      //5获取参数
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]

      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      // })
      }
    })

    getRecommend().then(res => {
      this.recommends = res.data.list
    }).catch(err => {
      console.log(err)
    })


    this.grtThemeTopY =debounce(() => {
      this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
    })

  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    goodsList,
    goodsListItem,
    DetailBottomBar,
    BackTop
  },
  mixins:[itemListenerMixin],
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      this.grtThemeTopY()

    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      //获取Y值
      const positionY = -position.y
      //对比
      this.isShowBackTop = positionY > 500

      let length = this.themeTopYs.length
      for (let i = 0; i < this.themeTopYs.length; i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
          || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex

        }
      }
    },
    backclick() {
      this.$refs.scroll.scroll.scrollTo(0, 0, 500)
    },
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      //商品加入购物车
      // this.$store.cartList.push()
      this.$store.dispatch('addCart',product).then(res => {
        this.$toast.show(res, 2000)
      })




  },},


  destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImglistenner)
  },
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 10;
  background-color: #fff;
  height: 100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content{
  height: calc(100% - 44px - 49px);
}
</style>
