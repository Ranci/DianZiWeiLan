<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>电子签到</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ElecSignMana' }">系统电子签到管理</el-breadcrumb-item>
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
            <el-button type="primary" @click="getAttendanceFro()" style="">查询</el-button>
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
            <el-table-column prop="attendanceId" label="ID" min-width="60%">
            </el-table-column>
            <el-table-column prop="attendanceName" label="名称" min-width="60%">
            </el-table-column>
            <el-table-column prop="fenceName" label="电子围栏" min-width="60%">
            </el-table-column>
            <el-table-column prop="state" label="状态" min-width="60%">
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
       <!-- 编辑电子签到信息弹窗 -->
      <el-dialog title="编辑电子签到信息"  :visible.sync="editVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="600px"
          class="manaDialog"
          @close="resetForm('editForm')">
        <el-form :model='editForm' label-width="100px" ref="editForm">
            <el-form-item label="名称：" :label-width="formLabelWidth" prop="attendanceName">
              <el-input style='width:240px' clearable placeholder="请输入电子签到名称" v-model="editForm.attendanceName"></el-input>
            </el-form-item>
            <el-form-item label="描述：" :label-width="formLabelWidth" prop="attendanceDescription">
             <el-input style='width:240px' clearable placeholder="请输入签到描述" v-model="editForm.attendanceDescription"></el-input>
            </el-form-item>
            <el-form-item label="用户组：" :label-width="formLabelWidth" prop="groupName">
              <el-select style='width:240px' v-model="editForm.groupName"  filterable placeholder="请输入用户组">
                <el-option v-for="item in groupOptions" :key="item.groupName" :label="item.groupName" :value="item.groupName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电子围栏：" :label-width="formLabelWidth" prop="fenceName">
              <el-select style='width:240px' v-model="editForm.fenceName"  filterable placeholder="请输入电子围栏">
                <el-option v-for="item in fenceOption" :key="item.fenceName" :label="item.fenceName" :value="item.fenceName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" :label-width="formLabelWidth" prop="state">
             <el-select style='width:240px' v-model="editForm.state"  filterable placeholder="请输入电子签到状态">
                <el-option v-for="item in stateOptions" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
            <el-form-item label="生效时间：" :label-width="formLabelWidth" prop="workTime">
              <el-date-picker
                v-model="editForm.workTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="管理员：" :label-width="formLabelWidth" prop="attendanceAdmin">
              <div  v-for="(item, index) in adminList" :key="item">
                <!-- <el-input style='width:240px;margin-top:5px' clearable placeholder="请输入管理员姓名" v-model="adminList[index]"></el-input> -->
              <el-select 
                style='width:240px'
                v-model="adminList[index]" 
                filterable placeholder="请输入管理员姓名">
                <el-option v-for="itemAdmin in adminOptions" :key="itemAdmin.adminId" :label="itemAdmin.adminName" :value="itemAdmin.adminName">
                </el-option>
              </el-select>
              <!-- <span><el-button type="text" size="mini" icon="el-icon-minus" @click="delet(index)"></el-button></span> -->
              </div>
              <span style="margin-top:2px"><el-button type="text" size="mini" icon="el-icon-plus" @click="add"></el-button></span>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import api from '../api/hardware/api.js'
