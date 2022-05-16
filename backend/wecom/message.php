<?php
/**
 * Created by Sakuyo
 * Date: 2021/7/11
 */
// header("Access-Control-Allow-Origin:http://localhost:8080");
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Credentials:true");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-type: text/json; charset=utf-8");

require $_SERVER['DOCUMENT_ROOT'].'/backend/api/api_func.php';


function print_log($path, $data){
    $file = fopen($path, "a");  
    fwrite($file, date('Y-m-d H:i:s').''.$data."\r\n");  
    fclose($file);
}

print_log("./msgs-".date('Y-m-d').".txt", $_POST['data'])
?>