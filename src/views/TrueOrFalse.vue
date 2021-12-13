<template>
  <el-row type="flex" class="main-container">
    <el-col class="main-canvas-container">
      <div id='p5Sketch-trueorfalse' class='main-canvas'></div>
    </el-col>
    <el-col class='review-container'>
      <h2>评论</h2>
      <div class='review'></div>
    </el-col>
  </el-row>
</template>

<script>
  let sketch = require('@/js/p5/game/true-or-false/sketch-game-trueorfalse')
  export default {
    name:'TrueOrFalse',
    components: {
    
    },
    methods: {
    },
    mounted() {
      try {
        new window.p5(sketch);
      } catch (error) {
        new window.p5.constructor(sketch);
      }
      
    },
    watch: {
      $route() {
        document.querySelector('#p5Sketch-trueorfalse').noLoop = true;
      }
    }
  }
</script>

<style scoped>
  .main-container {
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .main-canvas-container {
    width: 100%;
    height: 90%;
    top: 0;
    bottom: 0;
    padding: 50px;
  }
  .main-canvas {
    width: 100%;
    height: 100%;
    background-color:dimgray;
    position: relative;
  }

  .review-container {
    width: 60%;
    border: 1px solid #DCDCDC;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .review-container div {
    height: 100px;
  }
</style>