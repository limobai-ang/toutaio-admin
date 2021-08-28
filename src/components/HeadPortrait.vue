<template>
  <div class="head-box">
    <img class="head-portrait" :src="userInfo.photo" alt="头像" />
    <el-dropdown>
      <span class="el-dropdown-link">
        <b>{{ userInfo.name }}</b>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <!--   若直接在el-dropdown-item上添加click事件，点击后没有任何反应。若在click后添加native修饰符，则可解决问题。 -->
        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'HeadPortrait',
  data () {
    return {
      userInfo: {}
    }
  },
  async created () {
    const data = await getUserInfo().catch(err => err)
    this.userInfo = data.data.data
  },
  methods: {
    logout () {
      this.$confirm('确定退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push({ path: '/login' })
          this.$message.success('退出成功!')
        })
        .catch(() => {
          this.$message.info('已取消退出')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.head-portrait {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: block;
  margin-right: 10px;
}
.el-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
