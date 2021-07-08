<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="10" class="header-row" type="flex" align="middle">
        <el-col :span="3" class="">
          <div class="header-menu">
            <el-button 
              icon="el-icon-menu" 
              :class="{'header-menu-button-open':menuStatus, 'header-menu-button-close':!menuStatus}" 
              type="text" 
              :style="{color: menuStatus?'#FF0099':'white'}" 
              @click="ClickMenu"
            />
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-menu
              default-active="/"
              mode="horizontal"
              @select="HandleSelect"
              background-color="transparent"
              text-color="#fff"
              active-text-color="#ffd04b"
              router
              unique-opened
            >
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="msg">消息</el-menu-item>
              <el-menu-item index="user" v-show="isLogin">个人中心</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="3" :offset="8">
          <div class="header-user">
            <button v-if="!isLogin" @click="ClickLogin" class="login-button">注册/登录</button>
            <el-dropdown v-if="isLogin" trigger="click">
              
              <span class="el-dropdown-link user-span">
                <img :src="userAvatarUrl" class="user-avatar" />
                <span class="user-span">{{userName}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                    <router-link to="/user" style="text-decoration:blink;"><el-dropdown-item>个人中心</el-dropdown-item></router-link>
                    <el-dropdown-item @click="Logout">登出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      

      


    </el-header>

  </el-container>
  <Login v-model="toLogin"></Login>
</template>
<script>
  import Login from '@/components/NavBar/Login/Login.vue'
  export default{
    props: {
      menuStatus:Boolean
    },
    components: {
      Login
    },
    data(){
      return{
        userName:'Sakuyo',
        userAvatarUrl:'https://sakuyo.cn/wordpress/wp-content/uploads/2020/07/QQ%E5%9B%BE%E7%89%8720200321144938.jpg',
        isLogin:true,
        toLogin:false
      }
    },
    methods:{
      ClickMenu(){
        // this.menuStatus = !this.menuStatus
        this.$emit("update:menuStatus", !this.menuStatus)
      },
      ClickLogin(){
        this.toLogin = true
      },
      Logout() {
        this.isLogin = false
      },
      HandleSelect(key, keyPath){
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    padding: 0;
    background-image: linear-gradient(to top right,#8A2BE2 ,#4A00E0);
    color: #F2F6FC;
  }
  .header-row {
    width: 100%;
    height: 100%;
  }
  .header-user {
    height: 100%;
    display:flex;
    justify-content:center;/*justify to right side*/
    align-items:center;/*keep in center of y axis*/
  }
  .header-menu {
    height: 100%;
    width: 100%;
    display:flex;
    padding-left: 10px;
    justify-content:flex-start;/*justify to left side*/
    align-items:center;/*keep in center of y axis*/
  }
  /*animation when button is clicked and means to open*/
  .header-menu-button-open {
    font-size: 40px;
    animation: button-open 0.6s;
  }
  /*key frames of the animation*/
  @keyframes button-open {
    0% {color: white;transform: rotate(0deg);}
    100% {color: #FF0099;transform: rotate(90deg);}
  }
  /*animation when button is clicked and means to close*/
  .header-menu-button-close {
    font-size: 40px;
    animation: button-close 0.6s;
  }
  /*key frames of the animation*/
  @keyframes button-close {
    0% {color: #FF0099;transform: rotate(90deg);}
    100% {color: white;transform: rotate(180deg);}
  }
  .login-button {
    min-height: 40px;
    border-radius: 4px;
    line-height: 1;
    padding: 12px 20px;
    font-size: 14px;
    border: 1px solid #606266;
    background-color: white;
    cursor: pointer;
  }
  .login-button:hover {
    color: #7b4397;
  }
  .el-col {
    height: 100%;
    width: 100%;
  }
  /deep/ .el-dropdown {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 1.25rem;
    background-color: white;
    border: 0.15rem solid white;
  }
  .user-span {
    color: white;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
</style>