<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>电子签到</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/CreateElecSignMana' }">创建电子签到</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class='addForm'>
        <el-form :model='addForm' label-width="100px" ref="addForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="attendanceName">
              <el-input style='width:240px' clearable placeholder="请输入电子签到名称" v-model="addForm.attendanceName"></el-input>
            </el-form-item>
            <el-form-item label="描述：" :label-width="formLabelWidth" prop="attendanceDescription">
             <el-input style='width:240px' clearable placeholder="请输入签到描述" v-model="addForm.attendanceDescription"></el-input>
            </el-form-item>
            <el-form-item label="用户组：" :label-width="formLabelWidth" prop="groupName">
              <el-select style='width:240px' v-model="addForm.groupName"  filterable placeholder="请输入用户组">
                <el-option v-for="item in groupOptions" :key="item.groupName" :label="item.groupName" :value="item.groupName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电子围栏：" :label-width="formLabelWidth" prop="fenceName">
              <el-select style='width:240px' v-model="addForm.fenceName"  filterable placeholder="请输入电子围栏">
                <el-option v-for="item in fenceOption" :key="item.fenceName" :label="item.fenceName" :value="item.fenceName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间：" :label-width="formLabelWidth" prop="workTime" >
              <div>
              <!-- <div v-for="(item,index) in addForm.workTime" :key="item"> -->
                <el-date-picker
                  v-model="addForm.workTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
                <!-- <el-button type="text" size="mini" icon="el-icon-minus" @click="delet(index)"></el-button>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="add"></el-button> -->
              </div>
            </el-form-item>
            <el-form-item label="管理员：" :label-width="formLabelWidth" prop="attendanceAdmin">
              <div  v-for="(item, index) in adminList" :key="item">
                <!-- <el-input style='width:240px' clearable placeholder="请输入管理员姓名" v-model="adminList[index]"></el-input> -->
              <el-select 
                style='width:240px'
                v-model="adminList[index]" 
                filterable placeholder="请输入管理员姓名">
                <el-option v-for="itemAdmin in adminOptions" :key="itemAdmin.adminId" :label="itemAdmin.adminName" :value="itemAdmin.adminName">
                </el-option>
              </el-select>
              <el-button type="text" size="mini" icon="el-icon-minus" @click="delet(index)"></el-button>
              <el-button type="text" size="mini" icon="el-icon-plus" @click="add"></el-button>
              </div>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:200px" type="primary" @click="submitAdd()">保 存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
import userapi from '../api/userAbout/api.js'
import api from '../api/hardware/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    // this.groupRemoteMethod()
    // this.fenceRemoteMethod()
    this.adminRemoteMethod()
    console.log('111111111111111')
  },
  data () {
    return {
      testData: [],
      addForm: {
        attendanceName: '',
        attendanceDescription: '',
        groupName: '',
        groupId: '',
        phone: '',
        fenceId: '',
        fenceName: '',
        workTime: [],
        workTimeList: {},
        attendanceAdmin: []
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
      loadingText: '正在拼命加载中，请稍等......]',
      loading: false,
      paginationVisible: true, // 表格下方的分页显示
      formLabelWidth: '150px',
      adminList: [''],
      states: [],
      groupOptions: [],
      fenceOptions: [],
      adminOptions: [{
        value: '1',
        adminName: '1'
      }, {
        value: '2',
        adminName: '2'
      }, {
        value: '3',
        adminName: '3'
      }],
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
     // 增加电子签到信息，点击“保存”
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addAttendanceFro()
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
     // 下拉列表,已存在的用户组
    // groupRemoteMethod (query) {
    //   if (query !== '') {
    //     api.getGroup({}).then(res => {
    //       this.filterFormFro.tableData = []
    //       if (res.result === 1000) {
    //         let data = res.content
    //         if (data.list.length > 0) {
    //           this.groupOptions = data.list
    //         }
    //       } else {
    //         this.$message.error(res.resultDesp)
    //       }
    //     }).catch(error => {
    //       this.$message.error(error)
    //     })
    //   }
    // },
     // 下拉列表,已存在的电子围栏
    // fenceRemoteMethod (query) {
    //   if (query !== '') {
    //     api.getFence({}).then(res => {
    //       if (res.result === 1000) {
    //         let data = res.content
    //         if (data.list.length > 0) {
    //           this.fenceOptions = data.list
    //         }
    //       } else {
    //         this.$message.error(res.resultDesp)
    //       }
    //     }).catch(error => {
    //       this.$message.error(error)
    //     })
    //   }
    // },
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
    // 创建电子签到
    addAttendanceFro () {
      let para = {
        attendanceName: this.addForm.attendanceName,
        attendanceDescription: this.addForm.attendanceDescription,
        // fenceName: this.addForm.fenceName,
        fenceName: 'fenceName',
        fenceId: parseInt('1'),
        groupName: 'groupName',
        groupId: parseInt('1'),
        workTimeList: [],
        attendanceAdminList: []
      }
      for (let i = 0; i < this.groupOptions.length; i++) {
        if (this.addForm.groupName === this.groupOptions[i].groupName) {
          para.groupId = parseInt(this.groupOptions[i].groupId)
          break
        }
      }
      for (let i = 0; i < this.fenceOptions.length; i++) {
        if (this.addForm.fenceName === this.fenceOptions[i].fenceName) {
          para.fenceId = parseInt(this.fenceOptions[i].fenceId)
          break
        }
      }
      if (this.addForm.workTime && this.addForm.workTime.length > 0) {
        para.workTimeList.push({
          startDate: this.formatDateFro(this.addForm.workTime[0]),
          endDate: this.formatDateFro(this.addForm.workTime[1]),
          startTime: this.formatTimeFro(this.addForm.workTime[0]),
          endTime: this.formatTimeFro(this.addForm.workTime[1])
        })
      }
      if (this.adminList && this.adminList.length > 0) {
        console.log('2222222222222222')
        for (let i = 0; i < this.adminList.length; i++) {
          para.attendanceAdminList.push({adminId: parseInt(this.adminList[i])})
        }
      }
      console.log(para)
      api.addAttendance(para).then(res => {
        if (res.result === 1000) {
          this.addVisable = false
          this.$message.success('添加电子签到信息成功')
          this.getAttendanceFro()
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.addVisable = false
        this.$message.error(error)
      })
    }
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
.addForm{
  margin-top: 80px;
  margin-left:300px;
}
</style>
