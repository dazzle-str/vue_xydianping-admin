<template>
  <el-table :data="userData">
    <el-table-column type="index"> </el-table-column>
    <el-table-column prop="openid" label="用户"> </el-table-column>
    <el-table-column prop="avatarUrl" label="头像">
      <template slot-scope="scope">
        <img :src="scope.row.avatarUrl" style="width: 40px" />
      </template>
    </el-table-column>
    <el-table-column prop="nickName" label="名字"> </el-table-column>
    <el-table-column prop="gender" label="性别">
      <template slot-scope="scope">
        {{ scope.row.gender | genderFormat }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      userData: []
    }
  },
  methods: {
    getAllUser () {
      this.$store.state.cloud
        .callFunction({
          name: 'getAllUser'
        })
        .then(res => {
          this.userData = res.result.data
        })
    }
  },
  created () {
    this.getAllUser()
  },
  filters: {
    genderFormat (originVal) {
      switch (originVal) {
        case 0:
          return '保密'
        case 1:
          return '男'
        case 2:
          return '女'
      }
    }
  }
}
</script>

<style></style>
