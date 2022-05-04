<template>
  <div class="hunt-container">
    
    <div></div>
    <el-table :data="formatTimeData" style="width: 70%">
      
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="format_time[0]" label="本机时间" width="180" />
      <el-table-column prop="departure_station" label="始发站" width="180" />
      <el-table-column prop="description" label="描述" />

    </el-table>
    <span class="local-time">{{currentTime}}</span>
  </div>
</template>

<script>
  export default {
    name:'FF14Hunt',
    components: {

    },
    data() {
      return {
        formatTimeData: null,
        currentTime: this.timeFormate(new Date())
      }
    },
    created() {
      let that = this;
      this.nowTimes();
      this.jsonp('https://ffxivhuntcn.com/static/js/chunk-6e12bd40.b12a5f0f.js', function() {
        that.formatTimeData = that.FormatHuntTime(that.GetHuntTime());
        that.formatTimeData.sort(that.SortTimeByNearest());
        for (let i = 0; i < that.formatTimeData.length; i++) {
          for (let j = 0; j < that.formatTimeData[i].format_time.length; j++) {
            that.formatTimeData[i].format_time[j] = that.FormatTimeToHM(that.formatTimeData[i].format_time[j]);
          }
        }
      });
    },
    methods: {
      nowTimes(){
        this.currentTime = this.timeFormate(new Date());
        self.setInterval(() => {
          self.setTimeout(() => {
            this.nowTimes()
          }, 0)
        }, 1000);
        // this.clear()
      },
      timeFormate(time_raw) {
        let year = time_raw.getFullYear();
        let month = time_raw.getMonth() + 1 < 10? "0" + (time_raw.getMonth() + 1): time_raw.getMonth() + 1;
        let date = time_raw.getDate() < 10? "0" + time_raw.getDate(): time_raw.getDate();
        let hh = time_raw.getHours() < 10? "0" + time_raw.getHours(): time_raw.getHours();
        let mm = time_raw.getMinutes() < 10? "0" + time_raw.getMinutes(): time_raw.getMinutes();
        let ss = time_raw.getSeconds() < 10? "0" + time_raw.getSeconds(): time_raw.getSeconds();
        return year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm + ':' + ss;
      },
      GetTimeOffset() {
        return (new Date().getTimezoneOffset()/60) + 8;
      },
      UTCToLocalTimeString(d) {   
        d.setHours(d.getHours() + this.GetTimeOffset());
        return d;
      },
      GetTimeDiff(t) {
        let val = t.getTime();
        let currentTime = new Date().getTime();
        let timeDiff = val >= currentTime ? val - currentTime : val + 24 * 60 * 60 * 1000 - currentTime;
        return timeDiff;
      },
      FormatTimeToHM(time_raw) {
        let h = time_raw.getHours();
        h = h < 10 ? '0' + h : h;
        let m = time_raw.getMinutes();
        m = m < 10 ? '0' + m : m;
        return h + ':' + m;
      },
      SortTimeByNearest() {
        let that = this;
        return function (a, b) {
          let aDiff;
          let bDiff;
          
          a.format_time.sort(function(aa, ab) {
            let aVal = that.GetTimeDiff(aa);
            let bVal = that.GetTimeDiff(ab);
            return aVal - bVal;
          });
          b.format_time.sort(function(ba, bb) {
            let aVal = that.GetTimeDiff(ba);
            let bVal = that.GetTimeDiff(bb);
            return aVal - bVal;
          });
          aDiff = a.format_time[0];
          bDiff = b.format_time[0];
          return aDiff - bDiff;
        }
      },
      FormatHuntTime(huntTrainsRaw) {
        if (!huntTrainsRaw) return null;

        let timeOffset = this.GetTimeOffset();
        let huntTrains = huntTrainsRaw;
        for (let i = 0; i < huntTrains.length; i++) {
          let huntTrain = huntTrains[i];
          let huntTimesRaw = huntTrain.time_table;
          let huntTimes = [];
          huntTimesRaw.forEach(huntTime => {
            let times = huntTime.split('&');
            huntTimes = huntTimes.concat(times);
          });
          huntTrain.format_time = [];
          for (let j = 0; j < huntTimes.length; j++) {
            const huntTime = huntTimes[j];
            if (huntTime == '-') continue;
            let huntTimeArr = huntTime.split(':');
            let huntTimeFormat = this.UTCToLocalTimeString(new Date()); // 获取当前北京时间
            huntTimeFormat.setHours(parseInt(huntTimeArr[0]));
            huntTimeFormat.setMinutes(parseInt(huntTimeArr[1]));
            huntTimeFormat = huntTimeFormat.getTime() - timeOffset * 60 * 60 * 1000;
            if (huntTimeFormat < new Date().getTime()) huntTimeFormat += 24 * 60 * 60 * 1000;
            huntTrain.format_time.push(new Date(huntTimeFormat));
          }
        }
        return huntTrains;
      },
      GetHuntTime() {
        let e = {};
        window.webpackJsonp.slice(-1)[0][1]['48f8'](e);
        let huntTrains = e.exports['a']['children'];
        return huntTrains;
      },
      jsonp(url, callback) {
        let body = document.getElementsByTagName('body')[0];
        let script = document.createElement('script');
        script.setAttribute('src', url);
        if (script.addEventListener) {
          script.addEventListener('load', function () {
            callback();
          }, false);
        } 
        else if (script.attachEvent) {
          script.attachEvent('onreadystatechange', function () {
            let target = window.event.srcElement;
            if (target.readyState == 'loaded') {
              callback();
            }
          });
        }
        body.appendChild(script);
        return true;
      }
    },
    watch: {

    }
  }
</script>

<style scoped>
  .hunt-container {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
  .local-time {
    color: #DCDCDC;
  }
  :deep() .el-table {
    background-color: #292929;
    color: #989898;
  }
  :deep() .el-table th, :deep() .el-table tr {
    background-color: transparent;
  }
</style>