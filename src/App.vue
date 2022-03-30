<template>
  <div :class="sdkId">
    <com-list-panel ref="comListPanel"></com-list-panel>
  </div>
</template>

<script>
import sdk from "./mixins/sdk";
import utils from "./utils/utils";
import sdkUtils from "./utils/sdkUtils";
import customCss from "./utils/customCss";

import ComListPanel from "./components/ComListPanel.vue";

export default {
  name: "App",
  mixins: [sdk],
  components: { ComListPanel },
  props: {},
  data() {
    return {};
  },
  watch: {},
  created() {
    let winObj = sdkUtils.getSdkObj();
    let options = winObj.getOption() || {};
    this.refresh(options);

    // 重写对外接口
    winObj.setOption = (opts) => {
      let options = { isSet: !!opts };
      Object.assign(options, opts);
      this.refresh(options);
    };

    this.moveStyleToShadow();
  },
  async mounted() {
    let winObj = sdkUtils.getSdkObj();
    let vars = winObj.getVars();
    let comListPanel = this.$refs.comListPanel;

    if (vars.isShow) {
      await this.$nextTick();
      comListPanel.show();
    }

    // 重写对外接口：显示任务面板
    winObj.showPanel = () => {
      console.log("showPanel");
      comListPanel.show();
    };
  },
  updated() {
    this.moveStyleToShadow();
  },
  methods: {
    // 本地，同步style标签样式到shadowdom中
    moveStyleToShadow() {
      if (process.env.VUE_APP_ENV !== "local") return;

      let eles = document.querySelectorAll("style");
      for (let i = eles.length - 1; i >= 0; i--) {
        let style = document.createElement("style");
        style.innerText = eles[i].innerText;
        window.__JSSDK_BOX.appendChild(style);
      }
    },

    refresh(options) {
      sdkUtils.saveOption(options);
      this.options = options;

      if (options.isSet) {
        this.updateThemeColor();
        this.updateZIndex();
        this.setIconFont();
      }
    },
    // ---------- 字体 iconfont ----------
    setIconFont() {
      let style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = customCss.iconfont;
      document.head.appendChild(style);
    },

    // ---------- z-index ----------
    updateZIndex() {
      let { zIndex } = this.options;
      if (!zIndex) return;

      let styleStr = customCss.zIndex;
      styleStr = styleStr.replace(/z-index:\d+/g, `z-index:${zIndex}`);
      sdkUtils.appendStyle(styleStr, "shadow");

      let shadowHost = document.querySelector(`.${this.sdkId}_box`);
      if (!shadowHost) return;
      shadowHost.style.zIndex = zIndex;
    },

    // ---------- 设置主题色 ----------
    updateThemeColor() {
      let { themeColor, activeColor } = this.options;
      if (!themeColor && !activeColor) return;
      let styleStr = utils.getThemeStr(customCss.theme, {
        theme: themeColor,
        active: activeColor,
      });
      sdkUtils.appendStyle(styleStr, "shadow");
    },

    // ---------- 任务相关 ----------
    showTask(task) {
      this.curTaskData = task;
      this.taskVideoVisible = true;
    },
    showImgSlider(imgList) {
      this.$set(this, "imgList", imgList);
      this.$refs.imgPrev.show();
    },
  },
  computed: {},
};
</script>

<style lang="scss">
@import "./assets/style/main";
</style>
