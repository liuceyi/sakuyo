<template>
  <el-card shadow="hover" class="msg-card">
    <template #header>
      <div class="msg-card__header-container">
        <span class="msg-card__header">{{msg['title']}}</span>
        <el-button type="text" class="msg-card__header-link">>></el-button>
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
  name: 'TextMsg',
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
  }

  .msg-card__header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .msg-card__header {
    font-size: 20px;
  }

  .msg-card__header-link {
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
</style>