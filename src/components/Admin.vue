<template>
  <el-container>
    <el-header>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="danger" @click="logout">退出登录</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="adminData" height="100%" border stripe v-loading="loading">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="_id" label="ID"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id, scope.row.username)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAdmin(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 添加管理员的对话框 -->
    <el-dialog title="添加管理员" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin" v-loading.fullscreen="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑管理员的对话框 -->
    <el-dialog title="编辑管理员" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdmin" v-loading.fullscreen="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      adminData: [],
      addDialogVisible: false,
      addForm: {
        username: '',
        password: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }]
      },
      loading: false,
      fullscreenLoading: false
    }
  },
  methods: {
    getAllAdmin () {
      this.loading = true
      this.$store.state.cloud.callFunction({
        name: 'getAllAdmin'
      }).then(res => {
        this.adminData = res.result.data
        this.loading = false
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addAdmin () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        this.$store.state.cloud.callFunction({
          name: 'createAdmin',
          data: this.addForm
        }).then(res => {
          this.fullscreenLoading = false
          this.$message.success('添加管理员成功')
          this.addDialogVisible = false
          this.getAllAdmin()
        })
      })
    },
    showEditDialog (_id, username) {
      this.$set(this.editForm, '_id', _id)
      this.$set(this.editForm, 'username', username)
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editAdmin () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        this.$store.state.cloud
          .callFunction({
            name: 'updateAdmin',
            data: this.editForm
          })
          .then(res => {
            this.fullscreenLoading = false
            this.$message.success('编辑管理员成功')
            this.editDialogVisible = false
            this.getAllAdmin()
          })
      })
    },
    async removeAdmin (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      this.$store.state.cloud
        .callFunction({
          name: 'deleteAdmin',
          data: {
            id
          }
        })
        .then(res => {
          this.$message.success('删除成功')
          this.getAllAdmin()
        })
    },
    async logout () {
      const confirmResult = await this.$confirm('你确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return
      localStorage.clear()
      this.$router.push('/login')
    }
  },
  created () {
    this.getAllAdmin()
  }
}
</script>

<style>

</style>
