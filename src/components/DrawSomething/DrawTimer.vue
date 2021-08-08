<template>
  <div class="timer-container">
    <el-progress type="circle" :percentage="timeSet / timeMax * 100" :stroke-width=8 :width=50 :status="timerStyle" v-show="showTimer">
        <span class="left-time-span">{{ timeSet }}</span>
    </el-progress>
  </div>
</template>
<script>
  export default {
    name:'DrawTimer',
    props:{
      gameObj:Object,
      readyToResult: Boolean
    },
    data() {
      return {
        showTimer: false,
        timerStyle: 'success',
        timeSet: 0,
        timeMax: 60
      }
    },
    inject:['SayReady'],
    emits:['create-room', 'join-room', 'game-start', 'show-word', 'change-active'],
    methods: {
      StartTimer() {
        this.showTimer = true;
        this.timer = setInterval(()=>{
          this.timeSet--;
          if (this.timeSet > 30) {
            this.timerStyle = 'success';
          }
          if (this.timeSet > 10 && this.timeSet <= 30) {
            this.timerStyle = 'warning';
          }
          if (this.timeSet <= 10){
            this.timerStyle = 'exception';
          }
          if (this.timeSet === 0) {
            this.showTimer = false;
            this.timerStyle = 'success';
            if (this.readyToResult) {
              this.$emit('show-word', false);
              this.SayReady();
            }
            else {
              this.$emit('change-active', false);
              this.$emit('show-word', true);
            }
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    watch: {
      'gameObj.round_end'(newVal) {
        // var roundEnd = this.gameObj().round_end;
        if (newVal != null) {
          var endTime = new Date(newVal.replace(/-/g, "/"));
          var nowTime = new Date();
          var timeDiff = parseInt((endTime - nowTime)/1000);
          if (timeDiff > 0 && !this.showTimer) {
            this.$emit('show-word', false);
            this.timeSet = timeDiff;
            this.timeMax = 60;
            this.StartTimer();
          }
        }
      },
      readyToResult(newVal) {
        if (newVal) {
          console.log('here');
          this.timeSet = 10;
          this.timeMax = 10;
          this.StartTimer();
        }
      }
    }
}
</script>
<style scoped>
  .timer-container {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 3px;
    left: 3px;
    z-index: 1000;
  }
  .left-time-span {
    font-size: 16px;
    font-weight: 500;
  }
</style>