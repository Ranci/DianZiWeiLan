<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>硬件信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/HarddianziweilanMana' }">网关信息管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='filterMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form v-model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="订单编号：">
            <el-input v-model.trim="filterForm.orderNumber"  clearable style="width:160px"></el-input>
          </el-form-item>
          <el-form-item label="入库时间：">
            <el-date-picker
              v-model="filterForm.storageTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item> 
          <el-form-item style="float:right">
            <el-upload
              class="upload-demo"
              ref="uploadExc"
              action=""
              :limit = "1"
              :http-request="uploaddianziweilanFro"
              :on-progress="onProgress"
              :before-upload = "beforeUploadExc"
              list-type="picture"
              accept="excel"
              :show-file-list="false">
              <el-button type="success">批量导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="danger"  @click="batchDeleteVisable = true">批量删除</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="warning"  @click="addVisable = true">添加</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getdianziweilanFro()" style="">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!--表格数据-->
      <el-row style="margin-top:10px">
        <el-table
          ref="dianziweilanTable"
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
          :data="filterFormFro.tableData" 
          :border="true"
          :row-class-name="tableRowClassName"
          :header-cell-class-name = "tableHeaderClassName"
          v-bind:style="{width: tableWidth + 'px'}">
            <el-table-column prop="index" label="序号" sortable min-width="15%">
            </el-table-column>
            <el-table-column prop="dianziweilanId"   label="网关ID" min-width="25%">
            </el-table-column>
            <el-table-column prop="hardwareVersion"   label="硬件版本号码" min-width="25%">
            </el-table-column>
            <el-table-column prop="softwareVersion" label="软件版本号码" min-width="25%">
            </el-table-column>
            <el-table-column prop="operatorName" label="操作员" min-width="25%">
            </el-table-column>
            <el-table-column prop="orderNumber" label="生产订单编号" min-width="25%">
            </el-table-column>
            <el-table-column prop="storageTime" label="入库时间" min-width="25%">
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
      <!-- 表格下方分页 -->
      <el-row>
        <div class="pagination" style="text-align:center" v-show="paginationVisible">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :page-size="15"
              layout="total, prev, pager, next, jumper"
              :total="filterFormFro.totalCount"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
      <!-- 添加网关信息弹窗 -->
      <el-dialog title="增加网关"  :visible.sync="addVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addForm')">
        <el-form :model='addForm' ref="addForm" :rules="addRules">
            <el-form-item label="网关ID：" :label-width="formLabelWidth" prop="dianziweilanId">
              <el-input style='width:240px' @keyup.native="addForm.dianziweilanId=addForm.dianziweilanId.replace(/[^\w\u4e00-\u9fa5\s]/g, '')" clearable placeholder="请输入网关ID" v-model.trim="addForm.dianziweilanId"></el-input>
            </el-form-item>
            <el-form-item label="硬件版本号：" :label-width="formLabelWidth" prop="hardwareVersion">
              <el-input style='width:240px'  clearable placeholder="请输入硬件版本号" v-model.trim="addForm.hardwareVersion"></el-input>
            </el-form-item>
            <el-form-item label="软件版本号：" :label-width="formLabelWidth" prop="softwareVersion">
              <el-input style='width:240px' clearable placeholder="请输入软件版本号" v-model.trim="addForm.softwareVersion"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="orderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model.trim="addForm.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 批量化删除订单弹窗 -->
      <el-dialog title="批量删除订单"  :visible.sync="batchDeleteVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('batchDeleteForm')">
        <el-form :model='batchDeleteForm' ref="batchDeleteForm" :rules="batchDeleteRules">
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="orderNumber">
              <el-input style='width:240px'  clearable placeholder="请输入订单编号" v-model.trim="batchDeleteForm.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitBatchDelete()">确 定</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑网关信息弹窗 -->
      <el-dialog title="编辑网关信息"   :visible.sync="editVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
        <el-form :model='editForm' ref="editForm" :rules="editRules">
            <el-form-item label="网关ID" :label-width="formLabelWidth" prop="dianziweilanId">
              <!--<label>{{editForm.dianziweilanId}}</label>-->
              <el-input style='width:300px' clearable v-model="editForm.dianziweilanId"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="orderNumber">
              <el-input style='width:300px' clearable placeholder="请输入订单编号" v-model.trim="editForm.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="硬件版本号：" :label-width="formLabelWidth" prop="hardwareVersion">
              <el-input style='width:300px' clearable v-model="editForm.hardwareVersion"></el-input>
            </el-form-item>
            <el-form-item label="软件版本号：" :label-width="formLabelWidth" prop="softwareVersion">
              <el-input style='width:300px' clearable v-model="editForm.softwareVersion"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import api from '../../api/hardware/api.js'
