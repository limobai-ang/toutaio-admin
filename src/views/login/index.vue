<template>
  <div class="box">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form ref="userForm" :rules="rules" :model="user">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <!-- loading 让按钮进入登录中的状态 不可点击 增加交互效果 -->
          <el-button type="primary" @click="onLogin" :loading="loginLoading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入登录接口方法
import { userLogin } from '@/api/user.js'
export default {
  name: 'Login',
  data () {
    const validateAgree = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('请勾选同意协议'))
      }
    }
    return {
      // 表单数据
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      // 是否勾选
      loginLoading: false, // loading... 一开始是没有的 只在登录的过程中为true
      // 表单验证规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '请输入正确的号码格式',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            pattern: /\d{6}$/,
            message: '请输入正确的验证码格式',
            trigger: 'blur'
          }
        ],
        agree: [{ validator: validateAgree, trigger: 'change' }]
      }
    }
  },
  methods: {
    // 登录按钮绑定事件
    onLogin () {
      this.$refs.userForm.validate(async valid => {
        // 如果验证失败，不发送请求 结束函数
        if (!valid) return false
        // 验证通过 是按钮进入 loading... 登录中状态
        this.loginLoading = true
        // 调用登录接口 使用await优化 拿到返回的结果
        const data = await userLogin(this.user).catch(err => {
          this.$message.error('登录失败手机号或验证码错误')
          // 登录调用完成 让按钮恢复
          this.loginLoading = false
          return err
        })
        if (data.status !== 201) return
        this.$message.success('登录成功')
        localStorage.setItem('token', data.data.data.token)
        this.$router.push({ path: '/home' })
        // 登录调用完成 让按钮恢复
        this.loginLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: url('');
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-form-wrap {
  background: white;
  min-width: 400px;
  padding: 30px 50px 10px;
  background-color: #fff;
}
.login-head {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.logo {
  width: 200px;
  height: 57px;
  background: url('./logo_index.png') no-repeat;
  background-size: contain;
}
.el-button {
  width: 100%;
}
</style>
