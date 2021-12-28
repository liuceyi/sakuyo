<template>
  <div class="chat-room-list-container">
    <el-row class="room-info" v-for="(room, roomKey) in roomList" :key="roomKey" @click="toRoom(room.rid)">
      <el-col :span="20" class="room-content-container">
        <div class="room-title">
          <span class="title" :title="room.title">{{room.title}}</span>
        </div>
        <div class="room-avatars" v-if="room.users.length < maxUsersShow">
          <img class="avatar-item" v-for="(user, key) in room.users" :key="key" src="https://www.sakuyo.cn/backend/data/user/avatar/000001.png" />
        </div>
        <div class="room-avatars" v-else>
          <img class="avatar-item" v-for="(user, key) in room.users.slice(0, maxUsersShow - 1)" :key="key" src="https://www.sakuyo.cn/backend/data/user/avatar/000001.png" />
          <i class="iconfont el-icon-more_ellipsis"></i>
        </div>
      </el-col>
      <el-col :span="4" class="room-link-container">
        <i class="iconfont el-icon-more_discuss" v-if="room.status==0"></i>
        <i class="el-icon-lock" v-else-if="room.status==1"></i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name:'ChatRoomList',
  emits:['to-room'],
  data() {
    return {
      roomList: [
        {title: 'Welcome to Sakuyo Chat!', rid:'1', users:[0, 1, 2, 3], status:0},
        {title: 'Welcome to Mihoko Chat!', rid:'2', users:[0, 1], status:1},
        {title: 'Welcome to Saku Chat!', rid:'3', users:[0, 1, 2, 3], status:1},
        {title: 'Welcome to Sayo Chat!', rid:'4', users:[0, 1, 2], status:0},
        {title: 'Welcome to Sayo Chat!', rid:'4', users:[0, 1, 2], status:0},
        {title: 'Welcome to Sayo Chat!', rid:'4', users:[0, 1, 2], status:0},
        {title: 'Welcome to Sayo Chat!', rid:'4', users:[0, 1, 2], status:0}
      ],
      maxUsersShow: 4,
    }
  },
  methods: {
    toRoom(rid) {
      this.$emit('to-room', rid);
    }
  }
}
</script>
<style scoped>
  .chat-room-list-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .chat-room-list-container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  }
  .chat-room-list-container::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
  }
  .chat-room-list-container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
  }

  .chat-room-list-container .room-info {
    flex-wrap: nowrap;
    width: 100%;
    height: 100px;
    min-height: 100px;
    padding: 0 10px;
    box-shadow: 5px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-bottom: 1px solid #DCDCDC;
  }

  /* .chat-room-list-container .room-info:hover {
    background-color: #DCDCDC;
    opacity: 0.9;
    cursor: pointer;
  } */

  .room-info:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(72,76,97,0) 0%, rgba(72,76,97,0.4) 75%);
    opacity: 0;
    transition: opacity 0.35s, transform 0.35s;
    transform: translateX(50%);
  }

  .room-info:hover:before {
    opacity: 1;
    transform: translateX(0%);
  }

  .room-info:hover .room-link-container i {
    color: white;
  }

  .room-info:hover .room-title .title {
    color: #6A5ACD;
  }

  .room-info .room-content-container {
    min-width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .room-info .room-title {
    margin-top: 10px;
  }

  .room-title .title {
    color: #4682B4;
    max-width: 500px;
    text-align: left;
    height: 40px;
    font-size: 30px;
    line-height: 40px;
    overflow: hidden; 
    text-overflow: ellipsis;
    white-space:nowrap;
    display:block;
  }
  
  .room-content-container .room-avatars {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

  .room-avatars .avatar-item {
    margin: 0 2px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
    z-index: 2;
  }

  .room-avatars .avatar-item:hover {
    margin-top: 3px;
  }

  .room-avatars i {
    font-size: 30px;
    height: 40px;
  }

  .room-info .room-link-container {
    min-width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .room-link-container i {
    font-size: 30px;
    color: #989898;
    z-index: 2;
  }
</style>