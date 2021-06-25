import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data(){
    return {
      itemListenerMixin: null
    }
  },
  mounted() {

      let newRefresh = debounce(this.$refs.scroll.refresh, 200)
      this.itemImglistenner = () => {
        newRefresh()
      }

    this.$bus.$on('itemImgLoad', this.itemImglistenner)
    },
}
