<template>
  <el-container>
    <el-main>
      <el-alert title="回复反馈" type="info" center show-icon :closable="false"></el-alert>
      <el-card shadow="never">
        <el-form :model="feedbackForm" label-position="top">
          <el-form-item label="反馈用户" prop="openid">
            <el-input v-model="feedbackForm.openid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="反馈类型" prop="type">
            <el-input v-model="feedbackForm.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="detail">
            <el-input type="textarea" autosize v-model="feedbackForm.detail" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="截图" prop="image" v-if="feedbackForm.image.length">
            <el-image :src="item" v-for="item in feedbackForm.image" :key="item" :preview-src-list="feedbackForm.image" style="height: 100px; padding-right: 10px"></el-image>
          </el-form-item>
          <el-form-item label="反馈时间" prop="date">
            <el-input v-model="feedbackForm.date" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never">
        <el-form :model="replyForm" :rules="replyFormRules" ref="replyFormRef" label-position="top">
          <el-form-item label="回复" prop="reply">
            <el-input type="textarea" autosize v-model="replyForm.reply" :disabled="feedbackForm.status === 1"></el-input>
          </el-form-item>
          <el-form-item label="回复时间" prop="date" v-if="replyForm.date">
            <el-input v-model="replyForm.date" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button type="primary" @click="reply" v-loading.fullscreen="fullscreenLoading" v-if="!feedbackForm.status">回复</el-button>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data () {
    return {
      feedbackForm: {
        status: 1,
        image: []
      },
      replyForm: {
        feedback: '',
        reply: ''
      },
      replyFormRules: {
        reply: [{ required: true, message: '请输入回复内容' }]
      },
      fullscreenLoading: false
    }
  },
  methods: {
    getFeedback (id) {
      this.$store.state.cloud
        .callFunction({
          name: 'getFeedback',
          data: {
            id
          }
        })
        .then(async res => {
          const feedbackForm = res.result.data
          if (feedbackForm.image.length) {
            await this.$store.state.cloud
              .callFunction({
                name: 'getTempFile',
                data: {
                  fileList: feedbackForm.image
                }
              })
              .then(res => {
                feedbackForm.image = res.result.map(item => item.tempFileURL)
              })
          }
          feedbackForm.date = this.dateFormat(feedbackForm.date)
          this.feedbackForm = feedbackForm
          if (res.result.data.status === 1) {
            this.$store.state.cloud
              .callFunction({
                name: 'getReply',
                data: {
                  feedback: id
                }
              })
              .then(res => {
                const replyForm = res.result.data[0]
                replyForm.date = this.dateFormat(replyForm.date)
                this.replyForm = replyForm
              })
          } else {
            this.$set(this.replyForm, 'feedback', id)
          }
        })
    },
    reply () {
      this.$refs.replyFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        await this.$store.state.cloud.callFunction({
          name: 'createReply',
          data: this.replyForm
        })
        await this.$store.state.cloud.callFunction({
          name: 'updateFeedback',
          data: {
            id: this.id
          }
        })
        this.fullscreenLoading = false
        this.$message.success('回复成功')
        this.$router.push('/feedback')
      })
    },
    dateFormat (date) {
      const dt = new Date(date)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  },
  created () {
    this.getFeedback(this.id)
  }
}
</script>

<style>
.el-card {
  margin: 20px 0;
}
</style>
