<template>
  <div class="background-container">
    <InstaViewer></InstaViewer>
  </div>
</template>

<script>
  import InstaViewer from '@/components/Insta/InstaViewer.vue';
  export default {
    name: 'Insta360',
    components: {
      InstaViewer
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