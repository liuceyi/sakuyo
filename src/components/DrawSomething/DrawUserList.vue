<template>
  <div class="user-list-title-container"><span class="user-list-title-content">玩家列表</span></div>
  <el-row v-for="(user, index) in userList" :key="index" class="user-container" type="flex">
    <el-col :span="4">
      <div class="drawing-user-span" v-show="index == drawingUser"></div>
    </el-col>
    <el-col :span="20" class="user-content-container">
      <el-avatar :src="user.avatarUrl" class="user-avatar"/>
      <span class="user-name">{{user.name}}</span>
    </el-col>
  </el-row>

</template>
<script>
  export default {
    name:'DrawUserList',
    props: {
      userList:Array,
      drawingUser:Number
    },
    data() {
      return {
        
        
      }
    },
    mounted() {
      
    },
    methods: {
      
    },
    watch: {

    }
  }
</script>
<style scoped>
  .user-list-title-container {
    border-bottom: 1px solid #DCDCDC;
    width: 100%;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-list-title-content {
    font-size: 14px;

  }
  .user-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drawing-user-span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-image: linear-gradient(to top right, #ff9966, #ff5e62);
  }
  .user-content-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .user-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    margin-right: 3px;
  }
  .user-name {

  }
</style>