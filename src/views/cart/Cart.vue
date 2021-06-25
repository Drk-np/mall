<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <cart-list/>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import CartList from "@/views/cart/childCpn/CartList";
  import CartBottom from "@/views/cart/childCpn/CartBottom";
  import CheckButton from "@/views/cart/childCpn/CheckButton";
  import {mapGetters} from "vuex";

  export default {
    name: "Cart",
    components:{
      NavBar,
      CartList,
      CartBottom,
      CheckButton,

    },
    computed: {
      ...mapGetters(['cartLength'])
      // ...mapGetters({length: 'cartLength'})改名写法
    }
  }
</script>

<style scoped>
.nav-bar{
  background-color: var(--color-high-text);
  color: white;
}
</style>
