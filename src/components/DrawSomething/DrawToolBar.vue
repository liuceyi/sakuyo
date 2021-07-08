<template>
  <!-- 取色器按钮 -->
  <input 
    type="color" 
    class="toolbar-button color-picker" 
    :model-value="penColor" 
    @input="ChangePenColor" 
    title="画笔颜色" 
    />

  <!-- 画笔按钮组 （v-show切换模式按钮和粗细按钮）-->
  <!-- 画笔粗细按钮 -->
  <div 
    class="toolbar-button width-picker" 
    title="画笔粗细" 
    @click="ClickPenWidthPicker" 
    v-show="isPen" 
    :class="isPen?'pen-active':'pen-inactive'"
  >
    <!-- 粗细实时显示（模拟） -->
    <div 
      class="pen-width-picker-img" 
      :style="{
        width:((lineWidthTemp+5)/maxLineWidth*100)>100?100:(lineWidthTemp+5)/maxLineWidth*100+'%', 
        height:((lineWidthTemp+5)/maxLineWidth*100)>100?100:(lineWidthTemp+5)/maxLineWidth*100+'%',
        'background-color':penColor
      }"
    />
    <!-- 粗细控制条 -->
    <el-slider 
      v-model="lineWidthTemp" 
      v-show="showPenWidth" 
      class="pen-width-slider" 
      :show-tooltip='false' 
      @mouseenter="stayPenWidthPicker=true" 
      @mouseleave="stayPenWidthPicker=false" 
      :marks="penMarks" 
      :max="maxLineWidth"
    />
  </div>
  <!-- 画笔模式按钮 -->
  <div 
    class="toolbar-button" 
    title="画笔模式" 
    @click="ClickPen"
    v-show="!isPen"
  >
    <i class="el-icon-edit"></i>
  </div>

  <!-- 橡皮按钮组 -->
  <!-- 橡皮粗细按钮 -->
  <div 
    class="toolbar-button width-picker" 
    title="橡皮粗细" 
    @click="ClickEraserWidthPicker" 
    v-show="!isPen" 
    :class="isPen?'eraser-inactive':'eraser-active'"
  >
    <!-- 粗细实时显示（模拟） -->
    <div 
      class="eraser-width-picker-img" 
      :style="{
        width:((eraserWidthTemp+5)/maxEraserWidth*100)>100?100:(eraserWidthTemp+5)/maxEraserWidth*100+'%', 
        height:((eraserWidthTemp+5)/maxEraserWidth*100)>100?100:(eraserWidthTemp+5)/maxEraserWidth*100+'%'
      }"
    />
    <!-- 粗细控制条 -->
    <el-slider 
      v-model="eraserWidthTemp" 
      v-show="showEraserWidth" 
      class="eraser-width-slider" 
      :show-tooltip='false' 
      @mouseenter="stayEraserWidthPicker=true" 
      @mouseleave="stayEraserWidthPicker=false" 
      :marks="eraserMarks" 
      :max="maxEraserWidth"
    />
  </div>
  <!-- 橡皮模式按钮 -->
  <div class="toolbar-button" title="橡皮模式" @click="ClickEraser" v-show="isPen"><i class="el-icon-more_xiangpica"></i></div>
  <!-- 清空画布按钮 -->
  <div class="toolbar-button once-button" title="清空画布" @click="ClearCanvas"><i class="el-icon-delete"></i></div>
  <div class="toolbar-button once-button" title="撤销操作"  @click="Undo" ref="undoBtn"><i class="el-icon-refresh-left"></i></div>
  <div class="toolbar-button once-button" title="回滚操作" @click="Redo" ref="redoBtn"><i class="el-icon-refresh-right" ></i></div>
  <!-- 保存画作按钮 -->
  <div class="toolbar-button once-button" title="保存画作"><i class="el-icon-picture-outline-round"></i></div>

