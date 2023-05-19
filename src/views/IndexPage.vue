<template>
  <div class="site-wrapper">
    <div class="neon-bg">
      <span>S</span>
      <span>a</span>
      <span>k</span>
      <span>u</span>
      <span><span class="neon-accent">Y</span><span class="neon-accent">O</span></span>
      
    </div>
    <el-container>
      <el-main class="main-page">
        <!-- <div class="description">
          <h1>欢迎来到我的个人网站</h1>
          <p>我是一名前端开发工程师，热爱编程和研究新技术。这个网站是我的个人博客和作品展示平台，展示了我在开发过程中积累的经验和技术成果。</p>
          <p>如果您对我的项目或博客内容感兴趣，欢迎在下面留言或者通过邮箱联系我。</p>
        </div> -->
        
      </el-main>
    </el-container>
  </div>
  <!-- <div class="background-container"> -->
    <!-- <div id='p5Sketch-logo' class='background-canvas'></div> -->
    <!-- <div id='p5Sketch-particles' class='background-canvas'></div> -->
  <!-- </div> -->
  <!-- <img src="@/assets/logo.png" class="logo">
  <ProgressBar :progress="progress"></ProgressBar> -->
</template>

<script>
  // import ProgressBar from '@/components/ProgressBar.vue'
  
  // import P5 from 'p5'
  // let sketchIndexParticle = require('@/js/p5/sketch-index-particles')
  // let sketchIndexLogo = require('@/js/p5/sketch-index-logo')
  export default {
    name:'IndexPage',
    components: {
    },
    data() {
      return {
        date: null
      }
    },
    mounted() {
      // try {
      //   new window.p5(sketchIndexLogo);
      // } catch (error) {
      //   console.log(error);
      //   new window.p5.constructor(sketchIndexLogo);
      // }
      
    },
    watch: {
      // $route() {
      //   document.querySelector('#p5Sketch-logo').noLoop = true;
      // }
    }
  }
</script>

<style scoped>
  @font-face {
  font-family: "AllertaStencil";
  src: url("../assets/font/Allerta-Stencil-Regular.ttf") format("truetype");
}
.site-wrapper {
  background-color: #000;
  /* height: 100vh; */
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: #fff;
  font-size: 16px;
  line-height: 1.6;
  position: absolute;
}
.main-page {
  top: 0; 
  position: absolute; 
  background-color: #111;
  width: 100%; 
  height: 100%; 
  opacity: 0.3; 
  padding: 0;
}

.neon-bg {
  font-size: 6rem;
  font-family: "AllertaStencil", sans-serif;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: calc(50vh - 120px);
}

.neon-bg span {
  display: inline-block;
  position: relative;
  font-weight: bold;
}

.neon-bg span:not(:last-child):after {
  content: "";
  position: absolute;
  top: 10%;
  right: -15%;
  bottom: 10%;
  left: -15%;
  z-index: -1;
  border-radius: 20px;
  background-color: #1e1e21;
  filter: blur(20px);
  opacity: 0.8;
  animation: halo 3s ease-in-out infinite;
}

.neon-bg .neon-accent {
  color: #8A2BE2;
}

.neon-accent:before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  color: #8A2BE2;
  text-shadow:
    0 0 15px #8A2BE2,
    0 0 30px rgba(0, 0, 0, 0.8),
    0 0 45px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(0, 0, 0, 0.2);
  animation: flicker 2s ease-in-out infinite;
}

@keyframes flicker {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.95);
  }
}

@keyframes halo {
    0%, 100% {
        filter: blur(3px);
        opacity: 0.9;
        transform: scale(1);
    }
    50% {
        filter: blur(20px);
        opacity: 0.4;
        transform: scale(1.05);
    }
}

</style>