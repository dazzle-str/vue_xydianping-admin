<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="type" style="width: 100%" clearable @clear="getAllNews" @change="retrieveNews">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddPage">添加新闻</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="newsData" height="100%" :default-sort="{ prop: 'date', order: 'descending' }" border stripe v-loading="loading">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="title" label="标题" sortable> </el-table-column>
        <el-table-column prop="type" label="类型" sortable> </el-table-column>
        <el-table-column prop="date" label="创建时间" sortable width="160px">
          <template slot-scope="scope">
            {{ scope.row.date | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="174px">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-view" size="mini" @click="showNews(scope.row._id)"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editNews(scope.row._id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeNews(scope.row._id)"></el-button>
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
      type: '',
      types: [
        { value: '资讯', label: '资讯' },
        { value: '通知', label: '通知' },
        { value: '广告', label: '广告' }
      ],
      newsData: [],
      loading: false
    }
  },
  methods: {
    toAddPage () {
      this.$router.push('/news/add')
    },
    getAllNews () {
      this.newsData = []
      this.loading = true
      this.$store.state.cloud.callFunction({
        name: 'getAllNews'
      }).then(res => {
        this.newsData = res.result.data
        this.loading = false
      })
    },
    retrieveNews () {
      this.newsData = []
      this.loading = true
      this.$store.state.cloud.callFunction({
        name: 'retrieveNews',
        data: {
          type: this.type
        }
      }).then(res => {
        this.newsData = res.result.data
        this.loading = false
      })
    },
    showNews (id) {
      this.$router.push(`/news/show/${id}`)
    },
    editNews (id) {
      this.$router.push(`/news/edit/${id}`)
    },
    async removeNews (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      this.$store.state.cloud.callFunction({
        name: 'deleteNews',
        data: {
          id
        }
      }).then(res => {
        this.$message.success('删除成功')
        this.getAllNews()
      })
    },
    // 数组去重
    unique (arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    }
  },
  created () {
    this.getAllNews()
  }
}
</script>

<style></style>
