<template>
  <img src="@/assets/logo.png" class="logo">
  <ProgressBar :progress="progress"></ProgressBar>
</template>
  
<script>
  import ProgressBar from '@/components/ProgressBar.vue'
  export default {
    name:'IndexPage',
    components: {
      ProgressBar
    },
    data() {
      return {
        progress:60
      }
    }
  }
</script>

<style scoped>
  
</style>