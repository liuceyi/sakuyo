<template>
  <div id="AdminHome" role="admin">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AdminHome'
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