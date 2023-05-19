<template>
  
  <div class="hunt-container">
    <div style="display: flex; flex-direction: row;">
      <div class="block">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="To"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          value-format='x'
        />
      </div>
      <el-button type="primary" @click="filterData" style="margin-left: 20px;" :loading="searching">Search</el-button>
    </div>
    <el-table :data="formatData" height="500" style="width: 90%">
      <el-table-column prop="section_id" label="板块ID" width="180" sortable>
        <template #default="scope">
          <el-tag disable-transitions :color="sectionColors[scope.row.section_id]" type="info" effect="dark">
            {{ scope.row.section_id }}
          </el-tag>
      </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="create_time" label="创建时间" width="180" sortable />
      <el-table-column prop="user" label="用户" width="180" />
      <el-table-column prop="link" label="链接">
        <template #default="scope">
          <el-link :href="scope.row.link" type="info" target="_blank">
            {{scope.row.link}}
          </el-link>
        </template>
      </el-table-column>

    </el-table>
    <span class="local-time">{{currentTime}}</span>
  </div>
</template>

<script>
  export default {
    name:'InstaViewer',
    components: {

    },
    data() {
      return {
        formatData: [],
        timeRange: null,
        searching: false,
        sectionColors: {
          '14': '#000080',
          '17': '#9400D3',
          '19': ''
        },
        shortcuts: [
          {
            text: '一天前',
            value: () => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setHours(18, 30, 0);
              console.log(start);
              return [start, end];
            },
          },
          {
            text: '三天前',
            value: () => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              start.setHours(18, 30, 0);
              return [start, end]
            },
          },
          {
            text: '一周前',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              start.setHours(18, 30, 0);
              return [start, end]
            },
          },
          {
            text: '一个月前',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              start.setHours(18, 30, 0);
              return [start, end]
            },
          },
          {
            text: '半年前',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
              start.setHours(18, 30, 0);
              return [start, end]
            },
          },
        ]
        // currentTime: this.timeFormate(new Date())
      }
    },
    mounted() {
      // this.wsRun();
    },
    methods: {
      wsRun() {
        // this.ws = new WebSocket("ws://localhost:4369");
        this.ws = new WebSocket("wss://sakuyo.cn:4369");
        let that = this;
        this.ws.onopen = function (event) {
          console.log("Connection open.", event);
        };

        this.ws.onmessage = function (event) {
          console.log("Received Message: ", event);
          let msg_obj = JSON.parse(event['data']);
          that.handleMsg(msg_obj);
        };

        this.ws.onclose = function (event) {
          console.log("Connection closed." , event);
        };
      },

      handleMsg(msg_obj) {
        let msg_type = msg_obj['type']
        switch (msg_type) {
          case 'handshake':
            this.ws.send(JSON.stringify({'type': 'heartbeat', 'content': null}));
            break;
          case 'form': {
            let msg_content = eval(JSON.parse(msg_obj['content']));
            let temp_arr = [];
            for (let i in msg_content) {
              temp_arr.push(msg_content[i]);
            }
            this.formatData = temp_arr;
            this.searching = false;
            break;
          }
          default:
            break;
        }
      },

      // async filterData() {
      //   let msg = {
      //     'type': 'filter', 
      //     'content': {
      //       // 'section': 14,
      //       'time': JSON.parse(JSON.stringify(this.timeRange))
      //     }};
      //   this.ws.send(JSON.stringify(msg));
      //   this.searching = true;
      // }

      // 获取数据
      filterData() {
        let that = this;
        let data = {
          'type': 'filter', 
          'startTime': JSON.parse(JSON.stringify(this.timeRange[0])),
          'endTime': JSON.parse(JSON.stringify(this.timeRange[1])),
        };
        this.axios.post('http://sakuyo.cn:4369', that.qs.stringify(data)).then(res=>{
          console.log(res.data);
          if (res.data.status == 'Success') {
            console.log('success');
          }
        })
      }

      
    },

    watch: {

    }
  }
</script>

<style scoped>
  .hunt-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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