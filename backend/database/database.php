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