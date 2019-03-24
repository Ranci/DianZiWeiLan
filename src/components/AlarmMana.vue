<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/AlarmMana' }">报警管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
           <el-form-item label="查询条件：">
             <el-select style='width:240px' v-model="filterForm.queryCondition" @change="getConditionView(filterForm.queryCondition)" filterable placeholder="查询内容">
                <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
            <el-form-item v-if="showContent" label="查询内容：">
            <el-input v-model.trim="filterForm.queryContent"  clearable style="width:220px"></el-input>
           </el-form-item>
           <el-form-item label="警报类型：">
             <el-select style='width:240px' v-model="filterForm.alarmType" filterable placeholder="警报类型">
                <el-option v-for="item in alarmTypeOptions" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
           <el-form-item label="时间：" v-if="showDate"> 
            <el-date-picker
              v-model="filterForm.queryContent"
              align="right"
              type="date"
              :picker-options="pickerOptions"
              placeholder="选择日期"
              style='width:220px'>
            </el-date-picker>
           </el-form-item>
          <el-form-item> 
            <el-button type="primary" @click="getAlarmFro()" style="">查询</el-button>
           </el-form-item>
          <el-form-item> 
            <!-- <el-button type="primary" @click="getCollegeListFro()" style="">查询</el-button> -->
            <el-button type="primary"  @click="download()" style="margin-right:15px">导出</el-button>
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
            <el-table-column prop="alarmInfoId" label="报警信息ID" v-if=show min-width="60%">
            </el-table-column>
            <el-table-column prop="fenceId" label="围栏编号" min-width="60%">
            </el-table-column>
            <el-table-column prop="fenceName" label="围栏名称" min-width="60%">
            </el-table-column>
            <el-table-column prop="userId" label="用户ID"  min-width="60%">
            </el-table-column>
            <el-table-column prop="userName" label="用户名" min-width="60%">
            </el-table-column>
            <el-table-column prop="alarmType" label="报警类型" min-width="60%">
            </el-table-column>
            <el-table-column prop="alarmDescription" label="报警描述" min-width="60%">
            </el-table-column>
            <el-table-column prop="alarmTime" label="报警时间" min-width="60%">
            </el-table-column>
            <el-table-column prop="isDeal" label="是否处理" min-width="60%">
            </el-table-column>
            <el-table-column label="管理"  width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-check"
                  type="warning"
                  @click="handleAlarm(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
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
    </div>
</template>
<script>
import api from '../api/hardware/api.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    console.log('!!!!!!!!!!!!!')
    this.filterForm.fenceId = this.$route.query.fenceId
    this.filterForm.fenceName = this.$route.query.fenceName
    this.getAlarmFro()
  },
  data () {
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 0
      },
      filterForm: {
        fenceId: '',
        fenceName: '',
        queryCondition: '',
        queryContent: '',
        alarmType: '用户',
        currentPage: 1
      },
      options: [{
        value: '1',
        label: '围栏ID'
      }, {
        value: '2',
        label: '围栏名称'
      }, {
        value: '3',
        label: '分组ID'
      }, {
        value: '4',
        label: '分组名称'
      }, {
        value: '5',
        label: '日期'
      }],
      alarmTypeOptions: [{
        value: '用户',
        label: '用户'
      }, {
        value: '设备',
        label: '设备'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      deleteForm: {
        alarmInfoId: ''
      },
      handleForm: {
        alarmInfoId: ''
      },
      list: [],
      states: [],
      fileList: [],
      showContent: true,
      showDate: false,
      multipleSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      importFlag: 1,
      show: false,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getAlarmFro(this.filterForm.currentPage)
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
      this.deleteForm.alarmInfoId = row.alarmInfoId
      // let data = this.filterFormFro.tableData[index]
      // this.deleteForm.alarmInfoId = data.alarmInfoId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAlarmFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
     // 点击表格中的“处理”按钮
    handleAlarm (index, row) {
      this.handleForm.alarmInfoId = row.alarmInfoId
      this.$confirm('是否处理该报警信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleAlarmFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 点击“导出”按钮
    download () {
      this.$confirm('确定导出数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportExcel()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
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
      // var hour = now.getHours()
      // hour = hour < 10 ? ('0' + hour) : hour
      // var minute = now.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      // var second = now.getSeconds()
      // second = second < 10 ? ('0' + second) : second
      // return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      return year + '-' + month + '-' + date + ' '
    },
    getConditionView (value) {
      if (value === '5') {
        this.showDate = true
        this.showContent = false
      } else {
        this.showContent = true
        this.showDate = false
      }
      this.filterForm.queryContent = ''
    },
    // 导出
    exportExcel () {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 查询警报信息
    getAlarmFro (pageNum) {
      this.loading = false
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        alarmType: this.filterForm.alarmType
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.fenceId = parseInt(this.filterForm.queryContent)
        } else if (this.filterForm.queryCondition === '2') {
          para.fenceName = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '3') {
          para.groupId = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '4') {
          para.groupName = this.filterForm.queryContent
        } else if (this.filterForm.queryCondition === '5') {
          if (this.filterForm.queryContent) {
            para.data = this.formatDayFro(this.filterForm.queryContent)
          } else {
            para.date = null
          }
        }
      } else {
        para.fenceId = null
        para.fenceName = null
        para.groupId = null
        para.groupName = null
        para.data = null
      }
      console.log(para)
      api.getAlarm(para).then(res => {
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
              this.filterFormFro.tableData[i].alarmTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].alarmTime))
              if (this.filterFormFro.tableData[i].isDeal === true) {
                this.filterFormFro.tableData[i].isDeal = '已处理'
              } else {
                this.filterFormFro.tableData[i].isDeal = '未处理'
              }
            }
          } else {
            this.$message.warning('没有查到任何警报信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 删除报警信息
    deleteAlarmFro () {
      let para = {
        alarmInfoId: parseInt(this.deleteForm.alarmInfoId)
      }
      console.log('delete')
      console.log(para)
      api.deleteAlarm(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除警报信息成功')
          this.getAlarmFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.deleteVisable = false
        this.$message.error(error)
      })
    },
     // 处理报警信息
    handleAlarmFro () {
      let para = {
        alarmInfoId: parseInt(this.handleForm.alarmInfoId)
      }
      console.log('deal')
      console.log(para)
      api.handleAlarm(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('报警信息已处理')
          this.getAlarmFro()
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
