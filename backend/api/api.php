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
        $res_content = login($account, $password_md5);
        if ($res_content == []) {
            $res = false;
        }
        else {
            $res = true;
        }
        break;
    case 'logout':
        $cookie =  $_COOKIE['sakuyo_token'];
        $res = logout($cookie);
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
    case 'get-user-info':
        $user_id = $_POST['uid'];
        $res_content = getUserInfo($user_id);
        if ($res_content == []) {
            $res = false;
        }
        else {
            $res = true;
        }
        break;
    case 'get-user-info:cookie':
        $cookie =  $_COOKIE['sakuyo_token'];
        $res_content = getUserInfoByCookie($cookie);
        if ($res_content == []) {
            $res = false;
        }
        else {
            $res = true;
        }
        break;
    case 'set-user-info':
        $user_id = $_POST['uid'];
        $nickname = $_POST['nickname'];
        $avatar = $_POST['avatar'];
        $res = setUserInfo($user_id, $nickname, $avatar);
        break;
    case 'check-cookie':
        $cookie =  $_COOKIE['sakuyo_token'];
        $res = checkCookie($cookie);
        break;
    case 'avatar':
        $res = saveAvatar($_FILES['avatar']['name'], $_FILES['avatar']['tmp_name']);
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