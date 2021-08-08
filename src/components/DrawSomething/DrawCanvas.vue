<template>
<!-- 画布本体 宽高自适应 -->
  
  <div :class="isStart?'canvas-container':'start-game-container'" id="canvas-container">
    <DrawTimer 
      v-if="isStart" 
      :gameObj="gameObj" 
      :readyToResult="readyToResult" 
      @change-active="ChangeActive"
      @show-word="ShowWord">
    </DrawTimer>
    <div v-show="readyToResult" class="show-word-container">
      <span class="show-word">{{word}}</span>
    </div>
    <canvas id="draw-canvas" :width="cvWidth" :height="cvHeight" v-show="isStart"></canvas>
    <div v-if="isActive" class="word-container">
      <span class="word">{{word}}</span>
    </div>
    <div v-if="!isStart">
      <router-view 
      @game-start="GameStart"
      @create-room="CreateRoom"
      @join-room="JoinRoom"
      :userList="userList"
      :roomId="roomId"></router-view>
    </div>
  </div>
</template>
<script>
  import DrawTimer from '@/components/DrawSomething/DrawTimer.vue'
  export default {
    name:'DrawCanvas',
    components: {
      DrawTimer
    },
    props: {
      isStart:Boolean,
      isActive:Boolean,
      cvWidth:Number,
      cvHeight:Number,
      userList:Array,
      roomId:String,
      gameObj:Object,
      word:String
    },
    data() {
      return {
        readyToResult: false
      }
    },
    emits:['game-start', 'create-room', 'join-room', 'change-active', 'get-word'],
    methods: {
      GameStart() {
        this.$emit('game-start');
      },
      CreateRoom() {
        this.$emit('create-room');
      },
      JoinRoom(newRoomId) {
        this.$emit('join-room', newRoomId);
      },
      ShowWord(newVal) {
        this.$emit('get-word');
        this.readyToResult = newVal;
      },
      ChangeActive(newVal) {
        this.$emit('change-active', newVal);
      }
    }
  }
</script>
<style scoped>
  .canvas-container, .start-game-container  {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border: 1px solid #919191;
    position: relative;
    overflow: hidden;
  }

  .start-game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    background-image: linear-gradient(to top right, #232526, #414345);
    opacity: 0.8;
    position: relative;
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

  #draw-canvas {
    width: 100%;
    height: 100%;
    /*cursor:url("../assets/cursor.png"),auto;*/
  }

  .show-word-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .show-word {
    color: white;
    font-size: 25px;
    font-weight: 500;
  }

  .word-container {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 20px;
    border-top: 2px solid #919191;
    border-left: 2px solid #919191;
    padding: 5px;
  }
  .word {
    color: black;
    font-size: 15px;
    font-weight: 500;
  }
</style>