<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/3

 */
require_once '../setting.php';
require_once ROOT_PATH.'/api/api_func.php';

class SocketService 
{
  // Property

  public $ws;

  private $address;

  private $port;

  public $clients = array(0=>array());

  // Constant

  const WS_STATUS_INVALID = 407;

  const WS_STATUS_TIMEOUT = 408;

  const WS_STATUS_SUCCESS = 200;

  const WS_STATUS_ERROR = 400;


  const HEARTBEAT_TIME = 30; 

  /** 
   * __construct
   * constructor of basic socket class
   * @access public
   * @param string $address IP address
   * @param int $port IP port
   * @return null
   */
  public function __construct($address='', $port='') 
  {
    if(!empty($address)) 
    {
      $this->address = $address;
    }

    if(!empty($port))  
    {
      $this->port = $port;
    }
  }


  /** 
   * run
   * Core function of socket server, init the socket server and import the functions
   * @access final public
   * @param
   * @return null
   */
  final public function run()
  {
    // Listen to port 
    $this->ws = new swoole_websocket_server($this->address, $this->port, SWOOLE_PROCESS, SWOOLE_SOCK_TCP | SWOOLE_SSL);

    // setting
    $this->ws->set([ 
      'daemonize' => false, 
      // setting SSL
      'ssl_cert_file' => "/www/server/panel/vhost/ssl/www.sakuyo.cn/fullchain.pem",
      'ssl_key_file' => "/www/server/panel/vhost/ssl/www.sakuyo.cn/privkey.pem"
    ]);

    // Bind to events
    $this->ws->on('start', [$this,'onStart']);
    $this->ws->on('open', [$this,'onOpen']);
    $this->ws->on('message', [$this,'onMessage']);
    // $this->ws->on('close', [$this,'onClose']);
    $this->ws->on('request', [$this, 'onRequest']);

    // Run event
    $this->ws->start();
  }

  public function onStart() 
  {
    echo "server starts running... \r\n";
  }

  public function onOpen($ws, $request) 
  {
    // Check if user is valid
    if (true) 
    {
      $cookie = $request->get['cookie'];
      $data_raw = getUserInfoByCookie($cookie);
      $data = json_decode($data_raw, true);

      // Check if it's reconnecting
      $uid = $data['uid'];
      list($room_id, $key) = $this->searchByUid($uid);

      echo "key:{$key}, room:{$room_id} \r\n";

      // If user exists
      if ($key !== false) 
      {
        $this->clients[$room_id][$key]['fd'] = $request->fd;

        $msg = $this->reconnectEvent($room_id, $uid, $request->fd);

        $this->ws->push($request->fd, $this->packMsg($msg));

        echo "{$client_data['nickname']} reconnected to room{$room_id}.\r\n";
      }

      // New user
      else 
      {
        $client_data = $data;

        $client_data['fd'] = $request->fd;

        echo "{$client_data['nickname']} joined.\r\n";

        $this->addClient($client_data);
      }

    }

    else 
    {
      echo $ws->close($request->fd);
    }

  }
  
  /** 
   * reconnectEvent
   * Custom Event for reconnecting
   * @access public
   * @param string $room_id unique code of room
   * @param string $uid unique code of user
   * @param object $fd unique code of socket connection
   * @return array $msg msg object that contains flag and room-id to guide the client
   */
  protected function reconnectEvent($room_id, $uid, $fd) 
  {
    $msg = array(
      'flag' => 'room-id',
      'data' => array(
        'room-id' => $room_id
      )
    );
    return $msg;
  }

  public function onMessage($ws, $frame) 
  {
    $client_data = json_decode($frame->data, true);
    $client_data['fd'] = $frame->fd;
    list($room_id, $key) = $this->searchByFd($frame->fd);

    switch($client_data['flag']) 
    {
      case 'msg':
        $this->broadcast($this->packMsg($client_data), $room_id);
        break;

      case 'logout':
        $this->removeClient($client_data['fd']);
        break;

      case 'user-list':
        $this->broadcast($this->packMsg($this->getPlayerList($room_id)), $room_id);
        break;

      default:
        $this->onMessageCustomEvent($client_data['flag'], $client_data);
        break;
    }
  }
  
  /** 
   * onMessageCustomEvent
   * Custom Event for onMessage Func
   * @access public
   * @param string $flag To identify the undefined events which may be defined by child class
   * @param array $client_data client data
   * @return null
   */
  protected function onMessageCustomEvent($flag, $client_data) {
    // Keep empty for basic class
  }

  public function onClose($ws, $fd)
  {
    list($room_id, $key) = $this->searchByFd($fd);

    // If user exists
    if($key !== false){
      $client_data = $this->clients[$room_id][$key];
      $client_name = $client_data['nickname'];

      $msg = array(
        'flag' => 'leave',
        'fd' => $fd,
        'nickname' => $client_name
      );

      // In public room
      if ($room_id == 0) {
        $this->removeClient($fd, $room_id);
        $this->broadcast($this->packMsg($msg), $room_id);
        echo "client:{$client_name} has closed\r\n";
      }

      // Quit the room that created by users
      if ($room_id != 0) {

        // $is_gaming = array_key_exists($room_id, $this->games);

        // $game_key = $this->games[$room_id]->searchPlayerByFd($fd);

        // if ($is_gaming) {

        //   $this->games[$room_id]->players[$game_key]['online'] = false;

        //   echo "player:{$client_name} has disconnected\r\n";

        // }

        $this->onCloseCustomEvent($room_id, $fd);

      }
    }
  }

