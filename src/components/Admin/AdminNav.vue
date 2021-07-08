<template>
  <div>
  	<el-menu
	  default-active="1"
	  class="el-menu-demo"
	  mode="horizontal"
	  @select="handleSelect"
	  background-color="#545c64"
	  text-color="#fff"
	  active-text-color="#ffd04b"
	  router>
    	<el-submenu index="/AdminPage">
      <template v-slot:title>订单管理</template>
      <el-menu-item index="/AdminPage/AdminView">待处理订单<el-badge class="mark" :value="this.value" /></el-menu-item>
      <el-menu-item index="/AdminPage/AdminOld">历史订单</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">客户通道</el-menu-item>
      <el-menu-item index="/AdminPage/AdminEdit">房型管理</el-menu-item>
    </el-menu>

  </div>
</template>

<script>

export default {
  name: 'AdminNav',
  props:{
    value:Number
  },
  data(){
  },
  methods: {
	handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

.background--room {
  background: #f6f6f6;
}
.mark{
  margin-left: 5px;
}




</style>