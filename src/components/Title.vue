<template>
  <div class="title">
    <i @click="isCollapseFn" :class="{'el-icon-s-fold': !isCollapse, 'el-icon-s-unfold': isCollapse}"></i>
    <span><b> 新闻发布管理系统</b></span>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Title',
  methods: {
    ...mapMutations(['isCollapseFn'])
  },
  computed: {
    ...mapState(['isCollapse'])
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  letter-spacing: 3px;
}
</style>
