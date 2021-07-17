<template>
  <button @click="test">user</button>
</template>
  
<script>
  export default {
    name:'SakuyoFantasy',
    components: {
    
    },
    methods: {
      test() {
        var ws = new WebSocket('ws://localhost:9997');
        ws.send('fuck');
      }
    }
  }
</script>

<style scoped>
  
</style>