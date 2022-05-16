<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/3

 */

require_once '../setting.php';
require_once ROOT_PATH.'/api/api_func.php';
require_once './basic_socket.php';

class ChatServer extends SocketService
{

  // Property





}

// Run the server

$port = 9998;

$sock = new ChatServer('0.0.0.0',$port);

$sock->run();



?>