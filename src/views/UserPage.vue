<template>
  <span>user</span>
  {{userName}}
  <img :src="userAvatarUrl">
</template>
  
<script>
  export default {
    name:'UserPage',
    components: {
    
    },
    props: {
      userName:String,
      userAvatarUrl:String
    }
  }
</script>

<style scoped>
  
</style>