</template>
<script>
  export default {
    name:'DrawToolBar',
    props: {
      penColor:String,
      lineWidth:Number,
      eraserWidth:Number,
      isPen:Boolean
    },
    emits: [
      'change-pen-color',
      'clear-canvas',
      'change-pen-status',
      'change-line-width', 
      'undo-trigger', 
      'redo-trigger', 
      'change-eraser-width'
    ],
    data() {
      return {
        lineWidthTemp: this.lineWidth,
        eraserWidthTemp: this.eraserWidth,
        showPenWidth: false,
        showEraserWidth: false,
        stayPenWidthPicker: false,
        stayEraserWidthPicker: false,
        maxLineWidth: 40,
        maxEraserWidth: 100,
        penMarks: {
          0:'',
          10:'',
          20:'',
          30:'',
          40:''
        },
        eraserMarks: {
          0:'',
          20:'',
          40:'',
          60:'',
          80:''
        }
      }
    },
    mounted() {
      let that = this;
      // bind hotkey to button
      document.onkeydown = e => {
        if (e.ctrlKey && e.key === "z") {
          that.$refs.undoBtn.click();
          // Prevent the default event of the keys
          e.preventDefault();
        }
        if (e.ctrlKey  && e.key === "y") {
          that.$refs.redoBtn.click();
          e.preventDefault();
        }
      }
    },
    methods: {
      ChangePenColor(event) {
        this.$emit('change-pen-color', event.target.value);
      },
      ClearCanvas() {
        this.$emit('clear-canvas');
      },
      ClickPenWidthPicker() {
        if (!this.stayPenWidthPicker) {
          this.showPenWidth = !this.showPenWidth;
        }
      },
      ClickEraserWidthPicker() {
        if (!this.stayEraserWidthPicker) {
          this.showEraserWidth = !this.showEraserWidth;
        }
      },
      ClickPen() {
        if (!this.isPen) {
          // this.isPen = true;
          this.$emit('change-pen-status', true);
        }
      },
      ClickEraser() {
        if (this.isPen) {
          // this.isPen = false;
          this.$emit('change-pen-status', false);
        }
      },
      Undo() {
        this.$emit('undo-trigger');
      },
      Redo() {
        this.$emit('redo-trigger');
      }
    },
    watch: {
      lineWidthTemp(newVal) {
        this.$emit('change-line-width', newVal);
      },
      eraserWidthTemp(newVal) {
        this.$emit('change-eraser-width', newVal);
      }
    }
  }
</script>
<style scoped>
  .toolbar-button {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    border: 1px solid #919191;
    padding: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .toolbar-button:hover {
    box-shadow: 0 0 10px -3px rgba(0,0,0,.5);
  }
  .color-picker {
    background-image: linear-gradient(45deg, #ec5f67, #f99157, #fac863, #99c794, #5fb3b3, #6699cc, #c594c5);
  }
  .color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .color-picker::-webkit-color-swatch{
    visibility: hidden;
  }
  .width-picker {
    position: relative;
  }
  .pen-width-picker-img {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    background-color: black;
    border: 1px solid #919191;
  }
  .eraser-width-picker-img {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    background-color: white;
    border: 1px solid #474747;
  }
  .pen-width-slider {
    position: absolute;
    width: 10rem;
    height: 2rem;
    left: 3rem;
    top: 0;
  }
  .eraser-width-slider {
    position: absolute;
    width: 10rem;
    height: 2rem;
    left: 3rem;
    top: 0;
  }
  /deep/ .el-slider__runway {
    height: 2rem;
    margin-top: 0;
    margin-bottom: 0 !important;
    background-color: transparent;
    border: 1px solid #DCDFE6;
    box-shadow: inset 0 0 8px -3px rgba(0,0,0,.5);;
  }
  /deep/ .pen-width-slider .el-slider__bar {
    height: 2rem;
    background-color: transparent;
    background-image: linear-gradient(to right, #919191, black);
  }
  /deep/ .eraser-width-slider .el-slider__bar {
    height: 2rem;
    background-color: transparent;
    background-image: linear-gradient(to right, #DCDCDC, white);
  }
  /deep/ .el-slider__button-wrapper {
    top: 0;
    height: 2rem;
  }
  /deep/ .el-slider__button {
    width: 4px;
    height: 2rem;
    border-radius: 0;
    border: 2px solid #DCDFE6;
    background-color: black;
  }
  /deep/ .el-slider__stop {
    width: 1px;
    height: 2rem;
    border-radius: 0;
    background-color: #DCDFE6;
  }
  .pen-active:before, .eraser-active:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border: 0.1rem solid #f70;
    width: 100%;
    height: 100%;
    margin: -0.1rem 0 0 -0.1rem;
    border-radius: 50%;
  }
  .pen-active, .eraser-active {
    background-color: #FAF0E6;
  }
  .once-button:active {
    background-color: #DCDCDC;
  }
</style>