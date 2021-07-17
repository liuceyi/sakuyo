<template>
    <span class="back-btn" @click="BackToIndex"><i class="el-icon-back"></i></span>
    <div class="game-title">Draw Something</div>
    <span class="room-id">房间ID:&nbsp;{{roomId}}</span>
    <div class="player-list-container">
      <div v-for="(user, index) in userList" :key="index" class="player-list">
        <el-avatar icon="el-icon-user-solid" :src="user.avatar" class="player-list__avatar"/>
        <span class="player-list__nickname">{{user.nickname}}</span>
      </div>
    </div>
    <el-button class="start-game-btn" @click="GameStart" v-if="isMe">开始游戏</el-button>
</template>
<script>
  export default {
    name:'DrawRoom',
    props: {
      isStart:Boolean,
      cvWidth:Number,
      cvHeight:Number,
      userList:Array,
      roomId:String
    },
    inject:['userInfo', 'JoinRoom'],
    emits:['game-start', 'create-room', 'join-room'],
    methods: {
      GameStart() {
        this.$emit('game-start');
      },
      BackToIndex() {
        this.$router.push('/draw-something');
        this.JoinRoom(0);
      }
    },
    computed: {
      isMe() {
        var userInfo = this.userInfo();
        for (var i = this.userList.length - 1; i >= 0; i--) {
          if (this.userList[i].host && (this.userList[i].uid == userInfo.uid)) {
            return true;
          }
        }
        return false;
      }
    }
  }
</script>
<style scoped>
  .back-btn {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    font-size: 50px;
    margin: 20px;
    cursor: pointer;
  }
  .back-btn:hover {
    color: #DCDCDC;
  }
  .start-game-btn {
    min-height: 30px;
    height: 3rem;
    max-height: 100px;
    min-width: 200px;
    width: 10rem;
    max-width: 500px;
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
  .room-id {
    color: white;
    font-size: 18px;
    font-weight: 500;
  }
  .player-list-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }
  .player-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  .player-list__avatar {

  }
  .player-list__nickname {
    color: white;
    font-size: 16px;
    font-weight: 400;
    padding-top: 5px;
  }

</style>