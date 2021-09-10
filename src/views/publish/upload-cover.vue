<template>
  <div>
    <!-- {{imgUrl}} -->
    <div class="block" @click="onUploadImgDialog">
      <el-avatar
        shape="square"
        icon="el-icon-plus"
        :size="120"
        :src="squareUrl || value"
      ></el-avatar>
    </div>
    <el-dialog
      title="封面图片"
      :visible.sync="dialogVisible"
      append-to-body
      width="50%"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="用户管理" name="first">
          <el-radio-group
            v-model="dataForm.collect"
            @change="cutState"
            size="medium"
          >
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="migBox">
            <el-image
              style="width: 150px; height: 150px"
              :src="item.url"
              v-for="item in srcList"
              :key="item.id"
              @click="currentImg(item.url)"
            >
            </el-image>
          </div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="dataForm.page"
            :page-size="dataForm.per_page"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-upload
            class="upload-demo"
            drag
            action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
            multiple
            :show-file-list="false"
            :headers="uploadHeaders"
            name="image"
            :on-success="uploadSuccess"
            :on-error="uploadError"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImg } from '@/api/images.js'
export default {
  name: 'UploadCover',
  props: ['coverIndex', 'value'],
  data () {
    return {
      squareUrl: '',
      dialogVisible: false,
      activeName: 'first',
      dataForm: {
        collect: false,
        page: 1,
        per_page: 10
      },
      total: 0,
      srcList: [],
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getImgFn(this.dataForm)
  },
  methods: {
    onUploadImgDialog () {
      this.dialogVisible = true
    },
    cutState () {
      // 每次切换之后都回到第一页开始
      this.dataForm.page = 1
      this.getImgFn(this.dataForm)
    },
    // 获取用户图片素材
    async getImgFn (dataForm) {
      const data = await getImg(dataForm).catch(err => err)
      if (data.status !== 200) return this.$message.error('图片素材获取错误')
      this.total = data.data.data.total_count
      this.srcList = data.data.data.results
    },
    // 分页功能
    handleCurrentChange (val) {
      this.dataForm.page = val
      this.getImgFn(this.dataForm)
    },
    // 文件上传成功时的钩子
    uploadSuccess (response, file, fileList) {
      this.squareUrl = response.data.url
      this.$message.success('图片上传成功')
      // this.$bus.$emit('updataUrl', this.squareUrl, this.coverIndex)
      this.$emit('input', this.squareUrl)
      this.dialogVisible = false
    },
    // 文件上传失败时的钩子
    uploadError () {
      this.$message.error('图片上传失败')
    },
    // 选择图片
    currentImg (url) {
      // this.$bus.$emit('input', url, this.coverIndex)
      this.$emit('input', url)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog {
  text-align: left;
}
.migBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.el-image {
  margin-top: 10px;
}
</style>
