<template>
  <div id="AdminOld">
    <el-table 
    ref="multipleTable" 
    :data="tableData" 
    style="width: 100%"
    align="center">
      <el-table-column prop="book_id" label="编号" :sortable='true' :sort-method="sortById" width="100"></el-table-column>
      <el-table-column prop="book_room" label="预订房型" sortable width="150"></el-table-column>
      <el-table-column prop="book_time" label="预订日期" sortable width="180"></el-table-column>
      <el-table-column prop="book_number" label="订房数量" width="100"></el-table-column>
      <el-table-column prop="client_name" label="客户姓名" sortable width="180"></el-table-column>
      <el-table-column prop="other_need" label="客户需求" width="300"></el-table-column>
      <el-table-column prop="phone_number" label="客户手机" width="180"></el-table-column>
      <el-table-column prop="room_price" label="房间单价" width="140"></el-table-column>
      <el-table-column prop="total_price" label="订单总价" width="140"></el-table-column>

    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="tableCount">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
axios.defaults.withCredentials = true;
//import {urlList} from '@/js/urllist.js';
export default {
  name: 'AdminOld',

  data(){
    return{
        errorText:'',
        tableData:[],
        tableDataTotal:[],
        tableCount:0,
        currentPage:1
      }
    },
    mounted(){
      this.getTable();
    },
    methods: {
      getTable(){    
          var that = this;
          var data = qs.stringify({'tab':'oldpage'});     
          axios.post(urlList[4],data
          )
          .then(response=>{
            that.tableDataTotal = response.data;
            that.tableCount = that.tableDataTotal.length;
            that.createTable();
          }
          )
          .catch(function (error) {
            that.$message.error = 'ajax错误'+error;
          });
      }
      
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

.background--room {
  background: #f6f6f6;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}




</style>