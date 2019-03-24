<template>
   <div style="height:100%;">
      <div class='header-title'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/elecSign' }">电子签到</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <div>
        </div>
        <el-card :body-style="{padding: '0px',height: '75px' }" shadow="hover">
        <!--<img src="~examples/assets/images/hamburger.png" class="image">-->
        <div class="grid-content grid-con-2" @click="jumpToCreate()">
            <i class="el-icon-location-outline grid-con-icon"></i>
            <span class="grid-cont-right">创建电子签到</span>
        </div>
        </el-card>
        <el-card :body-style="{padding: '0px',height: '75px' }" shadow="hover">
        <!--<img src="~examples/assets/images/hamburger.png" class="image">-->
        <div class="grid-content grid-con-2" @click="jumpToMana()">
            <i class="el-icon-edit-outline grid-con-icon"></i>
            <span class="grid-cont-right">电子签到管理</span>
        </div>
        </el-card>
      </el-row>
    </div>
</template>
<script>
import '../../static/css/gateMana/common.css'
import '../../static/css/gateMana/dianziweilan.css'
export default {
  data () {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    jumpToMana () {
      this.$router.push({
        name: 'elecSignMana'
      })
    },
    jumpToCreate () {
      this.$router.push({
        name: 'createElecSign'
      })
    }
  }
}
</script>
<style scoped>
.hide-dialog{
  display:none;
}
.el-row{
  margin-top: 80px;
  margin-bottom: 0px;
  margin-left:385px;
  width:410px;
  height:200px
}
.el-card{
  margin-top: 40px;
  margin-bottom: 30px;
  background-color: #EEEEEE;
  text-align: left;
  font-size: 20px;
}
.grid-content {
        display: flex;
        align-items: center;
        height: 75px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 23px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 40px;
        width: 100px;
        height: 75px;
        text-align: center;
        line-height: 70px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: #3FAF98;
    }
    .grid-con-2 .grid-num {
        color: rgb(100, 213, 114);
    }
    .grid-con-4 .grid-con-icon {
        background: #E6A23C;
    }
    .grid-con-4 .grid-num {
        color: #E6A23C;
    }
    .grid-con-5 .grid-con-icon {
        background: #F56C6C;
    }
    .grid-con-5 .grid-num {
        color: #F56C6C;
    }
    .grid-con-3 .grid-num {
        color: rgb(100, 213, 114);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }
</style>
