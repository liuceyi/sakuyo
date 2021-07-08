<template>
  <div class="chatbox-container">
    <el-scrollbar ref="chatScrollbar" class="chat-window">
      <el-row v-for="(msg, index) in chatMsgs" :key="index" :class="msg.me?'my-msg-box-container':'msg-box-container'" type="flex">
        <!-- 对话气泡（别人） -->
        <el-col :span="2" class="msg-avatar-container" v-if="!msg.me">
          <el-avatar class="msg-avatar" icon="el-icon-user-solid"></el-avatar>
        </el-col>
        <el-col :span="22"  v-if="!msg.me">
          <div class="msg-box">
            <span class="msg-box-nickname">{{msg.nickname}}</span>
            <span class="msg-box-content">{{msg.content}}</span>
          </div>
        </el-col>
        <!-- 对话气泡（自己） -->
        <el-col :span="22"  v-if="msg.me">
          <div class="my-msg-box">
            <span class="msg-box-nickname">{{msg.nickname}}</span>
            <span class="my-msg-box-content">{{msg.content}}</span>
          </div>
        </el-col>
        <el-col :span="2" class="msg-avatar-container" v-if="msg.me">
          <el-avatar class="msg-avatar" icon="el-icon-user-solid"></el-avatar>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-input type="text" placeholder="请输入内容" v-model="text" minlength="1" maxlength="30" show-word-limit @keyup.enter="SendMsg" class="chat-input">
      <template #append>
        <el-button @click="SendMsg">发送</el-button>
      </template>
  </el-input>
  </div>

</template>
<script>
  export default {
    name:'DrawChatBox',
    data() {
      return {
        chatMsgs:[],
        text:''
        
      }
    },
    mounted() {
      this.chatMsgs = [
        {
          nickname:'sakuyo',
          avatar:'',
          content:'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
          time:'2021-07-08 11:39:06',
          me:false
        },
        {
          nickname:'sakuta',
          avatar:'',
          content:'xs',
          time:'2021-07-08 12:39:06',
          me:true
        },
        {
          nickname:'mihoko',
          avatar:'',
          content:'!!',
          time:'2021-07-08 10:39:06',
          me:false
        }
      ]
    },
    methods: {
      SendMsg() {
        if (this.text) {
          var time = new Date();
          this.chatMsgs.push({
            nickname:'sakuyo',
            avatar:'',
            content:this.text,
            time:time.toLocaleString(),
            me:true
          });
          this.text = '';
        }
      }
    },
    watch: {
      chatMsgs: {
        handler (val) {
          val.sort((a,b) => {
            let t1 = new Date(Date.parse(a.time.replace(/-/g, "/")))
            let t2 = new Date(Date.parse(b.time.replace(/-/g, "/")))
            return t2.getTime() - t1.getTime()
          })
          this.$nextTick(()=> {
            this.$refs['chatScrollbar'].wrap.scrollTop = this.$refs['chatScrollbar'].wrap.scrollHeight;
          })
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  .chatbox-container {
    padding: 0;
    border: 1px solid #919191;
    border-radius: 5px;
    overflow: hidden;
  }

  .msg-box-container, .my-msg-box-container {
    min-height: 35px;
    margin-top: 5px;
    margin-bottom: 8px;
  }
  .my-msg-box-container {

  }

  .msg-avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .msg-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .msg-box, .my-msg-box {
    display: flex;
    min-height: 35px;
    flex-direction: column;
    justify-content: center;
  }
  .msg-box {
    align-items: flex-start;
  }
  .my-msg-box {
    align-items: flex-end;
  }
  .msg-box-nickname {
    color: #919191;
    font-size: 12px;
    margin-top: 5px;
  }
  .msg-box-content, .my-msg-box-content {
    position: relative;
    height: fit-content;
    border: 1px solid #DCDCDC;
    border-radius: 8px;
    width: fit-content;
    max-width: 80%;
    word-wrap: break-word;
    word-break: break-all;
    padding: 6px;
    text-align: left;
    font-family: Arial, "微软雅黑";
    font-size: 15px;
  }
  .my-msg-box-content {
    border: 1px solid #66CD00;
    background-color: #66CD00;
  }
  .msg-box-content:before {
    content: '';
    position: absolute;
    right: 100%;
    top: 0px;
    width: 4px;
    height: 3px;
    border-bottom: 3px solid #DCDCDC;
    border-radius:0 0 0 60%;
  }
  .my-msg-box-content:after {
    content: '';
    position: absolute;
    left: 100%;
    top: 0px;
    width: 4px;
    height: 3px;
    border-bottom: 3px solid #66CD00;
    border-radius:0 0 60% 0;
  }
  .chat-window {
    width: 100%;
    height: 8rem;

  }
  :deep() .el-textarea__inner {
    width: 100%;
    height: 100%;
    border: 0;
    cursor: default;
  }
  .chat-input {
    width: 100%;
    height: 2rem;
  }
  :deep() .el-input__inner {
    height: 100%;
    padding: -1px;
    border-radius: 0px;
  }
  :deep() .el-input__inner:focus {
    border-color: #DCDFE6;
  }
  :deep() .el-input .el-input-group__append, .el-input .el-input-group__append .el-button {
    border-radius: 0;
  }
  :deep() .el-input .el-input-group__append {
    border-right: 10px;
    border-bottom: 10px;
  }
  :deep() .el-input .el-input-group__append:hover {
    background-color: #e6e6e6;
  }
</style>