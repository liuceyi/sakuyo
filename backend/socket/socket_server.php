<?php
/**
 * Created by Sakuyo
 * Date: 2021/7/3
 */

class SocketService
{
    // Property
    private $address;
    private $port;
    private $server;
    private $clients = array();

    // Constant
    const WS_STATUS_INVALID = 407;
    const WS_STATUS_TIMEOUT = 408;
    const WS_STATUS_SUCCESS = 200;
    const WS_STATUS_ERROR = 400;
    const WS_STATUS_HEARTBEAT_START = 201;
    const WS_STATUS_HEARTBEAT_ONGOING = 202;

    const HEARTBEAT_TIME = 30; // Heartbeat 15s

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
    public function service(){
        // Get TCP protocol
        $tcp = getprotobyname("tcp");
        $sock = socket_create(AF_INET, SOCK_STREAM, $tcp);
        socket_set_option($sock, SOL_SOCKET, SO_REUSEADDR, 1);
        // Check if the socket is error
        if(!$sock) {
            throw new Exception("Failed to create socket: ".socket_strerror($sock)."\n");
        }
        
        socket_bind($sock, $this->address, $this->port) or die('Failed to bind socket: make sure ' .$this->port.'is not occupied.'.socket_strerror($sock)."\n");
        socket_listen($sock, $this->port) or die('Failed to listen socket: '.socket_strerror($sock)."\n");
        
        echo "Start listening on $this->address $this->port ... \n";
        $this->server = $sock;
    }

    // main running process
    public function run() {
        $this->service();
        // Assign clients list
        $this->clients[0] = array('socket' => $this->server);
        
        // Inifinite loop
        while (true){
            $read = array_column($this->clients, 'socket');
            $write = NULL;
            $except = NULL;
            // socket_select will block the loop until something changes
            socket_select($read, $write, $except, NULL) or die('Failed to select socket: '.socket_strerror($sock)."\n");

            foreach ($read as $key => $_sock) { //$key is uid (key), while $_sock is socket (value)
                if($this->server == $_sock) { // if it's new connection to server
                    if(($new_client = socket_accept($_sock))  === false) {
                        die('Failed to accept socket: '.socket_strerror($_sock)."\n");
                    }
                    $line = trim(socket_read($new_client, 1024));
                    // Handshake here
                    $this->handshaking($new_client, $line);
                    // Allocate unique id
                    $uid = uniqid();
                    // Get client's IP
                    socket_getpeername($new_client, $ip);
                    // Add socket into the array
                    array_push($this->clients, array(
                        'uid' => $uid,
                        'socket' => $new_client,
                        'ip' => $ip
                    ));
                    echo "Client uid:{$uid} \n";
                    echo "Client ip:{$ip}   \n";
                }
                else { // otherwise there's new message coming
                    $this->receiveMsg($key, $_sock);
                }
            }
        }
    }

    /**
     * Receive message
     * @param $client_key  uid of the client
     * @param $client_socket   Socket of the client
     * @return null|string
     */
    public function receiveMsg($client_key, $client_socket) {
        socket_recv($client_socket, $buffer, 2048, 0) or $this->removeClient($client_key);
        // Decode msg
        $msg_str = $this->message($buffer);
        // Get the client info
        $client = $this->clients[$client_key];
        try {
            $msg = json_decode($msg_str, true);
            print_r($msg);
        }
        catch(Exception $e) {
            echo $e->getMessage();
            $this->removeClient($client_key);
        }
        switch ($msg['flag']) {
            case 'login':
                // Check cookie
                if (false) {
                    $this->sendMsg('Wrong cookie', $client_socket, self::WS_STATUS_INVALID);
                    echo "Client <{$client['uid']}> is invalid \n";
                    $this->removeClient($client_key);
                    break;
                }
                else {
                    // Create heartbeat (Encoding heartbeat code)
                    $hb_code = $this->createHeartBeatCode($client['uid']);
                    // [idea: using $uid and $time, an unique string can be created]
                    // $hb_code = '123456';
                    $this->sendMsg($hb_code, $client_socket, self::WS_STATUS_HEARTBEAT_START);
                    $client['heartbeat'] = array(
                        'hbCode' => $hb_code,
                        'hbTime' => date('y-m-d h:i:s')
                    );
                }
                break;
            case 'heartbeat':
                // Check heartBeat (Time diff and code diff)
                $hb_time_diff = strtotime(date('y-m-d h:i:s')) - strtotime($client['heartbeat']['hbTime']); // Time difference
                if ($hb_time_diff <= self::HEARTBEAT_TIME && $msg['data'] == $client['heartbeat']['hbCode']) {
                    // keep online status (Refresh onlogin time)
                    $client['heartbeat']['hbTime'] = date('y-m-d h:i:s');
                    $hb_code = $this->createHeartBeatCode($client['uid']);
                    // $hb_code = '123456';
                    $this->sendMsg($hb_code, $client_socket, self::WS_STATUS_HEARTBEAT_ONGOING);
                    $client['heartbeat']['hbCode'] = $hb_code;
                }
                else {
                    $this->sendMsg('Heartbeat timeout', $client_socket, self::WS_STATUS_TIMEOUT);
                    echo "Client <{$client['uid']}>'s heartbeat is timeout \n";
                    $this->removeClient($client_key);
                }
                break;
            case 'msg':
                if (isset($client['heartbeat'])) {
                    $msg_arr = array(
                        'tag' => 'msg',
                        'content' => $msg['data']
                    );
                    $this->broadcast($msg_arr);
                }
                else {
                    $this->sendMsg('Invalid Msg connection', $client_socket, self::WS_STATUS_INVALID);
                    echo "Client <{$client['uid']}> is invalid \n";
                    $this->removeClient($client_key);
                }
                break;
            case 'draw':
                if (isset($client['heartbeat'])) {
                    $msg_arr = array(
                        'tag' => 'draw',
                        'content' => $msg['data']
                    );
                    $this->broadcast($msg_arr);
                }
                else {
                    $this->sendMsg('Invalid Draw connection', $client_socket, self::WS_STATUS_INVALID);
                    echo "Client <{$client['uid']}> is invalid \n";
                    $this->removeClient($client_key);
                }
                break;
            default:
                $this->sendMsg('Invalid connection', $client_socket, self::WS_STATUS_INVALID);
                print_r($msg);
                $this->removeClient($client_key);
                break;
        }
    
    $this->clients[$client_key] = $client;
    }

