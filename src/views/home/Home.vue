<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick" ref="tabControl1"
                 v-show="isTabFixed"/>
    <scroll  class="content"
             ref="scroll"
             :probe-type="3"
             @scroll="contentsroll"
             :pull-up-load="true"
             @pullingUp="loadMore">
    <home-swiper :banners="banners"  @swiperImageLoad="swiperImageLoad"/>
    <recommer-view :recommends="recommends"/>
    <Feature-view/>
    <tab-control  :titles="['流行','新款','精选']"
                   @tabClick="tabClick" ref="tabControl2" />
<!--               :class="{fixed:isTabFixed}"/>-->
    <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backclick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import RecommerView from "@/views/home/childComps/RecommerView";
  import FeatureView from "@/views/home/childComps/FeatureView";
  import goodsList from "@/components/content/goods/goodsList";
  import BackTop from "@/components/content/backTop/backTop";
  import Scroll from "@/components/common/scroll/Scroll";

  import NavBar from "@/components/common/navbar/NavBar";
  import TabControl from "@/components/content/TabControl/TabControl";

  import {getHomeMutidata, getHomeGoods} from "@/network/home";
  import {debounce} from "@/common/utils";

  export default {
    name: "Home",
    components: {
      BackTop,
      Scroll,
      NavBar,
      HomeSwiper,
      RecommerView,
      FeatureView,
      TabControl,
      goodsList
    },
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0 , list:[]},
          'new':{page:0 , list:[]},
          'sell':{page:0 , list:[]}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed : false,
        saveY: 0
      }},
    created() {
      //1.请求多个数据
      this.getHomeMutidata();
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {

      debounce(this.$refs.scroll.refresh, 200)

      this.$bus.$on('itemImageLoad',() => {
        this.scroll&&this.$refs.scroll.scroll.refresh()
      })


    },
    methods:{

      swiperImageLoad(){
         this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },


      //事件监听
      tabClick(index) {
        switch (index){
          case 0:
            this.currentType = 'pop'
                break
          case 1:
            this.currentType = 'new'
                break
          case 2:
            this.currentType = 'sell'
                break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backclick(){
        this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      },
      contentsroll(position){
        this.isShowBackTop = -(position.y) > 1000

        this.isTabFixed = -(position.y) > this.tabOffsetTop


      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.scroll.refresh()
        this.$refs.scroll.scroll.finishPullUp()
      },

      getHomeMutidata(){
        getHomeMutidata().then(res => {
          this.banners=res.data.banner.list;
          this.recommends=res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(
          res =>{
            this.goods[type].list.push(...res.data.list);
            this.goods[type].page += 1;

            this.$refs.scroll.scroll.finishPullUp()
          })
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      },
      activated(){
        this.$refs.scroll.scrollTo(0, -this.saveY, 0)

        this.$refs.scroll.refresh()

      },
      deactivated(){
        this.saveY = this.$refs.scroll.getScrollY()
      }
    }
  }
</script>

<style scoped>
 #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/
</style>
