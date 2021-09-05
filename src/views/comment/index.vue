<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <template>
      <el-table :data="tableData" v-loading="loading" size="medium" style="width: 100%">
        <el-table-column prop="title" label="标题" width="500px"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.comment_status ? 'success' : 'danger'">{{
              scope.row.comment_status ? '允许评论' : '禁止评论'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 按钮组件实现效果 -->
            <!-- <el-button
              :loading="scope.row.bunLoading"
              @click="editCommentStatusFn(scope.row)"
              :type="scope.row.comment_status ? 'danger' : 'success'"
              size="medium"
              >{{ scope.row.comment_status ? '关闭' : '开启' }}</el-button
            > -->
            <!-- 开关组件实现效果 -->
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.bunLoading"
              @change="editCommentStatusFn(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="form.per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalAll"
      background
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { getArticles, editCommentStatus } from '@/api/article.js'
export default {
  name: 'Comment',
  data () {
    return {
      form: {
        page: 1,
        per_page: 10,
        response_type: 'comment'
      },
      totalAll: 0,
      tableData: [],
      loading: false
    }
  },
  created () {
    this.getArticlesFn(this.form)
  },
  methods: {
    // 分页功能
    handleSizeChange (val) {
      this.form.per_page = val
      this.getArticlesFn(this.form)
    },
    handleCurrentChange (val) {
      this.form.page = val
      this.getArticlesFn(this.form)
    },
    // 获取评论管理列表
    async getArticlesFn (params) {
      this.loading = true
      const data = await getArticles(params).catch(err => err)
      if (data.status !== 200) {
        return this.$message.error('评论管理列表取失败')
      }
      this.tableData = data.data.data.results
      this.tableData.forEach(item => {
        // 注意如果直接添加属性defineProperty监测不到 Vue无法做出响应 这里需要使用this.$set来添加成响应式的数据
        this.$set(item, 'bunLoading', false)
      })
      this.totalAll = data.data.data.total_count
      this.loading = false
    },
    // 修改文章评论状态
    async editCommentStatusFn (item) {
      item.bunLoading = true
      const data = await editCommentStatus(
        item.id.toString(),
        item.comment_status
      ).catch(err => err)
      if (data.status !== 201) {
        this.$message.error('评论状态设置失败')
        item.comment_status = !item.comment_status
        item.bunLoading = false
        return
      }
      this.$message.success(
        item.comment_status ? '开启评论成功' : '关闭评论成功'
      )
      item.bunLoading = false
      // this.getArticlesFn(this.form)
    }
  }
}
</script>

<style></style>
