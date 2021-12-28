<template>
  <div class="container">
    <div class="chat-container">
      
      <ChatRoomList v-if="!isInRoom" @to-room="toRoom"></ChatRoomList>
      <div v-else style="width:100%; height:100%;">
        <div class="chat-content-container">
          <div class="chat-content" @click="showList">
            <ChatRoomBox @back="back"></ChatRoomBox>
          </div>

          <div class="user-list-bar"></div>
          <transition name="userList">
            <div class="chat-user-list" v-show="isListShow">
              <ChatUserList></ChatUserList>
            </div>
            
          </transition>
          
        </div>

        <div class="chat-input-container">
          <ChatRoomInput @send-msg="sendMsg"></ChatRoomInput>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
  import ChatRoomList from '@/components/ChatRoom/ChatRoomList.vue';
  import ChatRoomBox from '@/components/ChatRoom/ChatRoomBox.vue';
  import ChatUserList from '@/components/ChatRoom/ChatUserList.vue';
  import ChatRoomInput from '@/components/ChatRoom/ChatRoomInput.vue';
  export default {
    name:'IndexPage',
    emits:['go-to-login'],
    components: {
      ChatRoomList,
      ChatRoomBox,
      ChatUserList,
      ChatRoomInput,
    },
    data() {
      return{
        isInRoom: false,
        isListShow: false
      }
    },
    methods: {
      showList() {
        this.isListShow = !this.isListShow;
      },
      toRoom(rid) {
        console.log(rid);
        this.isInRoom = true;
      },
      back() {
        // back to public room
        this.isInRoom = false;
      },
      sendMsg(msg) {
        console.log(msg);
      }
    },
    mounted() {
      var that = this;
      var cookie = this.cookie.GetCookie();
      if (cookie == "") {
        // Go To Login
        that.$emit("go-to-login", true);
        return
      }
      this.isLoading = true;
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to left top, skyblue, white);
    z-index: -10;
  }
  .chat-container {
    width: 50vw;
    height: 40vw;
    border: 1px solid skyblue;
    border-radius: 20px;
    overflow: hidden;
    background-color: white;
  }

  .chat-content-container {
    width: 100%;
    height: 70%;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
    display: flex;
  }

  .chat-input-container {
    width: 100%;
    height: 30%;
    margin: 0px;
    padding: 0px;
  }

  .chat-content {
    width: 100%;
    display: inline;
  }

  .chat-user-list {
    width: 200px;
    display: inline;
    overflow: hidden;
  }

  .user-list-bar {
    width: 10px;
    transition: list-bar-appear 0.6s;
    background-color: aliceblue;
  }

  @keyframes list-bar-appear {
    0% {width: 0px;}
    100% {width: 10px;}
  }

  .userList-enter-active {
    animation: list-open 0.6s;
  }

  @keyframes list-open {
    0% {width: 0px;}
    100% {width: 200px;}
  }

  .userList-leave-active {
    animation: list-close 0.6s;
  }

  @keyframes list-close {
    0% {width: 200px;}
    100% {width: 0px;}
  }
</style>