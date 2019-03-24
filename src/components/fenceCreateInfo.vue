<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>创建围栏</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/fenceCreateInfo' }">填写基本信息</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class='addForm'>
        <el-form :model='addForm' label-width="100px" ref="addForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="fenceName">
              <el-input style='width:240px' clearable placeholder="请输入名称" v-model="addForm.fenceName"></el-input>
            </el-form-item>
            <el-form-item label="描述：" :label-width="formLabelWidth" prop="fenceDes">
             <el-input style='width:240px' clearable placeholder="请输入描述" v-model="addForm.fenceDes"></el-input>
            </el-form-item>
            <el-form-item label="用户组：" :label-width="formLabelWidth" prop="groupName">
              <el-select style='width:240px' v-model="addForm.groupName"  filterable placeholder="请输入用户组">
                <el-option v-for="item in groupOptions" :key="item.groupName" :label="item.groupName" :value="item.groupName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="触发条件：" :label-width="formLabelWidth" prop="conditionName">
              <span v-for="(item,index) in conditionList" :key="item" style="margin-right: 5px">
              <el-select style='width:150px' v-model="conditionList[index]"  filterable placeholder="请输入触发条件">
                <el-option v-for="item in conditionOptions" :key="item.conditionName" :label="item.conditionName" :value="item.conditionName">
                </el-option>
              </el-select>
              </span>
            </el-form-item>
            <el-form-item label="报警方式：" :label-width="formLabelWidth" prop="alarmName">
              <span v-for="(item,index) in alarmList" :key="item" style="margin-right: 5px">
              <el-select style='width:150px' v-model="alarmList[index]"  filterable placeholder="请输入报警方式">
                <el-option v-for="item in alarmOptions" :key="item.alarmName" :label="item.alarmName" :value="item.alarmName">
                </el-option>
              </el-select>
              </span>
            </el-form-item>
            <el-form-item label="生效时间：" :label-width="formLabelWidth" prop="workTime" >
              <div v-for="(item,index) in workTimeList" :key="item">
                <el-date-picker
                  v-model="workTimeList[index]"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  style="margin-bottom: 5px">
                </el-date-picker>
                <el-button type="text" size="mini" icon="el-icon-minus" @click="deletTime(index)"></el-button>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="addTime"></el-button>
              </div>
            </el-form-item>
            <el-form-item label="管理员：" :label-width="formLabelWidth" prop="adminName">
              <div v-for="(item,index) in adminList" :key="item">
                <el-select style='width:240px' multiple v-model="adminList[index]"  filterable placeholder="请输入管理员姓名">
                  <el-option v-for="item in adminOptions" :key="item.adminName" :label="item.adminName" :value="item.adminName">
                  </el-option>
                </el-select>
                <el-button type="text" size="mini" icon="el-icon-minus" @click="delet(index)"></el-button>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="add"></el-button>
              </div>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:200px" type="primary" @click="submitAdd()">提 交</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
