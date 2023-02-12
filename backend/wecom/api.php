<?php

/**

 * Created by Sakuyo

 * Date: 2021/7/11

 */

require_once '../setting.php';

require_once ROOT_PATH.'/database/database.php';

$success = false;
$content = null;

if ($_POST['sign'] !== "5caf990010c55bab11096393a1d7cc2f") {
    echo json_encode(array('success' => $success, 'content' => $content));
    exit;
}

switch($_POST['flag']) {
    case 'get-groups':
        global $database;
        $groups = $database->select("xx_groups", 
        [
            "id",
            "name"
        ]
        );
        $content = $groups;
        $success = true;
        break;

    case 'edit-group':
        if (!$_POST['data']['id'] || !$_POST['data']['name']) {
            break;
        }
        $id = $_POST['data']['id'];
        $new_name = $_POST['data']['name'];
        $is_exist = $database->has("xx_groups", [
            "id" => $id 
        ]);
        if (!$is_exist) {
            break;
        }
        $database -> update('xx_groups', ['name'=>$new_name], ['id'=>$id]);
        $success = true;
        break;
    
    case 'del-group':
        if (!$_POST['data']['id'] || !$_POST['data']['name']) {
            break;
        }
        $id = $_POST['data']['id'];
        $name = $_POST['data']['name'];
        $is_exist = $database->$database->has("xx_groups", [
            "AND" => [
                "id" => $id,
                "name" => $name
            ]
        ]);
        if ($is_exist) {
            break;
        }
        $database->delete("xx_groups", [
            "AND" => [
                "id" => $id,
                "name" => $name
            ]
        ]);
        $success = true;
        break;

    case 'add-group':
        if (!$_POST['data']['name']) {
            break;
        }
        $name = $_POST['data']['name'];
        $is_exist = $database->has("xx_groups", [
            "name" => $name 
        ]);
        if ($is_exist) {
            break;
        }
        $database -> insert('xx_groups', [
            'name' => $name
        ]);
        $success = true;
        break;

    case 'get-tags':
        global $database;
        $records = $database->select("xx_tags", 
            [
                "[>]xx_tag_for_group" => ["id" => "tag_id"],
                "[>]xx_groups" => ["xx_tag_for_group.group_id" => "id"]
            ],
            [
                "xx_tags.id",
                "xx_tags.name", 
                "xx_tags.level",
                "xx_tags.parent_id", 
                "group_id", 
                "xx_groups.name"
            ]
        );
        var_dump($database->error);
        $content = $records;
        $success = true;
        break;

    case 'edit-tag':
        global $database;
        $tag = $_POST['data']['tag'];
        $new_tag = $_POST['data']['newTag'];
        $groups = $_POST['data']['groups'];

        $database->update("xx_tags", 
            [
                "name" => $new_tag['name'],
                "level" => $new_tag['level'],
                "parent_id" => $new_tag['parentId']
            ],
            [
                "id" => $tag['id'],
                "name" => $tag['name']
            ]
        );

        $database->delete("xx_tag_for_group",
            [
                "tag_id" => $tag['id']
            ]
        );

        foreach ($groups as $group) {
            $database->insert("xx_tag_for_group",
                [
                    "tag_id" => $tag['id'],
                    "group_id" => $group['id']
                ]
            );
        }
        
        $success = true;
        break;

    case 'add-tag':
        global $database;
        $new_tag = $_POST['data']['newTag'];
        $groups = $_POST['data']['groups'];
        $database->insert("xx_tags",
            [
                "name" => $new_tag['name'],
                "level" => $new_tag['level'],
                "parent_id" => $new_tag['parentId']
            ]
        );
        $id = $database->id();
        foreach ($groups as $group) {
            $database->insert("xx_tag_for_group",
                [
                    "tag_id" => $$id,
                    "group_id" => $group['id']
                ]
            );
        }
        $success = true;
        break;

    case 'del-tag':
        global $database;
        if (!$_POST['data']['tag']) {
            break;
        }
        $database->delete("xx_tag_for_group",
            [
                "tag_id" => $tag['id']
            ]
        );
        $database->delete("xx_tags",
            [
                "id" => $tag['id']
            ]
        );
        $success = true;
        break;                    
}

echo json_encode(array('success' => $success, 'content' => $content));

?>