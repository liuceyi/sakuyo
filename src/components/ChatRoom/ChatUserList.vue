<template>
  <div class="list-container">
    <el-row class="user" v-for="(user, key) in users" :key="key">
      <el-col :span="6" class="avatar-container">
        <img class="avatar" />
      </el-col>
      <el-col :span="18" class="nickname-container">
        <span class="nickname">{{user.nickname}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name:'ChatUserList',
  data() {
    return {
      users: [
        {nickname:'Sakuyo'},
        {nickname:'Sauyo'},
        {nickname:'Sakuo'},
        {nickname:'Sakuo'},
        {nickname:'Sakuy'}
      ]
    }
  }
}
</script>

<style scoped>
  .list-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 10px;
  }

  .list-container .user {
    width: 100%;
    height: 30px;
  }

  .user:hover {
    cursor: pointer;
  }

  .user .avatar-container {
    display: flex;
    justify-content: right;
    align-items: center;
  }

  .avatar-container .avatar {
    width: 20px;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #B0C4DE;
    margin-right: 5px;
  }

  .user .nickname-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .nickname-container .nickname {
    min-width: 40px;
    font-size: 15px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5F9EA0;
  }

  .user:hover .nickname {
    color: #ADD8E6;
  }
</style>