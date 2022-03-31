<template>
  <el-container>
    <el-main>
      <el-image :src="newsForm.cover" fit="cover" style="width: 667px; height: 375px">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <h1>{{ newsForm.title }}</h1>
      <div v-html="newsForm.content"></div>
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
      newsForm: {}
    }
  },
  methods: {
    getNews (id) {
      this.$store.state.cloud.callFunction({
        name: 'getNews',
        data: {
          id
        }
      }).then(async res => {
        const newsForm = res.result.data
        await this.$store.state.cloud.callFunction({
          name: 'getTempFile',
          data: {
            fileList: [newsForm.cover]
          }
        }).then(res => {
          newsForm.cover = res.result[0].tempFileURL
        })
        this.newsForm = newsForm
      })
    }
  },
  created () {
    this.getNews(this.id)
  }
}
</script>

<style></style>
