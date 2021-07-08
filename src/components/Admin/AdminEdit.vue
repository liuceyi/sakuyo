<template>
  <div>
    <el-table 
    ref="multipleTable" 
    :data="tableData" 
    style="width: 100%;"  
    highlight-current-row 
    @current-change="singleChange"
    align="center" 
    >
    <el-table-column prop="room_id" label="房型编号" sortable width="150"></el-table-column>
    <el-table-column prop="room_name" label="房间类型" sortable width="150"></el-table-column>
    <el-table-column prop="room_number" label="房间余量" sortable width="150"></el-table-column>
    <el-table-column prop="room_price" label="房间价格" width="100"></el-table-column>
    <el-table-column label="编辑价格" width="100">
      <template v-slot="scope">
        <el-button
          size="mini"
          @click="priceEdit(scope.$index, scope.row)">编辑价格
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="编辑房量" width="100">
      <template v-slot="scope">
        <el-button
          size="mini"
          type="primary"
          @click="roomEdit(scope.$index, scope.row)">编辑房量
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="禁用"  width="100">
      <template v-slot="scope">
        <el-button v-if="scope.row.room_banned==0" size="mini" type="danger" @click="roomBan(scope.$index, scope.row)">禁用房间</el-button>
        <el-button v-if="scope.row.room_banned==1" size="mini" type="success" @click="roomUnBan(scope.$index, scope.row)">解锁房间</el-button>
      </template>
    </el-table-column>
        <el-table-column label="房间状态" sortable width="150">
      <template v-slot="scope">
        <p>{{ transword(scope.row.room_banned) }}</p>
      </template>
    </el-table-column> 
  </el-table>


  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
axios.defaults.withCredentials = true;
//import {urlList} from '@/js/urllist.js';
export default {
  name: 'AdminEdit',
  components: {

  },
  data(){
    return{
      tableData:[]
    }
  },
  mounted(){
    this.getTable();
  },
  methods: {
    getTable(){    
      var that = this;
      var data = qs.stringify({'tab':'pricepage'});     
      axios.post(urlList[4],data
      )
      .then(response=>{
        that.tableData = response.data;
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

</style>