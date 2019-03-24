<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/HomePage' }">主页</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="6">
            <el-card :body-style="{ padding: '5px' }" shadow="hover" class="card1">
            <!--<img src="~examples/assets/images/hamburger.png" class="image">-->
            <div style="padding: 14px;">
                <span>安全中心</span>
            </div>
            <div style="padding: 14px;" class="security" @click="jumpToAlarm()">
                <span style="margin-left: 60px;">{{todayAlarmNum}}</span>
                <span style="margin-left: 70px;">{{undealAlarmNum}}</span>
            </div>
            <div style="padding: 14px;">
                <span style="margin-left: 50px;">今日警报</span>
                <span style="margin-left: 70px;">未处理警报</span>
            </div>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card :body-style="{ padding: '5px' }" shadow="hover"  class="card2">	
            <!--<img src="~examples/assets/images/hamburger.png" class="image">-->
            <div style="padding: 14px;" class="fence" @click="jumpToFence()">
                <span class="fontIcon1"><i class="fa fa-hashtag fa-lg"></i></span>
                <span style="margin-left: 30px;">{{activeFenceNum}}</span>
                <span>/</span>
                <span>{{allFenceNum}}</span>
            </div>
            <div style="margin-left: 20px;">
                <span style="margin-left: 70px;">活跃电子围栏/总电子围栏</span>
            </div>
            </el-card>
            <el-card :body-style="{ padding: '5px' }" shadow="hover" class="card3">
            <!--<img src="~examples/assets/images/hamburger.png" class="image">-->
            <div style="padding: 14px;" class="sign" @click="jumpToSign()">
                <span class="fontIcon2"><i class="el-icon-date"></i></span>
                <span style="margin-left: 30px;">{{activeAtendanceNum}}</span>
                <span>/</span>
                <span>{{allAtendanceNum}}</span>
            </div>
            <div style="margin-left: 80px;">
                <span>活跃电子签到/总电子签到</span>
            </div>
            </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import api from '../api/hardware/api.js'
import 'vue-awesome/icons'
import '../../static/font/css/font-awesome.css'
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  created () {
    console.log('!!!!!!!!!!!!!')
    this.getInfo()
    // this.getRoleFro()
  },
  data () {
    return {
      undealAlarmNum: '2',
      todayAlarmNum: '4',
      activeFenceNum: '15',
      allFenceNum: '89',
      activeAtendanceNum: '12',
      allAtendanceNum: '20'
    }
  },
  methods: {
    jumpToAlarm () {
      this.$router.push({
        name: 'alarmMana'
      })
    },
    jumpToFence () {
      this.$router.push({
        name: 'fenceMana'
      })
    },
    jumpToSign () {
      this.$router.push({
        name: 'elecSign'
      })
    },
    getInfo () {
      api.getHomePage().then(res => {
        if (res.data.result === 1000) {
          let data = res.data.content
          if (data.list.length > 0) {
            this.todayAlarmNum = data.list.todayAlarmNum
            this.undealAlarmNum = data.list.undealAlarmNum
            this.activeFenceNum = data.list.activeFenceNum
            this.allFenceNum = data.list.allFenceNum
            this.activeAtendanceNum = data.list.activeAtendanceNum
            this.allAtendanceNum = data.list.allAtendanceNum
          } else {
            this.$message.warning('没有查到任何信息')
          }
        } else {
          this.$message.error(res.resultDesp)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(error)
      })
    }
  }
}
</script>
<style>
.hide-dialog{
  display:none;
}
.el-col{
  margin-top: 10px;
  margin-bottom: 0px;
  margin-left:75px;
}
.card1{
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: #fff;
  text-align: left;
  font-size: 12px;
  width:320px;
  height:180px;
}
.card2{
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: #fff;
  text-align: center;
  font-size: 12px;
  width:400px;
  height:120px;
}
.card3{
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: #fff;
  text-align: center;
  font-size: 12px;
  width:400px;
  height:120px;
}
.security{
  font-size: 60px;
  font-weight: 100;
  color: red;
}
.sign{
  font-size: 45px;
  font-weight: 100;
  color: #E6A23C;
}
.fence{
  font-size: 45px;
  font-weight: 100;
  color: #3FAF98;
}
.fontIcon1{
  margin-left: 5px;
  font-size: 35px;
 /* background-color: #3FAF98;*/
  color: #3FAF98;
}
.fontIcon2{
  font-size: 45px;
  /*background-color: #E6A23C;*/
  color: #E6A23C;
}
</style>
