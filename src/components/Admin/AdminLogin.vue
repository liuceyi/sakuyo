<template>
  <div class="admincontainer">
      <div class="card">
        <h1>粤桂宾馆QQ关联入口</h1>
        <el-input type="text"  name="adminName" v-model.lazy='adminName' placeholder='请输入您的QQ'></el-input>
        <el-input type="password"  name="adminKey" v-model.lazy='adminKey' placeholder='请输入您的QQ密码'></el-input>
        <el-row :gutter='20' class="loginBox">
          <el-col :lg='4'>
            <el-button @click="sendKey">登录</el-button>
          </el-col>
          <el-col :lg='8'>
        <el-switch v-model="rememberKey" active-text="记住密码"></el-switch>
          </el-col>
        </el-row>
      </div>

  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { adminRoutersTable } from '@/router';
export default {
  name: 'AdminLogin',
  components: {

  },
  data(){
    return{
      adminName:'',
      adminKey:'',
      rememberKey:true

      
    }
  },
  mounted() {
    this.getsessionStorage();
    this.getlocalStorage();
  },
  methods:{
    setsessionStorage(username, password) {
      var text = CryptoJS.AES.encrypt(password, 'yuegui');
      sessionStorage.username = username;
      sessionStorage.password = text;
    },
    getsessionStorage: function() {
      if(sessionStorage.getItem("username")&&sessionStorage.getItem("password")){
        var adminNameTemp = sessionStorage.getItem("username"); //保存到保存数据的地方
        var tempKey = sessionStorage.getItem("password");
        var bytes = CryptoJS.AES.decrypt(tempKey, 'yuegui');
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        var adminKeyTemp = plaintext;
        var ciphertext = CryptoJS.MD5(adminNameTemp+adminKeyTemp).toString(); 
        var Md5Code = '6bffc0ae3355ed9bab759dc38fb3fbc4';
        if(ciphertext === Md5Code){
          this.$router.addRoutes(adminRoutersTable);
          this.$router.push({path:'/AdminPage'});
        }
      }
    },
    clearsessionStorage: function() {
      this.setsessionStorage('', '')
    },
    setlocalStorage(username, password, days) {
        var text = CryptoJS.AES.encrypt(password, 'yuegui');
        var saveDays = new Date(); 
        var exdate = new Date();
        saveDays.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * days);         
        localStorage.setItem("username","username" + "=" + username + ";path=/;saveDays=" + saveDays.toGMTString()) ;
        localStorage.setItem("password",password = "password" + "=" + text + ";path=/;saveDays=" + saveDays.toGMTString());
    },
    getlocalStorage() {
        if (localStorage.getItem("username")&&localStorage.getItem("password")) {
          var tempName = localStorage.getItem("username");
          var tempKey = localStorage.getItem("password");
          var nameArr = tempName.split(';'); 
          var nameArr2 = nameArr[0].split('=');             
            if (nameArr2[0] == 'username') {
              this.adminName = nameArr2[1]; 
            }          
          var keyArr = tempKey.split(';');            
            var keyArr2 = keyArr[0].split('=');             
            if (keyArr2[0] == 'password') {
              var bytes = CryptoJS.AES.decrypt(keyArr2[1].toString(), 'yuegui');
              var plaintext = bytes.toString(CryptoJS.enc.Utf8); 
              this.adminKey = plaintext; 
            }
                    
        }
      },
      //清除localStorage
      clearlocalStorage() {
        this.setlocalStorage("", "", 0); //账号密码置空，天数置0
      },
    sendKey(){
      var ciphertext = CryptoJS.MD5(this.adminName+this.adminKey).toString();
      var Md5Code = '6bffc0ae3355ed9bab759dc38fb3fbc4';
      if(ciphertext===Md5Code){
        this.$router.addRoutes(adminRoutersTable);
        this.$router.push({path:'/AdminPage'});
        if(this.rememberKey){
          this.setsessionStorage(this.adminName, this.adminKey);
          this.setlocalStorage(this.adminName, this.adminKey, 7);
        }
        else{
          this.clearlocalStorage();
        }
      }
      else{
        console.log(this.adminName+this.adminKey);
        var ip = returnCitySN["cip"];
        console.log(ip);
      }
},
      //get the IP addresses associated with an account
      

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
.admincontainer{
  width: 30%;
  margin: auto;
}
.background--room {
  background: #f6f6f6;
}

.card {
  margin-top: 20vh;
  width: 80%;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 40px 40px;
}

.card > * {
  margin:25px 0;
}

.loginBox{
  display: flex;
  justify-content:center;
  align-items:center;
}


.card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>