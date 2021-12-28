<template>
  <div class="msg-container">
    <el-row class="msg-card-container" type="flex" justify="center">
      <el-col v-for="(msg, index) in msgList" :key="msg" :class="index % 2 == 0 ? 'left-msg' : 'right-msg'">
        <TextMsg v-if="msg['noPic']" :msg="msg"></TextMsg>
        <PTMsg v-else :msg="msg"></PTMsg>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
  import TextMsg from '@/components/MsgPage/TextMsg.vue';
  import PTMsg from '@/components/MsgPage/PTMsg.vue';
  export default {
    name:'MsgPage',
    components: {
      TextMsg,
      PTMsg
    },
    data() {
      return {
        msgList: [
          {
            'title':'test',
            'content':'asdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoiasdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoi',
            'link':'',
            'noPic':true
          },
                    {
            'title':'test',
            'content':'asdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoiasdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoi',
            'link':'',
            'noPic':true
          },
          {
            'title':'Test test test',
            'content':'asdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;\
            dsaukfhdsajklfjoiasdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;\
            jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoiasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldaasdfjkaldsjfkaljfdkla;jfkld;ajfkldaasdfjkaldsjfkaljfdkla;\
            jfkld;ajfkldasjkfl;jdskal;fjdksla;jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;\
            dsaukfhdsajklfjoiasdfjkaldsjfkaljfdkla;jfkld;ajfkldasjkfl;jdskal;fjdksla;\
            jfkdl;asjfkld;sajfkld;sajfkld;sajfkl;dsaukfhdsajklfjoi',
            'link':'',
            'noPic':false
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .msg-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 300px;
  }

  .msg-card-container {
    display: flex;
    flex-direction: column;
  }

  .left-msg {
    padding-right: 0px;
  }

  .right-msg {
    padding-left: 0px;
  }
</style>