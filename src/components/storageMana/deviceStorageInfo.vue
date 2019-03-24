<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/deviceStorageInfo' }">设备出入库记录</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='filterMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form v-model="filterForm" ref="filterForm" :inline="true">
          <el-form-item label="出入库类型：" label-width="100px">
            <el-select
                @change="changeType" 
                v-model="filterForm.type"
                style='width:120px'
                placeholder="请选择">
              <el-option label="入库" value="1" key="1"></el-option>
              <el-option label="出库" value="0" key="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：" label-width="90px"> 
            <el-date-picker
              v-model="filterForm.storageTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名：">
            <el-input placeholder="请输入客户名" v-model.trim="filterForm.client"></el-input>  
          </el-form-item>
          <el-form-item label="设备类型：" label-width="100px">
            <el-select style='width:120px' v-model="filterForm.deviceTypeId"  filterable placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.deviceTypeId" :label="item.deviceTypeName" :value="item.deviceTypeId">
              </el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="订单号："  label-width="90px">
            <el-input style='width:150px' placeholder="请输入订单号" v-model.trim="filterForm.orderNum"></el-input>  
          </el-form-item>
          <el-form-item label="出货人：">
            <el-input style='width:150px' placeholder="请输入出货人" v-model.trim="filterForm.client"></el-input>  
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getDeviceStorageInfoFro(filterForm.type)" style="">查询</el-button>
          </el-form-item>
          <div style="clear:both"></div>
          <el-form-item v-if="this.filterForm.type==='1'" label="入库总数：" label-width="100px">
            <el-input style='width:100px' v-model="filterFormFro.allPurchaseNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-if="this.filterForm.type==='0'" label="出库总数：" label-width="100px"> 
            <el-input style='width:100px' v-model="filterFormFro.allSaleNum" :disabled="true"></el-input>
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
          v-bind:style="{width: tableWidth + 'px'}">
            <el-table-column  prop="index" label="序号" min-width="15%">
            </el-table-column>
            <el-table-column prop="deviceTypeId"   label="设备类型ID" min-width="20%">
            </el-table-column>
            <el-table-column prop="deviceTypeName"   label="设备类型名" min-width="20%">
            </el-table-column>
            <el-table-column prop="client"   label="客户名" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseNumber"   label="入库数量" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseOrderNumber" label="采购订单号" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseTime"   label="入库时间" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleNumber"   label="出库数量" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleOrderNumber" label="出库订单号" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleTime"   label="出库时间" min-width="20%">
            </el-table-column>
            <!--<el-table-column prop="operatorMeg"   label="操作说明" min-width="20%">
            </el-table-column>-->
            <el-table-column prop="operatorName"   label="操作员姓名" min-width="20%">
            </el-table-column>
            <el-table-column v-if="this.isAdmin" label="操作"  width="240">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  v-if="filterForm.type==='1'"
                  @click="handleEditIn(scope.$index, scope.row)">更新入库记录</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-if="filterForm.type==='0'"
                  @click="handleEditOut(scope.$index, scope.row)">更新出库记录</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, filterForm.type)">删除记录</el-button>
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
      <!-- 设备入库弹窗 -->
      <el-dialog title="更新设备入库信息"  :visible.sync="editInVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('editInForm')">
        <el-form :model='editInForm' ref="editInForm" :rules="editInRules">
             <el-form-item label="出库记录ID：" :label-width="formLabelWidth">
              <label>{{editInForm.purchaseOrderId}}</label>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="purchaseOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model.trim="editInForm.purchaseOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="设备类型ID：" :label-width="formLabelWidth">
              <el-input style='width:240px' :disabled="true" clearable placeholder="请输入设备类型ID" v-model="editInForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型名：" :label-width="formLabelWidth">
              <el-select style='width:240px' v-model="editInForm.deviceTypeName"  filterable placeholder="请输入设备类型" @change="getDeviceTypeName('editInForm')">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth">
               <el-input style='width:240px'  clearable placeholder="请输入客户名" v-model.trim="editInForm.client"></el-input> 
            </el-form-item>
            <el-form-item label="采购数量：" :label-width="formLabelWidth" prop="purchaseNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入采购数量" v-model="editInForm.purchaseNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="editInForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEditIn()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 设备出库弹窗 -->
      <el-dialog title="更新设备出库信息"  :visible.sync="editOutVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"  
          class="manaDialog"
          @close="resetForm('editOutForm')">
        <el-form :model='editOutForm' ref="editOutForm" :rules="editOutRules">
            <el-form-item label="出库记录ID：" :label-width="formLabelWidth">
              <label>{{editOutForm.saleOrderId}}</label>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="saleOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model.trim="editOutForm.saleOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="设备类型ID：" :label-width="formLabelWidth">
              <el-input style='width:240px' :disabled="true" clearable placeholder="请输入设备类型ID" v-model="editOutForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型名：" :label-width="formLabelWidth">
              <el-select style='width:240px' v-model="editOutForm.deviceTypeName"  filterable placeholder="请输入设备类型" @change="getDeviceTypeName('editOutForm')">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
               <el-input style='width:240px' clearable placeholder="请输入客户名" v-model.trim="editOutForm.client"></el-input> 
            </el-form-item>
            <el-form-item label="出货数量：" :label-width="formLabelWidth" prop="saleNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入出货数量" v-model="editOutForm.saleNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="editOutForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEditOut()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除设备出库信息弹窗 -->
      <el-dialog title="删除设备出库库信息"  :visible.sync="deleteOutVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('deleteOutForm')">
        <el-form :model='deleteOutForm' ref="deleteOutForm" :rules="deleteOutRules">
            <el-form-item label="出库记录ID：" :label-width="formLabelWidth">
              <label>{{deleteOutForm.saleOrderId}}</label>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="deleteOutForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitDeleteOut()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除网关入库信息弹窗 -->
      <el-dialog title="删除设备入库库信息"  :visible.sync="deleteInVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('deleteInForm')">
        <el-form :model='deleteInForm' ref="deleteInForm" :rules="deleteInRules">
            <el-form-item label="入库记录ID：" :label-width="formLabelWidth">
              <label>{{deleteInForm.purchaseOrderId}}</label>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="deleteInForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitDeleteIn()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import api from '../../api/apiStorage/api.js'
