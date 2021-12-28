<template>
  <div class="box-container">
    <i class="btn-back el-icon-back" @click="back"></i>
    <div class="title-container">
      <span class="title">123</span>
    </div>
    <div class="content-container">
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
    </div>
  </div>
</template>

<script>
  export default {
    name:'ChatRoomBox',
    emits:['back'],
    data() {
      return {
        chatMsgs: [
          {nickname:'sakuyo', content:'123', me:true}
        ]
      }
    },
    methods: {
      back() {
        this.$emit('back');
      }
    },
    watch: {
      chatMsgs: {
        handler (val) {
          val.sort((a,b) => {
            let t1 = new Date(Date.parse(a.time))
            let t2 = new Date(Date.parse(b.time))
            return t2.getTime() - t1.getTime()
          })
          for (var i = val.length - 1; i >= 0; i--) {
            if (val[i].uid == this.userInfo.uid) {
              val[i].me = true;
            }
            else {
              val[i].me = false;
            }
          }
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
  .box-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .box-container .btn-back {
    position: absolute;
    top: 0%;
    left: 0%;
    margin: 10px;
    font-size: 40px;
    cursor: pointer;
    color: #989898;
  }

  .btn-back:hover {
    color: #DCDCDC;
  }

  .box-container .title-container {
    height: 60px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .title-container .title {
    margin-left: 60px;
    max-width: 500px;
    height: 60px;
    text-align: left;
    font-size: 30px;
    line-height: 60px;
    color: #778899;
    cursor: default;
  }

  .box-container .content-container {
    flex: 1 1 auto;
    background-color: #F8F8FF;
  }

  /* msg box class */
  .msg-box-container, .my-msg-box-container {
    min-height: 35px;
    margin-top: 5px;
    margin-bottom: 8px;
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
  
  .my-msg-box-content:hover {
    border: 1px solid #66DC00;
    background-color: #66DC00;
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

  /* msg box class */
</style>