<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/userGroup' }">用户组管理</el-breadcrumb-item>
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
            <el-input v-model.trim="filterForm.queryContent" prop="queryContent" clearable style="width:220px"></el-input>
           </el-form-item>
           <el-form-item> 
            <el-button type="primary" @click="getUserGroupFro()" style="">查询</el-button>
           </el-form-item>
          <el-form-item> 
            <!-- <el-button type="primary" @click="getCollegeListFro()" style="">查询</el-button> -->
            <el-button type="primary"  @click="addVisable = true" style="margin-right:15px">添加</el-button>
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
            <el-table-column prop="index" label="序号" sortable width="80px">
            </el-table-column>
            <el-table-column prop="groupId" label="组ID" v-if="false">
            </el-table-column>
            <el-table-column prop="groupName" label="组名称" width="200px">
            </el-table-column>
            <el-table-column prop="description" label="描述"  width="200px">
            </el-table-column>
            <el-table-column v-if="false" prop="adminId" label="组管理员ID" width="200px">
            </el-table-column>
            <el-table-column prop="adminName" label="组管理员" width="200px">
            </el-table-column>
            <el-table-column prop="userNum" label="人数" width="200px">
            </el-table-column>
            <el-table-column prop="fenceNum" label="围栏数" width="200px">
            </el-table-column>
            <el-table-column label="管理" width="150px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
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
      <!-- 添加用户组信息弹窗 -->
      <el-dialog title="添加用户组信息"   :visible.sync="addVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('addForm')">
          <el-form :model='addForm' ref="addForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="addForm" ref="addForm">
                <el-form-item label="组名称：">
                  <el-input v-model.trim="addForm.groupName" prop="queryCondition" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                  <el-input v-model.trim="addForm.description" prop="queryContent" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="管理员：">
                  <el-select style='width:240px' v-model="addForm.adminName"  filterable placeholder="请输入管理员姓名" @change="getAdminId('addForm')">
                    <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="addForm.userData" 
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width:'371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px" align="center">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleUserDelete(scope.$index, scope.row, 'addForm', 'userData')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
               <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd('User,addForm')"></el-button></div></el-col>
               <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="paginationVisible">
                    <el-pagination
                      @current-change="((item) => {handleCurrentChange(item, 'addForm,user')})"
                      background
                      :page-size="15"
                      :total="addForm.totalUserCount"
                      layout="prev, slot, next"
                      :current-page.sync="addForm.currentUserPage">
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px">
              <el-col :span="18">
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="addForm.fenceData" 
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width: '371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px">
                    </el-table-column>
                    <el-table-column v-if="false" prop="fenceId" label="围栏ID" width="100px">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="描述"  width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleUserDelete(scope.$index, scope.row, 'addForm', 'fenceData')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd('Fence,addForm')"></el-button></div></el-col>
              <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="paginationVisible">
                    <el-pagination
                      @current-change="((item) => {handleCurrentChange(item, 'addForm,fence')})"
                      background
                      :page-size="15"
                      :total="addForm.totalFenceCount"
                      layout="prev, slot, next"
                      :current-page.sync="addForm.currentFencePage">
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item >
                <el-button style="width:200px; margin-top:50px; margin-left:150px" type="primary" @click="submitAdd()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
       <!-- 编辑用户组信息弹窗 -->
      <el-dialog title="编辑用户组信息"   :visible.sync="editVisable"
          :closeOnClickModal="false" 
          width="550px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
          <el-form :model='editForm' ref="editForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="editForm" ref="editForm">
                <el-form-item label="组名称：">
                  <el-input v-model.trim="editForm.groupName" prop="queryCondition" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                  <el-input v-model.trim="editForm.description" prop="queryContent" clearable style="width:150px"></el-input>
                </el-form-item>
                <el-form-item label="管理员：">
                  <el-select style='width:240px' v-model="editForm.adminName"  filterable placeholder="请输入管理员姓名" @change="getAdminId('editForm')">
                    <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-table
                    :data="editForm.userData" 
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'371px'}">
                    <el-table-column prop="index" label="序号" width="70px" align="center">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px" align="center">
                    </el-table-column>
                    <el-table-column label="管理" width="100px" align="center">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleUserDelete(scope.$index, scope.row, 'editForm', 'userData')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
               <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd('User,editForm')"></el-button></div></el-col>
               <!-- 表格下方分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="userPaginationVisible">
                    <el-pagination
                      @current-change="((item) => {handleCurrentChange(item, 'editForm,user')})"
                      :page-size="5"
                      background
                      :total="editForm.totalUserCount"
                      layout="prev, slot, next"
                      :current-page.sync="editForm.currentUserPage">
                      <div style="margin-top:10px;margin-bottom: 10px;color: #3FAF98">{{this.editForm.currentUserPage}}</div>
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top:20px">
              <el-col :span="18">
                <el-table
                    :data="editForm.fenceData" 
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    tooltip-effect="dark"
                    v-bind:style="{width: '371px'}">
                    <el-table-column prop="index" label="序号" width="70px">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="描述"  width="100px">
                    </el-table-column>
                    <el-table-column label="管理" width="100px">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            icon="el-icon-delete"
                            type="text"
                            style="width: 10px;height: 10px;color:#3FAF98;"
                            @click="handleUserDelete(scope.$index, scope.row, 'editForm', 'fenceData')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="1"><div style=""><el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd('Fence,editForm')"></el-button></div></el-col>
              <!-- 表格右侧分页 -->
              <el-col :span="3">
                <div class="userpagination" style="text-align:center" v-show="fencePaginationVisible">
                    <el-pagination
                      small
                      @current-change="((item) => {handleCurrentChange(item, 'editForm,fence')})"
                      background
                      :page-size="5"
                      :total="editForm.totalFenceCount"
                      layout="prev, slot, next"
                      :current-page.sync="editForm.currentFencePage">
                      <div style="margin-top:10px;margin-bottom: 10px;color: #3FAF98">{{this.editForm.currentFencePage}}</div>
                    </el-pagination>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="" :label-width="formLabelWidth" >
                <el-button style="width:200px; margin-top:50px" type="primary" @click="submitEdit()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
      <!-- 添加用户 -->
      <el-dialog title="添加用户"   :visible.sync="addUser"
          :closeOnClickModal="false" 
          width="300px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('userForm')">
          <el-form :model='userForm' ref="userForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="userForm" ref="userForm">
                <el-form-item>
                  <el-input v-model.trim="userForm.userId" prop="userId" placeholder="用户ID" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model.trim="userForm.userName" prop="userName"  placeholder="用户名" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item> 
                  <el-button type="primary" @click="getAllUserFro()" style="width:60px;height:20px;font-size:12px">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="userForm.userData" 
                    ref="multipleTable"
                    @selection-change="((item) => {handleCurrentChange(item, 'selectUser')})"
                    :border="true"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'251px'}">
                    <el-table-column prop="index" type="selection" label="序号" width="50px" align="center">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户姓名" width="100px" align="center">
                    </el-table-column>
                </el-table>
               <!-- 表格下方分页 -->
                <div class="" style="text-align:center; margin-top: 15px;" v-show="true">
                    <el-pagination
                      @current-change="((item) => {handleCurrentChange(item, 'userForm,user')})"
                      background
                      :page-size="5"
                      :total="userForm.totalUserCount"
                      layout="prev, pager, next"
                      :current-page.sync="userForm.currentUserPage">
                    </el-pagination>
                </div>
            </el-row>
            <el-row>
              <el-form-item>
                <el-button style="width:80px; margin-top:15px; margin-left:95px" type="primary" @click="submitUserAddToGroup()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
      <!-- 添加围栏 -->
      <el-dialog title="添加围栏"   :visible.sync="addFence"
          :closeOnClickModal="false" 
          width="300px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('fenceForm')">
          <el-form :model='fenceForm' ref="fenceForm">
            <!--数据筛选条件+按钮-->
            <el-row>
              <el-form :inline="true" v-model="fenceForm" ref="fenceForm">
                <el-form-item>
                  <el-input v-model.trim="fenceForm.fenceId" prop="fenceId" placeholder="围栏ID" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model.trim="fenceForm.fenceName" prop="fenceName"  placeholder="围栏名称" clearable style="width:80px"></el-input>
                </el-form-item>
                <el-form-item> 
                  <el-button type="primary" @click="getAllFenceFro()" style="width:60px;height:20px;font-size:12px">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
                <el-table
                    :element-loading-text="loadingText"
                    element-loading-spinner="el-icon-loading"
                    :data="fenceForm.fenceData" 
                    ref="multipleTable"
                    @selection-change="((item) => {handleCurrentChange(item, 'selectFence')})"
                    :border="true"
                    class="usertable"
                    style="font-size: 12px;text-align: center; color: #333333;"
                    v-bind:style="{width:'251px'}">
                    <el-table-column prop="index" type="selection" label="序号" width="50px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceId" label="围栏ID" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceName" label="围栏名称" width="100px" align="center">
                    </el-table-column>
                    <el-table-column prop="fenceDes" label="围栏描述" width="100px" align="center">
                    </el-table-column>
                </el-table>
               <!-- 表格下方分页 -->
                <div class="userpagination" style="text-align:center" v-show="true">
                    <el-pagination
                      @current-change="((item) => {handleCurrentChange(item, 'fenceForm,fence')})"
                      background
                      :page-size=5
                      :total="fenceForm.totalFenceCount"
                      layout="prev, pager, next"
                      :current-page.sync="fenceForm.currentFencePage">
                    </el-pagination>
                </div>
            </el-row>
            <el-row>
              <el-form-item label="" :label-width="formLabelWidth" >
                <el-button style="width:80px; margin-top:10px;margin-right:20px" type="primary" @click="submitFenceAddToGroup()">保 存</el-button>
              </el-form-item>
            </el-row>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import userapi from '../api/userAbout/api.js'
