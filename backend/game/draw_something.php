<?php

/**
 * 
 */
class DrawSomething
{
    public $players = array();
    public $active_player = 0;
    public $game_word;
    public $game_id;
    public $game_time;
    public $round = 0;
    public $round_time = 30;
    public $total_round;

    function __construct() {
        $this->game_id = uniqid();
        echo "game id:{$this->game_id} starts.";
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
        if (true) {
            $this->players[$player_id]['score'] += 1;
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

    public function getGame() 
    {
        $game = array(
            'players' => $this->players,
            'round' => $this->round,
            'active' => $this->active_player
        );
        return $game;
    }

    public function gameEnd() 
    {
        return $this->players;
    }

    public function getGameWord() 
    {
        $game_word = '123';
        $this->game_word = $game_word;
        return $game_word;
    }
}