<template>
    <panel-head :route="route" />
    <el-table :data="tableData.list" >
        <el-table-column prop="id" label="ID" style="width:5px"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{permissionName(scope.row.permissions_id)}}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active? 'success':'danger'">{{scope.row.active? '正常':'异常'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" >
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 5px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="编辑">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        size="small"
        :background="false"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
        v-model="dialogFormVisable"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
    <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
    >
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="permissions_id">
            <el-select
                v-model="form.permissions_id"
                placeholder="请选择菜单权限"
                style="width:240px"
            >
                <el-option 
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >

                </el-option>

            </el-select>
        </el-form-item>
   </el-form>
   <template #footer>
        <div class="dialog-footer">
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
    </template>
    </el-dialog>
</template>

<script setup>
import {authAdmin,menuSelectList,updateUser} from '../../../api'
import { ref,onMounted, reactive } from 'vue';
import dayjs from 'dayjs'
import {useRoute} from 'vue-router'

const route = useRoute()
console.log(route,'route')

//列表数据
const tableData=reactive({
    list:[],
    total:0
})

const paginationData = reactive({
    pageNum:1,
    pageSize:10
})
//请求列表数据
const getListData = () => {
  authAdmin(paginationData).then(({ data }) => {
    const { list, total } = data.data
    console.log(list,'list')
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })

    tableData.list = list
    tableData.total = total
  })
}
//点击当前页
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

onMounted(() => {
  getListData()
  menuSelectList().then(({ data }) => {
    options.value = data.data
    console.log(options.value,'options.value')
  })
})

//弹窗
const dialogFormVisable = ref(false)
const beforeClose = () => {
    dialogFormVisable.value = false
}
const rules = reactive({
    name:[
        {required:true,message:'请填写昵称',trigger:'blur'}
    ],
    permissions_id:[
        {required:true,message:'请选择菜单权限',trigger:'blur'}
    ]
})
//编辑表单
const formRef = ref()
const form = reactive({
    name:'',
    permissions_id:''
})
//表单提交
const confirm = async(formEl) => {
    if(!formEl) return
    await formEl.validate((valid, fields) => {
        if(valid){
            const {name,permissions_id}=form
            updateUser({name,permissions_id}).then(({data}) => {
                if(data.code === 10000){
                    dialogFormVisable.value = false
                    getListData()
                }
            })
        }else{
            console.log('error submit!!',fields)
        }
    })
}
const options = ref([])
//根据权限id获取权限名称
const permissionName = (id) => {
   const data = options.value.find(el => el.id === id)
   return data ? data.name : '超级管理员'
}
//编辑
const open = (rowData) => {
    dialogFormVisable.value = true
    Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:rowData.permissions_id})
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>