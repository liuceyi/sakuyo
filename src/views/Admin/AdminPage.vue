<template>
  <div id="AdminPage">

    <AdminNav :value="this.value"></AdminNav>
    <router-view @valueGet='valueGet'></router-view>
    










  </div>
</template>

<script>
import AdminNav from './AdminNav.vue'
export default {
  name: 'AdminPage',
  components: {
    AdminNav
  },
  data(){
    return{
      value:0

      
    }
  },
  methods:{
    valueGet(data){
      this.value = data.value;
    }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

.background--room {
  background: #f6f6f6;
}





</style>