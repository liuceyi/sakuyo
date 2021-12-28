<template>
  <div class="user-card-container">
    <el-row class="user-card" type="flex" justify="center">
      <el-col :span="4" class="user-card__avatar-container">

        <el-progress 
        type="circle" 
        :percentage="uploadPercent" 
        :width="100" 
        class="user-card__avatar-progressbar" 
        v-if="isUpload">
          <template #default="{ percentage }">
            <span class="user-card__avatar-progressbar__value">{{ percentage }}%</span>
          </template>
        </el-progress>
        <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="BeforeAvatarUpload"
              :http-request="UploadAvatar"
              accept=".jpg,.png"
              class="user-card__avatar-uploader">
          <el-avatar 
            :src="userInfo.avatar" 
            class="user-card__avatar" 
            icon="el-icon-user-solid" 
            v-if="!isUpload"
            @mouseenter="mouseOver = true"
            @mouseleave="mouseOver = false" />
          <div v-if="!isUpload" class="user-card__avatar-mask" v-show="mouseOver">
            <i class="el-icon-plus"></i>
          </div>
        </el-upload>
      </el-col>
      <el-col :span="20" class="user-card__content">
        <span class="user-card__content__uid">uid:{{userInfo.uid}}</span>
        <div class="nickname-container">
          <span class="user-card__content__nickname" v-if="!editNickname">{{userInfo.nickname}}</span>
          <el-input 
            type="text" 
            v-model="newNickname" 
            maxlength="10" 
            :show-word-limit="false" 
            class="edit-nickname-input" 
            v-if="editNickname"
            @keyup.enter="UploadNickname"
            @keyup.esc="editNickname = false">
              <template #append>
                <el-button icon="el-icon-check" class="edit-nickname-input__btn" @click="UploadNickname"></el-button>
              </template>
            </el-input>
          <el-button 
            circle 
            icon="el-icon-edit" 
            class="nickname__edit-btn" 
            @click="editNickname = true" 
            v-if="!editNickname">
          </el-button>
          <el-button 
            circle 
            icon="el-icon-close" 
            class="nickname__edit-btn" 
            @click="editNickname = false" 
            v-if="editNickname">
          </el-button>
        </div>
        <div class="exp-bar-container">
          <el-progress :percentage="exp" :stroke-width=8 :show-text=false class="exp-bar" />
          <span class="exp-bar__text">LV{{level}}</span>
        </div>
      </el-col>

    </el-row>
  </div>
</template>
  
<script>

  export default {
    name:'UserPage',
    props: {
      userInfo:Object
    },
    data() {
      return {
        exp: 10,
        level: 1,
        uploadPercent: 0,
        isUpload: false,
        mouseOver: false,
        editNickname: false,
        newNickname: '',
        homePageNode: this.$parent.$parent.$parent.$parent
      }
    },
    mounted() {
      this.homePageNode.GetUserInfo();
    },
    methods: {
      BeforeAvatarUpload(file) {
        this.isUpload = true;
        this.mouseOver = false;
        var extension = file.name.substring(file.name.lastIndexOf('.') + 1);
        const isImg = extension === 'jpg' || extension === 'png'
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImg) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isImg && isLt2M;
      },
      UploadAvatar(e) {
        const renameFile = new File([e.file], this.userInfo.uid);
        let formdata = new FormData();
        formdata.append('flag', 'avatar');
        formdata.append('avatar', renameFile);
        var that = this;
        this.axios({
          url:that.api,
          method:'post',
          data:formdata,
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: progressEvent => {
                // progressEvent.loaded: the size that has been uploaded
                // progressEvent.total: the total size to upload
                that.uploadPercent = (progressEvent.loaded / progressEvent.total * 100);
          }
        }).then(res=>{
          if (res.data.status == 'Success') {
            that.homePageNode.GetUserInfo();
            setTimeout(()=>{
              that.isUpload = false;
            }, 1000);
          }
        })
      },
      UploadNickname() {
        if (this.userInfo.nickname == this.newNickname) {
          this.$message.warning({
            message: '新旧昵称一致，无需更改',
            type: 'warning'
          });
          return;
        }
        if (this.newNickname == '') {
          this.$message.warning({
            message: '昵称不允许为空',
            type: 'warning'
          });
          return;
        }
        var that = this;
        var data = {flag:'set-user-info', uid:that.userInfo.uid, nickname:this.newNickname};
        this.axios.post(that.api, that.qs.stringify(data)).then(res=>{
          if (res.data.status == 'Success') {
            that.homePageNode.GetUserInfo();
            that.editNickname = false;
          }
        })
      }
    }
  }
</script>

<style scoped>
  .user-card-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-card {
    width: 50%;
    height: 30rem;
    border: 1px solid #DCDCDC;
    border-radius: 5px;
    box-shadow: 0 5px 15px -5px rgba(0,0,0,.5);
    padding: 10px;
    background-color: transparent;
    background-image: linear-gradient(to top right, #FC466B, #3F5EFB);
    padding: 30px;
  }
  .user-card__avatar-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 2px;
  }
  .user-card__avatar-progressbar {
    width: 100px;
    height: 100px;
    min-height: 100px;
    min-width: 100px;
  }
  .user-card__avatar-progressbar__value {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }
  .user-card__avatar-uploader {
    position: relative;
  }
  .user-card__avatar-mask {
    content: '';
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    z-index: 1000;
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    color: white;
    font-size: 40px;
    font-weight: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-card__avatar {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 5px solid white;
  }
  .user-card__content {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    align-items: flex-start;
  }
  .user-card__content__uid {
    color: #DCDCDC;
    font-size: 14px;
  }
  .nickname-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
  }
  .nickname__edit-btn {
    width: 20px;
    min-height: 20px;
    min-width: 20px;
    height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-left: 15px;
    background-color: transparent;
    color: white;
  }
  .nickname__edit-btn:hover {
    background-color: rgba(224, 255, 255, 0.2);
  }
  .user-card__content__nickname {
    color: white;
    font-size: 30px;
    font-weight: 700;
    padding-top: 2px;
    min-width: 100px;
    text-align: left;
  }
  .edit-nickname-input {
    height: 40px;
    max-width: 250px;
    border-radius: 20px;
  }
  .edit-nickname-input :deep() .el-input__inner {
    border: 0;
  }
  .edit-nickname-input :deep() .el-input-group__append {
    background-color: white;
    width: 20px;
    padding: 0 5px;
    border: 0;
  }
  .edit-nickname-input__btn {
    border: 0;
  }
  .edit-nickname-input__btn:hover {
    color: #43CD80;
  }
  .exp-bar {
    min-height: 30px;
    min-width: 200px;
  }
  .exp-bar :deep().el-progress-bar__inner {
    border-radius: 0;
    background-color: unset;
    animation: hue 6s linear infinite;
    background-image: linear-gradient(to right, #11998e, #38ef7d);
  }
  @keyframes hue {
    0% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(60deg); }
    100% { filter: hue-rotate(00deg); }
  }
  .exp-bar__text {
    color: white;
    font-size: 20px;
    font-weight: 600;
  }
</style>