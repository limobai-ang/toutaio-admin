<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="btnBox">
        <el-radio-group
          v-model="dataForm.collect"
          @change="cutState"
          size="medium"
        >
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success" size="medium" @click="dialogVisible = true"
          >添加素材</el-button
        >
      </div>
      <el-row :gutter="20">
        <el-col :span="24">
          <div v-for="item in srcList" :key="item.id" class="imgsBox">
            <el-image
              style="width: 200px; height: 200px"
              :src="item.url"
              :preview-src-list="srcList"
            >
            </el-image>
            <div class="operation">
              <i
                @click="enshrineImgFn(item.id, !item.is_collected)"
                class="el-icon-star-off"
                :class="{ active: item.is_collected }"
              ></i>
              <i class="el-icon-delete" @click="deleteImgFn(item.id)"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="dataForm.page"
        :page-size="dataForm.per_page"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="上传图片"
      :append-to-body="true"
      width="30%"
      center
      :visible.sync="dialogVisible"
    >
      <!-- upload组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，他会自己发
         请求方法: 默认就是post
         请求路径: action 必须填写完整路径
         请求头: headers
     -->
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
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <el-dialog :visible.sync="uploadDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { getImg, enshrineImg, deleteImg } from '@/api/images.js'
export default {
  name: 'Images',
  data () {
    return {
      dataForm: {
        collect: false,
        page: 1,
        per_page: 10
      },
      total: 0,
      srcList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      uploadDialogVisible: false,
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getImgFn(this.dataForm)
  },
  methods: {
    // 获取用户图片素材
    async getImgFn (dataForm) {
      const data = await getImg(dataForm).catch(err => err)
      this.total = data.data.data.total_count
      this.srcList = data.data.data.results
    },
    // 分页功能
    handleCurrentChange (val) {
      this.dataForm.page = val
      this.getImgFn(this.dataForm)
    },
    // 切换状态
    cutState () {
      // 每次切换之后都回到第一页开始
      this.dataForm.page = 1
      this.getImgFn(this.dataForm)
    },
    // 文件上传成功时的钩子
    uploadSuccess () {
      this.getImgFn(this.dataForm)
      this.$message.success('图片上传成功')
      this.dialogVisible = false
    },
    // 文件上传失败时的钩子
    uploadError () {
      this.$message.error('图片上传失败')
    },
    // 收藏图片
    async enshrineImgFn (id, collect) {
      const data = await enshrineImg(id, collect).catch(err => err)
      if (data.status !== 201) return this.$message.error('操作失败')
      this.getImgFn(this.dataForm)
      this.$message.success('操作成功')
    },
    // 删除图片
    deleteImgFn (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = await deleteImg(id).catch(err => err)
          if (data.status !== 204) return this.$message.error('删除失败')
          this.getImgFn(this.dataForm)
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.btnBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.operation {
  width: 100%;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 0;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  color: #ccc;
}
.operation > i {
  margin: 0 10px;
}
.imgsBox {
  height: 200px;
  margin: 20px 20px;
  display: inline-block;
  position: relative;
}
.active {
  color: #e6a23c;
}
:hover.el-icon-delete {
  color: #f56c6c;
  transition: all 0.5s;
}
:hover.el-icon-star-off {
  color: #e6a23c;
  transition: all 0.5s;
}
</style>
