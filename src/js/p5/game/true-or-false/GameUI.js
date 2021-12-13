const katex = require('katex');
class GameUI {
  buttonGroup = {};
  pageFlag = '';
  pageParam = {};

  constructor() {
    this.initButton();

    this.tex = self.p5.createP();
    this.tex.parent("#p5Sketch-trueorfalse");
    this.tex.style('font-size', '50px');
    this.tex.style('margin', 'auto');
    this.tex.style('text-align', 'center');
    this.tex.style('position', 'absolute');
    this.tex.style('top', '50%');
    this.tex.style('left', '50%');
    this.tex.style('transform', 'translate(-50%,-50%)');
    // this.tex.position(0, 0);

    this.inputBox = self.p5.createInput('');
    
    this.inputBox.parent("#p5Sketch-trueorfalse");
    // this.inputBox.style('width', '200');
    this.inputBox.size(100);
    // this.inputBox.style('margin', 'auto');
    this.inputBox.style('text-align', 'center');
    this.inputBox.style('position', 'absolute');
    this.inputBox.style('top', '70%');
    this.inputBox.style('left', '50%');
    this.inputBox.style('transform', 'translate(-50%,-50%)');
    this.inputBox.style('display', 'none');

    
  }

  initButton() {
    let that = this;

    this.buttonGroup['start'] = [];
    {
      let buttonClassic = new Button({
        x:self.p5.width/2,
        y:self.p5.height/3,
        w:250,
        h:60,
        radius:10,
        text:'Classic Mode'
      });
      buttonClassic.hover = function() {
        this.color = self.p5.color(199,21,133);
      }
      buttonClassic.onClick = function() {
        console.log('get')
        self.system.mode = 'classic';
        that.pageParam.num = 10;
        that.pageParam.initTime = 5;
        that.pageParam.difficulty = 3;
        self.system.gameReady = true;
      }
      this.buttonGroup['start'].push(buttonClassic);
  
      let buttonInput = new Button({
        x:self.p5.width/2,
        y:self.p5.height/3 * 2,
        w:250,
        h:60,
        radius:10,
        text:'Input Mode',
        color: self.p5.color(72,61,139)
      });
      buttonInput.hover = function() {
        this.color = self.p5.color(65,105,225);
      }
      buttonInput.onClick = function() {
        self.system.mode = 'input';
        that.pageParam.num = 10;
        that.pageParam.initTime = 10;
        that.pageParam.difficulty = 3;
        self.system.gameReady = true;
      }
      this.buttonGroup['start'].push(buttonInput);
    }
    

    this.buttonGroup['ready'] = [];
    {
      let buttonLeftNum = new Button({
        x:self.p5.width/2 - 120,
        y:self.p5.height/3,
        w:60,
        h:60,
        radius:10,
        text:'-',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonLeftNum.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonLeftNum.onClick = function() {
        that.pageParam.num -= 1;
        if (that.pageParam.num < 3) {
          that.pageParam.num = 3;
        }
      }
      this.buttonGroup['ready'].push(buttonLeftNum);

      let buttonRightNum = new Button({
        x:self.p5.width/2 + 120,
        y:self.p5.height/3,
        w:60,
        h:60,
        radius:10,
        text:'+',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonRightNum.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonRightNum.onClick = function() {
        that.pageParam.num += 1;
        if (that.pageParam.num > 100) {
          that.pageParam.num = 100;
        }
      }
      this.buttonGroup['ready'].push(buttonRightNum);

      let buttonLeftTime = new Button({
        x:self.p5.width/2 - 120,
        y:self.p5.height/2,
        w:60,
        h:60,
        radius:10,
        text:'-',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonLeftTime.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonLeftTime.onClick = function() {
        that.pageParam.initTime -= 1;
        if (that.pageParam.initTime < 3) {
          that.pageParam.initTime = 3;
        }
      }
      this.buttonGroup['ready'].push(buttonLeftTime);

      let buttonRightTime = new Button({
        x:self.p5.width/2 + 120,
        y:self.p5.height/2,
        w:60,
        h:60,
        radius:10,
        text:'+',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonRightTime.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonRightTime.onClick = function() {
        that.pageParam.initTime += 1;
        if (that.pageParam.initTime > 30) {
          that.pageParam.initTime = 30;
        }
      }
      this.buttonGroup['ready'].push(buttonRightTime);

      let buttonLeftDiff = new Button({
        x:self.p5.width/2 - 120,
        y:self.p5.height/3 * 2,
        w:60,
        h:60,
        radius:10,
        text:'-',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonLeftDiff.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonLeftDiff.onClick = function() {
        that.pageParam.difficulty -= 1;
        if (that.pageParam.difficulty < 2) {
          that.pageParam.difficulty = 2;
        }
      }
      this.buttonGroup['ready'].push(buttonLeftDiff);

      let buttonRightDiff = new Button({
        x:self.p5.width/2 + 120,
        y:self.p5.height/3 * 2,
        w:60,
        h:60,
        radius:10,
        text:'+',
        color:self.p5.color(248,248,255),
        textColor:self.p5.color(50,50,50)
      });
      buttonRightDiff.hover = function() {
        this.color = self.p5.color(230,230,250);
      }
      buttonRightDiff.onClick = function() {
        that.pageParam.difficulty += 1;
        if (that.pageParam.difficulty > 30) {
          that.pageParam.difficulty = 30;
        }
      }
      this.buttonGroup['ready'].push(buttonRightDiff);

      let buttonSure = new Button({
        x:self.p5.width/2,
        y:self.p5.height * 0.9,
        w:120,
        h:50,
        radius:10,
        text:'Go!',
        color:self.p5.color(199,21,133)
      });
      buttonSure.hover = function() {
        this.color = self.p5.color(255,20,147);
      }
      buttonSure.onClick = function() {
        self.system.gameMode(that.pageParam.num, that.pageParam.initTime, that.pageParam.difficulty);
        self.system.gameStart = true;
        that.tex.show();
        if (self.system.mode == 'input') {
          that.inputBox.show();
        }
      }
      this.buttonGroup['ready'].push(buttonSure);
    }
    

    this.buttonGroup['pause'] = [];
    this.buttonGroup['gameover'] = [];
    this.buttonGroup['game'] = [];
  }

  drawPause() {
    this.pageFlag = 'pause';
    self.p5.background(30);
    self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
    self.p5.fill(0, 102, 153);
    self.p5.textSize(100);
    self.p5.text("PAUSED", self.p5.width/2, self.p5.height/2);
    this.inputBox.hide();
  }

  drawGameOver() {
    this.pageFlag = 'gameover';
    self.p5.background(30);
    self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
    self.p5.fill(0, 102, 153);
    self.p5.textSize(100);
    self.p5.text(self.system.question.score / self.system.question.num * 100 + "% Correct", self.p5.width/2, self.p5.height/3);
    self.p5.textSize(60);
    self.p5.text("PRESS G RESTART", self.p5.width/2, self.p5.height/3 * 2);
    this.tex.hide();
    this.inputBox.hide();
    self.p5.keyTyped = function() {
      if (self.p5.key === 'g') {
        self.system.gameRestart();
      }
    }
  }

  drawGameStart() {
    this.pageFlag = 'start';
    self.p5.push();
    self.p5.background(30);
    this.buttonGroup['start'].forEach(button => {
      button.draw();
    });
    // self.p5.text("PRESS G START", self.p5.width/2, self.p5.height/2);
    self.p5.pop();
  }

  drawGameReady() {
    this.pageFlag = 'ready';
    self.p5.push();
    self.p5.background(30);
    self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
    self.p5.fill(230,230,250);
    self.p5.textSize(20);
    self.p5.text('HOW MANY QUESTIONS', self.p5.width/2, self.p5.height/3 - 60);
    self.p5.text('ROUND TIMING', self.p5.width/2, self.p5.height/2 - 60);
    self.p5.text('DIFFICULTY', self.p5.width/2, self.p5.height/3 * 2 - 60);
    self.p5.textSize(40);
    self.p5.textAlign(self.p5.CENTER, self.p5.BOTTOM);
    self.p5.text(this.pageParam.num, self.p5.width/2, self.p5.height/3 + 25);
    self.p5.text(this.pageParam.initTime, self.p5.width/2, self.p5.height/2 + 25);
    self.p5.text(this.pageParam.difficulty, self.p5.width/2, self.p5.height/3 * 2 + 25);
    this.buttonGroup['ready'].forEach(button => {
      button.draw();
    });
    // self.p5.text("PRESS G START", self.p5.width/2, self.p5.height/2);
    self.p5.pop();
  }

  drawUI() {
    this.pageFlag = 'game';
    this.drawQuestion();
    this.drawTime();
  }


  drawQuestion(){
    let question = self.system.question.qList[self.system.question.qNow];
    let latexStr = question.str;
    latexStr = latexStr.replace(/\*/g, '\\times');
    latexStr = latexStr.replace(/\//g, '\\div');
    katex.render(latexStr, this.tex.elt);
  }

  drawTime() {
    let timeRate = self.system.question.time / self.system.question.initTime;
    self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
    self.p5.noStroke();
    self.p5.fill(240);
    self.p5.arc(100, 100, 100, 100, -self.p5.HALF_PI, -self.p5.HALF_PI + self.p5.TWO_PI * timeRate);
    
    self.p5.textSize(30);
    self.p5.fill(self.p5.lerpColor(self.p5.color(139,0,0), self.p5.color(0,100,0), timeRate));
    self.p5.text(Math.floor(self.system.question.time) + 1, 100, 100);
  }

  setGradient(x, y, w, h, c1, c2, axis=0) {
    self.p5.push();
    self.p5.noFill();
    self.p5.strokeWeight(1);
    const X_AXIS = 0;
    const Y_AXIS = 1;
    
    if (axis === Y_AXIS) {
      // Vertical
      for (let i = y; i <= y + h; i++) {
        let inter = self.p5.map(i, y, y + h, 0, 1);
        let c = self.p5.lerpColor(c1, c2, inter);
        self.p5.stroke(c);
        self.p5.line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Horizonal
      for (let i = x; i <= x + w; i++) {
        let inter = self.p5.map(i, x, x + w, 0, 1);
        let c = self.p5.lerpColor(c1, c2, inter);
        self.p5.stroke(c);
        self.p5.line(i, y, i, y + h);
      }
    }
    self.p5.pop();
  }

  
}

// Assign in game UI and remember to add them in button groups
class Button {
  isClick = false;
  constructor({x, y, w, h, radius=0, text='', color=self.p5.color(75,0,130), textColor=self.p5.color(240,248,255), hasStroke=false}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.radius = radius;
    this.text = text;
    this.initColor = color;
    this.color = color;
    this.initTextColor = textColor;
    this.textColor = textColor;
    this.hasStroke = hasStroke;
  }

  init() {
    this.color = this.initColor;
    this.textColor = this.initTextColor;
  }

  hover() {}

  click() {
    let hit = self.p5.collidePointRect(self.p5.mouseX, self.p5.mouseY, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    if (hit) {
      this.onClick();
    }
  }
  onClick() {}

  draw() {
    self.p5.push();
    self.p5.rectMode(self.p5.CENTER);
    if (this.hasStroke) {
      self.p5.strokeWeight(2);
      self.p5.stroke(10);
    }
    else {
      self.p5.noStroke();
    }
    self.p5.fill(this.color);
    self.p5.rect(this.x, this.y, this.w, this.h, this.radius);
    self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
    self.p5.fill(this.textColor);
    self.p5.textSize(this.h/3);
    self.p5.text(this.text, this.x, this.y);
    self.p5.pop();

    let hit = self.p5.collidePointRect(self.p5.mouseX, self.p5.mouseY, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    if (hit) {
      this.hover();
      //this.onClick();
    }
    else {
      this.init();
    }
  }


}
module.exports = GameUI;