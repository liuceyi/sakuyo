<?php
/**
 * Created by Sakuyo
 * Date: 2021/7/3
 */

class SocketService
{
    private $address;
    private $port;
    private $server;
    private $clients = array();
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
        $this->$clients[0] = ['socket' => $this->server];
        // Inifinite loop
        while (true){
            $read = array_column($this->clients, 'socket');
            $write = NULL;
            $except = NULL;
            print_r($read);
            // socket_select will block the loop until something changes
            socket_select($read, $write, $except, NULL) or die('Failed to select socket: '.socket_strerror($sock)."\n");
            print_r($read);
            foreach ($read as $key => $_sock) { //$key is uid (key), while $_sock is socket (value)
                if($this->server == $_sock) { // if it's new connection to server
                    if(($newClient = socket_accept($_sock))  === false) {
                        die('Failed to accept socket: '.socket_strerror($_sock)."\n");
                    }
                    $line = trim(socket_read($newClient, 1024));
                    // Handshake here
                    $this->handshaking($newClient, $line);
                    // Allocate unique id
                    $uid = uniqid();
                    // Get client's IP
                    socket_getpeername($newClient, $ip);
                    $this->$clients[$uid] = array(
                        'socket' => $newClient,
                        'ip' => $ip
                    );
                    echo "Client uid:{$uid} \n";
                    echo "Client ip:{$ip}   \n";
                    echo "Client msg:{$line}\n";
                }
                else { // otherwise there's new message coming
                    $this->receiveMsg($key, $_sock);
                }
            }
        }
    }

    /**
     * Handshake
     * @param $newClient    Socket of new client
     * @return int Returns the number of bytes successfully written to the socket
     */
    public function handshaking($newClient, $line){
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
    public function message($buffer){
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
     * Receive message
     * @param $key  uid of the client
     * @param $client   Socket of the client
     * @return null|string
     */
    public function receiveMsg($key, $client) {
        socket_recv($client, $buffer,  2048, 0) or $this->removeClient($key);
        // Decode msg
        $msg = $this->message($buffer);
        // Code here...
        echo "{$key} Client msg: ".$msg."\n";
        
        $response = $msg;
        $this->send($client, $response);
        echo "{$key} Response to Client:".$response,"\n";
    }
    /**
     * Remove client
     * @param $client
     * @return null|boolean
     */
    public function removeClient($key) {
        unset($this->$clients[$key]);
    }

    /**
     * Send message to a client
     * @param $client   client's socket
     * @param $msg   message to send
     * @return int|string
     */
    public function send($client, $msg) {
        $msg = $this->frame($msg);
        socket_write($client, $msg, strlen($msg));
    }

    /**
     * Broadcast the message to EVERYONE
     * @param $msg message to broadcast
     * @return null
     */
    public function broadcast($msg) {
        foreach($this->$clients as $client) {
            send($client, $msg);
        }
    }

    /**
     * @param $s 
     * @return string
     */
    public function frame($s) {
        $a = str_split($s, 125);
        if (count($a) == 1) {
            return "\x81" . chr(strlen($a[0])) . $a[0];
        }
        $ns = "";
        foreach ($a as $o) {
            $ns .= "\x81" . chr(strlen($o)) . $o;
        }
        return $ns;
    }

    /**
     * Close the socket server
     */
    public function close(){
        return socket_close($this->server);
    }
}

$sock = new SocketService('127.0.0.1','9998');
$sock->run();

?>