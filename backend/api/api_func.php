<?php
/**
 * Created by Sakuyo
 * Date: 2021/7/11
 */
if (empty($_SERVER['DOCUMENT_ROOT'])) {
    $_SERVER['DOCUMENT_ROOT'] = '../..';
}
require $_SERVER['DOCUMENT_ROOT'].'/backend/database/database.php';

/**
 * Login
 * @param $account  the user account
 * @param $password_md5   the encoded password
 * @return boolean
 */
function login($account, $password_md5) {
    global $database;
    $login_stat = $database->has("user", [
        "AND" => [
            "account" => $account,
            "password" => $password_md5
        ]
    ]);
    if ($login_stat) {
        $random = uniqid();
        $cookie = md5(md5($account).$random);
        $database -> update('user', ['cookie'=>$cookie], ['account'=>$account, 'password'=>$password_md5]);
        return $cookie;
    }
    else {
        return false;
    }
}

function logout($cookie) {
    global $database;
    $is_login = $database -> has('user', ['cookie'=>$cookie]);
    if ($is_login) {
        $database -> update('user', ['cookie'=>''], ['cookie'=>$cookie]);
        return true;
    }
    return false;
}

/**
 * Register
 * @param $account  the user account
 * @param $password_md5   the encoded password
 * @return boolean
 */
function register($account, $password_md5) {
    global $database;
    $user_count = $database -> count('user', '*');
    $user_id = str_pad($user_count + 1, 6, "0", STR_PAD_LEFT);
    date_default_timezone_set('Asia/Shanghai');
    $create_time = date('Y-m-d H:i:s');
    $database -> insert('user', [
        'uid' => $user_id,
        'account' => $account,
        'password' => $password_md5,
        'create_time' => $create_time
    ]);
    setUserInfo($user_id, $account, '');
    return true;
}

/**
 * GetAccountExist   Get if the account exists
 * @param $account  the user account
 * @return boolean
 */
function getAccountExist($account) {
    global $database;
    $is_exist = $database -> has('user', ['account'=>$account]);
    if ($is_exist) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * GetUserInfo  Get the users' detail information
 * @param $user_id  the user id (account in number)
 * @return false|string
 */
function getUserInfo($user_id, $show_cols='*') {
    global $database;
    $data_raw = $database -> select('user_info', $show_cols, ['uid'=>$user_id]);
    if (empty($data_raw)) {
        return false;
    }
    else {
        $data = json_encode($data_raw[0]);
        return $data;
    }
    
}

function getUserInfoByCookie($cookie) {
    global $database;
    $data_raw = $database -> select('user', 'uid', ['cookie'=>$cookie]);
    if (empty($data_raw)) {
        return false;
    }
    else {
        $user_id = $data_raw[0];
        return getUserInfo($user_id);
    }

}

function setUserInfo($uid, $nickname='', $avatar='') {
    if ($nickname) {
        $new_arr['nickname'] = $nickname;
    }
    if ($avatar) {
        $new_arr['avatar'] = $avatar;
    }
    if(($nickname || $avatar) && $uid) {
        global $database;
        $is_exist = $database -> has('user_info', ['uid'=>$uid]);
        $new_arr['uid'] = $uid;
        if (!$is_exist) {
            $database -> insert('user_info', $new_arr);
        }
        else {
            $database -> update('user_info', $new_arr, ['uid'=>$uid]);
        }
        return true;
    }
    else {
        return false;
    }
}

function checkCookie($cookie) {
    global $database;
    $isValid = $database -> has('user', ['cookie'=>$cookie]);
    return $isValid;
}

function saveAvatar($file_name, $tmp_name) {
    $filepath = $_SERVER['DOCUMENT_ROOT'].'backend/data/user/avatar/';
    if(move_uploaded_file($tmp_name, $filepath.$file_name)){
        return true;
    }
    else{
        return false;
    }
}