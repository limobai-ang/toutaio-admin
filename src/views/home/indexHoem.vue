<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>欢迎</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="homeImage">
      <img src="./homeImage.png" alt="" />
    </div>
  </el-card>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.homeImage {
  text-align: center;
}
</style>
