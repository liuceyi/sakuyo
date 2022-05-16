<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

require_once '../setting.php';

require_once ROOT_PATH.'/api/http.php';

require_once ROOT_PATH.'/thread/pipe.php';

require_once './scraper.php';

set_time_limit(0); // Never Stop

        
class WecomBot

{

    private const API_TOKEN = '6273d56b9b3d24ee84de27de';

    private const SLEEP_TIME = 30; // 半分钟运行一次

    private $scraper = null;

    private $dev_mode = false;

    public function __construct($name, $dev_mode=false) 
    {
        $this->scraper = new Scraper();
        $this->dev_mode = $dev_mode;
        $this->thread = new ThreadPipe($name);
        $this->thread->enter();
    }
    
    
    /**
     * run 循环进程，获取信息并分发
     */
    public function run() 
    {
        do {
            // 群聊名称
            $target_topic = '星讯 24小时热点资讯A88';
            $news = $this->scraper->get_newest_tele();
            // 如果信息不为空
            if ($news != null & !$this->dev_mode) {
                // 分发
                // $send_room_list = $this->distributor->distribute($news);
                
                // api: 获取群聊列表
                $room_list = $this->bot_get_room();

                foreach ($room_list as $room_data) {
                    // 按照群聊名称搜索
                    if ($room_data['topic'] == $target_topic) {
                        $chatId = $room_data['chatId'];
                        break;
                    }
                }
                print_r('发送消息到群聊【'.$chatId.'】...'.PHP_EOL);
                if (!$chatId) {

                    print_r('未能找到目标群聊'.PHP_EOL);

                    break;

                }

                $bot_token = '6273d56b9b3d24ee84de27de';

                $res = $this->bot_send($chatId, $bot_token, $news);

                if (!$res) {

                    print_r('Bot发送失败'.PHP_EOL);

                    break;

                }

            }

            

            sleep(self::SLEEP_TIME); // 等待半分钟

        

        } while(true);

    }

    /**
     * bot_get_room 获取机器人所有群聊
     * @return Array
     */
    private function bot_get_room() 

    {

        $url = 'https://ex-api.botorange.com/room/list?token='.self::API_TOKEN.'&current=0&pageSize=5';

        $res = getRequest($url);

        $room_list = $res['data'];

        return $room_list;

    }

    
    /**
     * bot_send 向指定群聊发送信息
     * @param String $chatId 群聊id
     * @param String $bot_token 机器人token （一个token对应一个机器人）
     * @param String $text 信息内容
     * @return Boolean
     */
    private function bot_send($chatId, $bot_token, $text) 

    {

        $url = 'https://ex-api.botorange.com/message/send';

        $data = array(

            "chatId" => $chatId,

            "token" => $bot_token,

            "messageType" => 0, 

            "payload" => array(

                "text" => $text,

                "mention" => []

            ),

            "externalRequestId" => uniqid()

        );

        $res = postRequest($url, $data);

        

        if ($res['code'] == 0) {

            return true;

        }

        else {

            print_r($res.PHP_EOL);

            return false;    

        }

    }

}



$wecomBot = new WecomBot('Main-Bot');

$wecomBot -> run();



?>