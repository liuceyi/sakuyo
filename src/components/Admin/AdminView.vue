<template>
  <div id="AdminView">
    <el-table 
    ref="multipleTable" 
    :data="tableData" 
    style="width: 100%"  
    align="center" 
    highlight-current-row 
    @current-change="singleChange" 
    @selection-change="multipleChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="book_id" label="编号" :sortable='true' :sort-method="sortById" width="100"></el-table-column>
      <el-table-column label="订单状态" sortable width="150">
        <template v-slot="scope">
          <p>{{ transword(scope.row.book_success) }}</p>
        </template>
      </el-table-column>    
      <el-table-column prop="book_room" label="预订房型" sortable width="150"></el-table-column>
      <el-table-column prop="book_time" label="预订日期" sortable width="180"></el-table-column>
      <el-table-column prop="book_number" label="订房数量" width="100"></el-table-column>
      <el-table-column prop="client_name" label="客户姓名" sortable width="180"></el-table-column>
      <el-table-column prop="other_need" label="客户需求" width="300"></el-table-column>
      <el-table-column prop="phone_number" label="客户手机" width="180"></el-table-column>
      <el-table-column prop="room_price" label="房间单价" width="140"></el-table-column>
      <el-table-column prop="total_price" label="订单总价" width="140"></el-table-column>

    </el-table>
    <div style="margin: 20px">
      <el-button @click="singleTarget" v-show="singleShow">处理</el-button>
      <el-button @click="multipleTarget" v-show="multipleShow">批量处理</el-button>
      <el-button @click="multipleCancel()" v-show="multipleShow">取消</el-button>
    </div>
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
  name: 'AdminView',

  data(){
    return{
        errorText:'',
        tableData:[],
        tableDataTotal:[],
        currentRow:null,
        multipleSelection: [],
        singleShow:true,
        multipleShow:false,
        tableCount:0,
        currentPage:1
      }
    },
    mounted(){
      this.getNeedDeal();
      this.getTable();
    },
    methods: {
      sortById(a,b){
        let val1 = a.book_id;
        let val2 = b.book_id;
        return val2 - val1
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.createTable();
      },
      singleTarget(){
        var that=this;
        var data = qs.stringify({book_id: this.currentRow.book_id,type:'single'});
        axios.post(urlList[5],data
          )
          .then(response=>{
            const h = that.$createElement;
            that.$notify({
              title: '处理成功',
              message: h('i', { style: 'color: teal'}, '编号：'+that.currentRow.book_id+'处理完毕')
            });
            that.currentRow.book_success = "1";
          }
          )
          .catch(function (error) {
            that.$message.error = 'ajax错误'+error;
          });
      },
      multipleTarget(){
        var that=this;
        var bookIdList=[];
        for(var i=0;i<this.multipleSelection.length;i++){
          bookIdList[i] = this.multipleSelection[i].book_id;
        }
        
        var data = qs.stringify({book_id:bookIdList,type:'multiple'});
        axios.post(urlList[5],data
          )
          .then(response=>{
            const h = that.$createElement;
            that.$notify({
              title: '处理成功',
              message: h('i', { style: 'color: teal'}, '订单批量处理完毕')
            });
            for(var i=0;i<that.multipleSelection.length;i++){
              that.multipleSelection[i].book_success = '1';
            }            
          }
          )
          .catch(function (error) {
            that.$message.error = 'ajax错误'+error;
          });
      },
      singleChange(val){
        this.currentRow = val;
      },
      multipleChange(val){
        this.multipleSelection = val;
      },
      transword(index){
        if(index === '0') return "未处理";
        else if(index === '1') return "已处理";
      },
      tableRowClassName({row, rowIndex}){
        for(var i=0;i<this.tableData.length;i++){
          if(this.tableData[i].book_success === '0'){
            if(rowIndex === i){
              return 'warning-row';
            }
          }
          else if(this.tableData[i].book_success === '1'){
            if(rowIndex === i){
              return 'success-row';
            }
          }
        }      
      },
      getNeedDeal(){
        var that = this;
        var data = qs.stringify({'tab':'need'});
        axios.post(urlList[4],data
          )
          .then(response=>{
            that.$emit("valueGet",{value:response.data});        
          }
          )
          .catch(function (error) {
            that.$message.error = 'ajax错误'+error;
          });
        
      },
      getTable(){ 
          var that = this;   
          var data = qs.stringify({'tab':'needpage'});     
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
      },
      createTable(){
        var val = this.currentPage;
        if(this.tableCount <= 10){
          this.tableData = this.tableDataTotal;
        }
        else{
          var pageNum = Math.floor(this.tableCount/10);
          var pageLess = this.tableCount % 10;
          if(pageLess == 0){
            this.tableData = this.tableDataTotal.slice((val-1)*10,val*10)
          }
          else{
            if(val <= pageNum) {
              this.tableData = this.tableDataTotal.slice((val-1)*10,val*10)
            }
            else {            
              this.tableData = this.tableDataTotal.slice(this.tableCount - pageLess,this.tableCount)
            }
          }
        }
      },
      multipleCancel(rows){
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
        this.singleShow = true;
        this.multipleShow = false;        
      },

    },
    watch:{
      currentRow(curVal){
        if(curVal){
          this.singleShow = true;
          this.multipleShow = false;
        }
      },
      multipleSelection(curVal){
        if(curVal.length != 0){
          this.singleShow = false;
          this.multipleShow = true;
        }
        else if(curVal.length == 0){
          this.singleShow = true;
          this.multipleShow = false;          
        }
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