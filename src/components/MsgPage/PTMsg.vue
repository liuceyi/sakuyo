<template>
  <el-card shadow="hover" class="msg-card">
    <template #header>
      <div class="msg-card__header-container">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="msg-card__header-img"
        />
        <div class="msg-card__header-wrap">
          <span class="msg-card__header">{{msg['title']}}</span>
          <el-button type="text" class="msg-card__header-link">>></el-button>
        </div>
      </div>
    </template>
    <div class="msg-card__content-container">
      <TextOverflow :default-height="70">
        <div>
          <span class="msg-card__content">{{msg['content']}}</span>
        </div>
      </TextOverflow>

    </div>
  </el-card>
</template>

<script>
import TextOverflow from '@/components/MsgPage/TextOverflow.vue'
export default {
  name: 'PTMsg',
  components: {
    TextOverflow
  },
  props: {
    msg: Object
  }
}
</script>
<style scoped>
  .msg-card {
    width: 480px;
    margin-top: 20px;
    align-content: flex-start;
  }

  .msg-card__header-container {
    display: block;
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .msg-card__header-container {
    width: 100%;
    height: auto;
    max-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #DCDCDC;
  }

  .msg-card__header-container:before{
    content: "";
    width: 0;
    height: 100%;
    background: #000;
    padding: 14px 18px;
    position: absolute;
    top: 0;
    left: 50%;
    opacity: 0;
    transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
  }


  .msg-card__header-container:hover:before{
    width: 100%;
    left: 0;
    opacity: 0.5;
  }

  .msg-card__header-container .msg-card__header-img{
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .msg-card__header-container .msg-card__header,
  .msg-card__header-container .msg-card__header-link {
    opacity: 0;
    transition: all 0.5s ease 0s;
  }

  .msg-card__header-container:hover .msg-card__header,
  .msg-card__header-container:hover .msg-card__header-link {
    opacity: 1;
    transition-delay: 0.5s;
    color: #DCDCDC;
  }

  .msg-card__header-wrap {
    padding: 0;
    position: absolute;
    text-align: center;
    width: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .msg-card__header {
    font-size: 30px;
    cursor: default;
  }

  .msg-card__header-link {
    width: 50px;
    font-size: 20px;
  }

  .msg-card__content-container {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .msg-card__content {
    
    padding: 0px 15px;
    font-size: 14px;
    word-wrap: break-word;
    display: block;
    text-align: left;
  }

  >>> .el-card__header {
    padding: 0px;
  }
</style>