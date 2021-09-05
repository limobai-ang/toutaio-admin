<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>发布文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="标题：" prop="title">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.title"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <el-tiptap :extensions="extensions" v-model="form.content"></el-tiptap>
      </el-form-item>
      <el-form-item label="封面：" prop="cover.type">
        <el-radio-group v-model="form.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道：" prop="channel_id">
        <el-select v-model="form.channel_id" placeholder="请选择频道">
          <el-option
            v-for="item in channels"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 条件渲染 根据isEdit显示发布或者修改 -->
      <el-form-item v-if="!isEdit">
        <el-button type="primary" @click="onSubmit(false)">发布</el-button>
        <el-button @click="onSubmit(true)">存入草稿</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="primary" @click="editArticle">修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  ElementTiptap,
  // necessary extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  CodeBlock,
  Blockquote,
  TextAlign,
  Indent,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TextColor,
  HorizontalRule
  // LineHeigh
} from 'element-tiptap'

import {
  getChannels,
  addArticle,
  inquireArticle,
  editArticle
} from '@/api/article.js'

// 上传图片接口
import { uploadingImg } from '@/api/images.js'
export default {
  name: 'Publish',
  components: {
    'el-tiptap': ElementTiptap
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: ''
      },
      // 频道信息
      channels: [],
      // 是否是修改文章 有id就是修改 没有就不是
      isEdit: this.$route.query.id,
      // 验证规则
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        // 输入完内容删除后 content里面会留下一个字符串'<p></p>' 通过自定义验证规则解决
        content: [
          {
            required: true,
            validator (rule, value, callback) {
              if (value === '' || value === '<p></p>') {
                callback(new Error('内容不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        'cover.type': [
          { required: true, message: '请选择图片类型', trigger: 'blur' }
        ],
        channel_id: [{ required: true, message: '请选择频道', trigger: 'blur' }]
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new CodeBlock(),
        new Image({
          // 默认会把图片生成 base64
          async uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            const data = await uploadingImg(fd).catch(err => err)
            console.log(data)
            return data.data.data.url
          }
        }),
        new Blockquote(),
        new TextAlign(),
        new Indent(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new HorizontalRule(),
        new TextColor()
      ]
    }
  },
  methods: {
    // 发布按钮
    onSubmit (draft) {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        console.log(1231231313)
        const data = await addArticle(this.form, draft).catch(err => err)
        if (data.status !== 201) return this.$message.error('文章发布失败')
        this.$message.success('文章发布成功')
        this.$router.push({ path: '/home/article' })
      })
    },
    // 修改按钮
    editArticle () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        const data = await editArticle(this.form, this.isEdit).catch(err => err)
        if (data.status !== 201) return this.$message.error('文章修改失败')
        this.$message.success('文章修改成功')
        this.$router.push({ path: '/home/article' })
      })
    },
    // 获取频道信息
    async getChannelsFn () {
      const data = await getChannels().catch(err => err)
      if (data.status !== 200) return this.$message.error('频道信息获取失败')
      this.channels = data.data.data.channels
    },
    // 查询文章
    async inquireArticleFn () {
      const data = await inquireArticle(this.isEdit).catch(err => err)
      if (data.status !== 200) return this.$message.error('文章信息获取失败')
      this.form = data.data.data
    }
  },
  created () {
    // 获取频道信息
    this.getChannelsFn()

    // 如果是修改页面就要获取文章数据
    if (this.isEdit) {
      this.inquireArticleFn()
    }
  }
}
</script>

<style></style>
