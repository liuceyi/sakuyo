const {Player, AI} = require('./Character.js');
const KeyInput = require('./KeyInput.js');
const GameUI = require('./GameUI.js');
const Map = require('./Map.js');
class System {
  paused = false;
  gameOver = false;
  blockList = [];

  constructor(p5) {
    self.p5 = p5;
    self.system = this;
    this.gameInit();
  }

  set() {
    for (let key in this.teamList) {
      this.teamList[key].forEach(character => {
        character.setTarget();
        character.initSkill();
      });
    }
  }

  die(character) {
    let team = character.team;
    let index = this.teamList[team].indexOf(character);
    this.teamList[team].splice(index, 1);
    if (this.teamList[team].length <= 0) {
      console.log('GAME OVER');
      
      let teamSurvive = [];
      for (let key in this.teamList) {
        if(this.teamList[key].length <= 0) {
          //
        }
        else {
          teamSurvive.push(key);
        }
      }
      if (teamSurvive.length > 1) {
        this.gameOver = false;
      }
      else {
        this.gameOver = true;
        this.winner = teamSurvive[0];
      }
      
    }
  }

  run() {
    if (this.paused && !this.gameOver) {
      self.p5.background(30);
      self.p5.textAlign(self.p5.CENTER);
      self.p5.fill(0, 102, 153);
      self.p5.textSize(100);
      self.p5.text("PAUSED", self.p5.width/2, self.p5.height/2);
    }
    else if(this.gameOver) {
      self.p5.background(30);
      self.p5.textAlign(self.p5.CENTER);
      self.p5.fill(0, 102, 153);
      self.p5.textSize(100);
      self.p5.text("GAME OVER", self.p5.width/2, self.p5.height/3);
      self.p5.textSize(80);
      self.p5.text("TEAM " + this.winner + " WIN", self.p5.width/2, self.p5.height/2);
      self.p5.textSize(60);
      self.p5.text("PRESS G RESTART", self.p5.width/2, self.p5.height/3 * 2);

      let that = this;
      self.p5.keyTyped = function() {
        if (self.p5.key === 'g') {
          that.gameRestart();
        }
      }
    }
    else {
      this.gameLaunch();
    }
    
  }

  gameInit() {
    this.map = new Map(self.p5.width, self.p5.height);
    this.player = new Player(self.p5.width/2, self.p5.height/2, 'a', self.p5.color(100, 100, 100), '1P');
    this.enemy = new AI(100, self.p5.height/2, 'b', self.p5.color(10, 10, 10), 'AI');
    this.enemy.initSpeed = 0;
    this.teamList = {a:[this.player], b:[this.enemy]};
    this.currentKeyInput = new KeyInput();
    this.set();
    this.gameUI = new GameUI();
  }

  gameLaunch() {
    self.p5.push();
    self.p5.stroke(10);
    self.p5.strokeWeight(1);
    self.p5.line(0, self.p5.height/2, self.p5.width, self.p5.height/2);
    self.p5.pop();
    this.map.draw();
    for (let key in this.teamList) {
      this.teamList[key].forEach(character => {
        character.draw();
      });
      
    }
    
    // this.player.draw();
    // this.enemy.draw();
    this.gameUI.draw();
  }

  gameRestart() {
    this.gameInit();
    this.gameOver = false;
  }
}

module.exports = System;