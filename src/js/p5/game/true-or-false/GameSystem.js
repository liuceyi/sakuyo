import { ClassicQuestion, InputQuestion } from './Question.js';
import KeyInput from './KeyInput.js';
import GameUI from './GameUI.js';
class System {
  paused = false;
  gameOver = false;
  gameStart = false;
  gameReady = false;

  mode = '';

  constructor(p5) {
    self.p5 = p5;
    self.system = this;
    this.gameInit();
  }

  run() {
    if (this.paused && !this.gameOver && this.gameStart && !this.gameReady) {
      this.gameUI.drawPause();
    }
    else if(this.gameOver) {
      this.gameUI.drawGameOver();
    }
    else if (this.gameStart) {
      this.gameLaunch();
    }
    else if (this.gameReady) {
      this.gameUI.drawGameReady();
    }
    else {
      this.gameUI.drawGameStart();
    }
    
  }

  gameInit() {
    this.gameUI = new GameUI();
    this.currentKeyInput = new KeyInput();
  }

  gameLaunch() {
    this.question.run();
    if (this.question.finish) {
      this.gameOver = true;
      return;
    }
    this.gameUI.drawUI();
  }

  gameMode(num=10, initTime=5, difficulty=3) {
    switch (this.mode) {
      case 'classic':
        this.question = new ClassicQuestion(num, initTime, difficulty);
        break;
      case 'input':
        this.question = new InputQuestion(num, initTime, difficulty);
        break;
      default:
        console.log('Game mode error');
        break;
    }
  }

  gameRestart() {
    this.gameOver = false;
    this.gameReady = true;
    this.gameStart = false;
  }
}

export default System;