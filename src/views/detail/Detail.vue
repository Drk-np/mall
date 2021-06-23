<template>
  <div id="detail" >
    <detail-nav-bar  class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>
    </scroll>

  </div>

</template>

<script>
import DetailNavBar from "@/views/detail/childCompa/DetailNavBar";
import DetailSwiper from "@/views/detail/childCompa/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childCompa/DetailBaseInfo";
import DetailGoodsInfo from "@/views/detail/childCompa/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childCompa/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childCompa/DetailCommentInfo";



import {getDetail, Goods , Shop, GoodsParam } from "@/network/detail";
import DetailShopInfo from "@/views/detail/childCompa/DetailShopInfo";
import Scroll from "@/components/common/scroll/Scroll";


export default {
  name: "detail",
  data(){
    return{
       iid: null,
      topImages:[],
      goods: {},
      shop: {},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},

    }
  },
  created() {
    //保存传入的iid
    // console.log(this.$route.params);
    this.iid = this.$route.params.iid

    //根据iid请求详情数据
    getDetail(this.iid).then(res => {

      const data =res.result
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
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      }
    })
  },
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
  },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
    }
  }
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
  height: calc(100% - 44px);
}
</style>
