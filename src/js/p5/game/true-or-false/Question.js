class Question {
  timeUp = false;
  finish = false;
  showAnswer = false;
  playerAns = null;
  qNow = 0;
  qList = [];
  initShowAnswerTime = 1;
  score = 0;

  constructor(num=10, initTime=5, difficulty=3) {
    this.num = num;
    this.initTime = initTime;
    this.difficulty = difficulty;
    this.init();
    this.initGraphics();
    this.time = this.initTime;
  }

  init() {
    // this.finish = false;
    // this.timeUp = false;
    // this.showAnswer = false;
    // this.qList = [];
    // this.score = 0;
    this.createQuestions();
  }

  initGraphics() {
    this.pg = self.p5.createGraphics(self.p5.width, self.p5.height);
  }

  run() {
    if (!this.finish) {
      
      if (!this.showAnswer) {
        this.timePass();
      }
      else {
        if (this.playerAns) {
          this.correct();
        }
        else {
          this.wrong();
        }
      }

      if (this.timeUp && !this.showAnswer) {
        this.showAnswer = true;
        this.showAnswerTime = this.initShowAnswerTime;
        this.timeUpHandle();
      }
      return true;
    }
    else {
      return false;
    }
  }

  timeUpHandle() {}

  correct() {
    self.system.gameUI.tex.hide();
    this.pg.clear();
    this.pg.background(50,50,50, 0.5);
    this.pg.fill(60,179,113);
    this.pg.textAlign(self.p5.CENTER, self.p5.CENTER);
    this.pg.textSize(100);
    this.pg.text("CORRECT!", self.p5.width/2, self.p5.height/2);
    self.p5.image(this.pg, 0, 0);
    this.showAnswerTime -= self.p5.deltaTime / 1000;

    if (this.showAnswerTime <= 0) {
      this.score += 1;
      self.system.gameUI.tex.show();
      this.showAnswer = false;
      this.timeUp = false;
      this.next();
    }
  }

  wrong() {
    self.system.gameUI.tex.hide();
    this.pg.clear();
    this.pg.background(50,50,50, 0.5);
    this.pg.fill(139,0,0);
    this.pg.textAlign(self.p5.CENTER, self.p5.CENTER);
    this.pg.textSize(100);
    this.pg.text("WRONG~", self.p5.width/2, self.p5.height/2);
    self.p5.image(this.pg, 0, 0);

    this.showAnswerTime -= self.p5.deltaTime / 1000;
    if (this.showAnswerTime <= 0) {
      self.system.gameUI.tex.show();
      this.showAnswer = false;
      this.timeUp = false;
      this.next();
    }
  }

  timePass() {
    if (!this.timeUp) {
      this.time -= self.p5.deltaTime / 1000;
      if (this.time <= 0) {
        this.timeUp = true;
      }
    }
  }

  next() {
    this.time = this.initTime;
    this.qNow += 1;
    self.system.gameUI.inputBox.elt.focus();
    if (this.qNow >= this.num) {
      console.log('finish')
      this.finish = true;
    }
  }

  randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
      case 1: 
        return parseInt(Math.random()*minNum+1,10); 
      case 2: 
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      default: 
        return 0; 
    } 
  } 

  createQuestions() {
    for (let i = 0; i < this.num; i++) {
      let {answer, qStr} = this.initQuestion(this.difficulty);
      this.qList[i] = {answer:answer, str:qStr, playerAns:null};
    }
  }

  isTrue() {}

  initQuestion() {}
  
}

class ClassicQuestion extends Question {
  // Player thinks it's true
  isTrue() {
    if (this.finish) {
      return;
    }
    else {
      this.showAnswer = true;
      this.showAnswerTime = this.initShowAnswerTime;
      if (this.qList[this.qNow].answer == 1) {
        console.log('true')
        this.playerAns = true;
      }
      else {
        this.playerAns = false;
      }
    }
  }

  timeUpHandle() {
    if (this.qList[this.qNow].answer == 0) {
      this.playerAns = true;
    }
    else {
      this.playerAns = false;
    }
  }

