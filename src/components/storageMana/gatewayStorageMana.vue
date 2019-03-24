<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/dianziweilanStorageMana' }">网关库存管理</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='filterMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form v-model="filterForm" ref="filterForm" :inline="true">
          <el-form-item style="float:right"> 
            <el-button type="warning"  @click="addInVisable = true">网关入库</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="success"  @click="addOutVisable = true">网关出库</el-button>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getdianziweilanStorageManaFro()" style="">查询</el-button>
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
            <el-table-column prop="stockNum" label="库存数" min-width="25%">
            </el-table-column>
            <el-table-column prop="idealSockNum" label="理想库存数" min-width="25%">
            </el-table-column>
        </el-table>
      </el-row>
      <!-- 网关入库弹窗 -->
      <el-dialog title="网关入库"  :visible.sync="addInVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addInForm')">
        <el-form :model='addInForm' ref="addInForm" :rules="addInRules">
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px' clearable placeholder="请输入客户名" v-model.trim="addInForm.client"></el-input>
            </el-form-item>
            <el-form-item label="采购数量：" :label-width="formLabelWidth" prop="purchaseNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入采购数量" v-model="addInForm.purchaseNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="purchaseOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model.trim="addInForm.purchaseOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px' type="textarea" :rows="3" clearable placeholder="请输入入库说明" v-model.trim="addInForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAddIn()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 网关出库弹窗 -->
      <el-dialog title="网关出库"  :visible.sync="addOutVisable"
          :closeOnClickModal="false"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          width="550px"
          class="manaDialog"
          @close="resetForm('addOutForm')">
        <el-form :model='addOutForm' ref="addOutForm" :rules="addOutRules">
            <el-form-item label="客户名：" :label-width="formLabelWidth" prop="client">
              <el-input style='width:240px'  clearable placeholder="请输入客户名" v-model.trim="addOutForm.client"></el-input>
            </el-form-item>
            <el-form-item label="出货数量：" :label-width="formLabelWidth" prop="saleNumber">
              <el-input style='width:240px' type="number" clearable placeholder="请输入出货数量" v-model="addOutForm.saleNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" :label-width="formLabelWidth" prop="saleOrderNumber">
              <el-input style='width:240px' clearable placeholder="请输入订单编号" v-model.trim="addOutForm.saleOrderNumber"></el-input>
            </el-form-item>
            <el-form-item label="操作说明：" :label-width="formLabelWidth" prop="operatorMeg">
              <el-input style='width:240px'  type="textarea" :rows="3" clearable placeholder="请输入出库说明" v-model.trim="addOutForm.operatorMeg"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:240px" type="primary" @click="submitAddOut()">保 存</el-button>
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
    }
    this.getdianziweilanStorageManaFro('1')
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
      testData: [],
      filterForm: {
      },
      filterFormFro: {
        tableData: []
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px',
      addInForm: {
        purchaseOrderNumber: '',
        client: '',
        purchaseNumber: '',
        operatorMeg: ''
      },
      addOutForm: {
        purchaseOrderNumber: '',
        client: '',
        purchaseNumber: '',
        operatorMeg: ''
      },
      addInVisable: false,
      addOutVisable: false,
      addInRules: { // 弹窗网关入库信息验证规则
        purchaseNumber: [
          { required: true, message: '请填写采购数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        client: [
          { required: true, message: '请填写客户名称', trigger: 'blur' },
          { max: 20, message: '客户名称最多20个字', trigger: 'blur' }
        ],
        purchaseOrderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最多30个字', trigger: 'blur' }
        ],
        operatorMeg: [
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      },
      addOutRules: { // 弹窗网关出库信息验证规则
        client: [
          { required: true, message: '请填写客户名称', trigger: 'blur' },
          { max: 20, message: '客户名称最多20个字', trigger: 'blur' }
        ],
        saleOrderNumber: [
          { required: true, message: '请填写订单编号', trigger: 'blur' },
          { max: 30, message: '订单编号最多30个字', trigger: 'blur' }
        ],
        saleNumber: [
          { required: true, message: '请填写出货数量', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        operatorMeg: [
          { max: 200, message: '操作说明最多200个字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
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
    // 网关信息入库，点击“保存”
    submitAddIn () {
      this.$refs['addInForm'].validate((valid) => {
        if (valid) {
          this.addIndianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    // 网关信息出库，点击“保存”
    submitAddOut () {
      this.$refs['addOutForm'].validate((valid) => {
        if (valid) {
          this.addOutdianziweilanStorageFro()
        } else {
          return false
        }
      })
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 硬件信息-查询网关信息
    getdianziweilanStorageManaFro () {
      this.loading = true
      let para = {}
      api.getdianziweilanStorageMana(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.result === 1000) {
          let data = res.content
          if (data.list.length > 0) {
            this.$message.success('网关库存信息查询成功')
            this.filterFormFro.tableData = data.list
          } else {
            this.$message.warning('没有查到任何网关库存信息')
          }
        } else {
          this.$message.error(res.data.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    // 网关信息入库
    addIndianziweilanStorageFro () {
      let para = {
        client: this.addInForm.client,
        purchaseNumber: parseInt(this.addInForm.purchaseNumber),
        purchaseOrderNumber: this.addInForm.purchaseOrderNumber,
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username')),
        operatorMeg: this.addInForm.operatorMeg
      }
      api.addIndianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.addInVisable = false
          this.$message.success('网关信息入库成功')
          this.getdianziweilanStorageManaFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 网关信息出库
    addOutdianziweilanStorageFro () {
      let para = {
        client: this.addOutForm.client,
        saleOrderNumber: this.addOutForm.saleOrderNumber,
        saleNumber: parseInt(this.addOutForm.saleNumber),
        accountId: parseInt(sessionStorage.getItem('accountId')),
        operatorName: (sessionStorage.getItem('username')),
        operatorMeg: this.addOutForm.operatorMeg
      }
      api.addOutdianziweilanStorage(para).then(res => {
        if (res.result === 1000) {
          this.addOutVisable = false
          this.$message.success('网关信息出库成功')
          this.getdianziweilanStorageManaFro()
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
