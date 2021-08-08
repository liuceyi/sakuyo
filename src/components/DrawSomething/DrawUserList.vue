<template>
  <div class="user-list-title"><span class="user-list-title__content">玩家列表</span></div>
  <el-row v-for="(user, index) in userList" :key="index" class="user-container" type="flex">
    <el-col :span="4" class="drawing-user">
      <div class="drawing-user__span" v-show="index == drawingUser"></div>
    </el-col>
    <el-col :span="18" class="user-content">
      <el-avatar :src="user.avatar" icon="el-icon-user-solid" class="user-content__avatar"/>
      <span class="user-content__name">{{user.nickname}}</span>
    </el-col>
    <el-col :span="2">
      <span>{{user.score}}</span>
    </el-col>
    
  </el-row>

</template>
<script>
  export default {
    name:'DrawUserList',
    props: {
      userList:Array,
      drawingUser:Number
    }
  }
</script>
<style scoped>
  .user-list-title {
    border-bottom: 1px solid #DCDCDC;
    width: 100%;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-list-title__content {
    font-size: 14px;

  }
  .user-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drawing-user {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drawing-user__span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-image: linear-gradient(to top right, #ff9966, #ff5e62);
  }
  .user-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .user-content__avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    margin-right: 3px;
  }
  .user-content__name {
    cursor: default;
  }
</style>