<template>
  
    <el-footer class="footer">
      <el-row :gutter="20" class="footer-container">
        <!-- logo -->
        <el-col :span="2" align="middle">
          <img src="@/assets/logo.png" class="logo">
        </el-col>
        <el-col :span="18">
          
        </el-col>
        <el-col :span="4">
          <p>版权所有&copy;Sakuyo</p><a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备20051363号</a>
        </el-col>

      </el-row>
    </el-footer>
  
</template>
<script>

</script>
<style scoped>
  .footer {
    min-height: 200px;
    width: 100%;
    background: #242424;
    color: #aaa;
  }
  .footer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 100px;
    height: 100px;
    filter: grayscale(100%);
  }
  .logo:hover {
    filter: grayscale(0);
  }
  .el-col {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>