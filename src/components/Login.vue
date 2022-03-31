<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$store.state.cloud.callFunction({
        name: 'adminLogin',
        data: this.model
      }).then(res => {
        if (res.result.status !== 200) return this.$message.error(res.result.message)
        localStorage.token = res.result.token
        this.$router.push('/')
        this.$message.success('登录成功')
      })
    }
  }
}
</script>

<style>
.el-card.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
