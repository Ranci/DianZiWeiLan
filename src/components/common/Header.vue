<template>
<el-container class='headerStyle'>
  <el-header class="header" style="height:70px">
    <div style="float:left">
      <img src='' style="margin-top:6px"></img>
    </div>
    <div style="float:left;padding-left:10px">
      <span style="font-size:20px">电子围栏管理系统</span>
    </div>
    <!--<div class='close-btn'>
      <span style="font-size:14px" @click="submitLogOut()">退出</span>
    </div>-->
    <div style="float:right;padding-right:20px">             
      <span style="font-size:14px">{{adminName}}</span>
    </div>
    <div style="float:right;padding-right:10px">
      <el-dropdown>
        <span style="float:right;padding-right:10px">
            <img src='../../../static/img/icon-user.png' style="margin-top:25px"></img>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="font-size:14px" @click="submitLogOut()">退出</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="font-size:14px" @click="handleEdit()">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> 
    <div>
      <el-dialog title="修改密码"   :visible.sync="editVisible"
          :closeOnClickModal="false" 
          width="500px"
          class="manaDialog"
          :close-on-click-modal="false" 
          :close-on-press-escape="false"
          @close="resetForm('editForm')">
        <el-form :model='editForm' ref="editForm" :rules="editRules">
            <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
              <el-input style='width:280px' clearable v-model="editForm.password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" >
              <el-button style="width:200px;margin-left: 15px" type="primary" @click="submitEdit()">保 存</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>  
  </el-header>
</el-container>
</template>
<script>
import api from '../../api/userAbout/api.js'
import md5 from 'js-md5'
import '../../../static/css/gateMana/common.css'
import '../../../static/css/gateMana/dianziweilan.css'
export default {
  mounted () {
    this.adminName = sessionStorage.getItem('adminName')
  },
  data () {
    // var editValidate = (rule, value, callback) => {
    //   if (!(this.editForm.checkPass === this.editForm.password)) {
    //     callback(new Error('两次输入密码不一致'))
    //   } else {
    //     callback()
    //   }
    //   callback()
    // }
    return {
      adminName: '',
      editVisible: false,
      testForm: {
        pageNum: 1,
        recordNum: 2
      },
      editForm: {
        password: ''
      },
      personalCenterVisable: false,
      confirmPasswordVisable: false,
      changePasswordVisable: false,
      personalForm: {
        role: '',
        name: '',
        employeeTels: '',
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      rules: {
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      editRules: { // 弹窗修改设备信息验证规则
        password: [
          { required: true, message: '请填写新密码', trigger: 'blur' }
        ]
      },
      formLabelWidth: '25%'
    }
  },
  methods: {
    // 退出登录
    submitLogOut () {
      this.$confirm('确认退出登录么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('adminId')
        sessionStorage.removeItem('adminName')
        this.$router.push('/login')
      }).catch(() => {
        this.$message.warning('退出登陆失败')
      })
    },
    // 点击表格中的“编辑”按钮
    handleEdit () {
      this.editVisible = true
    },
      // 编辑设备信息，点击“保存”
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.chanePwdFro()
        } else {
          return false
        }
      })
    },
    // 硬件信息-编辑设备信息
    chanePwdFro () {
      let para = {
        adminId: this.adminId,
        newPassword: md5(this.editForm.password)
      }
      api.changePwd(para).then(res => {
        if (res.data.result === 1000) {
          this.editVisible = false
          this.$message.success('修改密码成功')
        } else {
          this.$message.warning(res.data.resultDesp)
        }
      }).catch(error => {
        this.editVisible = false
        this.$message.error(error)
      })
    }
  }
}
</script>

<style scoped>
  .close-btn :hover{
    cursor: pointer;
  }
  .close-btn {
    float:right;padding-right:30px
  }
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
    background-color: #3FAF98
  }

  .header .logo {
    float: left;
    width: 250px;
    text-align: center;
  }

  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
  }

  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    cursor: pointer;
    vertical-align: middle;
  }

  .user-info .user-logo {
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

  .el-dialog .el-input {
    width: 80%
  }
</style>
<style>
  .sidebar {
    top:70px !important;
  }
  /* .headerStyle .header-title {
    height: 50px;
    font-size: 20px;
    color: #ffffff;
    margin-top:-10px;
    position: relative;
  } */
  .headerStyle .header-title {
    font-size: 20px;
    color: #ffffff;
    margin-top:-5px;
    width:auto;
  }
</style>
