<?php

/**
 * 
 */

class DrawSomething
{
    public $players = array();
    public $active_player = -1;
    public $game_word;
    public $game_id;
    public $game_time;
    public $round = 0;
    public $round_time = 30;
    public $total_round;
    public $dict;
    public $used_words = array();
    public $round_end;

    function __construct($room_id) {
        $this->game_id = $room_id;
        $data_raw = file_get_contents('../data/static/ds_dict.json');
        $data = json_decode($data_raw, true);
        $this->dict = $data['words'];
        echo "game id:{$this->game_id} starts. \r\n";
    }

    public function start($players, $total_round) 
    {
        foreach($players as $player) 
        {
            $player['score'] = 0;
        }
        $this->players = $players;
        $this->total_round = $total_round;
        $this->getGameWord();
        return true;
    }

    public function playerInput($input, $player_id)
    {
        // Check if correct
        if ($input == $this->game_word) {
            $this->players[$player_id]['score'] += 2;
            $this->players[$this->active_player]['score'] += 1;
            return true;
        }
        else {
            return false;
        }
    }

    // Finished 1 game and is going to next
    public function playerRound()
    {
        // Round time is over
        if (true && $this->active_player < count($this->players) - 1) {
            $this->active_player += 1;
            $this->getGameWord();
            return true;
        }
        else if (true && $this->active_player >= count($this->players) - 1) {
            $this->active_player = 0;
            if ($this->round < $this->total_round) {
                $this->round += 1;
                
            }
            else {
                return false;
            }
            return true;
        }
    }

    public function newDrawer() 
    {
        $new_time = date('Y-m-d H:i:s', strtotime("+60 second"));
        $this->round_end = $new_time;
        echo $new_time;
    }
    public function getGame() 
    {
        $game = array(
            'players' => $this->players,
            'round' => $this->round,
            'active' => $this->active_player,
            'round_end' => $this->round_end
        );
        return $game;
    }

    public function gameEnd() 
    {
        return $this->players;
    }

    public function getGameWord() 
    {
        $random_num = rand(0, count($this->dict) - 1);
        $game_word = $this->dict[$random_num];
        if (in_array($game_word, $this->used_words) && count($this->used_words) < count($this->dict)) {
            return $this->getGameWord();
        }
        else {
            $this->game_word = $game_word;
            $this->used_words[] = $game_word;
            return $game_word;
        }

    }

    public function searchPlayerByUid($uid)
    {
        $key = array_search($uid, array_column($this->players, 'uid'));
        if ($key !== false) {
            // exist
            return $key;
        }  
        return false;
    }

    public function searchPlayerByFd($fd)
    {
        $key = array_search($fd, array_column($this->players, 'fd'));
        if ($key !== false) {
            // exist
            return $key;
        }  
        return false;
    }
}