import userapi from '../api/userAbout/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    // for (let i = 0; i < 15; i++) {
    //   this.filterFormFro.tableData.push({
    //     index: i + 1,
    //     attendanceId: i + 1,
    //     attendanceName: i + 1,
    //     fenceName: i + 1,
    //     state: i + 1
    //   })
    // }
    console.log('!!!!!!!!!!!!!')
    this.getAttendanceFro()
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
        attendanceName: '',
        attendanceDescription: '',
        state: '',
        groupId: '',
        groupName: '',
        fenceName: '',
        workTime: [],
        attendanceAdmin: ''
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      deleteForm: {
        attendanceId: ''
      },
      options: [{
        value: '1',
        label: '电子签到ID'
      }, {
        value: '2',
        label: '电子签到名称'
      }, {
        value: '3',
        label: '分组名称'
      }],
      stateOptions: [{
        value: '-1',
        label: '已过期'
      }, {
        value: '0',
        label: '未运行'
      }, {
        value: '1',
        label: '运行中'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      list: [],
      adminList: [''],
      states: [],
      groupOptions: [],
      fenceOptions: [],
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
      this.getAttendanceFro(this.filterForm.currentPage)
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
      this.deleteForm.attendanceId = data.attendanceId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAttendanceFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.attendanceId = data.attendanceId
      this.editForm.oldAttendanceName = data.attendanceName
      this.editForm.attendanceName = row.attendanceName
      this.editForm.attendanceDescription = row.attendanceDescription
      this.editForm.workTimeList = data.workTimeList
      this.editForm.fenceName = row.fenceName
      this.editForm.state = row.state
      this.editForm.groupId = row.groupId
      this.editForm.groupName = row.groupName
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
     // 将时间转化为字符串(filterForm)
    formatDateFro (now) {
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var date = now.getDate()
      date = date < 10 ? ('0' + date) : date
      return year + '-' + month + '-' + date
    },
     // 将时间转化为字符串(filterForm)
    formatTimeFro (now) {
      var hour = now.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      var minute = now.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = now.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return hour + ':' + minute + ':' + second
    },
    // 编辑网关信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editAttendanceFro()
        } else {
          return false
        }
      })
    },
    add () {
      // let obj = {
      //   name: ''
      // }
      let obj = ''
      this.adminList.push(obj)
    },
    delet (index) {
      this.adminList.splice(index, 1)
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 查询电子签到信息
    getAttendanceFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.attendanceId = parseInt(this.filterForm.queryContent)
        } else if (this.filterForm.queryCondition === '2') {
          para.attendanceName = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '3') {
          para.groupName = this.filterForm.groupName
        }
      } else {
        para.attendanceId = null
        para.attendanceName = null
        para.groupName = null
      }
      console.log(para)
      api.getAttendance(para).then(res => {
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
              this.filterFormFro.tableData[i].recentTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].recentTime))
              if (parseInt(this.filterFormFro.tableData[i].state) === parseInt(-1)) {
                this.filterFormFro.tableData[i].state = '已过期'
              } else if (parseInt(this.filterFormFro.tableData[i].state) === parseInt(0)) {
                this.filterFormFro.tableData[i].state = '运行中'
              } else {
                this.filterFormFro.tableData[i].state = '未运行'
              }
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
    // 下拉列表,已存在的电子围栏
    fenceRemoteMethod (query) {
      if (query !== '') {
        api.getFence({}).then(res => {
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
    adminRemoteMethod (query) {
      if (query !== '') {
        userapi.getAllAdmin({}).then(res => {
          if (res.data.result === 1000) {
            let data = res.data.content
            if (data.list.length > 0) {
              this.adminOptions = data.list
            }
          } else {
            this.$message.error(res.resultDesp)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
    // 编辑电子签到信息
    editAttendanceFro () {
      let para = {
        attendanceId: this.editForm.attendanceId,
        attendanceName: this.editForm.attendanceName,
        oldAttendanceName: this.editForm.oldAttendanceName,
        attendanceDescription: this.editForm.attendanceDescription,
        fenceId: parseInt('1'),
        state: parseInt(this.editForm.state),
        fenceName: this.editForm.fenceName,
        groupName: this.editForm.groupName,
        groupId: parseInt('1'),
        workTimeList: [],
        attendanceAdminList: []
      }
      for (let i = 0; i < this.groupOptions.length; i++) {
        if (this.editForm.groupName === this.groupOptions[i].groupName) {
          para.groupId = parseInt(this.groupOptions[i].groupId)
          break
        }
      }
      if (this.editForm.workTime && this.editForm.workTime.length > 0) {
        para.workTimeList.push({
          startDate: this.formatDateFro(this.editForm.workTime[0]),
          endDate: this.formatDateFro(this.editForm.workTime[1]),
          startTime: this.formatTimeFro(this.editForm.workTime[0]),
          endTime: this.formatTimeFro(this.editForm.workTime[1])
        })
      }
      if (this.adminList && this.adminList.length > 0) {
        for (let i = 0; i < this.adminList.length; i++) {
          para.attendanceAdminList.push({adminId: parseInt(this.adminList[i])})
        }
      }
      console.log(para)
      api.editAttendance(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑电子签到信息成功')
          this.getAttendanceFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 删除电子签到信息
    deleteAttendanceFro () {
      let para = {
        attendanceId: this.deleteForm.attendanceId
      }
      console.log(para)
      api.deleteAttendance(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除电子签到信息成功')
          this.getAttendanceFro()
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
