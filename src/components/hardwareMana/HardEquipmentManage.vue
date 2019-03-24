<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>硬件信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/HardEquipmentManage' }">设备信息管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm" :rules="queryRules">
           <el-form-item label="设备ID：">
            <el-input v-model.trim="filterForm.deviceId" prop="deviceId" clearable style="width:100px"></el-input>
           </el-form-item>
           <el-form-item label="设备类型：">
            <el-select style='width:240px' v-model="addForm.deviceTypeName" clearable filterable placeholder="请输入设备类型">
              <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
              </el-option>
            </el-select>
           </el-form-item>
           <el-form-item label="操作员姓名：">
            <el-input v-model.trim="filterForm.operatorName"  clearable style="width:100px"></el-input>
           </el-form-item>
            <el-form-item label="生产订单编号：">
            <el-input v-model.trim="filterForm.orderNumber"  clearable style="width:100px"></el-input>
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
              <el-button type="danger"  @click="batchDeleteVisable = true" style="margin-right:15px">批量删除</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-upload
                class="upload-demo"
                ref="uploadExc"
                style="float:right;margin-right:15px"
                action=""
                :limit = "1"
                :http-request="uploadDeviceFro"
                :on-progress="onProgress"
                :before-upload = "beforeUploadExc"
                list-type="picture"
                accept="excel"
                :show-file-list="false">
              <el-button type="success">批量导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item style="float:right"> 
            <!-- <el-button type="primary" @click="getCollegeListFro()" style="">查询</el-button> -->
            <el-button type="warning"  @click="addVisable = true" style="margin-right:15px">添加</el-button>
          </el-form-item> 
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getDeviceFro()" style="">查询</el-button>
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
          v-bind:style="{width: tableWidth + 'px'}">
            <el-table-column prop="index" label="序号" sortable min-width="15%">
            </el-table-column>
            <el-table-column prop="deviceId" label="设备id" min-width="25%">
            </el-table-column>
            <el-table-column prop="deviceTypeId" label="设备类型ID" min-width="25%">
            </el-table-column>
            <el-table-column prop="deviceTypeName" label="设备类型" min-width="25%">
            </el-table-column>
            <el-table-column prop="operatorId" label="操作员ID" min-width="25%">
            </el-table-column>
            <el-table-column prop="operatorName" label="操作员姓名" min-width="25%">
            </el-table-column>
            <el-table-column prop="storageTime" label="入库时间" min-width="25%">
            </el-table-column>
            <el-table-column prop="orderNumber" label="生产订单编号" min-width="25%">
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
              :total="filterFormFro.totalCount"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
      <!-- 添加设备信息弹窗 -->
      <el-dialog title="增加设备"  :visible.sync="addVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addForm')">
        <el-form :model='addForm' ref="addForm" :rules="addRules">
            <el-form-item label="设备ID" :label-width="formLabelWidth" prop="deviceId">
              <el-input style='width:240px' clearable placeholder="请输入设备id" v-model="addForm.deviceId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型ID：" :label-width="formLabelWidth" prop="deviceTypeId">
             <el-input :disabled="true" style='width:240px' clearable placeholder="请输入设备类型ID" v-model="addForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型：" :label-width="formLabelWidth" prop="deviceTypeName">
              <el-select style='width:240px' v-model="addForm.deviceTypeName"  filterable placeholder="请输入设备类型" @change="getDeviceTypeName('addForm')">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产订单编号" :label-width="formLabelWidth" prop="orderNumber">
              <el-input style='width:240px' clearable placeholder="请输入生产订单编号" v-model="addForm.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑设备信息弹窗 -->
      <el-dialog title="编辑设备信息"   :visible.sync="editVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
        <el-form :model='editForm' ref="editForm" :rules="editRules">
            <el-form-item label="设备ID：" :label-width="formLabelWidth" prop="deviceId">
              <el-input style='width:240px' clearable v-model="editForm.deviceId" placeholder=deviceId></el-input>
            </el-form-item>
            <el-form-item label="设备类型ID：" :label-width="formLabelWidth" prop="deviceTypeId">
             <el-input :disabled="true" style='width:240px' clearable placeholder="请输入设备类型ID" v-model="editForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型：" :label-width="formLabelWidth" prop="deviceTypeName">
              <el-select style='width:240px' v-model="editForm.deviceTypeName"   @change="getDeviceTypeName('editForm')" filterable placeholder=deviceTypeName></el-input>
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产订单编号" :label-width="formLabelWidth" prop="orderNumber">
              <el-input style='width:240px' clearable placeholder="请输入生产订单编号" v-model="editForm.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEdit()">保 存</el-button>
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
    this.userId = sessionStorage.getItem('accountId')
    this.username = sessionStorage.getItem('username')
    this.getDeviceFro()
    this.remoteMethod()
  },
  data () {
    var checkDeviceId = (rule, value, callback) => { // 内容编号验证
      if (/^[A-Fa-f0-9]+$/.test(this.filterForm.deviceId)) {
        callback()
      } else {
        this.$message.warning('设备ID为0123456789ABCDEF组合')
      }
    }
    var validateId = (rule, value, callback) => {
      let flag = 0
      if (/^[A-Fa-f0-9]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('设备ID为0123456789ABCDEF组合'))
      }
      for (let i = 0; i < this.testData.length; i++) {
        if (parseInt(this.testData[i].deviceId) === value) {
          flag = 1
          break
        }
      }
      if (flag) {
        callback(new Error('设备ID重复，请重新输入'))
      } else {
        callback()
      }
      callback()
    }
    var editValidateId = (rule, value, callback) => {
      let flag = 0
      if (/^[A-Fa-f0-9]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('设备ID为0123456789ABCDEF组合'))
      }
      for (let i = 0; i < this.testData.length; i++) {
        if (parseInt(this.testData[i].deviceId) === value && !(parseInt(value) === parseInt(this.editForm.deviceId))) {
          flag = 1
          break
        }
      }
      if (flag) {
        callback(new Error('设备ID重复，请重新输入'))
      } else {
        callback()
      }
      callback()
    }
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 0
      },
      filterForm: {
        deviceId: '',
        deviceTypeName: '',
        operatorName: '',
        storageTime: '',
        orderNumber: '',
        currentPage: 1
      },
      batchDeleteForm: {
        orderNumber: ''
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      addForm: {
        deviceId: '',
        deviceTypeId: '',
        operatorName: '',
        orderNumber: ''
      },
      addVisable: false,
      editVisable: false,
      batchDeleteVisable: false,
      editForm: {
        deviceId: '',
        deviceTypeId: '',
        operatorName: '',
        orderNumber: '',
        oldDeviceId: '',
        oldDeviceTypeId: ''
      },
      deleteForm: {
        deviceId: '',
        deviceTypeId: ''
      },
      typeOptions: [],
      list: [],
      states: [],
      sels: [],
      selections: [],
      addRules: { // 弹窗添加设备信息验证规则
        deviceId: [
          { required: true, message: '请填写设备id', trigger: 'blur' },
          { max: 4, message: 'id最多4位', trigger: 'blur' },
          { validator: validateId, trigger: 'blur' }
        ],
        deviceTypeName: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        orderNumber: [
          { required: true, message: '请填写生产订单编号', trigger: 'blur' }
        ]
      },
      editRules: { // 弹窗修改设备信息验证规则
        deviceId: [
          { required: true, message: '请填写设备id', trigger: 'blur' },
          { max: 4, message: 'id最多4位', trigger: 'blur' },
          { validator: editValidateId, trigger: 'blur' }
        ],
        deviceTypeName: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        orderNumber: [
          { required: true, message: '请填写生产订单编号', trigger: 'blur' }
        ]
      },
      batchDeleteRules: { // 弹窗批量删除订单信息验证规则
        orderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 50, message: '订单编号最多50个字', trigger: 'blur' }
        ]
      },
      queryRules: { // 数据筛选
        deviceId: [
          { validator: checkDeviceId, trigger: 'blur' },
          { max: 24, message: '设备ID最多24个字', trigger: 'blur' }
        ]
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
      fileList: [],
      multipleSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
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
    // 点击表格中的“编辑”按钮
    handleEdit (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editForm.oldDeviceId = data.deviceId
      this.editForm.deviceTypeName = data.deviceTypeName
      this.editForm.oldDeviceTypeId = data.deviceTypeId
      this.editForm.deviceId = row.deviceId
      this.editForm.deviceTypeId = data.deviceTypeId
      this.editForm.orderNumber = row.orderNumber
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.deviceId = data.deviceId
      this.deleteForm.deviceTypeId = data.deviceTypeId
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
    // 批量删除设备订单信息，点击“确定”
    submitBatchDelete () {
      this.$refs['batchDeleteForm'].validate((valid) => {
        if (valid) {
          this.deleteDeviceByListFro()
        } else {
          return false
        }
      })
    },
    // 下拉列表,已存在的设备类型
    remoteMethod (query) {
      if (query !== '') {
        api.getDeviceTypeID({}).then(res => {
          this.filterFormFro.tableData = []
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
    // 批量导入
    uploadDeviceFro () {
      this.loading = true
      let file = this.$refs['uploadExc'].uploadFiles[0].raw
      let para = new FormData()
      para.append('files', file)
      para.append('username', sessionStorage.getItem('username'))
      para.append('accountId', sessionStorage.getItem('accountId'))
      // 测试修改，暂定
      apiFile.uploadDevice(para).then(res => {
        this.loading = false
        this.$refs['uploadExc'].clearFiles()
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}) // 表示xlsx类型
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = '设备批量导入结果.xlsx' // 下载后文件名
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
     // excel文件上传前进行检验格式
    beforeUploadExc (file) {
      const isExcel = (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      if (!isExcel) {
        this.$message.warning('批量导入文件类型应为.xlsx或.xls')
      }
      return isExcel
      //  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    // 文件上传时
    onProgress (event, file, fileList) {
      this.loading = true
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 硬件信息-查询所有设备类型信息
    getDeviceTypeName (form) {
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (this[form].deviceTypeName === this.typeOptions[i].deviceTypeName) {
          this[form].deviceTypeId = this.typeOptions[i].deviceTypeId
          break
        }
      }
    },
    // 硬件信息-查询设备信息
    getDeviceFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        deviceTypeName: this.filterForm.deviceTypeName,
        operatorName: this.username,
        orderNumber: this.filterForm.orderNumber
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.deviceId && this.filterForm.deviceId !== '') {
        para.deviceId = this.filterForm.deviceId
      } else {
        para.deviceId = null
      }
      para.pageNum = this.filterForm.currentPage
      if (this.filterForm.storageTime && this.filterForm.storageTime.length > 0) {
        para.startDate = this.formatDayFro(this.filterForm.storageTime[0])
        para.endDate = this.formatDayFro(this.filterForm.storageTime[1])
      }
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
              this.filterFormFro.tableData[i].storageTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].storageTime))
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
    // 硬件信息-增加设备信息
    addDeviceFro () {
      let para = {
        deviceId: this.addForm.deviceId,
        deviceTypeId: parseInt(this.addForm.deviceTypeId),
        deviceTypeName: this.addForm.deviceTypeName,
        operatorId: parseInt(this.userId),
        operatorName: this.username,
        orderNumber: this.addForm.orderNumber
      }
      api.addDevice(para).then(res => {
        if (res.result === 1000) {
          this.addVisable = false
          this.$message.success('添加设备信息成功')
          this.getDeviceFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.addVisable = false
        this.$message.error(error)
      })
    },
    // 硬件信息-编辑设备信息
    editDeviceFro () {
      let para = {
        deviceId: this.editForm.deviceId,
        deviceTypeId: parseInt(this.editForm.deviceTypeId),
        deviceTypeName: this.editForm.deviceTypeName,
        operatorId: parseInt(this.userId),
        operatorName: this.username,
        orderNumber: this.editForm.orderNumber,
        oldDeviceTypeId: parseInt(this.editForm.oldDeviceTypeId),
        oldDeviceId: this.editForm.oldDeviceId
      }
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
    // 硬件信息-删除设备信息
    deleteDeviceFro () {
      let para = {
        deviceId: this.deleteForm.deviceId,
        deviceTypeId: parseInt(this.deleteForm.deviceTypeId)
      }
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
    },
    // 硬件信息-批量删除设备信息
    deleteDeviceByListFro () {
      let para = {
        orderNumber: this.batchDeleteForm.orderNumber
      }
      api.deleteDeviceByList(para).then(res => {
        if (res.result === 1000) {
          this.batchDeleteVisable = false
          this.$message.success('成功删除订单编号为【' + para.orderNumber + '】的设备信息')
          this.getDeviceFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      })
      .catch(error => {
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
