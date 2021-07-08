<?php

require $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';

use Medoo\Medoo;

// Using Medoo namespace
header('Access-Control-Allow-Origin:localhost:8080');
header("Access-Control-Allow-Credentials:true");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT,DELETE,OPTIONS');
header("Content-type: text/json; charset=utf-8");//字符编码设置

$database = new Medoo([
    'database_type' => 'mysql',
    'database_name' => 'sakuyo',
    'server' => 'localhost',
    'username' => 'root',
    'password' => 'root',
	'charset' => 'utf8'
]);
