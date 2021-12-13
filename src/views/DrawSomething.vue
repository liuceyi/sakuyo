<template>
<!--   <button @click="SayReady">ready</button>
  <span>{{word}}</span> -->
  <el-row :gutter="10" type="flex" class="main-container">
    <!-- 工具栏容器 宽度为2/24*100% -->
    <el-col :span="2" id="p5ToolBar" v-if="isActive&&isStart">
      <!-- 子组件 工具栏 -->
      <DrawToolBar 
        :penColor="penColor" 
        :lineWidth="lineWidth" 
        :eraserWidth="eraserWidth"
        :isPen="isPen" 
        @clear-canvas="ClearCanvas" 
        @change-line-width="ChangeLineWidth" 
        @change-eraser-width="ChangeEraserWidth"
        @change-pen-status="ChangePenStatus"
        @change-pen-color="ChangePenColor"
        @undo-trigger="Undo"
        @redo-trigger="Redo"
      >
      </DrawToolBar>
    </el-col>
    <!-- 画布容器 宽度为20/24*100% -->
    <el-col :span="18" class="draw-canvas-container">
      <DrawCanvas
        :isStart="isStart"
        :isActive="isActive"
        :userList="userList"
        :cvWidth="cvWidth"
        :cvHeight="cvHeight"
        :roomId="roomId"
        :gameObj="gameObj"
        :word="word"
        @game-start="GameStart"
        @create-room="CreateRoom"
        @join-room="JoinRoom"
        @change-active="ChangeActive"
        @get-word="GetWord"
        v-loading="isLoading"></DrawCanvas>
    </el-col>
    <el-col :span="3" class="userlist-container" v-if="isStart">
      <DrawUserList :userList="gameObj.players" :drawingUser="gameObj.active"></DrawUserList>
    </el-col>
    <div class="chat-container">
      <DrawChatBox :chatMsgs="chatMsgs" @send-msg="SendMsg"></DrawChatBox>
    </div>
  </el-row>
  
</template>
  
