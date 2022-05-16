<?php

/**
 * Created by Sakuyo
 * Date: 2022/5/6
 */

 



/**
** @desc 封装 curl 的调用接口，get的请求方式
**/

function getRequest($url, $data=null, $timeout=30) 
{
    if($url == "" || $timeout <= 0) {
        return false;
    }

    if ($data != null) {
        $url = $url.'?'.http_build_query($data);
    }

    $con = curl_init((string)$url);
    curl_setopt($con, CURLOPT_HEADER, false);
    curl_setopt($con, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($con, CURLOPT_TIMEOUT, (int)$timeout);
    curl_setopt($con, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($con, CURLOPT_SSL_VERIFYPEER, 0);
    $res = curl_exec($con);
    if ($res === false) {
        throw new Exception(curl_error($con), curl_errno($con));
    }
    var_dump($res);
    return json_decode($res, true);
}



/**

** @desc 封装 curl 的调用接口，post的请求方式

**/

function PostRequest($url, $data, $timeout=30)
{
    if($url == '' || empty($data) || $timeout <=0) {
        return false;
    }

    $con = curl_init((string)$url);
    curl_setopt($con, CURLOPT_HEADER, false);
    curl_setopt($con, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($con, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    // curl_setopt($con, CURLOPT_POST, true);
    curl_setopt($con, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($con, CURLOPT_TIMEOUT, (int)$timeout);
    curl_setopt($con, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($con, CURLOPT_SSL_VERIFYPEER, 0);
    $res = curl_exec($con);
    if ($res === false) {
        throw new Exception(curl_error($con), curl_errno($con));
    }
    return json_decode($res, true); 
}



















?>