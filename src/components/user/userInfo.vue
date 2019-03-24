<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--数据筛选条件+按钮-->
      <el-row class='subjectMana filterForm' v-bind:style="{width: tableWidth + 'px'}">
        <el-form v-model="filterForm" ref="filterForm" :inline="true">
          <!-- <el-form-item label="用户名：">
            <el-input  v-model.trim="filterForm.username"  clearable style="width:160px"></el-input>
          </el-form-item> -->
          <el-form-item label="手机号码：">
            <el-input v-model="filterForm.phone" type="number" clearable style="width:160px"></el-input>
          </el-form-item>
          <el-form-item style="float:right"> 
            <el-button type="primary" @click="getUserListFro()" style="">查询</el-button>
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
            <el-table-column prop="index" label="序号" sortable min-width="15%">
            </el-table-column>
            <el-table-column prop="nickname" label="用户名" min-width="25%">
            </el-table-column>
            <el-table-column prop="email" label="邮件" min-width="25%">
            </el-table-column>
            <el-table-column prop="phone" label="电话号码" min-width="25%">
            </el-table-column>
            <el-table-column label="操作"  width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handledianziweilan(scope.$index, scope.row)">查看绑定网关</el-button>
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
              :current-page.sync="filterForm.currentPage"
              :page-size="15"
              layout="total, prev, pager, next, jumper"
              :total="filterFormFro.totalCount">
            </el-pagination>
        </div>
      </el-row>
    </div>
</template>
<script>
import api from '../../api/userAbout/api.js'
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    // if (!sessionStorage.getItem('username') || sessionStorage.getItem('username') === '') {
    //   this.$message.info('请先登陆')
    //   this.$router.push('/login')
    //   return
    // }
    this.getUserListFro() // 从后台查询用户列表
  },
  data () {
    return {
      testData: [],
      filterForm: {
        phone: '',
        userId: '',
        username: '',
        currentPage: 1
      },
      filterFormFro: {
        tableData: [],
        totalCount: 1
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      paginationVisible: false, // 表格下方的分页显示
      formLabelWidth: '150px'
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    // 分页页面跳转时
    handleCurrentChange (val) {
      this.filterForm.currentPage = val
      this.getUserListFro(this.filterForm.currentPage)
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
    handledianziweilan (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.$router.push({
        name: 'dianziweilan',
        query: {
          userId: data.userId,
          nickname: data.nickname
        }
      })
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 向后台请求用户列表
    getUserListFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        // username: this.filterForm.username,
        phone: this.filterForm.phone
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      para.pageNum = this.filterForm.currentPage
      api.getUserList(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.data.result === 1000) {
          let data = res.data.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.filterFormFro.tableData = data.list
            this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = parseInt(this.filterForm.currentPage - 1) * para.pageSize + i + 1
            }
          } else {
            this.$message.warning('没有查到任何用户数据')
          }
        } else {
          this.$message.error(res.data.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.tableWidth = document.body.scrollWidth - 259 - 20
  }
}
</script>
