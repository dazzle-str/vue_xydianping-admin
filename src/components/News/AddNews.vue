<template>
  <el-container>
    <el-main>
      <el-alert title="添加新闻" type="info" center show-icon :closable="false"></el-alert>
      <el-form :model="newsForm" :rules="newsFormRules" ref="newsFormRef" label-position="top">
        <el-form-item label="新闻类型" prop="type">
          <el-select v-model="newsForm.type" style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="newsForm.title"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" prop="content">
          <vue-editor v-model="newsForm.content"></vue-editor>
        </el-form-item>
        <el-form-item label="新闻封面" prop="cover">
          <el-upload action="#" list-type="picture-card" accept=".jpg, .png" :limit="1" :auto-upload="false" :file-list="fileList" :on-change="change">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="handleRemove">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，显示纵横比为 9 : 16</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="post" v-loading.fullscreen="fullscreenLoading">点击发布</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  data () {
    return {
      newsForm: {
        type: '',
        title: '',
        content: '',
        cover: ''
      },
      newsFormRules: {
        type: [{ required: true, message: '请选择新闻类型' }],
        title: [{ required: true, message: '请输入新闻标题' }],
        content: [{ required: true, message: '请输入新闻内容' }],
        cover: [{ required: true, message: '请上传新闻封面' }]
      },
      types: [
        { value: '资讯', label: '资讯' },
        { value: '通知', label: '通知' },
        { value: '广告', label: '广告' }
      ],
      fileList: [],
      fullscreenLoading: false
    }
  },
  methods: {
    change (file) {
      this.fileList.push(file)
    },
    handleRemove () {
      this.fileList.pop()
    },
    async upload () {
      await this.$store.state.cloud.uploadFile({
        cloudPath: `${Date.now()}.png`,
        file: this.newsForm.cover.raw
      }).then(res => {
        this.$set(this.newsForm, 'cover', res.fileID)
      })
    },
    post () {
      this.$set(this.newsForm, 'cover', this.fileList[0])
      this.$refs.newsFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        await this.upload()
        this.$store.state.cloud.callFunction({
          name: 'createNews',
          data: this.newsForm
        }).then(res => {
          this.fullscreenLoading = false
          this.$message.success('发布成功')
          this.$router.push('/news')
        })
      })
    }
  },
  components: {
    VueEditor
  }
}
</script>

<style></style>
