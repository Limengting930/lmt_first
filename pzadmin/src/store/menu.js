const localData = localStorage.getItem('pz_v3pz')//

const state = localData ? localData.menu:{
    isCollapse: false, //用来表示菜单是否被折叠，初始值是 false，表示菜单默认没有折叠。
    selectMenu:[],//是一个空数组，用来存储当前选中的菜单项。
    routerList:[],//存储动态加载的路由列表
    menuActive:'1-1'//用来存储当前选中的菜单项，初始值是 1-1，表示默认选中了第一项。
}
//实现状态转换
const mutations = {
    collapseMenu(state){
        state.isCollapse = !state.isCollapse
    }, //这个 mutation 用来切换 isCollapse 的状态。
    // 每次调用 collapseMenu，isCollapse 会取反（如果是 false 就变成 true，如果是 true 就变成 false），
    // 也就是说它控制菜单是否折叠。
    addMenu(state,playload){
        //对数据进行去重（可能会重复点击）
        if(state.selectMenu.findIndex(item => item.path === playload.path)===-1){
            state.selectMenu.push(playload)
        }
    }, //payload 是传递给 mutation 的数据,表示用户点击的菜单项的数据
    closeMenu(state,playload){
        //根据传入的参数，删除数组中的元素
        //找到点击数据的索引
        const index=state.selectMenu.findIndex(val =>val.name === playload.name)
        //通过索引删除指定元素
        state.selectMenu.splice(index,1)
    },
    dynamicMenu(state,playload){
        
        //通过glob导入文件
        const modules=import.meta.glob('../views/**/*.vue')
        console.log(modules)
        function routerSet(router){
            router.forEach(route =>{
                 //判断没有子菜单，拼接路由数据
                if(!route.children) {
                    const url=`../views${route.meta.path}/index.vue`;
                    //拿到获取的vue组件
                    route.component=modules[url]
                }else{
                    routerSet(route.children)
                }
            })
           
        }
        routerSet(playload)
        //拿到完整的路由数据
        state.routerList=playload
    },
    updateMenuActive(state,playload){
        state.menuActive=playload
    }
}
export default {
  state,
  mutations
}//让这个模块可以被其他地方使用