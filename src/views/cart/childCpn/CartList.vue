<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll" :pull-up-load="true">
      <cart-list-item
        v-for="(item, index) of cartList"
        :key="index"
        :itemInfo="item"
      />
    </scroll>
  </div>
</template>

<script>
  import Scroll from "@/components/common/scroll/Scroll";
  import CartListItem from "@/views/cart/childCpn/CartListItem";

  import { mapGetters } from 'vuex'



  export default {
    name: "CartList",
    computed: {
      ...mapGetters(['cartList'])
    },
    components: {
      Scroll,
      CartListItem
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100vh - 44px - 49px - 50px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
