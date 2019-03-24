import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/dianziweilan/',
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: {allowBack: false}
    },
    {
      path: '/home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {allowBack: false},
      children: [
        {
          path: '/homePage', // 用户组
          component: resolve => require(['../components/HomePage.vue'], resolve)
        },
        {
          name: '/fenceMana',
          path: '/fenceMana', // 围栏管理
          component: resolve => require(['../components/FenceMana.vue'], resolve)
        },
        {
          path: '/fenceCreate', // 围栏创建
          component: resolve => require(['../components/FenceCreate.vue'], resolve)
        },
        {
          path: '/userGroup', // 用户组
          component: resolve => require(['../components/UserGroup.vue'], resolve)
        },
        {
          path: '/deviceMana', // 设备管理
          component: resolve => require(['../components/DeviceMana.vue'], resolve)
        },
        {
          name: '/elecSign',
          path: '/elecSign', // 电子签到
          component: resolve => require(['../components/ElecSign.vue'], resolve)
        },
        {
          name: 'alarmMana', // 报警管理
          path: '/alarmMana',
          component: resolve => require(['../components/AlarmMana.vue'], resolve)
        },
        {
          name: 'elecSignMana', // 电子签到管理
          path: '/elecSignMana',
          component: resolve => require(['../components/ElecSignMana.vue'], resolve)
        },
        {
          name: 'fenceCreateInfo', // 围栏创建-填写具体信息
          path: '/fenceCreateInfo',
          component: resolve => require(['../components/FenceCreateInfo.vue'], resolve)
        },
        {
          name: 'fenceOutCreate', // 围栏创建-填写具体信息
          path: '/fenceOutCreate',
          component: resolve => require(['../components/FenceOutCreate.vue'], resolve)
        },
        // {
        //   name: 'beiyong', // 围栏创建-填写具体信息
        //   path: '/beiyong',
        //   component: resolve => require(['../components/beiyong.vue'], resolve)
        // },
        {
          name: 'fenceInCreate', // 围栏创建-室内电子围栏创建
          path: '/fenceInCreate',
          component: resolve => require(['../components/FenceInCreate.vue'], resolve)
        },
        {
          name: 'createElecSign', // 电子签到管理
          path: '/createElecSign',
          component: resolve => require(['../components/CreateElecSign.vue'], resolve)
        },
        {
          path: '/sysMana', // 用户组
          component: resolve => require(['../components/SysMana.vue'], resolve)
        }
        // {
        //   path: '/hardEquipmentManage', // 设备类管理
        //   component: resolve => require(['../components/hardware/HardEquipmentManage.vue'], resolve)
        // },
        // {
        //   path: '/hardEquipmentManage', // 设备类管理
        //   component: resolve => require(['../components/hardwareMana/HardEquipmentManage.vue'], resolve)
        // },
        // {
        //   path: '/hardEquipmentFunction', // 设备类型功能管理
        //   component: resolve => require(['../components/hardware/HardEquipmentFunction.vue'], resolve)
        // },
        // {
        //   path: '/hardFunctionCode', // 功能码管理
        //   component: resolve => require(['../components/hardware/HardFunctionCode.vue'], resolve)
        // },
        // {
        //   path: '/hardEquipmentType', // 设备类型管理
        //   component: resolve => require(['../components/hardware/HardEquipmentType.vue'], resolve)
        // },
        // {
        //   path: '/dianziweilanUser', // 网关用户管理
        //   component: resolve => require(['../components/userAbout/dianziweilanUser.vue'], resolve)
        // },
        // {
        //   path: '/EquipMentdianziweilan', // 网管设备管理
        //   component: resolve => require(['../components/userAbout/equipMentdianziweilan.vue'], resolve)
        // },
        // {
        //   path: '/Register', // 设备寄存器管理
        //   component: resolve => require(['../components/userAbout/register.vue'], resolve)
        // },
        // {
        //   path: '/dianziweilanAuthorize', // 网关授权用户管理
        //   component: resolve => require(['../components/userAbout/dianziweilanAuthorize.vue'], resolve)
        // },
        // {
        //   path: '/dianziweilanStorageMana', // 库存-网关库存页面
        //   component: resolve => require(['../components/storageMana/dianziweilanStorageMana.vue'], resolve)
        // },
        // {
        //   path: '/dianziweilanStorageInfo', // 库存-网关库存信息页面
        //   component: resolve => require(['../components/storageMana/dianziweilanStorageInfo.vue'], resolve)
        // },
        // {
        //   path: '/DeviceStorageMana', // 库存-设备库存页面
        //   component: resolve => require(['../components/storageMana/deviceStorageMana.vue'], resolve)
        // },
        // {
        //   path: '/DeviceStorageInfo', // 库存-设备库存信息页面
        //   component: resolve => require(['../components/storageMana/deviceStorageInfo.vue'], resolve)
        // }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/login/Login.vue'], resolve)
    }
  ]
})
