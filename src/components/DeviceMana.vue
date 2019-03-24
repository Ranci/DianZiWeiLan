<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/DeviceMana' }">设备管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
           <el-form-item label="查询条件">
            <el-select style='width:240px' v-model="filterForm.queryCondition"  filterable placeholder="查询条件">
              <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>
            <el-form-item label="查询内容：">
            <el-input v-model.trim="filterForm.queryContent"  clearable style="width:220px"></el-input>
           </el-form-item>
          <el-form-item> 
            <el-button type="primary" @click="getDeviceFro()">查询</el-button>
           </el-form-item>
           <el-form-item> 
            <el-button type="primary" @click="addVisable = true">添加</el-button>
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
            <el-table-column prop="deviceId" label="设备ID" min-width="60%">
            </el-table-column>
            <el-table-column prop="deviceName" label="设备名称" min-width="60%">
            </el-table-column>
            <el-table-column prop="deviceTypeName" label="设备类型名称" v-if="show" min-width="60%">
            </el-table-column>
            <el-table-column prop="fenceId" label="所属围栏" min-width="60%">
            </el-table-column>
            <el-table-column prop="adminName" label="管理员" min-width="60%">
            </el-table-column>
            <el-table-column prop="phone" label="电话" min-width="60%">
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
       <!-- 编辑设备信息弹窗 -->
      <el-dialog title="编辑设备信息"  :visible.sync="editVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('editForm')">
        <el-form :model='addForm' ref="editForm">
            <el-form-item label="设备ID" :label-width="formLabelWidth" prop="deviceId">
              <el-input style='width:240px' clearable placeholder="请输入设备ID" v-model="editForm.deviceId"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" :label-width="formLabelWidth" prop="deviceName">
              <el-input style='width:240px' clearable placeholder="请输入设备名称" v-model="editForm.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="设备类型：" :label-width="formLabelWidth" prop="deviceTypeName">
             <el-select style='width:240px' v-model="editForm.deviceTypeName"  filterable placeholder="请输入设备类型">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="所属围栏：" :label-width="formLabelWidth" prop="fenceId">
              <el-select style='width:240px' v-model="editForm.fenceId"  filterable placeholder="请输入所属围栏ID">
                <el-option v-for="item in fenceOptions" :key="item.fenceId" :label="item.fenceId" :value="item.fenceId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="管理员：" :label-width="formLabelWidth" prop="adminName">
              <el-select style='width:240px' v-model="editForm.adminName"  filterable placeholder="请输入管理员姓名">
                <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
              <el-input style='width:240px' clearable placeholder="请输入电话" v-model="editForm.phone"></el-input>
            </el-form-item> -->
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 添加设备信息弹窗 -->
      <el-dialog title="添加设备"  :visible.sync="addVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addForm')">
        <el-form :model='addForm' ref="addForm">
            <el-form-item label="设备名称" :label-width="formLabelWidth" prop="deviceName">
              <el-input style='width:240px' clearable placeholder="请输入设备名称" v-model="addForm.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="设备类型：" :label-width="formLabelWidth" prop="deviceTypeName">
             <el-select style='width:240px' v-model="addForm.deviceTypeName"  filterable placeholder="请输入设备类型">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
             </el-select>
            </el-form-item>
            <el-form-item label="所属围栏：" :label-width="formLabelWidth" prop="fenceId">
              <el-select style='width:240px' v-model="editForm.fenceId"  filterable placeholder="请输入所属围栏ID">
                <el-option v-for="item in fenceOptions" :key="item.fenceId" :label="item.fenceId" :value="item.fenceId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="管理员：" :label-width="formLabelWidth" prop="adminName">
              <el-select style='width:240px' v-model="addForm.adminName"  filterable placeholder="请输入管理员姓名">
                <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
              <el-input style='width:240px' clearable placeholder="请输入管理员电话" v-model="addForm.phone"></el-input>
            </el-form-item> -->
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:220px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
// import userapi from '../api/userAbout/api.js'
import api from '../api/hardware/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    console.log('!!!!!!!!!!!!!')
    this.getDeviceFro()
    this.typeRemoteMethod()
    // this.fenceRemoteMethod()
    this.adminRemoteMethod()
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
      editForm: {
        deviceId: '',
        deviceName: '',
        oldDeviceName: '',
        deviceTypeName: '',
        fenceId: '',
        adminName: '',
        phone: ''
      },
      addForm: {
        deviceName: '',
        deviceTypeName: '',
        fenceId: '',
        adminName: '',
        phone: ''
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      deleteForm: {
        userId: ''
      },
      list: [],
      states: [],
      options: [{
        value: '1',
        label: '设备ID'
      }, {
        value: '2',
        label: '设备名称'
      }, {
        value: '3',
        label: '设备类型名称'
      }],
      typeOptions: [],
      fenceOptions: [],
      adminOptions: [],
      fileList: [],
      multipleSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      show: false,
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
      this.getDeviceFro(this.filterForm.currentPage)
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
      this.deleteForm.deviceId = data.deviceId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDeviceFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.deviceName = row.deviceName
      this.editForm.oldDeviceName = data.deviceName
      this.editForm.deviceTypeName = row.deviceTypeName
      this.editForm.deviceId = row.deviceId
      this.editForm.fenceId = row.fenceId
      this.editForm.phone = row.phone
      this.editForm.adminName = row.adminName
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
    // 增加设备信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addDeviceFro()
        } else {
          return false
        }
      })
    },
    // 编辑设备信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editDeviceFro()
        } else {
          return false
        }
      })
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 下拉列表,已存在的设备类型
    typeRemoteMethod (query) {
      if (query !== '') {
        api.getDeviceType({}).then(res => {
          if (res.result === 1000) {
            let data = res.content
            if (data.list.length > 0) {
              this.typeOptions = data.list
            }
          } else {
            this.$message.error(res.resultDesp)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
     // 下拉列表,已存在的电子围栏
    fenceRemoteMethod (query) {
      if (query !== '') {
        api.getDeviceTypeID({}).then(res => {
          this.filterFormFro.tableData = []
          if (res.result === 1000) {
            let data = res.content
            if (data.list.length > 0) {
              this.fenceOptions = data.list
            }
          } else {
            this.$message.error(res.resultDesp)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
     // 管理员下拉列表
    // adminRemoteMethod (query) {
    //   if (query !== '') {
    //     userapi.getAllAdmin({}).then(res => {
    //       this.filterFormFro.tableData = []
    //       if (res.data.result === 1000) {
    //         let data = res.data.content
    //         if (data.list.length > 0) {
    //           this.adminOptions = data.list
    //         }
    //       } else {
    //         this.$message.error(res.resultDesp)
    //       }
    //     }).catch(error => {
    //       this.$message.error(error)
    //     })
    //   }
    // },
    // 查询设备信息
    getDeviceFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.deviceId = parseInt(this.filterForm.queryContent)
        } else if (this.filterForm.queryCondition === '2') {
          para.deviceName = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '3') {
          para.deviceTypeName = this.filterForm.queryContent
        }
      } else {
        para.deviceId = null
        para.deviceName = null
        para.deviceTypeName = null
      }
      para.pageNum = this.filterForm.currentPage
      // console.log(para)
      api.getDevice(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.testData = data.list
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何设备信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
     // 添加设备
    addDeviceFro () {
      let para = {
        deviceName: this.addForm.deviceName,
        deviceTypeId: '',
        deviceTypeName: this.addForm.deviceTypeName,
        fenceId: parseInt('1'),
        // fenceId: parseInt(this.addForm.fenceId),
        fenceName: '',
        phone: sessionStorage.getItem('phone'),
        adminId: parseInt(sessionStorage.getItem('adminId')),
        adminName: sessionStorage.getItem('adminName')
      }
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (this.addForm.deviceTypeName === this.typeOptions[i].deviceTypeName) {
          para.deviceTypeId = parseInt(this.typeOptions[i].deviceTypeId)
          break
        }
      }
      for (let i = 0; i < this.fenceOptions.length; i++) {
        if (this.addForm.fenceId === this.fenceOptions[i].fenceId) {
          para.fenceName = this.fenceOptions[i].fenceName
          break
        }
      }
      console.log('添加设备')
      console.log(para)
      // api.addDevice(para).then(res => {
      //   if (res.result === 1000) {
      //     this.addVisable = false
      //     this.$message.success('添加设备信息成功')
      //     this.getDeviceFro()
      //   } else {
      //     this.$message.warning(res.resultDesp)
      //   }
      // }).catch(error => {
      //   this.editVisable = false
      //   this.$message.error(error)
      // })
    },
    // 编辑设备信息
    editDeviceFro () {
      let para = {
        deviceName: this.editForm.deviceName,
        oldDeviceName: this.editForm.oldDeviceName,
        deviceId: parseInt(this.editForm.deviceId),
        deviceTypeId: '',
        deviceTypeName: this.editForm.deviceTypeName,
        fenceId: parseInt(1),
        // fenceId: parseInt(this.editForm.fenceId),
        fenceName: this.editForm.fenceName,
        phone: sessionStorage.getItem('phone'),
        adminId: parseInt(sessionStorage.getItem('adminId')),
        adminName: sessionStorage.getItem('adminName')
      }
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (this.editForm.deviceTypeName === this.typeOptions[i].deviceTypeName) {
          para.deviceTypeId = this.typeOptions[i].deviceTypeId
          break
        }
      }
      for (let i = 0; i < this.fenceOptions.length; i++) {
        if (this.editForm.fenceId === this.fenceOptions[i].fenceId) {
          para.fenceName = this.fenceOptions[i].fenceName
          break
        }
      }
      console.log(para)
      api.editDevice(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑设备信息成功')
          this.getDeviceFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 删除设备信息
    deleteDeviceFro () {
      let para = {
        deviceId: this.deleteForm.deviceId
      }
      console.log(para)
      api.deleteDevice(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除设备信息成功')
          this.getDeviceFro()
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
