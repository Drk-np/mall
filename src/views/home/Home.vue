<template>
  <div id="home" class="home-nav">
    <nav-bar><div slot="center">购物街</div></nav-bar>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar";
  import {getHomeMutidata} from "@/network/home";

  export default {
    name: "Home",
    components: {
      NavBar
    },
    created() {
      //1.请求多个数据
      getHomeMutidata().then(
        res => {
        console.log(res);
      })
    }
  }
</script>

<style scoped>
.home-nav{
  background-color: var(--color-tint);
  color: #f6f6f6;
}
</style>
