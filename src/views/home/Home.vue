<template>
  <el-container class="box-container">
    <el-aside width="auto">
      <Navigation></Navigation>
    </el-aside>
    <el-container>
      <el-header>
        <Title />
        <HeadPortrait></HeadPortrait>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导航组件
import Navigation from '@/components/Navigation'
import Title from '@/components/Title'
import HeadPortrait from '@/components/HeadPortrait'

export default {
  name: 'Home',
  components: {
    Navigation,
    Title,
    HeadPortrait
  }
}
</script>

<style lang="less" scoped>
.box-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.el-header {
  color: #333;
  // text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  // text-align: center;
  // line-height: 160px;
}

</style>