import api from '../api/hardware/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    this.getUserGroupFro()
    for (let i = 0; i < 15; i++) {
      this.filterFormFro.tableData.push({
        index: i + 1,
        groupId: i + 1,
        groupName: i + 1,
        description: i + 1,
        adminName: i + 1,
        adminId: i + 1,
        userNum: i + 1,
        fenceNum: i + 1
      })
    }
    for (let i = 0; i < 15; i++) {
      this.editForm.userData.push({
        index: i + 1,
        userId: i + 1,
        userName: i + 1
      })
      this.editForm.fenceData.push({
        index: i + 1,
        fenceId: i + 1,
        fenceName: i + 1,
        fenceDecs: i + 1
      })
      this.userForm.userData.push({
        index: i + 1,
        userId: i + 1,
        userName: i + 1
      })
    }
    // this.getAllUserFro()
    // console.log('!!!!!!!!!!!!!')
  },
  data () {
    return {
      testData: [],
      filterFormFro: {
        tableData: [],
        totalCount: 15
      },
      userForm: {
        userId: '',
        userName: '',
        userData: [],
        totalUserCount: 15,
        currentUserPage: 1
      },
      fenceForm: {
        fenceId: '',
        fenceName: '',
        currentFencePage: 1,
        totalFenceCount: 15,
        fenceData: []
      },
      editForm: {
        userData: [],
        fenceData: [],
        groupId: '',
        groupName: '',
        adminId: '',
        adminName: '',
        currentUserPage: 1,
        currentFencePage: 1,
        totalFenceCount: 15,
        totalUserCount: 15
      },
      addForm: {
        userData: [],
        fenceData: [],
        groupName: '',
        adminId: '',
        adminName: '',
        currentUserPage: 1,
        currentFencePage: 1,
        totalFenceCount: 15,
        totalUserCount: 15
      },
      filterForm: {
        fenceId: '',
        fenceName: '',
        queryCondition: '',
        queryContent: '',
        currentPage: 1
      },
      tableWidth: '', // 表格宽度
      loadingText: '正在拼命加载中，请稍等......',
      loading: false,
      addUser: false,
      addFence: false,
      addVisable: false,
      editVisable: false,
      paginationVisible: true, // 表格下方的分页显示
      userPaginationVisible: true,
      fencePaginationVisible: true,
      formLabelWidth: '150px',
      deleteForm: {
        groupId: ''
      },
      list: [],
      states: [],
      fileList: [],
      userData: [],
      options: [{
        value: '1',
        label: '分组D'
      }, {
        value: '2',
        label: '分组名称'
      }],
      adminOptions: [{
        adminId: 1,
        adminName: '1'
      }, {
        adminId: 2,
        adminName: '2'
      }],
      multipleUserSelection: [],
      multipleFenceSelection: [],
      withCredentials: true,
      processing: false,
      uploadTip: '点击上传',
      formFlag: 0,
      form: '',
      dialogImportVisible: false,
      errorResults: []
    }
  },
  methods: {
    /** ********************************* 页面处理数据格式等函数 ************************************************ */
    /* 合并页面事件 包括 (1)主页面（用户组管理）的分页事件handleCurrentChange
                        (2) 添加用户组弹窗（点击主页面的添加按钮）中的两个表格（用户表和围栏表）的分页事件handleAddFenceCurrentChange 和 handleAddUserCurrentChange
                        （3）编辑用户组弹窗（点击主页面表格中的编辑图标）中的两个表格（用户表和围栏表）的分页事件handleEditFenceCurrentChange 和 handleEditUserCurrentChange
                        (4) 添加用户组和编辑用户组弹窗中的两个子弹窗：添加用户和添加围栏这两个弹窗中的表格多选事件 handleUserSelectionChange 和 handleFenceSelectionChange */
    handleCurrentChange (val, type) {
      let form = type.split(',')[0]
      type = !type.includes('select') ? type.split(',')[1] : type
      switch (type) {
        case 'user':
          this[form].currentUserPage = val
          this.getUserFro(this[form].currentUserPage, form)
          break
        case 'fence':
          this[form].currentFencePage = val
          this.getFenceFro(this[form].currentFencePage, form)
          break
        case 'selectFence':
          this.multipleFenceSelection = val
          break
        case 'selectUser':
          console.log(val)
          this.multipleUserSelection = val
          break
        default:
          this.filterForm.currentPage = val
          this.getUserGroupFro(this.filterForm.currentPage)
          break
      }
    },
    /* 合并两个点击事件（点击添加或编辑弹窗中的“+”），分别处理围栏表单事件和用户表单事件点击后将相应的子弹窗可视符 visible.sync 设置为true的同时初始化子弹窗（添加用户/添加围栏）的表格数据this.getFenceFro(1, 'fenceForm') 和 this.getUserFro(1, 'userForm') ） */
    handleAdd (form) {
      this.multipleUserSelection = []
      this.multipleFenceSelection = []
      form = form.split(',')
      form.includes('Fence') ? this.addFence = Boolean(true | this.getFenceFro(1, 'fenceForm')) : this.addUser = Boolean(true | this.getUserFro(1, 'userForm'))
      this.form = form[1]
      console.log(form)
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
      this.editForm.oldGroupName = data.groupName
      this.editForm.groupId = data.groupId
      this.editForm.description = row.description
      this.editForm.groupName = row.groupName
      this.editForm.adminId = row.adminId
      this.editForm.adminName = row.adminName
      // this.getFenceFro(1)
      // this.getUserFro()
      this.editVisable = true
    },
    // 点击表格中的“删除”按钮
    handleDelete (index, row) {
      let data = this.filterFormFro.tableData[index]
      this.deleteForm.groupId = data.groupId
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserGroupFro()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 合并删除动态增加的元素的四个方法 handleAddFenceDelete handleEditFenceDelete handleAddUserDelete handleEditUserDelete */
    // 点击用户表格中的“删除”按钮
    handleUserDelete (index, row, form, data) {
      this[form][data].splice(index, 1)
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
    // 编辑用户组信息，点击“保存”
    submitUserGroup (form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.editUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 添加用户组信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加用户，点击“保存”
    submitUserAdd () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.editUserGroupFro()
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加新用户到用户组，点击“保存”
    submitUserAddToGroup () {
      console.log(this.form)
      this.$refs[this.form].validate((valid) => {
        if (valid) {
          this.addUserToGroup(this.form)
        } else {
          return false
        }
      })
    },
    // 编辑用户组信息-添加新围栏到用户组，点击“保存”
    submitFenceAddToGroup () {
      this.$refs[this.form].validate((valid) => {
        if (valid) {
          this.addFenceToGroup(this.form)
        } else {
          return false
        }
      })
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
    /* 使用js数组方法替代for循环 */
    getAdminId (form) {
      this[form].adminId = this.adminOptions.find(exist => exist.adminName === this[form].adminName).adminId
    },
    /** ***************************** 向后台发送请求 ***************************************** */
    // 查询用户组信息
    getUserGroupFro (pageNum) {
      this.loading = true
      let para = {
        pageSize: 15,
        pageNum: parseInt(this.filterForm.currentPage)
      }
      pageNum ? this.filterForm.currentPage = pageNum : this.filterForm.currentPage = 1
      if (this.filterForm.queryCondition && this.filterForm.queryContent !== '') {
        if (this.filterForm.queryCondition === '1') {
          para.groupId = parseInt(this.filterForm.queryContent)
        } else {
          para.groupName = this.filterForm.queryContent
        }
      } else {
        para.groupId = null
        para.groupName = null
      }
      userapi.getUserGroup(para).then(res => {
        this.filterFormFro.tableData = []
        this.loading = false
        if (res.data.result === 1000) {
          let data = res.data.content
          data.allPages > 1 ? this.paginationVisible = true : this.paginationVisible = false
          if (data.list.length > 0) {
            this.filterFormFro.tableData = data.list
            // this.filterFormFro.totalCount = data.allCount
            for (let i = 0; i < this.filterFormFro.tableData.length; i++) {
              this.filterFormFro.tableData[i].index = (this.filterForm.currentPage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('没有查到任何用户组信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    },
    /* 合并查询用户组下的用户getUserFro和查询所有用户getAllUserFro */
    // 查询用户组的用户信息
    getUserFro (pageNum, form) {
      let para = {
        pageSize: 15,
        // pageNum: parseInt(this.editForm.currentUserPage),
        userGroupId: this.editForm.userGroupId
      }
      pageNum ? para.pageNum = pageNum : para.pageNum = 1
      console.log(para)
      // userapi.getUser(para).then(res => {
      //   this[form].userData = []
      //   // this.loading = false
      //   if (res.result === 1000) {
      //     let data = res.content
      //     data.allPages > 1 ? this[form].userPaginationVisible = true : this[form].userPaginationVisible = false
      //     if (data.list.length > 0) {
      //       this[form].userData = data.list
      //       this[form].totalUserCount = data.allCount
      //       for (let i = 0; i < this[form].userData.length; i++) {
      //         this.editForm.userData[i].index = i + 1
      //       }
      //     } else {
      //       this.$message.warning('没有查到任何用户信息')
      //     }
      //   } else {
      //     this.$message.error(res.resultDesp)
      //   }
      // }).catch(error => {
      //   this.$message.error(error)
      // })
    },
    // 查询用户组的围栏信息
    /* 围栏管理页面中对围栏进行增删改查后会自动调用查询所有电子围栏的方法进行更新页面，所以在围栏管理页面中缓存电子围栏的数据，保存在sessionStorage中。当前页请求所有围栏的数据是先查看本地缓存中有没有数据，有的话就取出来并在前段做分页，如果没有再发起请求，尽量减少当前页面的http请求 */
    getFenceFro (pageNum, form) {
      let para = {
        pageSize: 5
      }
      if (form === 'fenceForm' && sessionStorage['fenceData']) {
        this[form].fencePaginationVisible = true
        this[form].fenceData = JSON.parse(sessionStorage['fenceData']).slice((pageNum - 1) * para.pageSize, pageNum * para.pageSize)
        return
      }
      pageNum ? para.pageNum = pageNum : para.pageNum = 1
      para.groupName = this[form].groupName
      api.getFence(para).then(res => {
        this[form].fenceData = []
        if (res.result === 1000) {
          let data = res.content
          data.allPages > 1 ? this[form].fencePaginationVisible = true : this[form].fencePaginationVisible = false
          if (data.list.length > 0) {
            this[form].fenceData = data.list
            this[form].totalFenceCount = data.allCount
            for (let i = 0; i < this[form].fenceData.length; i++) {
              this[form].fenceData[i].index = (this[form].currentFencePage - 1) * 15 + i + 1
            }
          } else {
            this.$message.warning('当前尚未有电子围栏')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 编辑用户组信息
    editUserGroupFro () {
      let para = {
        description: this.editForm.description,
        groupName: this.editForm.groupName,
        oldGroupName: this.editForm.oldGroupName,
        groupId: this.editForm.groupId,
        adminId: this.editForm.adminId,
        adminName: this.editForm.adminName,
        fenceSet: [],
        userSet: []
      }
      var fenceName = new Set()
      var userName = new Set()
      for (let i = 0; i < this.editForm.fenceData.length; i++) {
        fenceName.add(this.editForm.fenceData[i].fenceId)
        userName.add(this.editForm.userData[i].userId)
      }
      para.fenceSet = fenceName
      para.userSet = userName
      console.log(para)
      userapi.editUserGroup(para).then(res => {
        if (res.result === 1000) {
          this.editVisable = false
          this.$message.success('编辑用户组信息成功')
          this.getUserGroupFro()
        } else {
          this.$message.warning(res.resultDesp)
        }
      }).catch(error => {
        this.editVisable = false
        this.$message.error(error)
      })
    },
    // 添加用户组信息
    addUserGroupFro () {
      let para = {
        description: this.addForm.description,
        groupName: this.addForm.groupName,
        adminId: parseInt('1'),
        adminName: 'admin',
        fenceSet: [],
        userSet: []
      }
      var fenceName = new Set()
      var userName = new Set()
      for (let i = 0; i < this.addForm.userData.length; i++) {
        userName.add(this.addForm.userData[i].userId)
      }
      for (let i = 0; i < this.addForm.fenceData.length; i++) {
        fenceName.add(this.addForm.fenceData[i].fenceId)
      }
      para.fenceSet = fenceName
      para.userSet = userName
      console.log(para)
      // userapi.addUserGroup(para).then(res => {
      //   if (res.result === 1000) {
      //     this.addVisable = false
      //     this.$message.success('添加用户组信息成功')
      //     this.getUserGroupFro()
      //   } else {
      //     this.$message.warning(res.resultDesp)
      //   }
      // }).catch(error => {
      //   this.editVisable = false
      //   this.$message.error(error)
      // })
    },
    // 添加用户到用户组并刷新弹出框中的用户表格，去重
    /* 去掉双循环，使用数组方法，过滤掉重复元素 */
    addUserToGroup (form) {
      this[form].userData = this[form].userData.concat(this.multipleUserSelection.filter(item => !this[form].userData.find(exist => exist.userId === item.userId)))
      this.multipleUserSelection = []
      this.addUser = false
    },
    // 添加围栏到用户组并刷新弹出框中的用户表格，去重
    /* 去掉双循环，使用数组方法，过滤掉重复元素 */
    addFenceToGroup (form) {
      this[form].fenceData = this[form].fenceData.concat(this.multipleFenceSelection.filter(item => !this[form].fenceData.find(exist => exist.fenceId === item.fenceId)))
      this.multipleFenceSelection = []
      this.addFence = false
    },
    // 硬件信息-删除用户组信息
    deleteUserGroupFro () {
      let para = {
        groupId: parseInt(this.deleteForm.groupId)
      }
      console.log(para)
      userapi.deleteUserGroup(para).then(res => {
        if (res.result === 1000) {
          this.deleteVisable = false
          this.$message.success('删除用户组信息成功')
          this.getUserGroupFro()
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
.usertable .el-button{
  width:40px;
  height:10px;
}
.userpagination{
    margin: 0px;
    /*text-align: right;*/
}
.el-col {
    border-radius: 40px;
  }
</style>
