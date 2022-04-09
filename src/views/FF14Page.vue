<template>
  <div class="background-container">
    <FF14Hunt></FF14Hunt>
  </div>
</template>

<script>
  import FF14Hunt from '@/components/FF14/FF14Hunt.vue';
  export default {
    name:'FF14Page',
    components: {
      FF14Hunt
    },
    data() {
      return {

      }
    },
    watch: {

    }
  }
</script>

<style scoped>
  .background-container {
    width: 100%;
    height: 100%;
    background-color: #292929;
    z-index: -10;
  }
</style>