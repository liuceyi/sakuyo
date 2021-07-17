<template>
  <NavBar ref="NavBar" v-model:menuStatus="asideStatus" :isLogin="isLogin" :userInfo="userInfo" @change-login="ChangeLogin"></NavBar>
  <el-container style="height: 100%;">
    <Aside :asideStatus="asideStatus" :isLogin="isLogin"></Aside>
    <el-main v-loading="isLoading">

      <router-view :userInfo="userInfo" v-if="isRouterAlive"></router-view>
    
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
  provide() {
    return {
      Reload: this.Reload,
      userInfo: () =>this.userInfo
    }
  },
  components: {
    NavBar,
    Aside,
    FootPage
  },
  data() {
    return{
      asideStatus: false,
      isLoading: false,
      isLogin: false,
      userInfo:{
        uid:'',
        nickname:'',
        avatar:''
      },
      isRouterAlive:true
    }
  },
  mounted() {
    this.CheckCookie();
  },
  methods: {
    menuChange(newStat) {
      this.asideStatus = newStat;
    },
    Reload() {
      this.isRouterAlive = false;
      this.$nextTick(()=>{
        this.isRouterAlive = true;
      })
    },
    CheckCookie() {
      this.isLoading = true;
      var cookie = this.cookie.GetCookie();
      var that = this;
      if (cookie == "") {
        this.isLoading = false;
        return false;
      }
      else {
        var data = {flag:'check-cookie'};
        this.axios.post(that.api, that.qs.stringify(data)).then((response) => {
          if (response.data.status == 'Success') {
            that.isLogin = true;
            that.GetUserInfo();
            return true;
          }
          else {
            this.isLoading = false;
            console.log('Error cookie');
            return false;
          }
        })
      }
      
      
    },
    GetUserInfo() {
      return new Promise(() => {
      // Get cookie
      // Import user information (avatar, nickname, etc.)
      var that = this;
      var data = {flag:'get-user-info:cookie'};
      this.axios
        .post(that.api, that.qs.stringify(data))
        .then((response) => {
          if (response.data.status == 'Success') {
            var userInfo = JSON.parse(response.data.content);
            sessionStorage.setItem('uid', userInfo.uid);
            sessionStorage.setItem('nickname', userInfo.nickname);
            sessionStorage.setItem('avatar', userInfo.avatar);
            that.userInfo = userInfo;
            // that._provided.userInfo.uid = userInfo.uid;
            that.isLoading = false;
          }
          else {
            console.log(response);
          }
        })
      })
    },
    ClearUserInfo() {
      // Clear cookie
      this.cookie.ClearCookie();
      sessionStorage.removeItem('uid');
      sessionStorage.removeItem('nickname');
      sessionStorage.removeItem('avatar');
    },
    ChangeLogin(val) {
      this.isLogin = val;
    },
    Logout() {
      var that = this;
      var data = {flag:'logout'};
      this.axios.post(that.api, that.qs.stringify(data))
      .then((response) => {
        if (response.data.status == 'Success') {
          that.ClearUserInfo();
          that.$router.push('/');
        }
        else {
          console.log(response);
        }
      });

    }
  },
  watch: {
    isLogin(val) {
      if (val) {
        this.GetUserInfo();
      }
      else {
        this.Logout();
      }
    }
  }
}
</script>
<style scoped>

</style>