import apihardWare from '../../api/hardware/api.js'
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
      this.$message.info('请先登陆')
      self.$router.push('/login')
      return
    } else if (sessionStorage.getItem('username') === 'admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
    this.getDeviceStorageInfoFro(this.filterForm.type)
    this.typeRemoteMethod()
  },
  data () {
    var checkNumber = (rule, value, callback) => { // 正整数验证
      if (/^[1-9]\d*$/.test(value)) {
        callback()
      } else {
        callback(new Error('请填写正整数'))
      }
    }
    return {
      isAdmin: false,
      accountId: '',
      operatorName: '',
      testData: [],
      typeOptions: [],
      filterForm: {
        storageTime: '',
        client: '',
        deviceTypeId: '1',
        type: '1',
        currentPage: 1
      },
      filterFormFro: {
        tableData: [],
        totalPage: 3,
        totalCount: 0
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      deleteInForm: {},
      deleteOutForm: {},
      editInForm: {
        deviceTypeId: '',
        deviceTypeName: '',
        client: '', // 客户名
        purchaseNumber: '', // 采购数量
        purchaseOrderNumber: '', // 订单编号
        accountId: '', // 操作员ID
        operatorName: '', // 操作员姓名
        oldPurchaseNumber: '', // 旧的采购数量
        oldDeviceTypeId: '',
        operatorMeg: '', // 操作说明
        purchaseOrderId: ''
      },
      editOutForm: {
        deviceTypeId: '',
        deviceTypeName: '',
        client: '', // 客户名
        saleNumber: '', // 出货数量
        saleOrderNumber: '', // 订单编号
        accountId: '', // 操作员ID
        operatorName: '', // 操作员姓名
        oldDeviceTypeId: '',
        oldSaleNumber: '', // 旧的出货数量
        operatorMeg: '',
        saleOrderId: ''// 操作说明
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
      addInVisable: false,
      addOutVisable: false,
      deleteInVisable: false,
      deleteOutVisable: false,
      editInVisable: false,
      editOutVisable: false,
      editInRules: { // 弹窗设备入库信息验证规则
        purchaseNumber: [
          { required: true, message: '请填写采购数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      editOutRules: { // 弹窗设备出库信息验证规则
        saleOrderNumber: {

        },
        saleNumber: [
          { required: true, message: '请填写出货数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      deleteInRules: { // 弹窗设备删除入库信息验证规则
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      deleteOutRules: { // 弹窗设备删除出库信息验证规则
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getDeviceStorageInfoFro(this.filterForm.type, this.filterForm.currentPage)
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
    // 更新设备信息入库，点击“保存”
    submitEditIn () {
      this.$refs['editInForm'].validate((valid) => {
        if (valid) {
          this.editInDeviceStorageFro()
        } else {
          return false
        }
      })
    },
    // 更新设备信息出库，点击“保存”
    submitEditOut () {
      this.$refs['editOutForm'].validate((valid) => {
        if (valid) {
          this.editOutDeviceStorageFro()
        } else {
          return false
        }
      })
    },
    // 删除设备信息入库，点击“保存”
    submitDeleteIn () {
      this.$refs['deleteInForm'].validate((valid) => {
        if (valid) {
          this.deleteInDeviceStorageFro()
        } else {
          return false
        }
      })
    },
    // 删除设备信息出库，点击“保存”
    submitDeleteOut () {
      this.$refs['deleteOutForm'].validate((valid) => {
        if (valid) {
          this.deleteOutDeviceStorageFro()
        } else {
          return false
        }
      })
    },
    // 点击表格中的“更新入库信息”按钮
    handleEditIn (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editInForm.deviceTypeId = data.deviceTypeId
      this.editInForm.deviceTypeName = data.deviceTypeName
      this.editInForm.client = data.client
      this.editInForm.purchaseNumber = data.purchaseNumber
      this.editInForm.purchaseOrderNumber = data.purchaseOrderNumber
      this.editInForm.purchaseOrderId = data.purchaseOrderId
      this.editInForm.oldPurchaseNumber = data.purchaseNumber
      this.editInForm.oldDeviceTypeId = data.deviceTypeId
      this.editInForm.operatorMeg = data.operatorMeg
      this.editInVisable = true
    },
    // 点击表格中的“更新出库库信息”按钮
    handleEditOut (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editOutForm.deviceTypeId = data.deviceTypeId
      this.editOutForm.deviceTypeName = data.deviceTypeName
      this.editOutForm.client = data.client
      this.editOutForm.saleNumber = data.saleNumber
      this.editOutForm.saleOrderNumber = data.saleOrderNumber
      this.editOutForm.oldSaleNumber = data.saleNumber
      this.editOutForm.oldDeviceTypeId = data.deviceTypeId
      this.editOutForm.saleOrderId = data.saleOrderId
      this.editOutForm.operatorMeg = data.operatorMeg
      this.editOutVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row, type) {
      let data = this.filterFormFro.tableData[index]
      if (type === '1') { // 入库
        this.deleteInForm.purchaseOrderId = data.purchaseOrderId
        this.deleteInVisable = true
      } else {
        this.deleteOutForm.saleOrderId = data.saleOrderId
        this.deleteOutVisable = true
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
    // 下拉框选择更改
    changeType (value) {
      this.getDeviceStorageInfoFro(value)
    },
    // 硬件信息-查询所有设备类型信息
    getDeviceTypeName (form) {
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (this[form].deviceTypeName === this.typeOptions[i].deviceTypeName) {
          this[form].deviceTypeId = this.typeOptions[i].deviceTypeId
          break
        }
      }
    },
    // 查询出入库存信息
    getDeviceStorageInfoFro (type, pageNum) {
      if (this.filterForm.deviceTypeId === '' || !this.filterForm.deviceTypeId) {
        this.$message.info('请先选择设备类型！')
      }
      if (!this.filterForm.type || this.filterForm.type === '') {
        this.$message.info('请先选择出入库类型！')
        return
      }
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        client: this.filterForm.client,
        operatorName: sessionStorage.getItem('username'),
        deviceTypeId: parseInt(this.filterForm.deviceTypeId)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      para.pageNum = this.filterForm.currentPage
      if (this.filterForm.storageTime && this.filterForm.storageTime.length > 0) {
        para.startDate = this.formatDayFro(this.filterForm.storageTime[0])
        para.endDate = this.formatDayFro(this.filterForm.storageTime[1])
      }
      if (type === '1') {
        this.getDeviceStockInFro(para)
      } else if (type === '0') {
        this.getDeviceStockOutFro(para)
      }
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 下拉列表,已存在的设备类型
    typeRemoteMethod (query) {
      if (query !== '') {
        apihardWare.getDeviceTypeID({}).then(res => {
          if (res.result === 1000) {
            let data = res.content
            if (data.list.length > 0) {
              this.typeOptions = data.list
            }
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
    // 从后台查询入库信息
    getDeviceStockInFro (para) {
      api.getDeviceStockIn(para).then(res => {
        this.filterFormFro.tableData = []
        this.filterFormFro.allPurchaseNum = ''
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.$message.success('设备入库记录查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalPage = data.allPages
            this.filterFormFro.totalCount = data.allCount
            data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
            this.filterFormFro.allPurchaseNum = data.allPurchaseNum
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
              this.filterFormFro.tableData[i].purchaseTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].purchaseTime))
              this.filterFormFro.tableData[i].operatorMeg = (data.list[i].addOperatorMeg ? data.list[i].addOperatorMeg : data.list[i].addOperatorMeg = '') + (data.list[i].updateOperatorMeg ? data.list[i].updateOperatorMeg : data.list[i].updateOperatorMeg = '') + (data.list[i].deleteOperatorMeg ? data.list[i].deleteOperatorMeg : data.list[i].deleteOperatorMeg = '')
            }
          } else {
            this.$message.warning('没有查到任何设备入库记录')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 从后台查询出库信息
    getDeviceStockOutFro (para) {
      api.getDeviceStockOut(para).then(res => {
        this.filterFormFro.tableData = []
        this.filterFormFro.allSaleNum = ''
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.$message.success('设备出库记录查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalPage = data.allPages
            this.filterFormFro.totalCount = data.allCount
            this.filterFormFro.allSaleNum = data.allSaleNum
            this.filterFormFro.totalPage > 1 ? this.paginationVisible = true : this.paginationVisible = false
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
              this.filterFormFro.tableData[i].saleTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].saleTime))
              this.filterFormFro.tableData[i].operatorMeg = (data.list[i].addOperatorMeg ? data.list[i].addOperatorMeg : data.list[i].addOperatorMeg = '') + (data.list[i].updateOperatorMeg ? data.list[i].updateOperatorMeg : data.list[i].updateOperatorMeg = '') + (data.list[i].deleteOperatorMeg ? data.list[i].deleteOperatorMeg : data.list[i].deleteOperatorMeg = '')
            }
          } else {
            this.$message.warning('没有查到任何设备出库记录')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 设备信息入库
    editInDeviceStorageFro () {
      let para = {
        client: this.editInForm.client,
        deviceTypeId: parseInt(this.editInForm.deviceTypeId),
        deviceTypeName: this.editInForm.deviceTypeName,
        purchaseNumber: parseInt(this.editInForm.purchaseNumber),
        purchaseOrderNumber: this.editInForm.purchaseOrderNumber,
        purchaseOrderId: this.editInForm.purchaseOrderId,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username')),
        operatorMeg: this.editInForm.operatorMeg,
        oldDeviceTypeId: parseInt(this.editInForm.oldDeviceTypeId),
        oldPurchaseNumber: parseInt(this.editInForm.oldPurchaseNumber)
      }
      api.editInDeviceStorage(para).then(res => {
        if (res.result === 1000) {
          this.editInVisable = false
          this.$message.success('设备信息入库成功')
          this.getDeviceStorageInfoFro('1')
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 设备信息出库
    editOutDeviceStorageFro () {
      let para = {
        client: this.editOutForm.client,
        deviceTypeId: parseInt(this.editOutForm.deviceTypeId),
        deviceTypeName: this.editOutForm.deviceTypeName,
        saleNumber: parseInt(this.editOutForm.saleNumber),
        saleOrderNumber: this.editOutForm.saleOrderNumber,
        saleOrderId: this.editOutForm.saleOrderId,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username')),
        operatorMeg: this.editInForm.operatorMeg,
        oldDeviceTypeId: parseInt(this.editOutForm.oldDeviceTypeId),
        oldSaleNumber: parseInt(this.editOutForm.oldSaleNumber)
      }
      api.editOutDeviceStorage(para).then(res => {
        if (res.result === 1000) {
          this.editOutVisable = false
          this.$message.success('设备信息出库成功')
          this.getDeviceStorageInfoFro('0')
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 删除设备入库记录
    deleteInDeviceStorageFro () {
      let para = {
        purchaseOrderId: this.deleteInForm.purchaseOrderId,
        operatorMeg: this.deleteInForm.operatorMeg
      }
      api.deleteInDeviceStorage(para).then(res => {
        if (res.result === 1000) {
          this.deleteInVisable = false
          this.$message.success('成功删除设备入库记录')
          this.getDeviceStorageInfoFro('1')
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 删除设备出库记录
    deleteOutDeviceStorageFro () {
      let para = {
        saleOrderId: this.deleteOutForm.saleOrderId,
        operatorMeg: this.deleteOutForm.operatorMeg
      }
      api.deleteOutDeviceStorage(para).then(res => {
        if (res.result === 1000) {
          this.deleteOutVisable = false
          this.$message.success('成功删除设备出库记录')
          this.getDeviceStorageInfoFro('0')
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  }
}
</script>
