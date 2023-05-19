<template>
  <div class="player-container" :style="{left: left + 'px', top: top + 'px'}" ref="musicPlayer" v-if="!isClosed">
    <div class="music-player" @mousedown="mouseDown">
      <div class="music-info">
        <el-card class="music-card" :body-style="{padding: '25px'}">
          <div class="music-title" v-if="musicList[currentIndex]"><span>{{ musicList[currentIndex].title }}</span></div>
          <audio ref="audio" :src="musicList[currentIndex].src" @ended="handleEnded" v-if="musicList[currentIndex]"></audio>
          <div :class="{ 'music-cover rotate': playing, 'music-cover': !playing }" v-if="musicList[currentIndex]" v-show="!isCollapsed">
            <img v-if="musicList[currentIndex].coverUrl" :src="musicList[currentIndex].coverUrl" alt="music-cover" />
          </div>
          <div class="music-control">
            <i class="el-icon-arrow-left" @click="prev"></i>
            <i class="iconfont" 
               :class="{ 'el-icon-morezanting': playing, 'el-icon-more24gf-play': !playing }" 
               @click="togglePlay"></i>
            <i class="el-icon-arrow-right" @click="next"></i>
            <i 
              class="iconfont el-icon-morebofang-suijibofang" 
              v-if="isRandom" 
              :class="{ active: isRandom }" 
              @click="toggleOrder"></i>
            <i 
              class="el-icon-refresh-right" 
              v-else 
              :class="{ active: !isRandom }" 
              @click="toggleRandom"></i>
          </div>
          <div class="music-volume" v-show="!isCollapsed">
            <el-slider class="volume-slider" v-model="volume" :min="0" :max="100" :show-input="false" @change="changeVolume" />
            <i class="el-icon-morevolumehigh iconfont volume-icon" 
               v-if="volume >= 60 && volume <= 100" 
               @click="toggleMute"></i>
            <i class="el-icon-morevolumemedium iconfont volume-icon" 
               v-else-if="volume >= 30 && volume < 60" 
               @click="toggleMute"></i>
            <i class="el-icon-morevolumelow iconfont volume-icon" 
               v-else-if="volume > 0 && volume < 30" 
               @click="toggleMute"></i>
            <i class="el-icon-morevolume-off iconfont volume-icon" 
               v-else 
               @click="toggleMute"></i>
          </div>
        </el-card>
      </div>
      <div class="close-btn">
        <i class="el-icon-close" @click="closePlayer"></i>
      </div>
    </div>
    <div class="toggle-btn">
      <i class="iconfont el-icon-more-collapse" 
         v-if="!isCollapsed"
         @click="togglePlayer"></i>
      <i class="iconfont el-icon-more-expand"
         v-else
         @click="togglePlayer"></i>
    </div>
  </div>
</template>
  
