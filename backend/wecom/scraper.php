<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

require_once '../setting.php';

require_once ROOT_PATH.'/api/http.php';
require_once ROOT_PATH.'/database/database.php';

class Scraper 
{
    private $current_time;
    private const CORP_NAME = '星讯';
    public function __construct() 
    {
        $this->current_time = time();
    }

    private function format_content(?string $content) 
    {
        // 替换财联社
        $content = str_replace("财联社", self::CORP_NAME, $content);
        $content = str_replace(self::CORP_NAME."记者", "记者", $content);
        // 添加头部时间和尾部广告位
        // $content = date("H:i")." ".$content."(来自XXX app)";
        $content = date("H:i")." ".$content;
        return $content;
    }

    private function save_to_csv($data)
    {
        global $database;
        $database -> insert('scrap_data', [
            'time' => $data['time'],
            'title' => $data['title'],
            'content' => $data['content']
        ]);
    }

    function get_newest_tele()
    {
        $url = "https://www.cls.cn/nodeapi/updateTelegraphList";

        $params = array(
            'app' => 'CailianpressWeb',
            'category' => '',
            'hasFirstVipArticle' => 1,
            'lastTime' => $this->current_time,
            'os' => 'web',
            'rn' => 20,
            'subscribedColumnIds' => '',
            'sv' => '7.7.5',
            'sign' => 'd743e779c4b932b833b69d23b8625ecf'
        );

        $output = getRequest($url, $params);
        if (!empty($output['data']['roll_data'])) {
            $newest_data = $output['data']['roll_data'][0];
            $this->current_time = $newest_data['ctime'];
            $title = $newest_data['title'];
            $content = $newest_data['content'];
            if (strpos($content, '这家') == true) {
                return null;
            }
            if (strpos($title, '风口研报') == true) {
                return null;
            }
            if (strpos($title, '盘中宝') == true) {
                return null;
            }
            if (strpos($title, '狙击龙虎榜') == true) {
                return null;
            }
            if (strpos($title, '电报解读') == true) {
                return null;
            }
            if (strpos($title, '早知道') == true) {
                return null;
            }
            if (strpos($title, '研选') == true) {
                return null;
            }
            if (strpos($title, '公告全知道') == true) {
                return null;
            }
            if (strpos($title, '九点特供') == true) {
                return null;
            }
            $this->save_to_csv(array(
                'time' => $newest_data['ctime'],
                'title' => $title,
                'content' => $content
            ));
            return $this->format_content($content);
        }

        else {
            return null;
        }
    }
}



?>