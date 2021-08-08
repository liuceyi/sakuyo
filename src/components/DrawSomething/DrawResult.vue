<template>
  <span class="back-btn" @click="BackToIndex"><i class="el-icon-back"></i></span>
  <div class="game-title">Draw Something</div>
  <el-row :gutter="20" v-for="(user, index) in rankList" :key="index" class="rank-container" type="flex">
    <el-col :span="12" class="rank__rank-container">
      <span class="rank__rank">{{index+1}}</span>
    </el-col>
    <el-col :span="12" class="rank__content-container">
      <el-avatar :src="user.avatar" class="rank__avatar"></el-avatar>
      <span class="rank__nickname">{{user.nickname}}</span>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name:'DrawResult',
    props: {
      userList:Array,
      roomId:Number
    },
    methods: {
      BackToIndex() {
        this.$router.push('/draw-something/room');
      }
    },
    computed: {
      rankList() {
        var listTemp = JSON.parse(JSON.stringify(this.userList));
        listTemp.sort((a,b) => {
          return b.score - a.score
        })
        return listTemp;
      }
    }
  }
</script>
<style scoped>
  .back-btn {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    font-size: 50px;
    margin: 20px;
    cursor: pointer;
  }

  .back-btn:hover {
    color: #DCDCDC;
  }
  .game-title {
    font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    text-transform: uppercase;
    font-size: 92px;
   /* color: #f1ebe5;
    text-shadow: 0 8px 9px #c4b59d, 0px -2px 1px #fff;*/
    font-weight: bold;
    letter-spacing: -4px;
    text-align: center;
    border-radius: 20px;
    background-color: transparent;
    background-image: linear-gradient(to right, #f7ff00, #db36a4);
    background-clip: text;
    color: transparent;
    cursor: default;
    animation: flash 3s linear infinite;
  }
  @keyframes flash {
    0% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(60deg); }
    100% { filter: hue-rotate(00deg); }
  }
  .rank-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .rank__rank-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .rank__rank {
    color: white;
    font-size: 30px;
    font-weight: 1000;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    line-height: 40px;
    border: 5px solid white;
  }
  .rank__content-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .rank__avatar {
    width: 40px;
    height: 40px;
    margin-right: 5px;
  }
  .rank__nickname {
    color: white;
    font-size: 20px;
    font-weight: 500;
  }

</style>