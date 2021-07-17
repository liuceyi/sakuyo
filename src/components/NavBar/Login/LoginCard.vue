<template>
  <el-form
    :model="loginForm"
    :rules="rules"
    ref="loginForm"
    label-width="100px"
    class="login-form"
    :hide-required-asterisk="true">
    <el-form-item prop="user">
      <template #label><i class="el-icon-user-solid" style="color: white;"></i></template>
      <el-input
        type="text"
        placeholder="请输入手机号或者邮箱"
        required="required"
        v-model="loginForm.user">
      </el-input>
    </el-form-item>
    <el-form-item prop="psw">
      <template #label><i class="el-icon-key" style="color: white;"></i></template>
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="loginForm.psw"
        @keyup.enter="SubmitForm('loginForm')"
        show-password>
      </el-input>
    </el-form-item>
  </el-form>      
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="8" :offset="8" style="display: flex; justify-content: center;">
      <div class="login-form-btn-container" @click="SubmitForm('loginForm')">
        <span></span><span></span><span></span><span></span>
        <button class="login-form-btn">登录</button>
        <div class="login-form-btn-div"></div>
        <div class="login-form-btn-div1"></div>
        <div class="login-form-btn-div2"></div>

      </div>
    </el-col>
    <el-col :span="8" class="login-span"><span>忘记密码</span>&nbsp;|&nbsp;<span @click="SwitchToReg">注册账号</span></el-col>
  </el-row>
</template>

<script>
export default {
  name: 'LoginCard',
  props: {
    isRegistered:Boolean
  },
  emits:['login-error', 'login-status'],
  data() {
    // check if the user is empty
    var checkUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号或者邮箱不能为空'))
      } 
      else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        // eslint-disable-next-line no-useless-escape
        const reg2 = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if ((reg.test(value) || reg2.test(value))) {
          callback()
        }
        else {
          callback(new Error('请输入正确的手机号或者邮箱'))
        }
      } 
    }   
    // check if the psw is empty
    var checkPsw = (rule, value, callback) => {
      if (value === '') {
      callback(new Error('请输入密码'))
      } 
      else {
        callback()
      }
    }
    return {
      loginForm: {
        user: '',
        psw: ''
      },
      rules: {
        user: [{ required: true, validator: checkUser, trigger: 'blur' }],
        psw: [{ required: true, validator: checkPsw, trigger: 'blur' }]
      },
      errorPsw: true
    }
  },
  methods: {
    SubmitForm(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {flag:'login', account:that.loginForm.user, password:that.loginForm.psw};
          that.axios
            .post(that.api, that.qs.stringify(data))
            .then((response) => {
              if (response.data.status == 'Success') {
                // login info (cookie)
                that.cookie.SetCookie(response.data.content);
                that.$emit('login-error', false);
                that.$emit('login-status', true);
                
              }
              else {
                that.$emit('login-error', true);
              }
              console.log(response)
            })
        } 
        else {
          console.log('Refused error submit');
          return false;
        }
      });
    },
    ResetForm(formName) {
      this.$refs[formName].resetFields();
    },
    SwitchToReg() {
      this.$emit('update:isRegistered', false);
      this.$emit('login-error', false);
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-form {
    width: 80%;
  }
  /deep/ .el-input__inner {
    background-color: transparent;
    border-color: #DCDCDC;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-radius: 0;
    color: white;
  }
  /deep/ .el-input__inner:hover, .el-input__inner:focus {
    box-shadow: 0 -10px 5px -10px white inset;
    animation: flowing-shadow 3s infinite;
  }
  @keyframes flowing-shadow {
    0% {box-shadow: 0 -10px 5px -10px white inset;}
    50% {box-shadow: 0 -10px 15px -10px white inset;}
    100% {box-shadow: 0 -10px 5px -10px white inset;}
  }
  .login-form-btn-container {
    height: 2.5rem;
    width: 4.5rem;
    cursor: pointer;   
  }
  .login-form-btn {
    height: 100%;
    width: 100%;
    line-height: 1;
    padding: 12px 20px;
    font-size: 14px;
    border: 0;
    background-color: #f329b3;
    box-sizing: border-box;
    color: white;
    z-index: 100;
    opacity: 0.9;
  }
  .login-form-btn-container:hover .login-form-btn {
    opacity: 1;
  }
  .login-form-btn-container:active .login-form-btn {
    background-color: #ba0882;
    opacity: 1;
  }
  .login-form-btn-container div {
    position: absolute;
    width: 4.35rem;
    height: 2.4rem;
    overflow: hidden;
    top: 0;
    padding: 0;
    margin: 0;
    border: 1px solid #f329b3;
    background-color: transparent;
    opacity: 0;
  }
  .login-form-btn-container:hover div.login-form-btn-div {
    animation: active-border 0.125s linear;
  }
  .login-form-btn-container:hover div.login-form-btn-div1 {
    animation: active-border1 0.25s linear;
  }
  .login-form-btn-container:hover div.login-form-btn-div2 {
    animation: active-border2 0.5s linear;
  }
  @keyframes active-border {
    0% {transform: scale(1,1); transform-origin: 40% 40%;opacity: 0.4;}
    50% {transform: scale(1.3,1.3); transform-origin: 40% 40%;opacity: 0.4;}
    100% {transform: scale(1,1); transform-origin: 40% 40%;opacity: 0.4;}
  }
  @keyframes active-border1 {
    0% {transform: scale(1,1); transform-origin: 40% 60%;opacity: 0.4;}
    50% {transform: scale(1.3,1.3); transform-origin: 40% 60%;opacity: 0.4;}
    100% {transform: scale(1,1); transform-origin: 40% 60%;opacity: 0.4;}
  }
  @keyframes active-border2 {
    0% {transform: scale(1,1); transform-origin: 60% 40%;opacity: 0.4;}
    50% {transform: scale(1.3,1.3); transform-origin: 60% 40%;opacity: 0.4;}
    100% {transform: scale(1,1); transform-origin: 60% 40%;opacity: 0.4;}
  }
  .login-span>span {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.5;
    color: white;
    cursor: pointer;
  }
  .login-span>span:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  .error-msgbox {
    position: absolute;
  }
</style>
