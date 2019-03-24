<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/userMana' }">用户信息管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
       <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}" v-if="isAdmin">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
          <el-form-item style="float:right"> 
            <el-button type="warning"  @click="addVisable = true" style="margin-right:15px">添加</el-button>
          </el-form-item> 
        </el-form>
      </el-row>
      <!--表格数据-->
      <el-row style="margin-top:10px">
        <el-table
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
          :data="filterFormFro.tableData" 
          :border="true"
          :row-class-name="tableRowClassName"
          :header-cell-class-name = "tableHeaderClassName"
          tooltip-effect="dark"
          v-bind:style="{width: tableWidth + 'px'}"
          v-if="isAdmin">
            <el-table-column prop="index" label="序号" sortable min-width="15%">
            </el-table-column>
            <el-table-column prop="accountId" label="用户ID" min-width="20%">
            </el-table-column>
            <el-table-column prop="username" label="用户名" min-width="20%">
            </el-table-column>
            <el-table-column prop="password" label="密码" min-width="20%" v-if="show">
            </el-table-column>
            <el-table-column label="操作"  width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--无权限时-->
      <el-row class="text" style="text-align:center"  v-if="isnotAdmin">
        <div>您无权限访问此页面</div>
      </el-row>
      <!-- 表格下方分页 -->
      <el-row>
        <div class="pagination" style="text-align:center" v-show="paginationVisible">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :page-size="15"
              :total="filterFormFro.totalCount"
              layout="total, prev, pager, next , jumper"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
        <!-- 添加管理员信息弹窗 -->
      <el-dialog title="增加管理员"  :visible.sync="addVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addForm')">
        <el-form :model='addForm' ref="addForm" :rules="addRules">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
              <el-input style='width:240px' clearable placeholder="请输入用户名" v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
             <el-input  style='width:240px' clearable placeholder="请输入密码" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑管理员信息弹窗 -->
      <el-dialog title="编辑管理员信息"   :visible.sync="editVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
        <el-form :model='editForm' ref="editForm" :rules="editRules">
            <el-form-item label="用户ID" :label-width="formLabelWidth" prop="accountId">
             <el-input :disabled="true" style='width:240px' clearable placeholder=accountId v-model="editForm.accountId"></el-input>
            </el-form-item>
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
              <el-input style='width:240px' clearable v-model="editForm.username" placeholder=username></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import api from '../../api/userAbout/api.js'
import md5 from 'js-md5'
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
      this.$message.info('请先登陆')
      this.$router.push('/login')
      return
    }
    this.userId = sessionStorage.getItem('accountId')
    this.username = sessionStorage.getItem('username')
    if (sessionStorage.getItem('username') === 'admin') {
      this.isAdmin = true
      this.isnotAdmin = false
    } else {
      this.isAdmin = false
      this.isnotAdmin = true
      this.$message.info('非管理员，无权限查看此页面')
    }
    this.getUserFro()
  },
  data () {
    return {
      isAdmin: false,
      isnotAdmin: true,
      show: false,
      filterFormFro: {
        tableData: [],
        totalPage: 3,
        totalCount: 0
      },
      filterForm: {
        currentPage: 1
      },
      addForm: {
        username: '',
        password: ''
      },
      editForm: {
        accountId: '',
        username: '',
        password: ''
      },
      deleteForm: {
        username: ''
      },
      addRules: { // 弹窗添加用户信息验证规则
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ]
      },
      editRules: { // 弹窗修改用户信息验证规则
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ]
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      testData: [],
      addVisable: false,
      editVisable: false,
      list: [],
      states: [],
      withCredentials: true,
      processing: false,
      importFlag: 1,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getUserFro(this.filterForm.currentPage)
    },
    // 设置表头样式
    tableHeaderClassName ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0) {
        return 'headerClass'
      }
    },
    // 设置表格每一行样式
    tableRowClassName ({row, rowIndex}) {
      return 'rowClass'
    },
    // 重置表单
    resetError (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
     // 点击表格中的“编辑”按钮
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.accountId = row.accountId
      this.editForm.username = row.username
      this.editForm.password = data.password
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.username = data.username
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
     // 增加管理员信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addUserFro()
        } else {
          return false
        }
      })
    },
    // 编辑管理员信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.changePwdFro()
        } else {
          return false
        }
      })
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 用户信息-查询管理员信息
    getUserFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      para.pageNum = this.filterForm.currentPage
      api.getUser(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.data.result === 1000) {
          let data = res.data.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.testData = data.list
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何管理员信息')
          }
        } else {
          this.$message.error(res.data.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 管理员信息-添加管理员
    addUserFro () {
      let para = {
        username: this.addForm.username,
        password: md5(this.addForm.password)
      }
      api.addUser(para).then(res => {
        if (res.data.result === 1000) {
          this.addVisable = false
          this.$message.success('添加管理员信息成功')
          this.getUserFro()
        } else {
          this.$message.warning(res.data.resultDesp)
        }
      }).catch(error => {
        this.addVisable = false
        this.$message.error(error)
      })
    },
      // 硬件信息-编辑用户信息
    changePwdFro () {
      let para = {
        accountId: parseInt(this.editForm.accountId),
        username: this.editForm.username,
        password: this.editForm.password
      }
      api.changePwd(para).then(res => {
        if (res.data.result === 1000) {
          this.editVisable = false
          this.$message.success('修改成功')
          this.getUserFro()
        } else {
          this.$message.warning(res.data.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 硬件信息-删除用户信息
    deleteUserFro () {
      let para = {
        username: this.deleteForm.username
      }
      api.deleteUser(para).then(res => {
        if (res.data.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除管理员信息成功')
          this.getUserFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.deleteVisable = false
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
</style>