  initQuestion(difficulty) {
    let rdNum = difficulty;
    let numList = [];
    for (let i = 0; i < rdNum; i++) {
      numList.push(Math.floor(Math.random()*20));
    }
    let isTrue = Math.round(Math.random());
    let qStr;
    let answer = 0;

    // Change Answer if it's false
    if (isTrue == 1) {
      answer += 0;
    }
    else {
      answer += Math.floor(Math.random()*3) + 1;
    }

    // Form the formula
    for (let i = 0; i < numList.length; i++) {
      if (i == 0) {
        qStr = '' + numList[i];
      }
      else {
        let mode = this.randomNum(1, 4);
        switch(mode) {
          case 1:
            qStr += ' + ' + numList[i];
            break;
          case 2:
            qStr += ' - ' + numList[i];
            break;
          case 3:
            qStr += ' * ' + numList[i];
            break;
          case (4 && numList[i] != 0 && numList[i-1] % numList[i] === 0):
            qStr += ' / ' + numList[i];
            break;
          default:
            qStr += ' + ' + numList[i];
            break;
        }        
      }
    }
    answer += eval(qStr);
    qStr += ' = ' + answer;
    return {isTrue, qStr};
  }
}
class InputQuestion extends Question {
  isTrue() {
    let ansStr = self.system.gameUI.inputBox.value();
    self.system.gameUI.inputBox.value('');
    if (this.finish || this.timeUp) {
      return;
    }
    else {
      
      if (parseInt(ansStr) === this.qList[this.qNow].answer) {
        this.playerAns = true;
      }
      else {
        this.playerAns = false;
      }
      this.showAnswer = true;
      this.showAnswerTime = this.initShowAnswerTime;
    }
  }

  timeUpHandle() {
    this.playerAns = false;
  }

  initQuestion(difficulty) {
    let rdNum = difficulty;
    let numList = [];
    for (let i = 0; i < rdNum; i++) {
      numList.push(Math.floor(Math.random()*20));
    }
    let qStr;
    let answer = 0;

    // Form the formula
    for (let i = 0; i < numList.length; i++) {
      if (i == 0) {
        qStr = '' + numList[i];
      }
      else {
        let mode = this.randomNum(1, 4);
        switch(mode) {
          case 1:
            qStr += ' + ' + numList[i];
            break;
          case 2:
            qStr += ' - ' + numList[i];
            break;
          case 3:
            qStr += ' * ' + numList[i];
            break;
          case (4 && numList[i] != 0 && numList[i-1] % numList[i] === 0):
            qStr += ' / ' + numList[i];
            break;
          default:
            qStr += ' + ' + numList[i];
            break;
        }        
      }
    }
    answer += eval(qStr);
    return {answer, qStr};
  }

  correct() {
    self.system.gameUI.tex.hide();
    self.system.gameUI.inputBox.hide();
    this.pg.clear();
    this.pg.background(50,50,50, 0.5);
    this.pg.fill(60,179,113);
    this.pg.textAlign(this.pg.CENTER, this.pg.CENTER);
    this.pg.textSize(100);
    this.pg.text("CORRECT!", this.pg.width/2, this.pg.height/2);
    self.p5.image(this.pg, 0, 0);
    this.showAnswerTime -= self.p5.deltaTime / 1000;

    if (this.showAnswerTime <= 0) {
      this.score += 1;
      self.system.gameUI.tex.show();
      self.system.gameUI.inputBox.show();
      this.showAnswer = false;
      this.timeUp = false;
      this.next();
    }
  }

  wrong() {
    self.system.gameUI.tex.hide();
    self.system.gameUI.inputBox.hide();
    this.pg.clear();
    this.pg.background(50,50,50, 0.5);
    this.pg.fill(139,0,0);
    this.pg.textAlign(this.pg.CENTER, this.pg.CENTER);
    this.pg.textSize(100);
    this.pg.text("WRONG~", this.pg.width/2, this.pg.height/2);
    self.p5.image(this.pg, 0, 0);

    this.showAnswerTime -= self.p5.deltaTime / 1000;
    if (this.showAnswerTime <= 0) {
      self.system.gameUI.tex.show();
      self.system.gameUI.inputBox.show();
      this.showAnswer = false;
      this.timeUp = false;
      this.next();
    }
  }

}
module.exports = {ClassicQuestion, InputQuestion};