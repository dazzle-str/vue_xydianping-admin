<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="status" style="width: 100%" clearable @clear="getAllFeedback" @change="retrieveFeedback">
            <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="feedbackData" height="100%" :default-sort="{ prop: 'date', order: 'descending' }" border stripe v-loading="loading">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="openid" label="用户"> </el-table-column>
        <el-table-column prop="type" label="类型" sortable> </el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '待处理' : '已处理' }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="创建时间" sortable width="160px">
          <template slot-scope="scope">
            {{ scope.row.date | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="66px">
          <template slot-scope="scope">
            <el-button :type="scope.row.status === 0 ? 'primary' : 'success'" :icon="scope.row.status === 0 ? 'el-icon-edit' : 'el-icon-view'" size="mini" @click="reply(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      status: '',
      statuses: [
        { value: 0, label: '待处理' },
        { value: 1, label: '已处理' }
      ],
      feedbackData: [],
      loading: false
    }
  },
  methods: {
    getAllFeedback () {
      this.status = ''
      this.feedbackData = []
      this.loading = true
      this.$store.state.cloud
        .callFunction({
          name: 'getAllFeedback'
        })
        .then(res => {
          this.feedbackData = res.result.data
          this.loading = false
        })
    },
    retrieveFeedback () {
      this.feedbackData = []
      this.loading = true
      this.$store.state.cloud.callFunction({
        name: 'retrieveFeedback',
        data: {
          status: this.status
        }
      }).then(res => {
        this.feedbackData = res.result.data
        this.loading = false
      })
    },
    reply (id) {
      this.$router.push(`/feedback/reply/${id}`)
    }
  },
  created () {
    this.getAllFeedback()
  }
}
</script>

<style></style>
