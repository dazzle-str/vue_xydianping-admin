<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="school" style="width: 100%" clearable @clear="getAllBusiness" @change="retrieveBusiness">
            <el-option v-for="item in schools" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商户</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="businessData" height="100%" :default-sort="{ prop: 'date', order: 'descending' }" border stripe v-loading="loading">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="signboard" label="门店照片" width="160px">
          <template slot-scope="scope">
            <el-popover trigger="hover" v-for="item in scope.row.signboard" :key="item">
              <img :src="item" style="width: 400px" />
              <img :src="item" slot="reference" style="width: 40px; height: 40px; padding-right: 6px" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商户名"> </el-table-column>
        <el-table-column prop="school" label="学校" sortable width="300px"> </el-table-column>
        <el-table-column prop="address" label="地址" sortable width="300px">
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable width="78px">
        </el-table-column>
        <el-table-column prop="like" label="点赞数" sortable width="88px">
          <template slot-scope="scope">
            {{ scope.row.like.length }}
          </template>
        </el-table-column>
        <el-table-column prop="collect" label="收藏数" sortable width="88px">
          <template slot-scope="scope">
            {{ scope.row.collect.length }}
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="创建用户" sortable>
        </el-table-column>
        <el-table-column prop="date" label="创建时间" sortable width="160px">
          <template slot-scope="scope">
            {{ scope.row.date | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBusiness(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 添加商户的对话框 -->
    <el-dialog title="添加商户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="学校" prop="school">
          <el-input v-model="addForm.school" placeholder="请填写商户所在学校"></el-input>
        </el-form-item>
        <el-form-item label="门店照片" prop="signboard">
          <el-upload action="#" multiple list-type="picture-card" accept=".jpg, .png" :limit="9" :auto-upload="false" :file-list="fileList" :on-change="change">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商户名" prop="name">
          <el-input v-model="addForm.name" placeholder="请填写商户招牌名称"></el-input>
        </el-form-item>
        <el-form-item label="商户类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择商户类型" style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address" placeholder="请填写商户地址"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBusiness" v-loading.fullscreen="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商户的对话框 -->
    <el-dialog title="编辑商户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="学校" prop="school">
          <el-input v-model="editForm.school" placeholder="请填写商户所在学校"></el-input>
        </el-form-item>
        <el-form-item label="商户名" prop="name">
          <el-input v-model="editForm.name" placeholder="请填写商户招牌名称"></el-input>
        </el-form-item>
        <el-form-item label="商户类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择商户类型" style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" placeholder="请填写商户地址"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBusiness" v-loading.fullscreen="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      school: '',
      schools: [],
      businessData: [],
      addDialogVisible: false,
      addForm: {
        school: '',
        signboard: [],
        name: '',
        type: '',
        address: ''
      },
      addFormRules: {
        school: [{ required: true, message: '请输入学校' }],
        signboard: [{ required: true, message: '请上传门店照片' }],
        name: [{ required: true, message: '请输入商户名' }],
        type: [{ required: true, message: '请输入商户类型' }],
        address: [{ required: true, message: '请输入地址' }]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        school: [{ required: true, message: '请输入学校' }],
        name: [{ required: true, message: '请输入商户名' }],
        type: [{ required: true, message: '请输入商户类型' }],
        address: [{ required: true, message: '请输入地址' }]
      },
      types: [
        { value: '餐饮', label: '餐饮' },
        { value: '购物', label: '购物' },
        { value: '生活服务', label: '生活服务' },
        { value: '运动健身', label: '运动健身' }
      ],
      fileList: [],
      loading: false,
      fullscreenLoading: false
    }
  },
  methods: {
    getAllBusiness () {
      this.school = ''
      this.businessData = []
      this.loading = true
      this.$store.state.cloud
        .callFunction({
          name: 'getAllBusiness'
        })
        .then(res => {
          this.getSchool(res.result.data)
          this.dataFormat(res.result.data)
          this.loading = false
        })
    },
    dataFormat (originVal) {
      originVal.forEach(async item => {
        await this.$store.state.cloud
          .callFunction({
            name: 'getTempFile',
            data: {
              fileList: item.signboard
            }
          })
          .then(res => {
            res.result.forEach((value, index) => {
              item.signboard[index] = value.tempFileURL
            })
          })
        await this.$store.state.cloud
          .callFunction({
            name: 'getOneUser',
            data: {
              openid: item.openid
            }
          })
          .then(res => {
            item.openid = res.result.data[0].name
          })
        this.businessData.push(item)
      })
    },
    getSchool (data) {
      this.schools = []
      let schools = data.map(item => item.school)
      schools = this.unique(schools)
      schools.forEach(item => {
        const school = {}
        school.value = item
        school.label = item
        this.schools.push(school)
      })
    },
    retrieveBusiness () {
      this.businessData = []
      this.loading = true
      this.$store.state.cloud
        .callFunction({
          name: 'retrieveBusiness',
          data: {
            school: this.school
          }
        })
        .then(res => {
          this.dataFormat(res.result.data)
          this.loading = false
        })
    },
    addDialogClosed () {
      this.fileList = []
      this.$refs.addFormRef.resetFields()
    },
    change (file) {
      this.fileList.push(file)
    },
    handleRemove (file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    async upload () {
      const imgArr = []
      for (let i = 0; i < this.addForm.signboard.length; i++) {
        await this.$store.state.cloud
          .uploadFile({
            cloudPath: `${Date.now()}.png`,
            file: this.addForm.signboard[i].raw
          })
          .then(res => {
            imgArr[i] = res.fileID
          })
      }
      this.$set(this.addForm, 'signboard', imgArr)
    },
    addBusiness () {
      this.$set(this.addForm, 'signboard', this.fileList)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        await this.upload()
        this.$store.state.cloud
          .callFunction({
            name: 'createBusiness',
            data: this.addForm
          })
          .then(res => {
            this.fullscreenLoading = false
            this.$message.success('添加商户成功')
            this.addDialogVisible = false
            this.getAllBusiness()
          })
      })
    },
    showEditDialog (id) {
      this.$store.state.cloud
        .callFunction({
          name: 'getBusiness',
          data: {
            id
          }
        })
        .then(res => {
          this.editForm = res.result.data
          this.editDialogVisible = true
        })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editBusiness () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        this.$store.state.cloud
          .callFunction({
            name: 'updateBusiness',
            data: this.editForm
          })
          .then(res => {
            this.fullscreenLoading = false
            this.$message.success('编辑商户成功')
            this.editDialogVisible = false
            this.getAllBusiness()
          })
      })
    },
    async removeBusiness (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      this.$store.state.cloud
        .callFunction({
          name: 'deleteBusiness',
          data: {
            id
          }
        })
        .then(res => {
          this.$message.success('删除成功')
          this.getAllBusiness()
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
    this.getAllBusiness()
  }
}
</script>

<style>
.el-header {
  background-color: #fff;
}
</style>
