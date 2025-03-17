<template>
        <el-row class="login-container" >
            <el-card style="max-width: 800px">
                <template #header>
                    <div class="card-header">
                        <img :src="imgUrl" alt="">
                    </div>
                </template>
                <div class="jump-link">
                    <el-link type="primary" @click="handleChange">{{formType?'返回登陆':'注册账号'}}</el-link>
                </div>
                <el-form
                ref="loginFormref" 
                :model="loginForm"
                :rules="rules"
                 >
                    <el-form-item prop="userName" >
                      <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled"></el-input>
                    </el-form-item>

                    <el-form-item prop="password" >
                      <el-input v-model="loginForm.passWord" type="password" placeholder="密码" prefix-icon="Lock"></el-input>
                    </el-form-item>

                    <el-form-item v-if="formType" prop="validCode" >
                      <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Moon">
                        <template #append>
                          <span @click="countdownChange">{{ countdown.validText }}</span>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" :style="{width: '100%'}" @click="submitForm(loginFormref)">
                        {{ formType?'注册':'登陆' }}
                      </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-row>
</template>

<script setup>
import {ref, reactive,computed,toRaw} from 'vue'
import {getCode, userAuthentication,login,menuPermissions} from '../../api'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import { useStore } from 'vuex'

const imgUrl = new URL('../../../public/login.jpg', import.meta.url).href
//通过接口获取表单数据
const loginForm=reactive({
  userName:'',
  passWord:'',
  validCode:''
})

//切换表单(0登陆 1注册)
const formType = ref(0)
//点击切换登陆和注册
const handleChange = () => {
  formType.value = formType.value? 0 : 1
}
//账号校验规则
const validateUser = (rule, value, callback) => {
  if (!value) {//账号不能为空
    return callback(new Error('请输入手机号'));
  }else{//账号格式要正确
    const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    phoneReg.test(value)?callback():callback(new Error('手机号格式不正确'))
  }
}
//密码校验规则
const validatePass = (rule, value, callback) => {
  if (!value) {//密码不能为空
    callback(new Error('请输入密码'))
  }else{//密码格式要正确
    const reg= /^[a-zA-Z0-9_-]{4,16}$/  //4-16位字母、数字、下划线、减号
    reg.test(value)?callback():callback(new Error('密码格式不正确'))
  }
}
 
//表单验证
const rules = reactive({
  userName:[{validator:validateUser,trigger:'blur'}],
  passWord:[{validator:validatePass,trigger:'blur'}]
})

//发送短信
const countdown=reactive({
  validText:'发送验证码',
  time:60
})
let flag=false
const countdownChange = () => {
  //如果定时器存在，则不执行
  if(flag) return
  //判断手机号是否正确
  const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if(!loginForm.userName || !phoneReg.test(loginForm.userName)){//若当前手机号不存在或格式不正确
    return ElMessage({
    message: '请检查手机号是否正确！',
    type: 'warning',
    })
  }
  //倒计时
  const time = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60;
      countdown.validText = `发送验证码`;
      flag=false
      clearInterval(time)
    } else{
      countdown.time-=1
      countdown.validText = `剩余${countdown.time}s`
    }
  }, 1000);
  flag=true
  //发送验证码
  getCode({tel: loginForm.userName}).then(({data}) => {
    console.log(data,'data')
    if(data.code===10000){
      ElMessage.success('验证码发送成功！')
    }
  })
}
const loginFormref = ref()
const router = useRouter()
const store=useStore()
const routerList=computed(() => store.state.menu.routerList)
//表单提交
const submitForm = async(formEl) => { //async声明一个异步函数
  if (!formEl) return
  //手动触发表单验证
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm,'submit!')
      //注册页面
      if(formType.value){
        userAuthentication(loginForm).then(({data}) => { //then()是 Promise 的方法，用于在异步操作完成后执行回调函数。
          if(data.code===10000){
            ElMessage.success('注册成功！请登录。')
            formType.value=0
          }
        })
      }else{
        //登陆页面
        login(loginForm).then(({data}) => {
          if(data.code===10000){
            ElMessage.success('登陆成功！')
            console.log(data)
            //将token和用户信息缓存到浏览器
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            menuPermissions().then(({data}) => {
              store.commit('dynamicMenu',data.data)
              console.log(routerList,'routerList')
              //将响应式数据转化为普通的路由数据
              toRaw(routerList.value).forEach(item => {
                router.addRoute('main',item)
            })
              router.push('/')
            })
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="less" scoped>
  :deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    display: flex; 
    justify-content: center; 
    align-items: center;
    .card-header{
      background-color: #f7f8fa;
      height: 100%;
      img {
        width: 550px;
        height: 100%;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>