<script>
  import * as mm from "music-metadata-browser";
  export default {
    name: 'MusicPlayer',
    data() {
      return {
        // 音乐播放器固有参数
        musicList: [],
        currentIndex: 0,
        playing: false, // 播放状态
        isRandom: false, // 是否随机播放
        volume: 50, // 音量，默认为50
        preVolume: 50,

        // 音乐播放器样式参数
        left: 30,
        top: 80,
        isDragging: false,
        isCollapsed: false,
        isClosed: false
      }
    },
    mounted() {
      this.initMusicList()
      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseUp);
    },
    beforeUnmount() {
      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);
    },
    methods: {
      async initMusicList() {
        const musicFiles = require.context('@/assets/music', true, /\.mp3$/)
        musicFiles.keys().forEach(path => {
          const musicName = path.slice(2, -4) // 截取文件名，去掉前面的 './' 和后面的 '.mp3'
          const src = musicFiles(path)
          this.musicList.push({title: musicName, src: src})
        })
        // 读取封面图片
        this.musicList.forEach(music => {
          mm.fetchFromUrl(music.src, {}).then(metadata => {
            if (metadata.common.picture && metadata.common.picture.length > 0) {
              const picture = metadata.common.picture[0];
              const url = URL.createObjectURL(new Blob([picture.data], { type: picture.format }));
              music.coverUrl = url; // 封面图片的URL保存到元数据中
            }
          });
        })
        
      },
      togglePlay() {
        const audio = this.$refs.audio
        if (audio.paused) {
          audio.play()
          this.playing = true
        } else {
          audio.pause()
          this.playing = false
        }
      },
      next() {
        this.isRandom ? this.playRandom() : this.playOrder('next')
      },
      prev() {
        this.isRandom ? this.playRandom() : this.playOrder('prev')
      },
      playOrder(type) {
        if (type === 'next') {
          this.currentIndex++
          if (this.currentIndex >= this.musicList.length) {
            this.currentIndex = 0
          }
        } 
        else {
          this.currentIndex--
          if (this.currentIndex < 0) {
            this.currentIndex = this.musicList.length - 1
          }
        }
        this.playMusic()
      },
      playRandom() {
        let index = Math.floor(Math.random() * this.musicList.length)
        while (index === this.currentIndex) {
          index = Math.floor(Math.random() * this.musicList.length)
        }
        this.currentIndex = index
        this.playMusic()
      },
      playMusic() {
        
        const audio = this.$refs.audio
        audio.volume = this.volume / 100 // 设置音量

        audio.src = this.musicList[this.currentIndex].src
        // audio.load()
        let that = this;
        audio.addEventListener('canplaythrough', () => {
          if (that.playing) 
          {
            audio.play();
          }
        });
        
        
      },
      handleEnded() {
        this.isRandom ? this.playRandom() : this.playOrder('next')
      },
      toggleRandom() {
        this.isRandom = true
      },
      toggleOrder() {
        this.isRandom = false
      },
      toggleMute() {
        // 切换静音状态
        const audio = this.$refs.audio
        if (audio.volume > 0) {
          this.preVolume = this.volume
          this.volume = 0
          audio.volume = this.volume / 100
        } 
        else {
          this.volume = this.preVolume
          audio.volume = this.volume / 100
        }
      },
      changeVolume(value) {
        // 调整音量大小
        const audio = this.$refs.audio
        audio.volume = value / 100
        this.volume = value
      },
      mouseDown(event) {
        this.isDragging = true;
        this.dragStartX = event.screenX;
        this.dragStartY = event.screenY;
        this.oldLeft = this.left;
        this.oldTop = this.top;
      },
      mouseMove(event) {
        if (!this.isDragging) {
          return;
        }
        const newLeft = this.oldLeft + event.screenX - this.dragStartX;
        const newTop = this.oldTop + event.screenY - this.dragStartY;
        this.left = newLeft;
        this.top = newTop;
      },
      mouseUp() {
        this.isDragging = false;
      },
      togglePlayer() {
        this.isCollapsed = !this.isCollapsed;
      },
      closePlayer() {
        this.$refs.audio.pause();
        this.isClosed = true;
      }
    }
  }
</script>
  
<style scoped>
  .player-container {
    position: fixed;
    z-index: 9999999;
    transition: all 0.05s ease;
  }
  .music-player {
    display: flex;
    justify-content: center;
  }
  
  .music-info {
    width: 300px;
  }
  
  .music-card {
  text-align: center;
  }
  
  .music-title {
    font-size: 20px;
    margin-bottom: 10px;
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
  }

  .music-title span {
    display: inline-block;
    animation: scroll 5s linear infinite;
    width: 100%;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .music-cover {
    text-align: center;
  }

  .music-cover img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    user-select: none;
    display: inline-block;
  }

  .rotate {
    animation: rotate 4s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .music-control {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  }
  
  .music-control i {
  font-size: 24px;
  margin: 0 10px;
  cursor: pointer;
  }
  
  .el-icon-random.active,
  .el-icon-sort.active {
  color: #409EFF;
  }

  .music-volume {
    margin-top: 10px;
  }

  .volume-slider {
    width: 200px;
    display: inline-block;
    vertical-align: middle;
  }

  .volume-icon {
    font-size: 24px;
    margin-left: 5px;
    cursor: pointer;
    vertical-align: middle;
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
    margin: 5px;
  }
  .toggle-btn {
    position: absolute;
    top: 3px;
    left: 3px;
    cursor: pointer;
  }

  .toggle-btn i {
    font-size: 30px;
  }
</style>