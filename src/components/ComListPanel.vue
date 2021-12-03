<template>
  <transition name="fade">
    <div :class="[cls('page'), 'sdk-fix-lt', 'sdk-full']" v-if="visible">
      <div
        :class="[cls('page-mask'), 'sdk-abs-lt', 'sdk-full']"
        @click="visible = false"
      ></div>
      <div :class="[cls('page-cont'), 'sdk-abs-rt']">
        <div class="sdk-h1">标题1</div>
        <div class="sdk-fn-box sdk-flex-m sdk-flex-end">
          <div class="sdk-btn">添加</div>
        </div>
        <table>
          <tr>
            <th>标题</th>
            <th>状态</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
          <tr v-for="i in 10" :key="i">
            <td>标题{{ i }}</td>
            <td>状态{{ i % 3 }}</td>
            <td>{{ new Date().toLocaleString("zh") }}</td>
            <td>
              <a href="javascript:;" class="sdk-link">编辑</a>
              <a href="javascript:;" class="sdk-link">删除</a>
            </td>
          </tr>
        </table>
      </div>
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
.#{$sdkId} .#{$sdkId}-page {
  &-mask {
    background: rgba(#000, 0.6);
  }
  &-cont {
    width: 86%;
    bottom: 0;
    padding: 30px;
    background: #fff;
  }
  .sdk-h1 {
    font-size: 18px;
    margin-bottom: 15px;
  }
  .sdk-fn-box {
    height: 60px;
  }
  table {
    width: 100%;
    text-align: left;
    th,
    td {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
