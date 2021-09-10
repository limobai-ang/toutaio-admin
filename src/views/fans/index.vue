<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>粉丝数据</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <echarts-demo></echarts-demo>
    <BAapDemo/>
    <dituDemo/>
  </el-card>
</template>

<script>
import echartsDemo from './components/echarts-demo.vue'
import BAapDemo from './components/BAap-demo.vue'
import dituDemo from './components/ditu-demo.vue'

export default {
  name: 'Fans',
  components: { echartsDemo, BAapDemo, dituDemo },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
