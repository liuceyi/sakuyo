<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/3

 */

require_once '../setting.php';

require_once ROOT_PATH.'/api/api_func.php';

require_once './basic_socket.php';

require_once ROOT_PATH.'/game/draw_something.php';



class DrawServer extends SocketService
{

    // Property
    public $games = array();

    public function reconnectEvent($room_id, $uid, $fd)
    {
      $is_gaming = array_key_exists($room_id, $this->games);
      $msg = array(
        'flag' => 'room-id',
        'data' => array(
          'room-id' => $room_id,
          'status' => $is_gaming
        )
      );
  
      if ($is_gaming) 
      {
        $game_key = $this->games[$room_id]->searchPlayerByUid($uid);
        $this->games[$room_id]->players[$game_key]['fd'] = $request->fd;
        $this->games[$room_id]->players[$game_key]['online'] = true;
      }
      return $msg;
    }

    public function onMessageCustomEvent($flag, $client_data) 
    {
      switch($flag) 
      {
        case 'draw':
          $this->broadcast($this->packMsg($client_data), $room_id);
          break;
        case 'game':
          $this->dealGame($client_data);
          break;
        default:
          break;
      }
    }

    public function onCloseCustomEvent($room_id, $fd)
    {
      $is_gaming = array_key_exists($room_id, $this->games);
      $game_key = $this->games[$room_id]->searchPlayerByFd($fd);

      if ($is_gaming) 
      {
        $this->games[$room_id]->players[$game_key]['online'] = false;
        echo "player:{$client_name} has disconnected\r\n";
      }

    }

    public function dealGame($data) 
    {

        $msg_temp = array(

            'flag' => 'game',

            'data' => array()

        );

        $msg = $msg_temp;

        $event = $data['event'];

        $uid = $data['uid'];

        list($room_id, $key) = $this->searchByUid($uid);

        switch ($event) {

            // Out game

            case 'create':

                $new_room_id = $this->createRoom();

                $this->switchRoom($uid, $new_room_id);

                $msg['data']['tag'] = 'room'; 

                $msg['data']['content'] = $new_room_id;

                list($room_id, $key) = $this->searchByUid($uid);

                $this->ws->push($this->clients[$room_id][$key]['fd'], $this->packMsg($msg));

                $this->clients[$room_id][$key]['host'] = true;

                break;

            case 'join':

                $new_room_id = trim($data['content']);

                if (isset($this->clients[$new_room_id])) {

                    $this->switchRoom($uid, $new_room_id);

                    $msg['data']['tag'] = 'room'; 

                    $msg['data']['content'] = $new_room_id;

                    list($room_id, $key) = $this->searchByUid($uid);

                    $this->clients[$room_id][$key]['host'] = false;

                    $this->ws->push($this->clients[$room_id][$key]['fd'], $this->packMsg($msg));

                }

                break;

            // In game

            case 'start':

                $new_game = new DrawSomething($room_id);

                $this->games[$room_id] = $new_game;

                $this->games[$room_id]->start($this->clients[$room_id], 3); // Input players and rounds (changable)

                $msg['data']['tag'] = 'game';

                $msg['data']['content'] = $this->games[$room_id]->getGame();

                $this->broadcast($this->packMsg($msg), $room_id);

                break;

            case 'new-word':

                $game_key = $this->games[$room_id]->searchPlayerByUid($uid);

                echo "Create word to {$game_key}";

                $msg['data']['tag'] = 'word';

                $msg['data']['content'] = $this->games[$room_id]->getGameWord();

                $this->ws->push($this->games[$room_id]->players[$game_key]['fd'], $this->packMsg($msg));

                break;

            case 'word':

                $game_key = $this->games[$room_id]->searchPlayerByUid($uid);

                echo "Send word to {$game_key}";

                $msg['data']['tag'] = 'word';

                $msg['data']['content'] = $this->games[$room_id]->game_word;

                $this->ws->push($this->games[$room_id]->players[$game_key]['fd'], $this->packMsg($msg));

                break;

            case 'check':

                $game_key = $this->games[$room_id]->searchPlayerByUid($uid);

                if ($this->games[$room_id]->playerInput($data['content']['content'], $game_key)) {

                    echo 'true answer';

                    $msg['data']['tag'] = 'check'; 

                    $msg['data']['content'] = true;

                    $this->ws->push($this->games[$room_id]->players[$game_key]['fd'], $this->packMsg($msg));

                    // Notify all players that sb. gets score

                    $msg = $msg_temp;

                    $msg['data']['tag'] = 'game'; 

                    $msg['data']['content'] = $this->games[$room_id]->getGame();

                    $this->broadcast($this->packMsg($msg), $room_id);

                }

                else {

                    echo 'wrong answer';

                    $msg = $msg_temp;

                    $msg['flag'] = 'msg';

                    $msg['data'] = $data['content'];

                    $this->broadcast($this->packMsg($msg), $room_id);

                }

                break;

            case 'ready':

                $game_key = $this->games[$room_id]->searchPlayerByUid($uid);

                $this->games[$room_id]->players[$game_key]['ready'] = true;

                $all_ready = true;

                $arr_temp = array();

                foreach ($this->games[$room_id]->players as $player) {

                    if ($player['ready']) {

                        $all_ready = $all_ready && true;

                    }

                    else {

                        $all_ready = $all_ready && false;

                        $arr_temp[] = $player;

                    }

                }

                if ($all_ready) {

                    // Game time over

                    if (!$this->games[$room_id]->playerRound()) {

                        echo "Game{$room_id} over";

                        $msg['data']['tag'] = 'end';

                        $msg['data']['content'] = $this->games[$room_id]->gameEnd();

                        $this->broadcast($this->packMsg($msg), $room_id);

                        unset($this->games[$room_id]);

                    }

                    // Next turn

                    else {

                        echo 'Next turn';

                        foreach ($this->games[$room_id]->players as $key => $player) {

                            $this->games[$room_id]->players[$key]['ready'] = false;

                        }

                        $this->games[$room_id]->newDrawer();

                        $msg['data']['tag'] = 'game'; 

                        $msg['data']['content'] = $this->games[$room_id]->getGame();

                        $this->broadcast($this->packMsg($msg), $room_id);

                    }

                }

                else {

                    echo 'Not ready:';

                    print_r($arr_temp);

                }

                break;

            case 'game':

                $msg['data']['tag'] = 'game'; 

                $msg['data']['content'] = $this->games[$room_id]->getGame();

                $this->broadcast($this->packMsg($msg), $room_id);

                break;

            default:

                // code...

                break;

        }

    }

}

// Run the server

$port = 9998;

$sock = new DrawServer('0.0.0.0',$port);

$sock->run();



?>