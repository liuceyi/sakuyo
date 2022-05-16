<?php

require $_SERVER['DOCUMENT_ROOT'].'/backend/vendor/autoload.php';



use Medoo\Medoo;



$database = new Medoo([

  'database_type' => 'mysql',

  'database_name' => 'sakuyo',

  'server' => '39.108.93.3',

  'username' => 'sakuyo',

  'password' => 'GcaYHzbp4x8Rjtzw',

	'charset' => 'utf8'

]);

// $database = new Medoo([

//   'database_type' => 'mysql',

//   'database_name' => 'sakuyo',

//   'server' => 'sakuyo.com:3306',

//   'username' => 'root',

//   'password' => 'root',

// 	'charset' => 'utf8'

// ]);