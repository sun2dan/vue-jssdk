<template>
  <transition name="fade">
    <div :class="cls('page')" v-if="visible">
      
    </div>
  </transition>
</template>

<script>
import sdk from "../mixins/sdk";
export default {
  name: "",
  mixins: [sdk],
  components: {},
  props: {},
  data() {
    return {
      visible: false,
    };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // ---------- 对外接口 ----------
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },

    // ---------- 本组件内部方法 ----------



  },
  computed: {},
};
</script>

<style lang="scss" scoped>
</style>
