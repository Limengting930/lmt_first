<template>
        <template v-for="(item,index) in props.menuData">
        
          <el-menu-item 
             @click="handleClick(item,`${props.index}-${item.meta.id}`)"
             v-if="!item.children || item.children.length == 0"
             :index="`${props.index}-${item.meta.id}`"
             :key="`${props.index}-${item.meta.id}`">
            <el-icon size="20">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
          </el-menu-item>

          <el-sub-menu v-else: index="`${props.index}-${item.meta.id}`">
            <template #title>
              <el-icon size="20">
                <component :is="item.meta.icon"></component>
              </el-icon>
              <span>{{item.meta.name}}</span>
            </template>
            <!-- 实现递归 -->
            <tree-menu 
               :index="`${props.index}-${item.meta.id}`"
               :menuData="item.children" /> 
          </el-sub-menu>
        </template>     
</template>

<script setup>
import { useRouter } from 'vue-router'
import {useStore} from 'vuex';
const props=defineProps(['menuData'])
//console.log(props,'props')
//创建router实例
const router=useRouter()
//创建store实例
const store=useStore()
//点击菜单
const handleClick=(item,active) => {
  //console.log(item,'item')
  store.commit('addMenu',item.meta) //用来提交一个 mutation
  store.commit('updateMenuActive',active)
  router.push(item.meta.path)
}
</script>

<style scoped>

</style>
