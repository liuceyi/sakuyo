<template>
  <el-dialog
    :model-value="toLogin"
    @close="CloseDialog"
    width="30%"
  >
    <template #title><span style="color: white; font-size: 16px;">{{isRegistered?'登录':'注册'}}</span></template>

    <LoginCard v-if="isRegistered" v-model:isRegistered="isRegistered"></LoginCard>

    <RegisterCard v-if="!isRegistered" v-model:isRegistered="isRegistered"></RegisterCard>


    
  </el-dialog>
</template>

<script>
import LoginCard from '@/components/NavBar/Login/LoginCard.vue'
import RegisterCard from '@/components/NavBar/Login/RegisterCard.vue'
export default {
  name: 'Login',
  props: {
    toLogin:Boolean
  },
  components: {
    LoginCard,
    RegisterCard
  },
  emits: ['update:toLogin'],
  data(){
    return{
      isRegistered:true
    }
  },
  methods: {
    CloseDialog(){
      this.$emit('update:toLogin', false)
    }
  }
}
</script>
<style>
  .el-dialog__header {
    background-color: #4A00E0;
    opacity: 1;
  }
  .el-dialog__body {
    background-color: #4A00E0;
    opacity: 1;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  /deep/ .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  
</style>
