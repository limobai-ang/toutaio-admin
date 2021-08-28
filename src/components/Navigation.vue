<template>
  <el-menu
    default-active="/home"
    class="el-menu-vertical-demo"
    background-color="#001e34"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <h1 class="logo">logo</h1>
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/home/article">
      <i class="el-icon-menu"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/home/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/home/publish">
      <i class="el-icon-document"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/home/comment">
      <i class="el-icon-s-comment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/home/fans">
      <i class="el-icon-user-solid"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/home/settings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Navigation',
  data () {
    return {}
  },
  computed: {
    ...mapState(['isCollapse'])
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
  min-height: 400px;
}
.el-menu {
  height: 100%;
}
.logo {
  margin: 0;
  background-color: #001e34;
  line-height: 100px;
  color: #fff;
}
.el-menu-item {
  font-size: 18px;
}
</style>
