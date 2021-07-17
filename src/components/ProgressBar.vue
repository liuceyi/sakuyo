<template>
  <el-progress type="line" :percentage="progress" :stroke-width=8 :show-text=false>
  </el-progress>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress:Number
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /deep/ .el-progress-bar__inner {
    background-color: unset;
    animation: hue 6s linear infinite;
    background-image: linear-gradient(to right, #3587d8 , #6855ff);
  }
  @keyframes hue {
    0% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(60deg); }
    100% { filter: hue-rotate(00deg); }
  }
</style>
