<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/dianziweilanStorageInfo' }">网关出入库记录</el-breadcrumb-item>
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
                style='width:150px'
                placeholder="请选择">
              <el-option label="入库" value="1" key="1"></el-option>
              <el-option label="出库" value="0" key="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：" label-width="100px"> 
            <el-date-picker
              v-model="filterForm.storageTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              style='width:340px'
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作员：">
            <el-input placeholder="请输入操作员" style='width:150px' v-model.trim="filterForm.operatorName"></el-input>  
          </el-form-item>
          <el-form-item label="订单编号：" label-width="100px">
            <el-input placeholder="请输入订单编号" style='width:150px' v-model.trim="filterForm.orderNumber"></el-input>  
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getdianziweilanStorageInfoFro(filterForm.type)" style="">查询</el-button>
          </el-form-item>
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
            <el-table-column prop="client"  label="客户名" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseNumber"   label="入库数量" min-width="18%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseOrderNumber" label="采购订单编号" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='1'" prop="purchaseTime"   label="入库时间" min-width="24%">4b8ff41631dd6
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleNumber"   label="出库数量" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleOrderNumber" label="出库订单编号" min-width="20%">
            </el-table-column>
            <el-table-column v-if="filterForm.type==='0'" prop="saleTime"   label="出库时间" min-width="24%">
            </el-table-column>
            <el-table-column prop="operatorName"   label="操作员" min-width="20%">
            </el-table-column>
            <el-table-column v-if="this.isAdmin" label="操作"  width="250">
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
      <!-- 网关入库弹窗 -->
      <el-dialog title="更新网关入库信息"  :visible.sync="editInVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('editInForm')">
        <el-form :model='editInForm' ref="editInForm" :rules="editInRules">
            <el-form-item label="采购订单编号：" :label-width="formLabelWidth" prop="purchaseOrderNumber">
              <el-input style='width:240px'  clearable placeholder="采购订单编号" v-model.trim="editInForm.purchaseOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px' clearable placeholder="请输入客户名" v-model.trim="editInForm.client"></el-input>
            </el-form-item>
            <el-form-item label="采购数量：" :label-width="formLabelWidth" prop="purchaseNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入采购数量" v-model="editInForm.purchaseNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' type="textarea" :rows="3" clearable placeholder="请输入操作说明" v-model.trim="editInForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="操作员：" :label-width="formLabelWidth" >
              <label>{{editInForm.operatorName}}</label>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEditIn()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 网关出库弹窗 -->
      <el-dialog title="更新网关出库信息"  :visible.sync="editOutVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('editOutForm')">
        <el-form :model='editOutForm' ref="editOutForm" :rules="editOutRules">
            <el-form-item label="出库订单编号：" :label-width="formLabelWidth" prop='saleOrderNumber'>
              <el-input style='width:240px' v-model="editOutForm.saleOrderNumber" placeholder="请输入出库订单编号"></el-input>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px'  clearable placeholder="请输入客户名" v-model.trim="editOutForm.client"></el-input>
            </el-form-item>
            <el-form-item label="出货数量：" :label-width="formLabelWidth" prop="saleNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入出货数量" v-model="editOutForm.saleNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' type="textarea" :rows="3" clearable placeholder="请输入操作说明" v-model.trim="editOutForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="操作员：" :label-width="formLabelWidth" >
              <label>{{editOutForm.operatorName}}</label>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitEditOut()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除网关出库信息弹窗 -->
      <el-dialog title="删除网关出库信息"  :visible.sync="deleteOutVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('deleteOutForm')">
        <el-form :model='deleteOutForm' ref="deleteOutForm" :rules="deleteInRules">
            <el-form-item label="出库订单编号：" :label-width="formLabelWidth">
              <label>{{deleteOutForm.saleOrderNumber}}</label>
            </el-form-item>
            <el-form-item label="操作员：" :label-width="formLabelWidth">
              <label>{{deleteOutForm.operatorName}}</label>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' type="textarea" :rows="3"  clearable placeholder="请输入操作说明" v-model.trim="deleteOutForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitDeleteOut()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 删除网关入库信息弹窗 -->
      <el-dialog title="删除网关入库信息"  :visible.sync="deleteInVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('deleteInForm')">
        <el-form :model='deleteInForm' ref="deleteInForm" :rules="deleteInRules">
            <el-form-item label="采购订单编号：" :label-width="formLabelWidth">
              <label>{{deleteInForm.purchaseOrderNumber}}</label>
            </el-form-item>
            <el-form-item label="操作员：" :label-width="formLabelWidth">
              <label>{{deleteInForm.operatorName}}</label>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' type="textarea" :rows="3" clearable placeholder="请输入操作说明" v-model.trim="deleteInForm.operatorMeg"></el-input>
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
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
      this.$message.info('请先登陆')
      this.$router.push('/login')
      return
    } else if (sessionStorage.getItem('username') === 'admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
    this.getdianziweilanStorageInfoFro(this.filterForm.type)
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
      filterForm: {
        storageTime: '',
        orderNumber: '',
        operatorName: '',
        toPage: 0,
        type: '1',
        currentPage: 1
      },
      filterFormFro: {
        tableData: [],
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
        client: '', // 客户名
        purchaseNumber: '', // 采购数量
        purchaseOrderNumber: '', // 订单编号
        accountId: '', // 操作员ID
        operatorName: '', // 操作员姓名
        oldPurchaseNumber: '', // 旧的采购数量
        operatorMeg: '' // 操作说明
      },
      editOutForm: {
        client: '', // 客户名
        saleNumber: '', // 出货数量
        saleOrderNumber: '', // 订单编号
        accountId: '', // 操作员ID
        operatorName: '', // 操作员姓名
        oldSaleNumber: '', // 旧的出货数量
        operatorMeg: '' // 操作说明
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
      editInRules: { // 弹窗网关入库信息验证规则
        client: [
          { required: true, message: '请填写客户名', trigger: 'blur' },
          { max: 20, message: '客户名最多20个字', trigger: 'blur' }
        ],
        purchaseNumber: [
          { required: true, message: '请填写采购数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      editOutRules: { // 弹窗网关出库信息验证规则
        client: [
          { required: true, message: '请填写客户名', trigger: 'blur' },
          { max: 20, message: '客户名最多20个字', trigger: 'blur' }
        ],
        saleNumber: [
          { required: true, message: '请填写出货数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      deleteInRules: { // 弹窗网关删除入库信息验证规则
        operatorMeg: [
          { required: true, message: '请填写操作说明', trigger: 'blur' },
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      deleteOutRules: { // 弹窗网关删除出库信息验证规则
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
      this.getdianziweilanStorageInfoFro(this.filterForm.type, this.filterForm.currentPage)
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
    // 更新网关信息入库，点击“保存”
    submitEditIn () {
      this.$refs['editInForm'].validate((valid) => {
        if (valid) {
          this.editIndianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    // 更新网关信息出库，点击“保存”
    submitEditOut () {
      this.$refs['editOutForm'].validate((valid) => {
        if (valid) {
          this.editOutdianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    // 删除网关信息入库，点击“保存”
    submitDeleteIn () {
      this.$refs['deleteInForm'].validate((valid) => {
        if (valid) {
          this.deleteIndianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    // 删除网关信息出库，点击“保存”
    submitDeleteOut () {
      this.$refs['deleteOutForm'].validate((valid) => {
        if (valid) {
          this.deleteOutdianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    // 点击表格中的“更新入库信息”按钮
    handleEditIn (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editInForm.client = data.client
      this.editInForm.purchaseNumber = data.purchaseNumber
      this.editInForm.purchaseOrderNumber = data.purchaseOrderNumber
      this.editInForm.oldPurchaseNumber = data.purchaseNumber
      this.editInForm.purchaseOrderId = data.purchaseOrderId
      this.editInForm.operatorName = data.operatorName
      this.editInVisable = true
    },
    // 点击表格中的“更新入出库信息”按钮
    handleEditOut (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.editOutForm.saleOrderId = data.saleOrderId
      this.editOutForm.client = data.client
      this.editOutForm.saleNumber = data.saleNumber
      this.editOutForm.saleOrderNumber = data.saleOrderNumber
      this.editOutForm.oldSaleNumber = data.saleNumber
      this.editOutForm.operatorName = data.operatorName
      this.editOutVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row, type) {
      let data = this.filterFormFro.tableData[index]
      if (type === '1') { // 入库
        this.deleteInForm.operatorName = data.operatorName
        this.deleteInForm.purchaseOrderId = data.purchaseOrderId
        this.deleteInForm.purchaseOrderNumber = data.purchaseOrderNumber
        this.deleteInForm.saleOrderNumber = data.saleOrderNumber
        this.deleteInVisable = true
      } else {
        this.deleteOutForm.saleOrderId = data.saleOrderId
        this.deleteOutForm.operatorName = data.operatorName
        this.deleteOutForm.saleOrderNumber = data.saleOrderNumber
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
      this.getdianziweilanStorageInfoFro(value)
    },
    // 查询出入库存信息
    getdianziweilanStorageInfoFro (type, pageNum) {
      if (!this.filterForm.type || this.filterForm.type === '') {
        this.$message.info('请先选择出入库类型！')
        return
      }
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        orderNumber: this.filterForm.orderNumber,
        operatorName: this.filterForm.operatorName
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      para.pageNum = this.filterForm.currentPage
      if (this.filterForm.storageTime && this.filterForm.storageTime.length > 0) {
        para.startDate = this.formatDayFro(this.filterForm.storageTime[0])
        para.endDate = this.formatDayFro(this.filterForm.storageTime[1])
      }
      if (type === '1') {
        this.getInStorageInfoFro(para)
      } else if (type === '0') {
        this.getOutStorageInfoFro(para)
      }
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 从后台查询入库信息
    getInStorageInfoFro (para) {
      api.getInStorageInfo(para).then(res => {
        this.filterFormFro.tableData = []
        this.filterFormFro.allPurchaseNum = ''
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.$message.success('网关入库记录查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            this.filterFormFro.allPurchaseNum = data.allPurchaseNum
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * para.pageSize + i + 1
              this.filterFormFro.tableData[i].purchaseTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].purchaseTime))
            }
          } else {
            this.$message.warning('没有查到任何网关入库记录')
          }
        } else {
          this.$message.error(res.data.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 从后台查询出库信息
    getOutStorageInfoFro (para) {
      api.getOutStorageInfo(para).then(res => {
        this.filterFormFro.tableData = []
        this.filterFormFro.allSaleNum = ''
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.$message.success('网关出库记录查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalPage = data.allPages
            this.filterFormFro.allSaleNum = data.allSaleNum
            this.filterFormFro.totalCount = data.allCount
            this.filterFormFro.totalPage > 1 ? this.paginationVisible = true : this.paginationVisible = false
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * para.pageSize + i + 1
              this.filterFormFro.tableData[i].saleTime = this.formatDayFro(new Date(this.filterFormFro.tableData[i].saleTime))
            }
          } else {
            this.$message.warning('没有查到任何网关出库记录')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 网关信息入库
    editIndianziweilanStorageFro () {
      let para = {
        purchaseOrderId: this.editInForm.purchaseOrderId,
        operatorMeg: this.editInForm.operatorMeg,
        client: this.editInForm.client,
        purchaseNumber: parseInt(this.editInForm.purchaseNumber),
        purchaseOrderNumber: this.editInForm.purchaseOrderNumber,
        oldPurchaseNumber: parseInt(this.editInForm.oldPurchaseNumber),
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username'))
      }
      api.editIndianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.editInVisable = false
          this.$message.success('更新入库记录成功')
          this.getdianziweilanStorageInfoFro('1', this.filterForm.currentPage)
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 网关信息出库
    editOutdianziweilanStorageFro () {
      let para = {
        saleOrderId: this.editOutForm.saleOrderId,
        client: this.editOutForm.client,
        saleNumber: parseInt(this.editOutForm.saleNumber),
        oldSaleNumber: parseInt(this.editOutForm.oldSaleNumber),
        saleOrderNumber: this.editOutForm.saleOrderNumber,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username')),
        operatorMeg: this.editOutForm.operatorMeg
      }
      api.editOutdianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.editOutVisable = false
          this.$message.success('更新出库记录成功')
          this.getdianziweilanStorageInfoFro('0', this.filterForm.currentPage)
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 删除网关入库记录
    deleteIndianziweilanStorageFro () {
      let para = {
        purchaseOrderId: this.deleteInForm.purchaseOrderId,
        operatorMeg: this.deleteInForm.operatorMeg
      }
      api.deleteIndianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.deleteInVisable = false
          this.$message.success('成功删除网关入库记录')
          this.getdianziweilanStorageInfoFro('1')
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 删除网关出库记录
    deleteOutdianziweilanStorageFro () {
      let para = {
        saleOrderId: this.deleteOutForm.saleOrderId,
        operatorMeg: this.deleteOutForm.operatorMeg
      }
      api.deleteOutdianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.deleteOutVisable = false
          this.$message.success('成功删除网关出库记录')
          this.getdianziweilanStorageInfoFro('0')
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
