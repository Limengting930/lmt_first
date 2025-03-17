<template>
   <el-menu
        :style="{width: !isCollapse?'200px':'60px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-cotainer"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :default-active="active"
        
      >
      <p class="logo-lg">{{ isCollapse? '小易':'小易陪诊' }}</p>
      <TreeMenu :menuData="menuData"/>
      
      </el-menu>
</template>

<script setup>
import TreeMenu from '../components/treeMenu.vue'
import {useRouter} from 'vue-router'
import { reactive,computed} from 'vue'
import {useStore} from 'vuex'

const router = useRouter()
//const menuData=reactive(router.options.routes[0].children)
//通过 useStore 获取 Vuex 的 store 实例，并使用 computed 来监控 store.state.menu.isCollapse 的值，
// 使得 isCollapse 成为一个响应式属性。当 isCollapse 在 Vuex 中发生变化时，isCollapse 会自动更新，并且组件会重新渲染。
const store=useStore()
const menuData=computed(()=>
     store.state.menu.routerList
)//菜单数据
const isCollapse=computed(()=>
     store.state.menu.isCollapse
)//菜单折叠
const active=computed(()=>
     store.state.menu.menuActive
)//文字高亮

console.log(router,'router')
const handleOpen=()=>{}
const handleClose=()=>{}
</script>

<style lang="less" scoped>
.aside-cotainer{
    height: 100%;
    .logo-lg{
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        height: 50px;
        line-height: 50px;
    }
}
</style>