    /**
     * Send message
     * @param $msg string|object    the message that is ready to send 
     * @param $client_socket   Socket of the client
     * @param $sign constant    the sign to notify the clients
     * @return boolean
     */
    public function sendMsg($msg, $client_socket, $sign=self::WS_STATUS_SUCCESS) {
        $response = json_encode(array('sign' => $sign, 'data' => $msg));
        $this->send($client_socket, $response);
        echo "Response to Client {$client_socket}: ".$response,"\n";
        return true;
    }

    private function createHeartBeatCode($uid) {
        $hb_code = md5($uid);
        return $hb_code;
    }


    /**
     * Remove client
     * @param $client
     * @return null|boolean
     */
    public function removeClient($key) {
        echo "Remove Client {$this->clients[$key]['uid']} ".$response,"\n";
        unset($this->clients[$key]);
    }

    /**
     * Broadcast the message to EVERYONE
     * @param $msg message to broadcast
     * @return null
     */
    public function broadcast($msg) {
        $temp = array_slice($this->clients, 1);
        foreach($temp as $client) {
            $this->sendMsg($msg, $client['socket']);
        }
    }

    /**
     * Send message to a client
     * @param $client   client's socket
     * @param $msg   message to send
     * @return int|string
     */
    private function send($client, $msg) {
        $msg = $this->frame($msg);
        socket_write($client, $msg, strlen($msg));
    }

    /**
     * Handshake
     * @param $newClient    Socket of new client
     * @return int Returns the number of bytes successfully written to the socket
     */
    private function handshaking($newClient, $line){
        $headers = array();
        $lines = preg_split("/\r\n/", $line);
        foreach($lines as $line)
        {
            $line = chop($line);
            if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
            {
                $headers[$matches[1]] = $matches[2];
            }
        }
        $secKey = $headers['Sec-WebSocket-Key'];
        $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'))); // Static value
        $upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $this->address\r\n" .
            "WebSocket-Location: ws://$this->address:$this->port/websocket/websocket\r\n".
            "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
        return socket_write($newClient, $upgrade, strlen($upgrade));
    }

    /**
     * Decode
     * @param $buffer
     * @return null|string
     */
    private function message($buffer){
        $len = $masks = $data = $decoded = null;
        $len = ord($buffer[1]) & 127;
        if ($len === 126)  {
            $masks = substr($buffer, 4, 4);
            $data = substr($buffer, 8);
        } else if ($len === 127)  {
            $masks = substr($buffer, 10, 4);
            $data = substr($buffer, 14);
        } else  {
            $masks = substr($buffer, 2, 4);
            $data = substr($buffer, 6);
        }
        for ($index = 0; $index < strlen($data); $index++) {
            $decoded .= $data[$index] ^ $masks[$index % 4];
        }
        return $decoded;
    }

    /**
     * @param $msg
     * @return string
     */
    private function frame($msg) {
        $frame = [];
        $frame[0] = '81';
        $len = strlen($msg);
        if ($len < 126) {
            $frame[1] = $len < 16 ? '0' . dechex($len) : dechex($len);
        } else if ($len < 65025) {
            $s = dechex($len);
            $frame[1] = '7e' . str_repeat('0', 4 - strlen($s)) . $s;
        } else {
            $s = dechex($len);
            $frame[1] = '7f' . str_repeat('0', 16 - strlen($s)) . $s;
        }

        $data = '';
        $l = strlen($msg);
        for ($i = 0; $i < $l; $i++) {
            $data .= dechex(ord($msg{$i}));
        }
        $frame[2] = $data;

        $data = implode('', $frame);

        return pack("H*", $data);
    }

    /**
     * Close the socket server
     */
    public function close(){
        return socket_close($this->server);
    }
}
// Run the server
echo "Input the port: ";
$port = fgets(STDIN);
$sock = new SocketService('127.0.0.1',$port);
$sock->run();

?>