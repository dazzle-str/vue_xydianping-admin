<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="business" style="width: 100%" clearable @clear="getAllComment" @change="retrieveComment">
            <el-option v-for="item in businessList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加评论</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="commentData" height="100%" :default-sort="{ prop: 'date', order: 'descending' }" border stripe v-loading="loading">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="62px">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="width: 40px; height: 40px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名字"></el-table-column>
        <el-table-column prop="business" label="商户" sortable></el-table-column>
        <el-table-column prop="type" label="类型" sortable width="78px"></el-table-column>
        <el-table-column prop="overall" label="总体" sortable width="74px"></el-table-column>
        <el-table-column prop="taste" label="口味" sortable width="74px"></el-table-column>
        <el-table-column prop="environment" label="环境" sortable width="74px"></el-table-column>
        <el-table-column prop="service" label="服务" sortable width="74px"></el-table-column>
        <el-table-column prop="comment" label="评论" width="400px"></el-table-column>
        <el-table-column prop="images" label="图片" width="160px">
          <template slot-scope="scope">
            <el-popover trigger="hover" v-for="item in scope.row.images" :key="item">
              <img :src="item" style="width: 400px" />
              <img :src="item" slot="reference" style="width: 40px; height: 40px; padding-right: 6px" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="创建时间" sortable width="160px">
          <template slot-scope="scope">
            {{ scope.row.date | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="66px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeComment(scope.row._id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 添加评论的对话框 -->
    <el-dialog title="添加评论" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="头像" prop="avatar">
          <el-upload class="avatar-uploader" action="#" list-type="picture-card" accept=".jpg, .png" :auto-upload="false" :limit="1" :on-change="addAvatar" :on-remove="removeAvatar">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="addForm.name" placeholder="请填写名字"></el-input>
        </el-form-item>
        <el-form-item label="商户" prop="business">
          <el-select v-model="addForm.business" placeholder="请选择商户" style="width: 100%" @change="getType">
            <el-option v-for="item in businessList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总体评分" prop="overall" v-if="addForm.business">
          <el-radio-group v-model="addForm.overall">
            <el-radio :label="1">1</el-radio>
            <el-radio :label="2">2</el-radio>
            <el-radio :label="3">3</el-radio>
            <el-radio :label="4">4</el-radio>
            <el-radio :label="5">5</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="口味评分" prop="taste" v-if="addForm.overall && type === '餐饮'">
          <el-radio-group v-model="addForm.taste">
            <el-radio :label="1">1</el-radio>
            <el-radio :label="2">2</el-radio>
            <el-radio :label="3">3</el-radio>
            <el-radio :label="4">4</el-radio>
            <el-radio :label="5">5</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="环境评分" prop="environment" v-if="addForm.overall">
          <el-radio-group v-model="addForm.environment">
            <el-radio :label="1">1</el-radio>
            <el-radio :label="2">2</el-radio>
            <el-radio :label="3">3</el-radio>
            <el-radio :label="4">4</el-radio>
            <el-radio :label="5">5</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务评分" prop="service" v-if="addForm.overall">
          <el-radio-group v-model="addForm.service">
            <el-radio :label="1">1</el-radio>
            <el-radio :label="2">2</el-radio>
            <el-radio :label="3">3</el-radio>
            <el-radio :label="4">4</el-radio>
            <el-radio :label="5">5</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评论" prop="comment" v-if="addForm.overall">
          <el-input type="textarea" autosize v-model="addForm.comment">
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images" v-if="addForm.overall">
          <el-upload action="#" multiple list-type="picture-card" accept=".jpg, .png" :limit="3" :auto-upload="false" :file-list="fileList" :on-change="change">
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
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComment" v-loading.fullscreen="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      business: '',
      businessList: [],
      commentData: [],
      addDialogVisible: false,
      addForm: {
        avatar: '',
        name: '',
        business: '',
        overall: '',
        taste: '',
        environment: '',
        service: '',
        comment: '',
        images: []
      },
      addFormRules: {
        avatar: [{ required: true, message: '请上传头像' }],
        name: [{ required: true, message: '请输入名字' }],
        business: [{ required: true, message: '请选择商户' }],
        overall: [{ required: true, message: '请输入总体评分' }],
        taste: [{ required: true, message: '请输入口味评分' }],
        environment: [{ required: true, message: '请输入环境评分' }],
        service: [{ required: true, message: '请输入服务评分' }]
      },
      type: '',
      fileList: [],
      loading: false,
      fullscreenLoading: false
    }
  },
  methods: {
    getAllComment () {
      this.business = ''
      this.commentData = []
      this.loading = true
      this.$store.state.cloud
        .callFunction({
          name: 'getAllComment'
        })
        .then(res => {
          this.getBusiness(res.result.data)
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
              fileList: [item.avatar]
            }
          })
          .then(res => {
            item.avatar = res.result[0].tempFileURL
          })
        if (item.images.length) {
          await this.$store.state.cloud
            .callFunction({
              name: 'getTempFile',
              data: {
                fileList: item.images
              }
            })
            .then(res => {
              res.result.forEach((value, index) => {
                item.images[index] = value.tempFileURL
              })
            })
        }
        await this.$store.state.cloud
          .callFunction({
            name: 'getBusiness',
            data: {
              id: item.business
            }
          })
          .then(res => {
            item.business = res.result.data.name
            item.type = res.result.data.type
          })
        this.commentData.push(item)
      })
    },
    getBusiness (data) {
      this.businessList = []
      let businessList = data.map(item => item.business)
      businessList = this.unique(businessList)
      businessList.forEach(item => {
        this.$store.state.cloud.callFunction({
          name: 'getBusiness',
          data: {
            id: item
          }
        }).then(res => {
          const business = {}
          business.value = item
          business.label = res.result.data.name
          this.businessList.push(business)
        })
      })
    },
    retrieveComment () {
      this.commentData = []
      this.loading = true
      this.$store.state.cloud
        .callFunction({
          name: 'retrieveComment',
          data: {
            id: this.business
          }
        })
        .then(res => {
          this.dataFormat(res.result.data)
          this.loading = false
        })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.type = ''
      this.fileList = []
    },
    getType () {
      this.$store.state.cloud.callFunction({
        name: 'getBusiness',
        data: {
          id: this.addForm.business
        }
      }).then(res => {
        this.type = res.result.data.type
      })
    },
    addAvatar (file) {
      this.$set(this.addForm, 'avatar', file)
    },
    removeAvatar () {
      this.$set(this.addForm, 'avatar', '')
    },
    change (file) {
      this.fileList.push(file)
    },
    handleRemove (file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    async uploadAvatar () {
      await this.$store.state.cloud
        .uploadFile({
          cloudPath: `${Date.now()}.png`,
          file: this.addForm.avatar.raw
        })
        .then(res => {
          this.$set(this.addForm, 'avatar', res.fileID)
        })
    },
    async uploadImages () {
      const imgArr = []
      for (let i = 0; i < this.addForm.images.length; i++) {
        await this.$store.state.cloud
          .uploadFile({
            cloudPath: `${Date.now()}.png`,
            file: this.addForm.images[i].raw
          })
          .then(res => {
            imgArr[i] = res.fileID
          })
      }
      this.$set(this.addForm, 'images', imgArr)
    },
    addComment () {
      this.$set(this.addForm, 'images', this.fileList)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.fullscreenLoading = true
        await this.uploadAvatar()
        await this.uploadImages()
        this.$store.state.cloud
          .callFunction({
            name: 'createComment',
            data: this.addForm
          })
          .then(res => {
            this.fullscreenLoading = false
            this.$message.success('添加评论成功')
            this.addDialogVisible = false
            this.getAllComment()
          })
      })
    },
    async removeComment (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      this.$store.state.cloud
        .callFunction({
          name: 'deleteComment',
          data: {
            id
          }
        })
        .then(res => {
          this.$message.success('删除成功')
          this.getAllComment()
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
    this.getAllComment()
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
