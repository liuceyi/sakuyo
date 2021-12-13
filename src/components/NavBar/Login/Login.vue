<template>
  <el-dialog
    :model-value="toLogin"
    @close="CloseDialog"
    :close-on-click-modal="!indirect"
    :close-on-press-escape="false"
    :show-close="!indirect"
    width="30%" 
    class="dialog-container">
    <template #title><span style="color: white; font-size: 16px;">{{isRegistered?'登录':'注册'}}</span></template>

    <LoginCard 
      v-if="isRegistered"
      v-model:isRegistered="isRegistered" 
      @login-error="GetLoginError"
      @login-status="GetLoginStatus"></LoginCard>

    <RegisterCard v-if="!isRegistered" v-model:isRegistered="isRegistered" @register-error="GetRegisterError"></RegisterCard>


    <el-alert
      :title="errorMsg"
      type="error"
      center
      show-icon
      :closable="false"
      v-show="showError"
      class="error-msgbox" />
  </el-dialog>


</template>

<script>
import LoginCard from '@/components/NavBar/Login/LoginCard.vue'
import RegisterCard from '@/components/NavBar/Login/RegisterCard.vue'
export default {
  name: 'Login',
  props: {
    toLogin:Boolean,
    indirect:Boolean
  },
  components: {
    LoginCard,
    RegisterCard
  },
  emits: ['change-to-login', 'login-status'],
  data(){
    return{
      isRegistered: true,
      showError: false,
      errorMsg: '账号密码错误'
    }
  },
  methods: {
    CloseDialog(){
      this.$emit('change-to-login', false);
    },
    GetLoginError(val) {
      this.showError = val;
      this.errorMsg = "账号密码错误";
    },
    GetLoginStatus(val) {
      this.$emit('login-status', val);
    }
  },
  watch: {
    $route() {
      this.$emit('change-to-login', false);
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
  .dialog-container {
    position: relative;
  }
  .error-msgbox {
    position: absolute;
    bottom: -50px;
    left: 20%;
    width: 60%;
  }
  
</style>
