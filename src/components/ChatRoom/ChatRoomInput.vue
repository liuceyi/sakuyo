<template>
  <div class="input-container">
    <div class="input-tool">
      <i class="iconfont el-icon-more_emoji"></i>
      <i class="iconfont el-icon-more_screenshot"></i>
      <i class="iconfont el-icon-more_document"></i>
    </div>
    <div class="input-box">
      <el-input class="input" v-model="textInput" type="textarea" autofocus="true" @keydown.enter="handleKeyCode($event)" resize="none" maxlength="500" show-word-limit></el-input>
    </div>
    <div class="btn-container">
      <el-button color="#6495ED" class="input-btn" @click="send">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'ChatRoomInput',
  emits: ['send-msg'],
  data() {
    return {
      userInfo:{
        uid:sessionStorage.getItem('uid'),
        nickname:sessionStorage.getItem('nickname'),
        avatar:sessionStorage.getItem('avatar')
      },
      textInput: ''
    }
  },
  methods: {
    send() {
      if (this.textInput) {
        let time = new Date();
        let msg = {
          uid:this.userInfo.uid,
          nickname:this.userInfo.nickname,
          avatar:this.userInfo.avatar,
          content:this.textInput,
          time:time.getTime()
        }
        this.$emit('send-msg', msg);
        this.textInput = '';
      }
    },
    handleKeyCode(event) {
      if (!event.ctrlKey) {
        event.preventDefault();
        this.send();
      } 
      else {
        this.textInput = this.textInput + '\n';
      }
      
    },
  }
}
</script>

<style scoped>
  .input-container {
    border-top: 1px solid #DCDCDC;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .input-container .input-tool {
    flex: 0 0 auto;
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  }

  .input-container .input-tool i {
    margin: 4px;
    font-size: 20px;
    cursor: pointer;
  }

  .input-container .input-tool i:hover {
    color: #989898;
  }

  .input-container .input-box {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-container .btn-container {
    flex: 0 0 auto;
    height: 50px;
  }

  .input-container .input-btn {
    position: absolute;
    bottom: 0%;
    right: 0%;
    width: 100px;
    height: 30px;
    border-radius: 20px;
    margin-right: 6px;
    margin-bottom: 6px;
  }

  .input-box >>> .el-textarea {
    width: 100%;
    height: 100%;
  }
  .input-box >>> .el-textarea__inner {
    width: 100%;
    height: 100%;
    border: 0px;
    padding: 0 10px;
    outline: none;
    font-size: 20px;
  }

  /*Scroll bar size*/
  .input-box >>> .el-textarea__inner::-webkit-scrollbar {
    width: 5px;
    height: 1px;
  }

  /*Thumb in Scroll bar*/
  .input-box >>> .el-textarea__inner::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }

  /*Track in Scroll bar*/
  .input-box >>> .el-textarea__inner::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }
</style>