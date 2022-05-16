<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

require_once '../setting.php';

require_once ROOT_PATH.'/database/database.php';

class Distributor 
{

    public function __construct() 
    {

    }

    private function get_tag2chat()
    {
        global $database;
        $database -> insert('distribute_tags', [
            'time' => $data['time'],
            'title' => $data['title'],
            'content' => $data['content']
        ]);
    }

    /**
     * distribute 根据给定词条对应群聊分发内容
     * @param Object $news
     * @return Array
     */
    private function distribute($news) 
    {
        // 词条对应群聊应为动态
        // 获取词条对应群聊

        
    }

}



?>