import apiFile from '../../api/apiFile/api.js'
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
      this.$message.info('请先登陆')
      this.$router.push('/login')
      return
    }
    this.getdianziweilanFro()
  },
  data () {
    var checkdianziweilanId = (rule, value, callback) => { // 内容编号验证
      if (/^[A-Fa-f0-9]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('网关ID为0123456789ABCDEF组合'))
      }
    }
    return {
      accountId: '',
      multipleSelection: [],
      filterForm: {
        orderNumber: '',
        currentPage: 1,
        operatorName: '',
        toPage: 1 // 前往第几页
      },
      filterFormFro: {
        tableData: [],
        totalCount: 0 // 总条数
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      addForm: {
        hardwareVersion: '',
        softwareVersion: ''
      },
      addVisable: false,
      batchDeleteVisable: false,
      editVisable: false,
      editForm: {
        hardwareVersion: '',
        softwareVersion: ''
      },
      batchDeleteForm: {
        orderNumber: ''
      },
      deleteForm: {
      },
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
      addRules: { // 弹窗添加硬件-网关信息验证规则
        dianziweilanId: [
          { required: true, message: '请填写网关ID', trigger: 'blur' },
          { validator: checkdianziweilanId, trigger: 'blur' },
          { max: 24, message: '网关ID最多24个字', trigger: 'blur' }
        ],
        hardwareVersion: [
          { required: true, message: '请填写硬件版本号名称', trigger: 'blur' },
          { max: 10, message: '硬件版本号名称最多10个字', trigger: 'blur' }
        ],
        softwareVersion: [
          { required: true, message: '请填写软件版本号名称', trigger: 'blur' },
          { max: 10, message: '软件版本号名称最多10个字', trigger: 'blur' }
        ],
        orderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最多30个字', trigger: 'blur' }
        ]
      },
      editRules: { // 弹窗编辑硬件-网关信息验证规则
        dianziweilanId: [
          { required: true, message: '请填写网关ID', trigger: 'blur' },
          { validator: checkdianziweilanId, trigger: 'blur' },
          { max: 24, message: '网关ID最多24个字', trigger: 'blur' }
        ],
        hardwareVersion: [
          { required: true, message: '请填写硬件版本号名称', trigger: 'blur' },
          { max: 10, message: '硬件版本号名称最多10个字', trigger: 'blur' }
        ],
        softwareVersion: [
          { required: true, message: '请填写软件版本号名称', trigger: 'blur' },
          { max: 10, message: '软件版本号名称最多10个字', trigger: 'blur' }
        ],
        orderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最多30个字', trigger: 'blur' }
        ]
      },
      batchDeleteRules: { // 弹窗批量删除订单信息验证规则
        orderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 40, message: '订单编号最多30个字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getdianziweilanFro(this.filterForm.currentPage)
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
    // 点击表格中的“编辑”按钮
    handleEdit (index, row) {
      this.editForm.orderNumber = row.orderNumber
      this.editForm.dianziweilanId = row.dianziweilanId
      this.editForm.olddianziweilanId = row.dianziweilanId
      this.editForm.hardwareVersion = row.hardwareVersion
      this.editForm.softwareVersion = row.softwareVersion
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.dianziweilanId = data.dianziweilanId
      this.$confirm('确定删除该条网关信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletedianziweilanFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
    // 增加网关信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.adddianziweilanFro()
        } else {
          return false
        }
      })
    },
    // 批量删除网关订单信息，点击“保存
    submitBatchDelete () {
      this.$refs['batchDeleteForm'].validate((valid) => {
        if (valid) {
          this.batchDeletedianziweilanFro()
        } else {
          return false
        }
      })
    },
    // 编辑网关信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editdianziweilanFro()
        } else {
          return false
        }
      })
    },
    // excel文件上传前进行检验格式
    beforeUploadExc (file) {
      let isExcel = false
      if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        isExcel = true
      } else {
        this.$message.warning('批量导入文件类型应为.xls或者.xlsx类型')
      }
      return isExcel
    },
    // 文件上传时
    onProgress (event, file, fileList) {
      this.loading = true
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
    /** ***************************** 向后台发送请求 ***************************************** */
    // 向后台发送信息批量导入网关信息(excel)
    uploaddianziweilanFro () {
      this.loading = true
      let file = this.$refs['uploadExc'].uploadFiles[0].raw
      let para = new FormData()
      para.append('files', file)
      para.append('username', sessionStorage.getItem('username'))
      para.append('accountId', sessionStorage.getItem('accountId'))
      // 测试修改，暂定
      apiFile.uploaddianziweilan(para).then(res => {
        this.loading = false
        this.$refs['uploadExc'].clearFiles()
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}) // 表示xlsx类型
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = '网关批量导入结果.xlsx' // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
        this.$message.info('文件上传成功，错误信息文档已生成')
      }).catch(error => {
        this.$refs['uploadExc'].clearFiles()
        this.loading = false
        this.$message.error(error)
      })
    },
    // 硬件信息-查询网关信息
    getdianziweilanFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        orderNumber: this.filterForm.orderNumber,
        operatorName: sessionStorage.getItem('username')
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      para.pageNum = this.filterForm.currentPage
      if (this.filterForm.storageTime && this.filterForm.storageTime.length > 0) {
        para.startDate = this.formatDayFro(this.filterForm.storageTime[0])
        para.endDate = this.formatDayFro(this.filterForm.storageTime[1])
      }
      api.getdianziweilan(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.$message.success('网关信息查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].storageTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].storageTime))
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * para.pageSize + i + 1
            }
          } else {
            this.$message.warning('没有查到任何网关信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 硬件信息-增加网关信息
    adddianziweilanFro () {
      let para = {
        dianziweilanId: this.addForm.dianziweilanId,
        hardwareVersion: this.addForm.hardwareVersion,
        softwareVersion: this.addForm.softwareVersion,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        username: sessionStorage.getItem('username'),
        orderNumber: this.addForm.orderNumber
      }
      api.adddianziweilan(para).then(res => {
        if (res.result === 1000) {
          this.addVisable = false
          this.$message.success('添加网关信息成功')
          this.getdianziweilanFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.addVisable = false
        this.$message.error(error)
      })
    },
    // 硬件信息-批量删除网关订单信息
    batchDeletedianziweilanFro () {
      let para = {
        orderNumber: this.batchDeleteForm.orderNumber
      }
      api.batchDeletedianziweilan(para).then(res => {
        if (res.result === 1000) {
          this.batchDeleteVisable = false
          this.filterForm.orderNumber = ''
          this.$message.success('成功删除网关订单编号为【' + para.orderNumber + '】的网关信息')
          this.getdianziweilanFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 硬件信息-编辑网关信息
    editdianziweilanFro () {
      let para = {
        dianziweilanId: this.editForm.dianziweilanId,
        orderNumber: this.editForm.orderNumber,
        olddianziweilanId: this.editForm.olddianziweilanId,
        hardwareVersion: this.editForm.hardwareVersion,
        softwareVersion: this.editForm.softwareVersion,
        accountId: parseInt(sessionStorage.getItem('accountId'))
      }
      api.editdianziweilan(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑网关信息成功')
          this.getdianziweilanFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 硬件信息-删除网关信息
    deletedianziweilanFro () {
      let para = {
        dianziweilanId: this.deleteForm.dianziweilanId
      }
      api.deletedianziweilan(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除网关信息成功')
          this.getdianziweilanFro()
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
