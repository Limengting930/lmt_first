<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title">{{props.route.meta.name}}</div>
            <p class="description">{{props.route.meta.describe}}</p>
        </div>
    </div>
</template>

<script setup>
  const props=defineProps({
     route:{
      type:Object
     }
  }) //props 定义了一个名为 route 的属性，类型为 Object。这意味着父组件需要传递一个对象作为 route 的值。
</script>

<style lang="less" scoped>
.panel-heading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;
  .panel-lead {
    font-size: 14px;
    .title {
      font-weight: bold;
      font-style: normal;
    }
    .description {
      margin-top: 5px;
    }
  }
}
</style>