<script>
  import DrawWs from '@/js/draw-ws.js'
  import DrawCanvasJs from '@/js/draw-something.js'
  import DrawCanvas from '@/components/DrawSomething/DrawCanvas.vue'
  import DrawToolBar from '@/components/DrawSomething/DrawToolBar.vue'
  import DrawUserList from '@/components/DrawSomething/DrawUserList.vue'
  import DrawChatBox from '@/components/DrawSomething/DrawChatBox.vue'
  let dc; // Assign dc for drawing canvas
  let ws;
  export default {
    name:'DrawSomething',
    emits:['go-to-login', 'game-start', 'create-room', 'join-room'],
    props:{
      toLogin:Boolean
    },
    components: {
      DrawToolBar,
      DrawUserList,
      DrawChatBox,
      DrawCanvas
    },
    provide() {
      return {
        JoinRoom: this.JoinRoom,
        SayReady: this.SayReady
      }
    },
    inject: ['Reload'],
    data() {
      return {
        cvWidth: 1000,
        cvHeight: 600,
        penColor: 'black',
        lineWidth: 10,
        eraserWidth: 30,
        isPen: true,
        userList: [],
        roomId: 0,
        chatMsgs: [],
        isActive: false,
        isStart: false,
        uid: sessionStorage.getItem('uid'),
        isLoading: false,
        gameObj: {
          players: [],
          round: 0,
          active: -1,
          round_end: null
        },
        word:''
      }
    },
    mounted() {
      var that = this;
      var cookie = this.cookie.GetCookie();
      if (cookie == "") {
        // Go To Login
        
        that.$emit("go-to-login", true);
        // console.log(that.toLogin);
        return
      }
      this.isLoading = true;
      ws = new DrawWs('www.sakuyo.cn', '9998', cookie);
      ws.ws.handleMsg = this.HandleChat;
      ws.ws.handleUserList = this.HandleUserList;
      ws.ws.handleRoomId = this.HandleRoomId;
      ws.ws.handleDraw = this.HandleDraw;
      ws.ws.handleGame = this.HandleGame;
      ws.ws.reload = this.Reload;
      ws.start().then(()=>{
        setTimeout(()=>{
          console.log('roomId:' + that.roomId);
          if (that.roomId == 0) {
            that.$router.push('/draw-something');
          }
          else {
            that.$router.push('/draw-something/room');
          }
          ws.askUserList(that.roomId);
          that.isLoading = false;
        }, 1500);
        
      })
      
      
    },
    methods: {
      ClearCanvas() {
        dc.clear();
      },
      ChangePenColor(val) {
        this.penColor = val;
        dc.changeColor(val);
      },
      ChangeLineWidth(val) {
        dc.changeLineWidth(val);
      },
      ChangeEraserWidth(val) {
        dc.changeEraserWidth(val);
      },
      ChangePenStatus(val) {
        this.isPen = val;
      },
      Undo() {
        dc.undo();
      },
      Redo() {
        dc.redo();
      },
      SendMsg(val) {
        if (this.isStart) {
          ws.GameOrder(this.uid, 'check', val);
          console.log('game-send', val);
        }
        else {
          ws.sendMsg(val);
        }
        
      },
      HandleChat(newVal) {
        this.chatMsgs.push(newVal);
      },
      HandleDraw(content) {
        if (content['type']=='path') {
          if (content['status']) {
            dc.wsGetPath(content['content']);
          }
          else {
            dc.wsPathStop();
          }
        }
        else {
          dc.wsGetOrder(content['content']);
        }
      },
      HandleUserList(newVal) {
        this.userList = newVal;
      },
      HandleRoomId(newVal) {
        this.roomId = newVal['room-id'];
        this.isStart = newVal['status'];    
      },
      HandleGame(data) {
        switch(data['tag']) {
          case 'room':
            var newRoomId = data['content'];
            this.roomId = newRoomId;
            break;
          case 'game':
            var gameObj = data['content'];
            this.gameObj = gameObj;
            this.isStart = true;
            break;
          case 'word':
            this.word = data['content'];
            break;
          case 'check':
            //this.GetScore();
            this.$notify({
              title: '回答正确',
              message: '分数+2',
              position: 'bottom-left',
              type: 'success'
            });
            break;
          case 'ready':
            this.word = '';
            this.isActive = false;
            break;
          case 'end':
            this.GameEnd();
            break;
        }
      },
      GameStart() {
        ws.GameOrder(this.uid, 'start', this.roomId);
      },
      GameEnd() {
        this.isStart = false;
        this.$router.push('/draw-something/result');
      },
      // First start or reconnect
      ActivateCanvas() {
        this.cvWidth = document.getElementById("canvas-container").offsetWidth;
        this.cvHeight = document.getElementById("canvas-container").offsetHeight;
        dc = new DrawCanvasJs('draw-canvas'); // Bind the element
        dc.wsDraw = function(content, isOrder=true, pathing=true){
          ws.sendDraw(content, isOrder, pathing);
        }
      },
      CreateRoom() {
        ws.GameOrder(this.uid, 'create');
      },
      JoinRoom(newRoomId) {
        ws.GameOrder(this.uid, 'join', newRoomId);
      },
      SayReady() {
        ws.GameOrder(this.uid, 'ready');
        dc.reset();
        this.penColor = 'black';
        this.lineWidth = 10;
        this.eraserWidth = 30;
      },
      ChangeActive(newVal) {
        this.isActive = newVal;
      },
      GetWord() {
        ws.GameOrder(this.uid, 'word');
      }
    },
    watch: {
      isPen(newVal) {
        if (newVal) {
          dc.pen();
        }
        else {
          dc.eraser();
        }
      },
      isActive(newVal) {
        dc.isActive = newVal;
        if (newVal) {
          dc.assign();
          ws.GameOrder(this.uid, 'new-word');
          console.log('ask word...');
        }
        else {
          dc.cancel();
        }
      },
      roomId(newVal) {
        if (newVal == 0) {
          this.$router.push('/draw-something');
        }
        else {
          this.$router.push('/draw-something/room');
          console.log('roomId'+newVal);
          ws.askUserList(newVal);
        }
      },
      'gameObj.active'(newVal) {
        if (newVal > -1) {
          if (this.gameObj.players[newVal]['uid'] == this.uid) {
            this.isActive = true;
          }
          else {
            this.isActive = false;
          }
        }
        else {
          this.isActive = false;
        }
        
      },
      isStart(newVal) {
        if (newVal) {
          ws.GameOrder(this.uid, 'game', this.roomId);
          this.ActivateCanvas();
          this.SayReady();
        }
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
  #p5Canvas {
    width: 100%;
    height: 100%;
  }
  #p5ToolBar {
    padding-top: 10px;
    border: 1px solid #919191;
    height: 25rem;
    margin-right: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #p5ToolBar:hover, .canvas-container:hover, .userlist-container:hover {
    box-shadow: 0 5px 15px -5px rgba(0,0,0,.5);
  }

  .main-container {
    height: 35rem;
    display: flex;
    justify-content: center;
  }

  .draw-canvas-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .userlist-container {
    height: 80%;
    margin-left: 10px;
    border: 1px solid #919191;
    border-radius: 5px;
  }
  .chat-container {
    width: 50%;
    height: 10rem;
    margin-top: 10px;
  }
</style>
