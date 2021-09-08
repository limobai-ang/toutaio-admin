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
            <el-button type="primary" @click="saveSettings" :loading="saveSettingsLoading">保存设置</el-button>
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
    <!-- 预览对话框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="50%"
      :append-to-body="true"
      @opened="dialogOpenTheFinished"
      @close="dialogCloseTheFinished"
    >
      <div class="previewImgBox">
        <img :src="previewImg" alt="" ref="previewImgRef" class="previewImg" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmImg"
          :loading="updataPhotoLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { editUserInfo, getUserInfo, editPhotoInfo } from '@/api/user.js'
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
      },
      // 预览对话框
      dialogVisible: false,
      // 预览图片地址
      previewImg: '',
      // 裁切器实例对象
      cropper: null,
      // 更新用户头像loading状态
      updataPhotoLoading: false,
      // 修改用户信息loading状态
      saveSettingsLoading: false
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
        this.saveSettingsLoading = true
        if (valid) {
          const data = await editUserInfo(this.userForm).catch(err => err)
          console.log(data)
          if (data.status !== 201) {
            this.saveSettingsLoading = false
            this.$message.error('用户信息获取失败')
            return
          }
          this.getUserInfoFn()
          this.saveSettingsLoading = false
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
    // 当用户选择上传或者修改文件后触发
    onFileChange () {
      const file = this.$refs.file // 获取到DOM 在DOM上有一个files文件对象
      // console.log(file.files[0]) // 上传文件对象
      const blobData = window.URL.createObjectURL(file.files[0]) // 将上传的文件对象传递给window.URL.createObjectURL方法 得到一个url地址
      this.previewImg = blobData // 将得到的图片地址赋值给 this.previewImg 预览地址
      // 展示弹出层预览选择的文件
      this.dialogVisible = true
      // 解决相同文件不触发事件 (选择相同文件value值相同 默认不触发) 上传完成之后改变value值为空 下次上传后就有一个新的value
      this.$refs.file.value = ''
    },
    /*
      当对话框打开动画结束完全打开时触发
      图片裁切器必须基于img进行初始化
      注意img必须是可见状态才能正常完成初始化
    */
    dialogOpenTheFinished () {
      // 获取图片DOM节点
      const image = this.$refs.previewImgRef

      /* 方式一 裁切器.replace方法
      if (this.cropper) {
        this.cropper.destroy(this.previewImg)
        return
      } */
      this.cropper = new Cropper(image, {
        viewMode: 1,
        aspectRatio: 1 / 1,
        dragMode: 'none',
        cropBoxResizable: false
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    /*
      关闭时的回调
      第一次初始化好之后,如果预览裁切的图片发生了变化,裁切器默认不会更新
      如果需要预览图片发生变化更新裁切器
      方式一 裁切器.replace方法
      方式二 销毁裁切器,重新初始化
    */
    dialogCloseTheFinished () {
      // 关闭对话框销毁裁切器并从图像中移除实例
      this.cropper.destroy()
    },
    // 裁切之后确定按钮
    confirmImg () {
      this.updataPhotoLoading = true
      this.cropper.getCroppedCanvas().toBlob(async file => {
        // console.log(file)    // 裁剪之后的文件对象
        const formData = new FormData()
        // Pass the image file name as the third parameter if necessary.
        formData.append('photo', file /*, 'example.png' */)
        const data = await editPhotoInfo(formData).catch(err => {
          this.updataPhotoLoading = false
          return err
        })
        if (data.status !== 201) return this.$message.error('用户头像修改失败')
        this.$message.success('用户头像修改成功')
        this.userForm.photo = data.data.data.photo
        this.updataPhotoLoading = false
        // this.getUserInfoInitFn()
        this.getUserInfoFn()
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.imageBox {
  text-align: center;
  margin-top: 20px;
}
.previewImg {
  /* Ensure the size of the image fit the container perfectly */
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
  height: 300px;
}
</style>
