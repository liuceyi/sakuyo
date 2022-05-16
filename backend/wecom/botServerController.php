<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */
 
require_once '../setting.php';

require_once ROOT_PATH.'/thread/pipe.php';

class ServerController 
{
    private $thread;
    function __construct() 
    {
        $this->thread = new ThreadPipe('Console', true);
    } 
    function start_thread() 
    {
        $cmd = 'php botServer.php';
        // exec("nohup php botServer.php >log.txt 2>error.txt &", $out, $status);
        pclose(popen('start /B '.$cmd, 'r'));
        print_r($out);
        print_r($status);
    }
    
    function kill_thread($pid)
    {
        return $this->thread->remove($pid);
    }
    
    function get_threads() 
    {
        return $this->thread->get_threads();
    }
}



$serverController = new ServerController();
echo $serverController->get_threads();
// $success = false;
// $content = null;
// switch($_POST['flag']) {
//     case 'get-threads':
//         $content = $serverController->get_threads();
//         $success = true;
//         break;

//     case 'kill-thread':
//         if ($_POST['data']['pid']) {
//             $pid = $_POST['data']['pid'];
//             $content = $serverController->remove($pid);
//             $success = true;
//         }
//         break;
    
//     case 'start-thread':
//         // 传入所需参数
//         if ($_POST['data']['name']) {
//             $content = $serverController->start_thread();
//             $success = true;
//         }
//         break;
// }

// echo json_encode(array('success' => $success, 'content' => $content));
?>