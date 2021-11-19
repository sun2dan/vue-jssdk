<template>
  <div :class="sdkId"></div>
</template>

<script>
export default {
  name: "App",
  components: {},
  props: {},
  data() {
    return {
      sdkId: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.sdkId = process.env.VUE_APP_SDKID;
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
@import "./assets/style/main";
</style>
