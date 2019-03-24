<template>
  <div class="login-wrap">
    <div class="ms-title">电子围栏管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="用户名" @keyup.enter.native="next()"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.passWord"
                    @keyup.enter.native="submitForm()" ref="password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script>
  // import api from '../../api/login/apiLogin.js'
  // import md5 from 'js-md5'
  export default {
    data: function () {
      return {
        ruleForm: {
          userName: '',
          passWord: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          passWord: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 点击跳转到注册界面
      toRegister () {
        this.$router.push('/register')
      },
      submitForm () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const self = this
            self.$router.push('/HomePage')
//          let para = {
//            password: md5(self.ruleForm.passWord),
//            adminName: self.ruleForm.userName
//          }
//          api.toLogin(para).then(res => {
//            if (res.result === 1000) {
//              sessionStorage.setItem('adminId', res.content.list.adminId)
//              sessionStorage.setItem('adminName', res.content.list.adminName)
//              sessionStorage.setItem('phone', res.content.list.phone)
//              self.$message.success('登录成功！')
//              self.$router.push('/HomePage')
//            } else {
//              self.$message({
//                message: res.resultDesp,
//                type: 'error'
//              })
//            }
//          })
//          .catch(error => {
//            self.$message({
//              message: error,
//              type: 'error'
//            })
//          })
          } else {
            return false
          }
        })
      },
      next () {
        let nextInput = this.$refs['password'].$el.children[0]
        nextInput.focus()
      }
    },
    mounted () {
      // this.getUserInfo()
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #3FAF98;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;

  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
