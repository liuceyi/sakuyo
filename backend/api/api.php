<?php

require $_SERVER['DOCUMENT_ROOT'].'/database/database.php';
require $_SERVER['DOCUMENT_ROOT'].'/api/api_func.php';
$flag = $_POST['flag'];

switch ($flag) {
    case 'user-account':
        $res = GetUserAccount()
        break;
    case 'user-info':
        $res = GetUserInfo()
        break;
    default:
        $res = 'error'
        break;
}










?>