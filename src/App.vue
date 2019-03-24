<template>
  <div id="app">
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
</script>
<style>
  @import "../static/css/main.css";
  @import "../static/css/color-dark.css";   /* 深色主题*!*/
  /* @import "../static/css/theme-green/color-green.css"; /*浅绿色主题*/
  /* @import "../static/css/element-#43A0FF/color-picker.css"; */
</style>
