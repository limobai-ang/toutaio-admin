<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :span="12">
        <el-form
          :model="userForm"
          :rules="userFormRules"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item label="编号：">
            <span>{{ userForm.id }}</span>
          </el-form-item>
          <el-form-item label="手机：">
            <span>{{ userForm.mobile }}</span>
          </el-form-item>
          <el-form-item label="媒体名称：" prop="name">
            <el-input v-model="userForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动形式：" prop="intro">
            <el-input type="textarea" v-model="userForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSettings">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="imageBox">
        <label for="file">
          <el-avatar
            shape="square"
            :size="200"
            :src="userForm.photo"
          ></el-avatar>
          <p>点击修改头像</p>
        </label>
        <input id="file" type="file" ref="file" hidden @change="onFileChange" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { editUserInfo, getUserInfo } from '@/api/user.js'
import { mapActions } from 'vuex'
export default {
  name: 'Settings',
  data () {
    return {
      userForm: {
        id: undefined,
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      // 验证规则
      userFormRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          {
            min: 1,
            max: 7,
            message: '长度在 1 到 7 个字符',
            trigger: ['blur', 'change']
          }
        ],
        intro: [{ required: true, message: '请输入媒体介绍', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getUserInfoInitFn()
  },
  methods: {
    ...mapActions(['getUserInfoFn']),
    // 修改用户信息
    saveSettings () {
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          const data = await editUserInfo(this.userForm).catch(err => err)
          console.log(data)
          if (data.status !== 201) {
            return this.$message.error('用户信息获取失败')
          }
          this.getUserInfoFn()
          this.$message.success('用户信息修改成功')
        } else {
          return false
        }
      })
    },
    // 获取用户个人数据
    async getUserInfoInitFn () {
      const data = await getUserInfo().catch(err => err)
      if (data.status !== 200) return this.$message.error('用户信息获取失败')
      this.userForm = data.data.data
    },
    onFileChange (a) {
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      console.log(file, blobData)
    }
  }
}
</script>

<style lang="less" scoped>
.imageBox {
  text-align: center;
  margin-top: 20px;
}
</style>
