<template>
  <transition name="fade">
    <div :class="[cls('page'), 'sdk-fix-lt', 'sdk-full']" v-if="visible">
      <div
        :class="[cls('page-mask'), 'sdk-abs-lt', 'sdk-full']"
        @click="visible = false"
      ></div>
      <div :class="[cls('page-cont'), 'sdk-abs-rt']"></div>
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

<style lang="scss">
.#{$sdkId}-page {
  &-mask {
    background: rgba(#000, 0.6);
  }
  &-cont {
    width: 86%;
    bottom: 0;
    background: #fff;
  }
}
</style>
