<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in selectMenu"
                :key="item.path"
                :class="{selected:route.path === item.path}"
                class="tab flex-box">
                <el-icon size="15"><component :is="item.icon" /></el-icon>
                <router-link :to="item.path" class="text flex-box">
                    {{ item.name }}
                </router-link>
                <el-icon size="15" class="close" @click="closeTab(item,index)"><Close /></el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar
                    :src="userInfo.avatar"
                />
                <p class="user-name">
                    {{userInfo.name}}
                </p>
                </div>
                
                <template #dropdown>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

//拿到store
const store = useStore()
//当前的路由对象
const route = useRoute()
const router = useRouter()
const selectMenu = computed(() => store.state.menu.selectMenu)//响应式计算,每当 Vuex 中的 selectMenu 改变时，selectMenu 计算属性会自动更新
//从localStorage读取用户信息
const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))//JSON.parse用于将字符串转换回 JavaScript 对象，以便后续代码可以使用它。

//点击关闭tag
const closeTab = (item,index) => {
    store.commit('closeMenu',item) //触发了一个名为 'closeMenu' 的 mutation
    //删除非当前页
    if(route.path !== item.path){
        return
    }
    const selectMenuData=selectMenu.value//获取当前selectMenu的值
    //删除最后一项
    if(index === selectMenuData.length){
        //如果tags只有一项，则跳转到首页
        if(!selectMenuData.length){
            router.push('/')
        }else{
            router.push(selectMenuData[index-1].path)
        }
    }else{ //如果删除中间位置的tag
        router.push(selectMenuData[index+1].path)
    }

}
const handleClick = (command) => {
    if(command==="cancel"){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')
        //router.push('/login')
        window.location.href = window.location.origin
    }
}

</script>

<style lang="less" scoped>
.flex-box{ //弹性盒子，可以让元素在一行显示
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icon{
            width:45px;
            height: 100%;
        }
        .icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab{
            //padding 用来控制元素内容区域与其边框之间的空间(内)
            padding: 0 10px;//上右下左
            height: 100%;
            .text{
                //margin 用来控制元素与其他元素之间的距离（外）
                margin: 0 5px;//上右下左
            }
            .close{
                visibility: hidden;//默认图标隐藏
            }
            &.selected{
                a{
                    color:#409eff;
                }
                i{
                    color:#409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover{
            background-color: #f5f5f5;
            .close{
                visibility: inherit;
                cursor: pointer;
                color:#000;
            }
        }
    }
    .header-right{
        .user-name{
            margin-left: 10px;
        }
    }
    a{
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>