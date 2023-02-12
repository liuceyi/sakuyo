<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */
ini_set('memory_limit', '1024M');

require_once '../setting.php';

require_once ROOT_PATH.'/database/database.php';

const JIEBA_PATH = ROOT_PATH."/vendor/fukuball/jieba-php/src";
require_once JIEBA_PATH."/vendor/multi-array/MultiArray.php";
require_once JIEBA_PATH."/vendor/multi-array/Factory/MultiArrayFactory.php";
require_once JIEBA_PATH."/class/Jieba.php";
require_once JIEBA_PATH."/class/Finalseg.php";
require_once JIEBA_PATH."/class/JiebaAnalyse.php";
use Fukuball\Jieba\Jieba;
use Fukuball\Jieba\Finalseg;
use Fukuball\Jieba\JiebaAnalyse;
Jieba::init(array('mode'=>'test', 'dict'=>'small'));
Finalseg::init();
JiebaAnalyse::init();


class Distributor 
{

    public function __construct() 
    {

    }

    private function get_tag_groups($tags)
    {
        global $database;
        $groups = $database->select("xx_tag_for_group", [
            "[>]xx_tags" => ["tag_id" => "id"],
            "[<]xx_groups" => ["group_id" => "id"]
        ], 
        [
            "xx_groups.name" 
        ],
        [
            "xx_tags.name" => $tags
        ]
        );
        return $groups;
    }

    private function cut_word($content) 
    {
        $top_k = 10;
        // JiebaAnalyse::setStopWords('./dict/stop_words.txt');

        $tags = JiebaAnalyse::extractTags($content, $top_k);
        return array_keys($tags);
    }

    /**
     * distribute 根据给定词条对应群聊分发内容
     * @param Object $news
     * @return Array
     */
    public function distribute($news) 
    {
        // 获取关键词
        $words = $this->cut_word($news['content']);
        // 获取词条对应群聊
        $groups = $this->get_tag_groups($words);
        // 常驻群聊
        $groups[] = ["name" => "星讯 24小时热点资讯A88"];
        return $groups;
    }

}



?>