<template>
    <panel-head :route="route"/>
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)">新建</el-button>
    </div>
    
    <el-table :data="tableData.list" style="width:100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="permissionName" label="菜单权限" width="500"></el-table-column>
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
        <el-form-item v-show="false" prop="id">
            <el-input v-model="form.id" ></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
            <el-tree 
                ref="treeRef"
                style="max-width: 600px;"
                :data="permissionData"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultKeys"
                :default-expanded-keys="[2]"
            />
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
import {ref,reactive, onMounted, nextTick} from 'vue'
import { userGetMenu ,userSetMenu,menuList} from '../../../api'; 
import { Plus, Delete } from "@element-plus/icons-vue";
import {useRoute} from 'vue-router'

const route = useRoute()
//onMounted 生命周期钩子来执行 API 请求，并将返回的数据存储到组件的响应式状态中。
onMounted(() => {
    //菜单数据
    userGetMenu().then(({data}) => {
        console.log(data)
        permissionData.value = data.data
    })
    getListData()
})
//列表数据
const tableData=reactive({
    list:[],
    total:0
})
//打开弹窗
const open = (rowData={}) => {
    dialogFormVisable.value = true
    //弹窗打开 form生成是异步的
    nextTick(() => {
        if(rowData){
            Object.assign(form,{id:rowData.id,name:rowData.name})
            treeRef.value.setCheckedKeys(rowData.permission)
        }
    })
}

const paginationData = reactive({
    pageNum:1,
    pageSize:10
})
//点击页码
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}
//点击当前页
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
//请求列表数据
const getListData = () => {
    menuList(paginationData).then(({data}) => {
        //console.log(data)
        const {list,total} = data.data
        tableData.list = list
        tableData.total = total
    })
}

const formRef = ref()
//form的数据
const form = reactive({
    name:'',
    permissions:'',
    id:''
})
//树形结构菜单权限
const permissionData = ref([])
//弹窗的显示与隐藏
const dialogFormVisable = ref(false)
//关闭弹窗
const beforeClose = () => {
    dialogFormVisable.value = false
    //重置表单
    formRef.value.resetFields()
    //tree选择重置
    treeRef.value.setCheckedKeys(defaultKeys)
}
//选中权限
const defaultKeys = [4,5]
const treeRef = ref()
const rules = reactive({
    name:[
        {required:true,message:'请填写权限名称',trigger:'blur'}
    ]
})
//表单提交
const confirm = async (formEl) => {
    if(!formEl) return
    await formEl.validate((valid, fields) => {
        if(valid){
            //获取到选择的checkbox数据
            const permissions=JSON.stringify(treeRef.value.getCheckedKeys())
            //调用接口
            userSetMenu({
                name:form.name,
                permissions:permissions,
                id:form.id
            }).then(({data}) => {
                console.log(data)
                beforeClose()
                getListData()
            })
        }else{
            console.log('error submit!!',fields)
        }
    })
}
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>