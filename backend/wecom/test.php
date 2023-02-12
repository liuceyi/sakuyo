<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

require_once './scraper.php';

require_once './distributor.php';
$dis = new Distributor();

$send_room_list = $dis->distribute(['content' => "test fdafhsadjkfh afdajhadklf ", "images" => []]);
$rooms = [];
foreach ($send_room_list as $room) 
{
    $rooms[] = $room['name'];
}
print_r($rooms);

?>