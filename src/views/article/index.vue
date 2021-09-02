<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <!-- el-radio 默认把 label 作为文本和选中之后的 value 值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.channel_id" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            onPick="abc"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            @click="onSubmit"
            :disabled="loading"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span
          >根据筛选条件共查询到<b>{{ totalAll }}</b
          >条结果</span
        >
      </div>
      <el-table :data="articles" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="cover.images" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 50px"
              :src="scope.row.cover.images[0]"
            ></el-image>
            <!-- <el-image style="width: 100px; height: 50px" src="./no-cover.gif"></el-image> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.status == 0" type="info">草稿</el-tag> -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editArticleFn(scope.row.id)" circle></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeArticleFn(scope.row.id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="loading"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalAll"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getChannels, getArticles, removeArticle } from '@/api/article.js'
export default {
  name: 'Article',
  data () {
    return {
      form: {
        status: null,
        channel_id: null,
        page: 1,
        per_page: 10,
        response_type: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      date: ['', ''],
      currentPage4: 1,
      // 频道信息
      channels: [],
      // 文章列表
      articles: [],
      totalAll: 0,
      articleStatus: [
        { text: '草稿', type: 'info' }, // 0
        { text: '待审核', type: '' }, // 1
        { text: '审核通过', type: 'success' }, // 2
        { text: '审核失败', type: 'warning' }, // 3
        { text: '已删除', type: 'danger' } // 4
      ],
      loading: true
    }
  },
  methods: {
    // 查询按钮
    onSubmit () {
      console.log(this.form)
      this.getArticlesFn(this.form)
    },
    // 分页功能
    handleSizeChange (value) {
      this.form.per_page = value
      this.getArticlesFn(this.form)
    },
    handleCurrentChange (value) {
      this.form.page = value
      this.getArticlesFn(this.form)
    },

    // 获取频道信息
    async getChannelsFn () {
      this.loading = true
      const data = await getChannels().catch(err => err)
      if (data.status !== 200) return this.$message.error('频道信息获取失败')
      this.channels = data.data.data.channels
      this.loading = false
    },
    // 获取文章列表
    async getArticlesFn (params) {
      this.loading = true
      const articles = await getArticles(params).catch(err => err)
      if (articles.status !== 200) {
        this.loading = false
        return this.$message.error('文章列表取失败')
      }
      this.articles = articles.data.data.results
      this.totalAll = articles.data.data.total_count
      console.log(articles.data.data)
      this.loading = false
    },
    // 删除文章
    removeArticleFn (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const data = await removeArticle(id).catch(err => err)
          console.log(data)
          if (data.status !== 204) return this.$message.error('文章删除失败')
          this.$message.success('文章删除成功')
          this.getArticlesFn(this.form)
        })
        .catch(() => {
          this.$message.error('已取消删除')
        })
    },
    // 修改文章
    editArticleFn (id) {
      this.$router.push(`publish?id=${id}`)
    }
  },
  watch: {
    date: {
      handler (newValue, oldValue) {
        this.form.begin_pubdate = newValue[0]
        this.form.end_pubdate = newValue[1]
      }
    }
  },
  created () {
    this.getChannelsFn()
    this.getArticlesFn()
  }
}
</script>

<style>
.tc {
  text-align: center;
}
.el-card {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 40px;
  text-align: center;
}
</style>
