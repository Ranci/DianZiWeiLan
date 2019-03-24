<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/deviceStorageMana' }">设备库存管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='filterMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form :inline="true" v-model="filterForm" ref="filterForm">
          <el-form-item label="设备类型：">
            <el-select style='width:240px' v-model="filterForm.deviceTypeName"  filterable placeholder="请输入设备类型">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
           </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="warning"  @click="inVisable = true">设备入库</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="success"  @click="outVisable = true">设备出库</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getDeviceStockFro()" style="">查询</el-button>
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
            <el-table-column prop="stockId" label="库存ID" min-width="20%">
            </el-table-column>
            <el-table-column prop="deviceTypeId" label="设备类型ID" min-width="20%">
            </el-table-column>
            <el-table-column prop="deviceTypeName" label="设备类型名" min-width="20%">
            </el-table-column>
            <el-table-column prop="stockNum" label="库存数" min-width="20%">
            </el-table-column>
            <el-table-column prop="idealSockNum" label="理想库存数" min-width="20%">
            </el-table-column>
        </el-table>
      </el-row>
      <!-- 表格下方分页 -->
      <el-row>
        <div class="pagination" style="text-align:center" v-show="paginationVisible">
            <el-pagination
              @current-change="handleCurrentChange"
              background
              :current-page="filterForm.currentPage"
              :page-size="15"
              layout="total, prev, pager, next, jumper"
              :current-page.sync="filterForm.currentPage">
            </el-pagination>
        </div>
      </el-row>
      <!-- 出库弹窗 -->
      <el-dialog title="设备出库"  :visible.sync="outVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('outForm')">
        <el-form :model='outForm' ref="outForm" :rules="outRules">
            <el-form-item label="设备类型ID" :label-width="formLabelWidth" prop="deviceTypeId">
              <el-input style='width:240px' :disabled="true" clearable placeholder="请输入设备类型ID" v-model="outForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型名：" :label-width="formLabelWidth" prop="deviceTypeName">
              <el-select style='width:240px' v-model="outForm.deviceTypeName"  filterable placeholder="请输入设备类型" @change="getDeviceTypeName('outForm')">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px' clearable placeholder="请输入客户名" v-model="outForm.client"></el-input>
            </el-form-item>
            <el-form-item label="出货数量" :label-width="formLabelWidth" prop="saleNumber">
              <el-input style='width:240px'  @keyup.native="outForm.saleNumber=outForm.saleNumber.replace(/[^0-9]/g, '')" clearable placeholder="输入出货数量" v-model="outForm.saleNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="saleOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model="outForm.saleOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="outForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitOut()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 入库弹窗 -->
      <el-dialog title="设备入库"  :visible.sync="inVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('inForm')">
        <el-form :model='inForm' ref="inForm" :rules="inRules">
            <el-form-item label="设备类型ID" :label-width="formLabelWidth" prop="deviceTypeId">
              <el-input style='width:240px' :disabled="true" clearable placeholder="请输入设备类型ID" v-model="inForm.deviceTypeId"></el-input>
            </el-form-item>
            <el-form-item label="设备类型名：" :label-width="formLabelWidth" prop="deviceTypeName">
             <el-select style='width:240px' v-model="inForm.deviceTypeName"  filterable placeholder="请输入设备类型" @change="getDeviceTypeName('inForm')">
                <el-option v-for="item in typeOptions" :key="item.deviceTypeName" :label="item.deviceTypeName" :value="item.deviceTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px' clearable placeholder="请输入客户名" v-model="inForm.client"></el-input>
            </el-form-item>
            <el-form-item label="采购数量" :label-width="formLabelWidth" prop="purchaseNumber">
              <el-input style='width:240px' @keyup.native="inForm.purchaseNumber=inForm.purchaseNumber.replace(/[^0-9]/g, '')" clearable placeholder="输入采购数量" v-model="inForm.purchaseNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="purchaseOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model="inForm.purchaseOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' clearable placeholder="请输入操作说明" v-model.trim="inForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitIn()">保 存</el-button>
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
      this.$router.push('/login')
      return
    }
    this.getDeviceStockFro()
    this.typeRemoteMethod()
    if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
      self.$router.push('/login')
      return
    } else if (sessionStorage.getItem('username') === 'admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
  },
  data () {
    return {
      testData: [],
      accountId: '',
      operatorName: '',
      filterFormFro: {
        tableData: [],
        totalPage: 3,
        totalCount: 0
      },
      filterForm: {
        deviceTypeName: '',
        currentPage: 1,
        toPage: 1
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      outForm: {
        deviceTypeId: '',
        deviceTypeName: '',
        client: '',
        saleNumber: '',
        saleOrderNumber: '',
        accountId: '',
        operatorName: '',
        operatorMeg: ''
      },
      inForm: {
        deviceTypeId: '',
        deviceTypeName: '',
        client: '',
        purchaseNumber: '',
        purchaseOrderNumber: '',
        accountId: '',
        operatorName: '',
        operatorMeg: ''
      },
      outVisable: false,
      inVisable: false,
      typeOptions: [],
      list: [],
      states: [],
      outRules: { // 设备出库信息验证规则
        deviceTypeName: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
          { required: true, message: '请填写设备类型', trigger: 'blur' },
          { max: 10, message: '设备类型最多10个字', trigger: 'blur' }
        ],
        client: [
          { required: true, message: '请填写客户名', trigger: 'blur' },
          { max: 20, message: '设备类型最多10个字', trigger: 'blur' }
        ],
        purchaseNumber: [
          { required: true, message: '请填写采购数量', trigger: 'blur' }
        ],
        purchaseOrderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最长为30位', trigger: 'blur' }
        ]
      },
      inRules: { // 设备入库信息验证规则
        deviceTypeName: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        client: [
          { required: true, message: '请填写客户名', trigger: 'blur' },
          { max: 20, message: '设备类型最多10个字', trigger: 'blur' }
        ],
        saleNumber: [
          { required: true, message: '请填写出货数量', trigger: 'blur' }
        ],
        saleOrderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最长为30位', trigger: 'blur' }
        ]
      },
      withCredentials: true,
      processing: false,
      importFlag: 1,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    getDeviceTyprName (form) {
      for (let i = 0; i < this.typeOptions.length; i++) {
        if (this[form].deviceTypeName === this.typeOptions[i].deviceTypeName) {
          this[form].deviceTypeId = this.typeOptions[i].deviceTypeId
          break
        }
      }
    },
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getDeviceStockFro()
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
    // 增加出库信息，点击“保存”
    submitOut () {
      this.$refs['outForm'].validate((valid) => {
        if (valid) {
          this.deviceStockOutFro()
        } else {
          return false
        }
      })
    },
    // 增加入库信息，点击“保存”
    submitIn () {
      this.$refs['inForm'].validate((valid) => {
        if (valid) {
          this.deviceStockInFro()
        } else {
          return false
        }
      })
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
          } else {
            this.$message.error(res.content.resultDesp)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
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
    getDeviceStockFro () {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage),
        deviceTypeName: this.filterForm.deviceTypeName
      }
      api.getDeviceStock(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.$message.success('设备库存信息查询成功')
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalPage = data.allPages
            this.filterFormFro.totalCount = data.allCount
            this.filterFormFro.totalPage > 1 ? this.paginationVisible = true : this.paginationVisible = false
            // this.filterFormFro.totalPage > 1 ? this.handleCurrentChange = true : this.handleCurrentChange = false
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何设备库存信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 硬件信息-出库
    deviceStockOutFro () {
      let para = {
        deviceTypeId: parseInt(this.outForm.deviceTypeId),
        deviceTypeName: this.outForm.deviceTypeName,
        client: this.outForm.client,
        saleNumber: parseInt(this.outForm.saleNumber),
        saleOrderNumber: parseInt(this.outForm.saleOrderNumber),
        operatorName: (sessionStorage.getItem('username')),
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorMeg: this.outForm.operatorMeg
      }
      api.deviceStockOut(para).then(res => {
        if (res.result === 1000) {
          this.outVisable = false
          this.$message.success('出库成功')
          this.getDeviceStockFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.outVisable = false
        this.$message.error(error)
      })
    },
    // 设备信息-入库
    deviceStockInFro () {
      let para = {
        deviceTypeId: parseInt(this.inForm.deviceTypeId),
        deviceTypeName: this.inForm.deviceTypeName,
        client: this.inForm.client,
        purchaseNumber: parseInt(this.inForm.purchaseNumber),
        purchaseOrderNumber: this.inForm.purchaseOrderNumber,
        operatorMeg: this.inForm.operatorMeg,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username'))
      }
      api.deviceStockIn(para).then(res => {
        if (res.result === 1000) {
          this.inVisable = false
          this.$message.success('入库成功')
          this.getDeviceStockFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.inVisable = false
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
