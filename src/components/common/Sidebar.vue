<template>
  <el-container>
    <el-aside class='sidebarStyle'>
      <div class="sidebar">
        <!--
        defalut-active:当前激活菜单的index
        unique-openeds：是否只保持一个子菜单的展开
        router：是否使用vue-router的模式，启用该模式会在激活导航时以index作为path进行路由跳转
        -->
        <!-- #242f42 #4693a2-->
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router 
          text-color="#fff"
          background-color="#363C52"
          active-text-color="#66CDAA">
          <template v-for="item in getSideItems">
            <template v-if="item.subs">
              <el-submenu :index="item.index" >
                <template slot="title" class='test'>
                  <!-- <i :class="item.icon"></i> -->
                  {{item.title}}
                </template>
                <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" >
                  <i class='subItem.icon'></i>
                  {{subItem.title}}
                </el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.index" class='test'>
                <i :class="item.icon"></i>
                {{item.title}}
              </el-menu-item>
              <!-- <li :index="item.index" class='nosubs-li'>
                <div class='nosubs-div'>
                  <i class='istyle'><img src="../../../static/img/形状-2.png"></img></i>
                  <i class='nosubs-i'></i>
                  {{item.title}}
                </div>
              </li> -->
            </template>
          </template>
        </el-menu>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
  /* eslint-disable quotes */

  import '../../../static/icon/icon.js'
  import '../../../static/font/css/font-awesome.css'
  import Icon from '../../../node_modules/vue-awesome/components/Icon'
  const sideData = require('../../json/origin-sidebar.json')
  export default {
    components: {Icon},
    data: function () {
      return {
        sideItems: sideData,
        scale: 1.7
      }
    },
    methods: {
    },
    computed: {
      getSideItems () {
        // return this.originSideData
        return this.sideItems.mainMana.items
      },
      onRoutes () {
        return this.$route.path.replace('/', '')
      }
    }
  }
</script>

<style scoped>
  .sidebar{
      display: block;
      position: absolute;
      width: 250px;
      left: 0;
      top: 70px;
      bottom:0;
      background: #2E363F;
  }
  .sidebar > ul {
      height:100%;
  }

</style>
<style>
 .sidebarStyle .sidebar {
   width: 219px !important;
   height:100%;
 }
 .sidebarStyle .el-submenu__title {
   background-color: #F2F3F5 !important
 }
 .sidebarStyle .nosubs-li {
  display: list-item;
  margin: 0;
  padding: 0;
  text-align: -webkit-match-parent;
  color:#000000;
 }
 .sidebarStyle .test {
   background-color: #363C52 !important;
   margin-left:2px;
   margin-right:2px;
 }
 .sidebarStyle .nosubs-div {
  font-size: 14px;
  color: #303133;
  -webkit-transition: border-color .3s,background-color .3s,color .3s;
  transition: border-color .3s,background-color .3s,color .3s;
  box-sizing: border-box;
  background-color: #F2F3F5;
  padding-left: 20px; color: rgb(0, 0, 0);
 }
 .sidebarStyle .nosubs-i {
 }
 
 .istyle:
</style>
