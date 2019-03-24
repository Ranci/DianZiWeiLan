<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/SysMana' }">系统管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
           <el-form-item label="查询条件">
             <el-select style='width:240px' v-model="filterForm.queryCondition"  filterable placeholder="查询内容">
                <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
            <el-form-item label="查询内容：">
              <el-input v-model.trim="filterForm.queryContent"  clearable style="width:220px"></el-input>
           </el-form-item>
          <el-form-item> 
            <el-button type="primary" @click="getAdminFro()" style="">查询</el-button>
           </el-form-item>
          <el-form-item> 
            <!-- <el-button type="primary" @click="getCollegeListFro()" style="">查询</el-button> -->
            <el-button type="primary"  @click="addVisable = true" style="margin-right:15px">添加</el-button>
          </el-form-item> 
        </el-form>
      </el-row>
      <!--表格数据-->
      <el-row style="margin-top:10px">
        <el-table
          id="out-table"
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
          :data="filterFormFro.tableData" 
          :border="true"
          :row-class-name="tableRowClassName"
          :header-cell-class-name = "tableHeaderClassName"
          tooltip-effect="dark"
          v-bind:style="{width: tableWidth + 'px'}">
            <el-table-column prop="index" label="序号" sortable min-width="20%">
            </el-table-column>
            <el-table-column prop="adminId" label="ID" min-width="60%">
            </el-table-column>
            <el-table-column prop="adminName" label="管理员名称" min-width="60%">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" min-width="60%">
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" min-width="60%">
            </el-table-column>
            <el-table-column prop="recentTime" label="上次登录时间" min-width="60%">
            </el-table-column>
            <el-table-column label="管理"  width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 表格下方分页 -->
      <el-row>
        <div class="pagination" style="text-align:center" v-show="paginationVisible">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :page-size="15"
              :total="filterFormFro.totalCount"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
       <!-- 添加管理员信息弹窗 -->
      <el-dialog title="添加管理员信息"  :visible.sync="addVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addForm')">
        <el-form :model='addForm' ref="addForm">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="adminName">
              <el-input style='width:240px' clearable placeholder="请输入管理员名称" v-model="addForm.adminName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="phone">
             <el-input style='width:240px' clearable placeholder="请输入联系方式" v-model="addForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="角色：" :label-width="formLabelWidth" prop="roleName">
              <el-select style='width:240px' v-model="addForm.roleName"  filterable placeholder="请输入角色名">
                <el-option v-for="item in roleOptions" :key="item.roleName" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
       <!-- 编辑管理员信息弹窗 -->
      <el-dialog title="编辑管理员信息"  :visible.sync="editVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('editForm')">
        <el-form :model='addForm' ref="editForm">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="adminName">
              <el-input style='width:240px' clearable placeholder="请输入用户名" v-model="editForm.adminName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="phone">
             <el-input style='width:240px' clearable placeholder="请输入联系方式" v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="角色：" :label-width="formLabelWidth" prop="roleName">
              <el-select style='width:240px' v-model="editForm.roleName"  filterable placeholder="请输入角色名">
                <el-option v-for="item in roleOptions" :key="item.roleName" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import api from '../api/userAbout/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    console.log('!!!!!!!!!!!!!')
    this.getAdminFro()
    // this.getRoleFro()
  },
  data () {
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 0
      },
      filterForm: {
        queryCondition: '',
        queryContent: '',
        currentPage: 1
      },
      addForm: {
        adminName: '',
        phone: '',
        roleId: ''
      },
      editForm: {
        userName: '',
        phone: '',
        roleName: ''
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      deleteForm: {
        adminId: ''
      },
      options: [{
        value: '1',
        label: '管理员ID'
      }, {
        value: '2',
        label: '管理员姓名'
      }, {
        value: '3',
        label: '角色名称'
      }],
      list: [],
      states: [],
      roleOptions: [],
      fileList: [],
      multipleSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      addVisable: false,
      editVisable: false,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getAdminFro(this.filterForm.currentPage)
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
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.adminId = data.adminId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAdminFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.adminId = data.adminId
      this.editForm.adminName = row.adminName
      this.editForm.oldAdminName = data.adminName
      this.editForm.oldPhone = data.phone
      this.editForm.phone = row.phone
      this.editForm.roleName = row.roleName
      this.editVisable = true
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
    // 将时间转化为字符串(filterForm)
    formatDayFro (now) {
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var date = now.getDate()
      date = date < 10 ? ('0' + date) : date
      var hour = now.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      var minute = now.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = now.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    // 编辑管理员信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editAdminFro()
        } else {
          return false
        }
      })
    },
     // 增加管理员信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addAdminFro()
        } else {
          return false
        }
      })
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 查询管理员信息
    getAdminFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.adminId = parseInt(this.filterForm.queryContent)
        } else if (this.filterForm.queryCondition === '2') {
          para.adminName = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '3') {
          para.roleName = this.filterForm.queryContent
        }
      } else {
        para.adminId = null
        para.adminName = null
        para.roleName = null
      }
      console.log(para)
      api.getAdmin(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        console.log(res)
        if (res.data.result === 1000) {
          let data = res.data.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
              this.filterFormFro.tableData[i].recentTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].recentTime))
            }
          } else {
            this.$message.warning('没有查到任何信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 查询管理员信息
    getRoleFro () {
      api.getRole().then(res => {
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.roleOptions = data.list
          }
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 添加管理员
    addAdminFro () {
      let para = {
        // roleId: parseInt(this.addForm.roleName),
        adminName: this.addForm.adminName,
        roleId: parseInt('1'),
        phone: this.addForm.phone
      }
      console.log(para)
      api.addAdmin(para).then(res => {
        if (res.result === 1000) {
          this.addVisable = false
          this.$message.success('添加管理员成功')
          this.getAdminFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.addVisable = false
        this.$message.error(error)
      })
    },
    // 编辑管理员信息
    editAdminFro () {
      let para = {
        adminName: this.editForm.adminName,
        adminId: parseInt(this.editForm.adminId),
        phone: this.editForm.phone,
        roleId: parseInt(this.editForm.roleName),
        oldPhone: this.editForm.oldPhone,
        oldAdminName: this.editForm.oldAdminName
      }
      console.log(para)
      api.editAdmin(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑管理员信息成功')
          this.getAdminFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 删除管理员信息
    deleteAdminFro () {
      let para = {
        adminId: this.deleteForm.adminId
      }
      console.log(para)
      api.deleteAdmin(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除管理员信息成功')
          this.getAdminFro()
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
