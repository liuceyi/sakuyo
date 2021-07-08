<template>
  <el-row :gutter="10" type="flex" class="main-container">
    <!-- 工具栏容器 宽度为2/24*100% -->
    <el-col :span="2" id="p5ToolBar">
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
    <el-col :span="18" class="canvas-container" id="canvas-container">
      <!-- 画布本体 宽高自适应 -->
      <canvas id="draw-canvas" :width="cvWidth" :height="cvHeight"></canvas>
    </el-col>
    <el-col :span="3" class="userlist-container">
      <DrawUserList :userList="userList" :drawingUser="drawingUser"></DrawUserList>
    </el-col>
    <div class="chat-container"><DrawChatBox></DrawChatBox></div>
  </el-row>
  
</template>
  
<script>
  import DrawCanvas from '@/js/draw-something.js'
  import DrawToolBar from '@/components/DrawSomething/DrawToolBar.vue'
  import DrawUserList from '@/components/DrawSomething/DrawUserList.vue'
  import DrawChatBox from '@/components/DrawSomething/DrawChatBox.vue'
  let dc; // Assign dc for drawing canvas
  export default {
    name:'DrawSomething',
    components: {
      DrawToolBar,
      DrawUserList,
      DrawChatBox
    },
    data() {
      return {
        cvWidth: 1000,
        cvHeight: 600,
        penColor: 'black',
        lineWidth: 10,
        eraserWidth: 30,
        isPen: true,
        userList: [
          {
            'avatarUrl':'https://sakuyo.cn/wordpress/wp-content/uploads/2020/07/QQ%E5%9B%BE%E7%89%8720200321144938.jpg', 
            'name':'sakuyo'
          },
          {
            'avatarUrl':'https://sakuyo.cn/wordpress/wp-content/uploads/2020/07/QQ%E5%9B%BE%E7%89%8720200321144938.jpg', 
            'name':'sakuya'
          }
        ],
        drawingUser:0
      }
    },
    mounted(){
      this.cvWidth = document.getElementById("canvas-container").offsetWidth - 10;
      this.cvHeight = document.getElementById("canvas-container").offsetHeight - 2;
      dc = new DrawCanvas('draw-canvas', '111'); // Bind the element and websocket
      dc.assign();

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
      }
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

  .canvas-container {
    width: 80%;
    height: 80%;
    border-radius: 5px;
    border: 1px solid #919191;
  }

  #draw-canvas {
    width: 100%;
    height: 100%;
    /*cursor:url("../assets/cursor.png"),auto;*/
  }

  .main-container {
    height: 35rem;
    display: flex;
    justify-content: center;
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
