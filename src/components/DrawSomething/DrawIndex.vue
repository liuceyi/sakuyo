<template>
  <div class="game-title">Draw Something</div>
  <div class="player-num-container">
    <span class="online-span">{{userList.length}}人在线</span>
  </div>
  <el-button class="game-btn create-room-btn" @click="CreateRoom">创建房间</el-button>
  <el-button class="game-btn join-room-btn" @click="toJoin = true" v-if="!toJoin">加入房间</el-button>
  <el-input            
    type="text" 
    v-model="newRoomId" 
    maxlength="20"
    placeholder="请输入房间号"
    :show-word-limit="false" 
    class="join-room-input" 
    v-if="toJoin"
    @keyup.enter="JoinRoom"
    @keyup.esc="toJoin = false">
    <template #append>
      <el-button icon="el-icon-check" class="join-room-input__btn" @click="JoinRoom"></el-button>
    </template>
  </el-input>
</template>
<script>
  export default {
    name:'DrawIndex',
    props: {
      isStart:Boolean,
      cvWidth:Number,
      cvHeight:Number,
      userList:Array
    },
    emits:['create-room', 'join-room', 'game-start'],
    data() {
      return {
        toJoin: false,
        newRoomId:''
      }
    },
    methods: {
      CreateRoom() {
        this.$emit('create-room');
      },
      JoinRoom() {
        this.$emit('join-room', this.newRoomId);
      }
    }
  }
</script>
<style scoped>
  .player-num-container {
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.8;
    margin-bottom: 20px;
    color: white;
  }
  .online-span {

  }

  .game-btn {
    min-height: 30px;
    height: 3rem;
    max-height: 100px;
    min-width: 200px;
    width: 10rem;
    max-width: 500px;
  }

  .create-room-btn {
    background-color: transparent;
    background-image: linear-gradient(to top right, #4568DC, #B06AB3);
    color: white;
    border: 0;
  }
  .create-room-btn:hover {
    filter: hue-rotate(60deg);
  }
  .join-room-btn {
    background-color: transparent;
    background-image: linear-gradient(to top right, #C9D6FF, #E2E2E2);
    color: #303133;
    border: 0;
  }
  .join-room-btn:hover {
    filter: hue-rotate(180deg);
  }

  .game-title {
    font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    text-transform: uppercase;
    font-size: 92px;
   /* color: #f1ebe5;
    text-shadow: 0 8px 9px #c4b59d, 0px -2px 1px #fff;*/
    font-weight: bold;
    letter-spacing: -4px;
    text-align: center;
    border-radius: 20px;
    background-color: transparent;
    background-image: linear-gradient(to right, #f7ff00, #db36a4);
    background-clip: text;
    color: transparent;
    cursor: default;
    animation: flash 3s linear infinite;
  }
  @keyframes flash {
    0% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(60deg); }
    100% { filter: hue-rotate(00deg); }
  }


  .join-room-input {
    min-height: 30px;
    height: 3rem;
    max-height: 100px;
    min-width: 200px;
    width: 10rem;
    max-width: 500px;
    border-radius: 20px;
    margin-left: 10px;
  }
  .join-room-input :deep() .el-input__inner {
    border: 0;
    min-height: 30px;
    height: 3rem;
    max-height: 100px;
  }
  .join-room-input :deep() .el-input-group__append {
    background-color: white;
    width: 20px;
    padding: 0 5px;
    border: 0;
  }
  .join-room-input__btn {
    border: 0;
  }
  .join-room-input__btn:hover {
    color: #43CD80;
  }
</style>