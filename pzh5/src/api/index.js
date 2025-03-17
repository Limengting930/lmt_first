import request from '../utils/request'

//整体暴露
export default{
    //登录
    login(data){
        return request.post('/login',data)
    },
    //首页
    index(){
        return request.get('/Index/index')
    },
    //订单详情
    h5Companion(){
        return request.get('/h5/companion')
    },
    //订单创建
    createOrder(data){
        return request.post('/createOrder',data)
    },
    //订单列表
    orderList(params){
        return request.get('/order/list',{params})
    },
    //订单详情
    orderDetail(params){
        return request.get('/order/detail',{params})
    },
}