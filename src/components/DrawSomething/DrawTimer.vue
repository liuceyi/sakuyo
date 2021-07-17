<template>
  <div class="timer-container"></div>
</template>
<script>
  export default {
    name:'DrawTimer',
    data() {
      return {
        times: 30
      }
    },
    emits:['create-room', 'join-room', 'game-start'],
    methods: {
      StartTimer() {
        // this.show = true;
        this.timer = setInterval(()=>{
          this.times--;
          if (this.times === 0) {
            // this.show = false;
            clearInterval(this.timer);
          }
        }, 1000);
      }
    }
  }
</script>
<style scoped>

</style>