<template>
  <transition name='aside'>
  <el-aside width="180px" style="background-color: rgb(238, 241, 246); z-index: 3000;" v-show="asideStatus">
    <el-menu router unique-opened active-text-color='white'>
      <el-menu-item v-for="item in navList" :key="item.index" :index="item.url" class="aside-el-menu-item">
        <template #title>{{item.title}}</template><span></span><span></span><span></span><span></span>
      </el-menu-item>
    </el-menu>
    <!-- <div v-show="!isLogin">
      <span id='login-first'>请先登录</span>
    </div> -->
  </el-aside>
  </transition>
</template>
<script>
  export default{
    props: {
      asideStatus:Boolean,
      isLogin:Boolean
    },
    data(){
      return{
        navList: [
          {icon:'', title:'Sakuyo幻想', url:'/sakuyo-fantasy'},
          {icon:'', title:'你画我猜', url:'/draw-something'},
          {icon:'', title:'True or False', url:'/true-or-false'},
          {icon:'', title:'MihoSaku聊天室', url:'/chat'}
        ]
      }
    },
    methods:{

    }
  }
</script>
<style scoped>
  >>> .el-menu {
    background-color: transparent;
  }
  >>> .el-menu-item {
    color: white;
    background-image: linear-gradient(to right, #4e54c8, #8f94fb);
    background-position: center;
    border-bottom: 1px solid #9FB6CD;
  }
  >>> .el-menu-item:hover, .el-menu-item:focus {
    color: white;
    background-image: linear-gradient(to bottom right,#373B44 ,#4286f4);
  }
  .aside-leave-active {
    animation: aside-open 0.6s;
  }
  @keyframes aside-open {
    0% {transform: translateX(0px);}
    100% {transform: translateX(-180px);}
  }
  .aside-enter-active {
    animation: aside-close 0.6s;
  }
  @keyframes aside-close {
    0% {transform: translateX(-180px);}
    100% {transform: translateX(0px);}
  }
  .aside-el-menu-item {
    position: relative;
    overflow: hidden;
  }
  .aside-el-menu-item:hover>span {
    position: absolute;
  }
  .aside-el-menu-item:hover>span:nth-child(1) {
    width: 100%;
    height: 2px;
    background-image: linear-gradient(to right, transparent, #03e9f4);
    left: -100%;
    top: 0;
    animation: span-line-one 1s linear infinite;
  }

  .aside-el-menu-item:hover>span:nth-child(2) {
      width: 2px;
      height: 100%;
      background-image: linear-gradient(to bottom, transparent, #03e9f4);
      right: 0;
      top: -100%;
      /* 延迟 0.25s */
      animation: span-line-two 1s .25s linear infinite;
  }

  .aside-el-menu-item:hover>span:nth-child(3) {
      width: 100%;
      height: 2px;
      background-image: linear-gradient(to left, transparent, #03e9f4);
      left: 100%;
      bottom: 0;
      /* 延迟 0.5s */
      animation: span-line-three 1s .5s linear infinite;
  }

  .aside-el-menu-item:hover>span:nth-child(4) {
      width: 2px;
      height: 100%;
      background-image: linear-gradient(to top, transparent, #03e9f4);
      left: 0;
      bottom: -100%;
      /* 延迟 0.75s */
      animation: span-line-four 1s .75s linear infinite;
  }

  @keyframes span-line-one {
      50%,
      100% {
          left: 100%;
      }
  }

  @keyframes span-line-two {
      50%,
      100% {
          top: 100%;
      }
  }

  @keyframes span-line-three {
      50%,
      100% {
          left: -100%;
      }
  }

  @keyframes span-line-four {
      50%,
      100% {
          bottom: 100%;
      }
  }

  #login-first {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-top: 10px;
    cursor: default;
  }
</style>