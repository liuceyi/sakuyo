<template>
  <div class="background-container">
    <div id='p5Sketch-logo' class='background-canvas'></div>
    <!-- <div id='p5Sketch-particles' class='background-canvas'></div> -->
  </div>
  <!-- <img src="@/assets/logo.png" class="logo">
  <ProgressBar :progress="progress"></ProgressBar> -->
</template>

<script>
  // import ProgressBar from '@/components/ProgressBar.vue'
  import P5 from 'p5'
  // let sketchIndexParticle = require('@/js/p5/sketch-index-particles')
  let sketchIndexLogo = require('@/js/p5/sketch-index-logo')
  export default {
    name:'IndexPage',
    components: {
      // ProgressBar
    },
    data() {
      return {
        progress:60
      }
    },
    mounted() {
      new P5(sketchIndexLogo())
      // new P5(sketchIndexParticle())
      
    }
  }
</script>

<style scoped>
  .background-container {
    width: 100%;
    height: 100%;
    /* background-color: #292929; */
    z-index: -10;
  }
  .background-canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -2;
  }
</style>