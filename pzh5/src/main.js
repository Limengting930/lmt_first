import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'

const app=createApp(App)
// 挂载路由
app.use(router)
app.mount('#app')
//挂载api,在实例上绑定属性
app.config.globalProperties.$api = api

router.beforeEach((to, from) => {
    if(to.path!=='/login'){
        if(!localStorage.getItem('h5_token')){
            return '/login'
        }
    }
})

//计算首屏的加载时间
window.onload = function () {
    //console.log(performance.timing.domComplete-performance.timing.navigationStart)
    //性能指标 性能监测对象PerformanceObserver
    const observer = new PerformanceObserver((list) =>{
        list.getEntries().forEach(entry => {
            console.log(entry.domComplete)
        }
     )
    })
    observer.observe({
        entryTypes:['navigation']
    })
}