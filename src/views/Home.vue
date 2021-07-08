<template>
  <NavBar ref="NavBar" v-model:menuStatus="asideStatus"></NavBar>
  <el-container style="height: 100%;">
    <Aside :asideStatus="asideStatus"></Aside>
    <el-main>

      <router-view></router-view>
    
    </el-main>

  </el-container>
  <FootPage ref='FootPage'></FootPage>
  
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import Aside from '@/components/Aside/Aside.vue'
import FootPage from '@/components/FootPage/FootPage.vue'

export default {
  name: 'Home',
  components: {
    NavBar,
    Aside,
    FootPage
  },
  data() {
      return{
        asideStatus:false
      }
    },
    methods: {
      menuChange(newStat) {
        this.asideStatus = newStat
        console.log(newStat)
      }
    }
}
</script>
<style scoped>

</style>