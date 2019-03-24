<template>
  <div class="wrapper">
    <v-sidebar></v-sidebar>
    <v-head></v-head>
    <div class='homeStyle'>
    <div class="content" style='padding-left:0'>
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    </div>
  </div>
</template>

<script>
  import vSidebar from './Sidebar.vue'
  import vHead from './Header.vue'
  window.addEventListener('popstate', function (e) {
    console.log('返回事件')
    window.history.forward(1)
    console.log(this)
  }, false)
  export default {
    data: function () {
      return {
        username: ''
      }
    },
    components: {
      vSidebar, vHead
    },
    methods: {
      judgeLogin () {
        /* api.getbranch(this.filterForm)
          .then(res => {
            if (res.headers.islogin) {
              if (res.headers.canRequest) {
              } else {
                alert('权限不足 ')
              }
            } else {
              alert('权限作废,请重新登录')
              this.$router.push('/login')
            }
          })
          .catch(err => {
            console.log('连接失败')
            console.log(err)
          }) */
      },
      getUsername () {
        this.username = sessionStorage.getItem('ms_username')
      }
    },
    mounted () {
      this.getUsername()
      // this.judgeLogin()
    }
  }
</script>
<style>
  .homeStyle .content {
    left:239px;
    padding: 0px;
    top:70px;
  }
</style>
