<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

class ThreadPipe 
{
    private const PIPE_PATH = './thread.pipe';
    private $admin;
    private $name;

    function __construct($name='Unnamed', $admin=false) 
    {
        $this->admin = $admin;
        $this->name = $name;
    }

    function enter() 
    {
        $pid = posix_getpid();
        $content = $this->name.'|'.$pid;
        $file = fopen(self::PIPE_PATH, 'w+');
        while (!feof($file)) {
            $thread = str_replace(' ','',fgets($file));
            if (empty($thread)) {
                continue;
            }
            if ($pid === $thread) {
                print_r('存在相同线程，忽略插入');
                return false;
            }
        }
        fwrite($file, $pid.PHP_EOL);
        fclose($file);
        $this->handleKill();
        return true;
    }

    function handleKill()
    {
        declare(ticks = 1);
        pcntl_signal(SIGTERM, array($this, "sigHandler"));
    }

    function sigHandler($sig) 
    {
        if($sig == SIGTERM) {
            $this->quit();
        }
    }

    function quit() 
    {
        $pid = posix_getpid();
        $content = $this->name.'|'.$pid;
        $contents = file_get_contents(self::PIPE_PATH);
        $contents = str_replace($content.PHP_EOL, '', $contents);
        return file_put_contents(self::PIPE_PATH, $contents);
    }

    function remove($pid_kill)
    {
        if (!$this->admin) return False;
        $file = fopen(self::PIPE_PATH, 'w+');
        while (!feof($file)) {
            $thread = str_replace(' ','',fgets($file));
            if (empty($thread)) {
                continue;
            }
            $thread_arr = explode("|", $thread);
            $name = $thread_arr[0];
            $pid = $thread_arr[1];
            if ($pid === $pid_kill) {
                posix_kill($pid);
                return True;
            }
        }
        return False;
    }

    function get_threads() 
    {
        if (!$this->admin) return False;
        $threads = [];
        $file = fopen(self::PIPE_PATH, 'w+');
        while (!feof($file)) {
            $thread = str_replace(' ','',fgets($file));
            if (empty($thread)) {
                continue;
            }
            $thread_arr = explode("|", $thread);
            $name = $thread_arr[0];
            $pid = $thread_arr[1];
            array_push($threads, array('name' => $name, 'pid' => $pid));
        } 
        return $threads;
    }

}

?>