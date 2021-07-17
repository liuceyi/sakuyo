<?php
/**
 * Created by Sakuyo
 * Date: 2021/7/3
 */

class SocketService
{
    // Property
    public $ws;
    private $address;
    private $port;
    public $clients = array();

    // Constant
    const WS_STATUS_INVALID = 407;
    const WS_STATUS_TIMEOUT = 408;
    const WS_STATUS_SUCCESS = 200;
    const WS_STATUS_ERROR = 400;

    const HEARTBEAT_TIME = 30; 

    // init
    public function __construct($address = '', $port='') {
        if(!empty($address)) {
            $this->address = $address;
        }
        if(!empty($port))  {
            $this->port = $port;
        }
    }

    // Launch the server
    public function run(){
        // Listen to port 
        $this->ws = new swoole_websocket_server($this->address, $this->port, SWOOLE_PROCESS, SWOOLE_SOCK_TCP | SWOOLE_SSL);
        // setting
        $this->ws->set([ 
            'task_worker_num' => 2,
            'worker_num'      => 2,
            'daemonize'       => false, 
            // setting SSL
            'ssl_cert_file' => "/www/server/panel/vhost/ssl/www.sakuyo.cn/fullchain.pem",
            'ssl_key_file' => "/www/server/panel/vhost/ssl/www.sakuyo.cn/privkey.pem"
        ]);
        // Bind to events
        $this->ws->on('start', [$this,'onStart']);
        $this->ws->on('open', [$this,'onOpen']);
        $this->ws->on('message', [$this,'onMessage']);
        $this->ws->on('close', [$this,'onClose']);
 
        $this->ws->start();

    }

    public function onStart() {
        echo 'server starts running... \r\n';
    }

    public function onOpen($ws, $request) {
        // Check if user is valid
        if (true) {
            echo $request->fd.'joined.\r\n';
            echo $request->get['cookie'];
        }
        else {
            echo $ws->close($request->fd);
        }
    }

    public function onMessage($ws, $frame) {
        $client_data = json_decode($frame->data, true);
        $client_data['uid'] = $frame->fd;
        switch($client_data['flag']) {
            case 'login':
                // check login...

                // login
                $this->addClient($client_data);
                break;
            case 'msg':
                $this->broadcast(json_encode($client_data));
                break;
            case 'logout':
                $this->removeClient($client_data['uid']);
                break;
            default:
                break;
        }
    }

    public function onClose($ws, $fd){
        $key = array_search($uid, array_column($this->clients, 'uid'));
        if($key){
            $data = array(
                'flag' => 'leave',
                'id' => $fd,
                'nickname' => $this->client[$key]['nickname']
            );
            $this->removeClient($fd);
            $this->broadcast(json_encode($data));
            echo "client:{$fd} has closed\r\n";
        }
    }

    public function addClient($data) {
        $this->clients[] = $client_data;
        $this->broadcast(GetOnlineList());
        return true;
    }

    public function removeClient($uid) {
        $key = array_search($uid, array_column($this->clients, 'uid'));
        if ($key !== false) {
            array_splice($this->clients, $key, 1);
            return true;
        }
        else {
            return false;
        }
    }

    public function broadcast($data) {
        foreach(array_column($this->clients, 'uid') as $client) {
            $this->ws->push($client, $data);
        }
    }
    
    public function GetOnlineList() {
        return json_encode($this->clients);
    }


    
}
// Run the server
echo "Input the port: ";
$port = fgets(STDIN);
$sock = new SocketService('127.0.0.1',$port);
$sock->run();

?>