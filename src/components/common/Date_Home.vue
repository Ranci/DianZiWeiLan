<template id="Date_home">
  <div class="block">
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
    </el-date-picker>
  </div>

  <div class="block">
    <el-date-picker v-model="value2" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      value1: '',
      value2: ''
    }
  }
}
</script>
