<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-active="$route.path">
        <el-menu-item index="/business">商户管理</el-menu-item>
        <el-menu-item index="/comment">评论管理</el-menu-item>
        <el-menu-item index="/news">新闻管理</el-menu-item>
        <el-menu-item index="/feedback">反馈管理</el-menu-item>
        <el-menu-item index="/user">用户列表</el-menu-item>
        <el-menu-item index="/admin">权限管理</el-menu-item>
      </el-menu>
    </el-aside>

    <router-view></router-view>
  </el-container>
</template>

<script>
export default {}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