import api from '../api/hardware/api.js'
import userapi from '../api/userAbout/api.js'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    this.points = this.$route.params.shape
    this.groupRemoteMethod()
    this.fenceRemoteMethod()
    this.alarmRemoteMethod()
    this.conditionRemoteMethod()
    console.log('经纬度：')
    console.log(this.points)
  },
  data () {
    return {
      testData: [],
      addForm: {
        fenceName: '',
        fenceDes: '',
        groupName: '',
        groupId: '',
        conditionId: '',
        conditionName: '',
        alarmId: '',
        alarmName: '',
        workTime: [],
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
      list: [],
      states: [],
      points: [],
      adminList: [''],
      alarmList: [''],
      conditionList: [''],
      conditionPara: [],
      alarmPara: [],
      workTimeList: [''],
      groupOptions: [],
      fenceOptions: [],
      adminOptions: [],
      conditionOptions: [],
      alarmOptions: [],
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
          // console.log(this.workTimeList[0][0])
          this.addFenceFro()
        } else {
          return false
        }
      })
    },
    add () {
      let obj = ''
      this.adminList.push(obj)
    },
    delet (index) {
      this.adminList.splice(index, 1)
    },
    addTime () {
      let obj1 = ''
      this.workTimeList.push(obj1)
      let obj2 = ''
      this.alarmList.push(obj2)
      let obj3 = ''
      this.conditionList.push(obj3)
    },
    deletTime (index) {
      this.workTimeList.splice(index, 1)
      this.alarmList.splice(index, 1)
      this.conditionList.splice(index, 1)
    },
    /** ***************************** 向后台发送请求 ***************************************** */
     // 下拉列表,已存在的用户组
    groupRemoteMethod (query) {
      if (query !== '') {
        userapi.getAllUserGroup({}).then(res => {
          if (res.data.result === 1000) {
            let data = res.data.content
            if (data.list.length > 0) {
              this.groupOptions = data.list
            }
          }
        })
      }
    },
     // 下拉列表,已存在的电子围栏
    fenceRemoteMethod (query) {
      let para = {
        pageSize: 1000,
        pageNum: 1
      }
      if (query !== '') {
        api.getFence(para).then(res => {
          if (res.data.result === 1000) {
            let data = res.data.content
            if (data.list.length > 0) {
              this.fenceOptions = data.list
            }
          }
        })
      }
    },
     // 管理员下拉列表
    adminRemoteMethod (query) {
      if (query !== '') {
        api.getAdmin({}).then(res => {
          if (res.result === 1000) {
            let data = res.content
            if (data.list.length > 0) {
              this.adminOptions = data.list
            }
          }
        })
      }
    },
    // 触发条件下拉列表
    conditionRemoteMethod (query) {
      if (query !== '') {
        api.getAllCondition({}).then(res => {
          if (res.data.result === 1000) {
            let data = res.data.content
            if (data.list.length > 0) {
              this.conditionOptions = data.list
            }
          }
        })
      }
    },
    // 警报下拉列表
    alarmRemoteMethod (query) {
      if (query !== '') {
        api.getAllAlarm({}).then(res => {
          if (res.result === 1000) {
            let data = res.content
            if (data.list.length > 0) {
              this.alarmOptions = data.list
            }
          }
        })
      }
    },
    // 创建电子围栏
    addFenceFro () {
      let para = {
        fenceName: this.addForm.fenceName,
        groupName: '1',
        // groupName: this.addForm.groupName,
        fenceDes: this.addForm.fenceDes,
        groupId: '',
        alarms: [],
        // adminId: parseInt(sessionStorage.getItem('adminId')),
        // adminName: sessionStorage.getItem('adminName'),
        adminId: parseInt('1'),
        adminName: 'admin',
        admins: [],
        buildId: '',
        buildName: '',
        mapName: '',
        floor: '',
        points: this.points
      }
      for (let i = 0; i < this.groupOptions.length; i++) {
        if (this.addForm.groupName === this.groupOptions[i].groupName) {
          para.groupId = parseInt(this.groupOptions[i].groupId)
          break
        }
      }
      // for (let i = 0; i < this.alarmList.length; i++) {
      //   for (let j = 0; i < this.alarmOptions.length; j++) {
      //     if (this.alarmList[i] === this.alarmOptions[j].alarmName) {
      //       this.alarmPara.push({
      //         alarmId: this.alarmOptions[j].alarmId,
      //         alarmName: this.alarmOptions[j].alarmName
      //       })
      //       break
      //     }
      //   }
      for (let i = 0; i < this.alarmList.length; i++) {
        this.alarmPara.push({
          alarmId: parseInt('1'),
          alarmName: 'alarmName'
        })
      }
      for (let i = 0; i < this.conditionList.length; i++) {
        this.conditionPara.push({
          conditionId: parseInt('1'),
          conditionName: 'conditionName'
        })
      }
        // for (let j = 0; i < this.conditionOptions.length; j++) {
        //   if (this.conditionList[i] === this.conditionOptions[j].conditionName) {
        //     this.conditionPara.push({
        //       conditionId: this.conditionOptions[j].conditionId,
        //       conditionName: this.conditionOptions[j].conditionName
        //     })
        //     break
        //   }
        // }
      // for (let i = 0; i < this.fenceOptions.length; i++) {
      //   if (this.addForm.fenceName === this.fenceOptions[i].fenceName) {
      //     para.fenceId = parseInt(this.fenceOptions[i].fenceId)
      //     break
      //   }
      // }
      if (this.workTimeList && this.workTimeList.length > 0) {
        for (let i = 0; i < this.workTimeList.length; i++) {
          para.alarms.push({
            startDate: this.formatDateFro(this.workTimeList[i][0]),
            endDate: this.formatDateFro(this.workTimeList[i][1]),
            startTime: this.formatTimeFro(this.workTimeList[i][0]),
            endTime: this.formatTimeFro(this.workTimeList[i][1]),
            alarmId: parseInt(this.alarmPara[i].alarmId),
            alarmName: this.alarmPara[i].alarmName,
            conditionId: parseInt(this.conditionPara[i].conditionId),
            conditionName: this.conditionPara[i].conditionName
          })
        }
      }
      if (this.adminList && this.adminList.length > 0) {
        for (let i = 0; i < this.adminList.length; i++) {
          // para.admins.push({adminId: parseInt(this.adminList[i])})
          para.admins.push(parseInt('1'))
        }
      }
      console.log(para)
      api.addFence(para).then(res => {
        console.log(res)
        if (res.data.result === 1000) {
          this.addVisable = false
          this.$message.success('添加电子围栏信息成功')
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