  /** 
   * onCloseCustomEvent
   * Custom Event for socket closing
   * @access protected
   * @param string $room_id unique code of room
   * @param object $fd unique code of socket connection
   * @return null
   */
  protected function onCloseCustomEvent($room_id, $fd) 
  {

  }

  public function onRequest($req, $res) {

  }


  /** 
   * createRoom
   * Create a new room
   * @access public
   * @param 
   * @return string $room_id unique room id
   */
  public function createRoom()
  {
    $room_id = uniqid();
    $this->clients[$room_id] = array();
    return $room_id;
  }


  /** 
   * switchRoom
   * switch to a new room (default is public room)
   * @access public
   * @param string $uid unique code of user
   * @param string $new_room_id unique code of room
   * @return null
   */
  public function switchRoom($uid, $new_room_id=0)
  {

    list($room_id, $key) = $this->searchByUid($uid);

    if ($key !== false && $room_id != $new_room_id) 
    {
      $data = $this->clients[$room_id][$key];
      $host = $data['host'];

      if ($host==true && count($this->clients[$room_id])>1 && $room_id !== 0) 
      {
        echo "change host \r\n";        
        // $this->clients[$room_id][0]['host'] = true;
        $this->switchRoomHost($room_id);
      }

      $data['host'] = false;
      $this->removeClient($data['fd'], $room_id);
      $this->addClient($data, $new_room_id);
    }

    if (count($this->clients[$room_id])<1 && $room_id !== 0) 
    {
      unset($this->clients[$room_id]);
    }
  }


  /** 
   * switchRoomHost
   * switch the host of a room
   * @access public
   * @param string $room_id unique code of room
   * @return null
   */
  public function switchRoomHost($room_id) 
  {
    $room = $this->clients[$room_id];
    $host_key = null;

    foreach ($room as $key => $client) 
    {
      if ($client['host'] == true) 
      {
        $host_key = $key;
      }
    }

    if ($host_key === null || count($room)<=1 || $room_id === 0) 
    {
      return;
    }

    $keys = array_keys($room);
    array_splice($keys, $host_key, 1);
    $new_host = $keys[0];

    $this->clients[$room_id][$host_key]['host'] = false;
    $this->clients[$room_id][$new_host]['host'] = true;

    print_r($this->clients);
  }


  /** 
   * addClient
   * add a new client to a room
   * @access public
   * @param object $data information of user
   * @param string $room_id unique code of room
   * @return bool
   */
  public function addClient($data, $room_id=0) 
  {
    array_push($this->clients[$room_id], $data);
    $player_list = $this->getPlayerList($room_id);
    $send_data = $this->packMsg($player_list);
    $this->broadcast($send_data, $room_id);
    return true;
  }


  /** 
   * removeClient
   * remove a client from a targeted room
   * @access public
   * @param object $fd
   * @param string $room_id 
   * @return bool
   */
  public function removeClient($fd, $room_id=0) 
  {
    $key = array_search($fd, array_column($this->clients[$room_id], 'fd'));

    if ($key !== false) 
    {
      array_splice($this->clients[$room_id], $key, 1);
      $player_list = $this->getPlayerList($room_id);
      $send_data = $this->packMsg($player_list);

      $this->broadcast($send_data, $room_id);
      return true;
    }

    else 
    {
      return false;
    }

  }


  /** 
   * searchByUid
   * search user by his uid
   * @access public
   * @param string $uid unique code of user
   * @return array(string $room_id, bool $key)
   */
  public function searchByUid($uid) 
  {

    foreach ($this->clients as $room_id => $clients_room) 
    {
      $key = array_search($uid, array_column($clients_room, 'uid'));

      if ($key !== false) 
      {
        // exist
        return array($room_id, $key);
      }
    }

    return array(0, false);
  }


  /** 
   * searchByFd
   * search user by his fd
   * @access public
   * @param object $fd unique code of user socket connection
   * @return array(string $room_id, bool $key)
   */
  public function searchByFd($fd)
  {
    foreach ($this->clients as $room_id => $clients_room) 
    {
      $key = array_search($fd, array_column($clients_room, 'fd'));
      if ($key !== false) 
      {
        // exist
        return array($room_id, $key);
      }
    }

    return array(0, false);
  }


  /** 
   * broadcast
   * Broadcast message to every user in a targeted room
   * @access public
   * @param array $data
   * @param string $room_id
   * @return null
   */
  public function broadcast($data, $room_id=0) 
  {
    $target_clients = $this->clients[$room_id];
    foreach(array_column($target_clients, 'fd') as $client) 
    {
      $this->ws->push($client, $data);
      echo 'push: '.$data."\r\n";
    }
  }

  
  /** 
   * getOnlineList
   * get every known clients in their connections
   * @access public
   * @param 
   * @return array
   */
  public function getOnlineList() 
  {
    return $this->clients;
  }


  /** 
   * getPlayerList
   * get player list in a targeted room for users
   * @access public
   * @param string $room_id unique code of a room (default is public room = 0) 
   * @return array $data message of player list
   */
  public function getPlayerList($room_id=0)
  {

    $data = array(
      'flag' => 'user-list',
      'data' => $this->clients[$room_id]
    );

    // echo 'player list:';

    // print_r($data);

    return $data;

  }

  /** 
   * packMsg
   * packing message in a standard format
   * @access private
   * @param array $msg message array
   * @param int $sign sign of response
   * @return string
   */
  protected function packMsg($msg, $sign=self::WS_STATUS_SUCCESS) 
  {
    $data = array(

      'sign' => $sign,

      'data' => $msg

    );
    return json_encode($data);
  }

}

