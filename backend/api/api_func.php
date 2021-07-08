<?php
public function GetUserAccount($show_cols='*', $username, $password) {
    $data_raw = $database -> select('user', '*', '');
    $data = json_encode($data_raw);
    return $data;
}
public function GetUserInfo($show_cols='', $userId) {

}