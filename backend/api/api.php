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
$flag = $_POST['flag'];

switch ($flag) {
    case 'login':
        echo $account;
        $account = $_POST['account'];
        $password_md5 = $_POST['password'];
        $res = login($account, $password_md5);
        break;
    case 'logout':
        $res = logout();
        break;
    case 'register':
        $account = $_POST['account'];
        $password_md5 = $_POST['password'];
        $res = register($account, $password_md5);
        break;
    case 'account-exist':
        $account = $_POST['account'];
        $res = getAccountExist($account);
        break;
    case 'user-info':
        $user_id = $_POST['uid'];
        $res_content = getUserInfo($user_id);
        if ($res_content == []) {
            $res = false;
        }
        else {
            $res = true;
        }
        break;
    default:
        $res = false;
        break;
}

if ($res) {
    $res_stat = 'Success';
}
else {
    $res_stat = 'Failed';
}
$res_msg = array(
    'status' => $res_stat,
    'content' => $res_content
);
echo json_encode($res_msg);










?>