const {AttackSkill} = require('./Skill.js');

class Weapon {
  range = 40;
  constructor(character, atk=10) {
    this.character = character;
    this.atk = atk;
    this.comboMax = 5;
    this.combo = 0;
    this.nextCombo = null;
    this.attackList = [];
    for (let i = 0; i < this.comboMax; i++) {
      this.attackList[i] = new AttackSkill(function(){});
    }
    this.importWeaponAni();
    this.weaponAngle = 0;
    this.initGraphics();
  }

  initGraphics() {
    this.pg = self.p5.createGraphics(100, 100);
  }

  setTarget(targets) {
    this.attackList.forEach(attack => {
      attack.collide.targets = targets;
    });
  }

  run() {
    this.drawShape();
    
    if (this.action != null || this.nextAction != null) {
      // if action still exists
      if (this.action != null) {
        // if action finished
        if (!this.action.isUsed) {
          // if next action is ready
          if (this.nextAction != null) {
            this.action = this.nextAction.action;
            this.action.use(this.nextAction.x, this.nextAction.y, this.nextAction.direction);
            this.nextAction = null;
            this.combo = this.nextCombo;
            this.nextCombo = null;
          }
          else {
            this.action = null;
          }
        }
        else {
          this.action.run();
        }
      }
      // if action doesn't exist (first attack or miss combo)
      else {
        // check if next action is ready
        if (this.nextAction != null) {
          this.action = this.nextAction.action;
          this.action.use(this.nextAction.x, this.nextAction.y, this.nextAction.direction);
          this.nextAction = null;
          this.combo = this.nextCombo;
          this.nextCombo = null;
        }
      }
    }
  }

  drawShape() {}

  importWeaponAni() {}

  attack(x, y, direction) {
    let isCd = this.attackList[this.combo].isCd();
    
    // GCD cooldowned, which means that all attacks can be used
    if (isCd && this.nextCombo == null){
      // if the targeted attack is using now, 1. this attack cannot be triggered (it's still in its duration) 2. input next combo (catch combo sucessfully)
      if(this.attackList[this.combo].isUsed) {
        this.nextCombo = this.combo + 1;
        if (this.nextCombo >= this.comboMax) {
          this.nextCombo = null;
          // this.action = null;
        }
      }
      // if the targeted attack isn't using now, the targeted attack is end and miss combos
      else {
        this.combo = 0;
        this.nextCombo = 0;
      }
      if (this.nextCombo != null) {
        this.nextAction = {action:this.attackList[this.nextCombo],x:x, y:y, direction:direction};
      }
      
      
      
    }
  }

}

class Rapier extends Weapon {
  range = 40;
  constructor(character, atk=10) {
    super(character, atk);
  }
  importWeaponAni(){
    let that = this;
    this.attackList[0].draw = function() {
      // console.log(this.direction)
      let w = 10 * this.direction;
      let h = 50;
      let targetAngle = 90;
      that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.2);

      let opacity = this.duration / this.durationMax;
      this.pg.clear();
      this.pg.noStroke();
      this.pg.fill('rgba(127,255,170, ' + opacity + ')');
      this.pg.drawingContext.shadowOffsetX = 5;
      this.pg.drawingContext.shadowOffsetY = -5;
      this.pg.drawingContext.shadowBlur = 10;
      this.pg.drawingContext.shadowColor = 'green';
      this.pg.beginShape();
      this.pg.vertex(this.charPos.x - w, this.charPos.y);
      this.pg.bezierVertex(
        this.charPos.x + 5*w, this.charPos.y - h/3,
        this.charPos.x + 5*w, this.charPos.y - h/3 * 2,
        this.charPos.x + w, this.charPos.y - h);
      this.pg.bezierVertex(
        this.charPos.x + 4*w, this.charPos.y - h/2, 
        this.charPos.x + 4*w, this.charPos.y - h/2, 
        this.charPos.x - w, this.charPos.y);
      this.pg.endShape();
      self.p5.image(this.pg, 0, 0);

      this.pos.x = this.charPos.x + w * 2;
      this.pos.y = this.charPos.y - h/2;
      this.collide.w = w * 4;
      this.collide.h = h;
    }

    this.attackList[1].draw = function() {
      let w = 10 * this.direction;
      let h = 50;
      let targetAngle = 0;
      that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.2);

      let opacity = this.duration / this.durationMax;
      this.pg.clear();
      this.pg.noStroke();
      this.pg.fill('rgba(127,255,170, ' + opacity + ')');
      this.pg.drawingContext.shadowOffsetX = 5;
      this.pg.drawingContext.shadowOffsetY = -5;
      this.pg.drawingContext.shadowBlur = 10;
      this.pg.drawingContext.shadowColor = 'green';
      this.pg.beginShape();
      this.pg.vertex(this.charPos.x, this.charPos.y - h);
      this.pg.bezierVertex(
        this.charPos.x + 5*w, this.charPos.y - h/4, 
        this.charPos.x + 5*w, this.charPos.y - h/6, 
        this.charPos.x + w, this.charPos.y);
      this.pg.bezierVertex(
        this.charPos.x + 4*w, this.charPos.y - h/4, 
        this.charPos.x + 4*w, this.charPos.y - h/3, 
        this.charPos.x, this.charPos.y - h);
      this.pg.endShape();
      self.p5.image(this.pg, 0, 0);

      this.pos.x = this.charPos.x + w * 2;
      this.pos.y = this.charPos.y - h/2;
      this.collide.w = w * 4;
      this.collide.h = h;
    }

    this.attackList[2].setDur(0.5);
    this.attackList[2].draw = function() {
      let w = 10 * this.direction;
      let h = 50;
      let targetAngle = 0;
      let durationPart = this.durationMax / 3;
      let durationNow = parseInt(this.duration / durationPart);
      this.pg.clear();
      if (durationNow == 2) {
        let opacity = (this.duration - durationNow*durationPart) / durationPart;
        targetAngle = 30;
        that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.2);
        this.pg.noStroke();
        this.pg.fill('rgba(127,255,170, ' + opacity + ')');
        this.pg.drawingContext.shadowOffsetX = 5;
        this.pg.drawingContext.shadowOffsetY = -5;
        this.pg.drawingContext.shadowBlur = 10;
        this.pg.drawingContext.shadowColor = 'green';
        this.pg.beginShape();
        this.pg.vertex(this.charPos.x - w, this.charPos.y - h/2);
        this.pg.bezierVertex(
          this.charPos.x + 4*w, this.charPos.y + h/4, 
          this.charPos.x + 4*w, this.charPos.y + h/6, 
          this.charPos.x + w, this.charPos.y - h/3);
        this.pg.bezierVertex(
          this.charPos.x + 3*w, this.charPos.y, 
          this.charPos.x + 3*w, this.charPos.y, 
          this.charPos.x - w, this.charPos.y - h/2);
        this.pg.endShape();
        self.p5.image(this.pg, 0, 0);
      }
      else if(durationNow == 1) {
        let opacity = (this.duration - durationNow*durationPart) / durationPart;
        targetAngle = 60;
        that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.2);
        this.pg.noStroke();
        this.pg.fill('rgba(127,255,170, ' + opacity + ')');
        this.pg.drawingContext.shadowOffsetX = 5;
        this.pg.drawingContext.shadowOffsetY = -5;
        this.pg.drawingContext.shadowBlur = 10;
        this.pg.drawingContext.shadowColor = 'green';
        this.pg.beginShape();
        this.pg.vertex(this.charPos.x - w, this.charPos.y - h/2);
        this.pg.bezierVertex(
          this.charPos.x + 4*w, this.charPos.y - h/4, 
          this.charPos.x + 4*w, this.charPos.y - h/6, 
          this.charPos.x + w, this.charPos.y - h/3 * 2);
        this.pg.bezierVertex(
          this.charPos.x + 3*w, this.charPos.y - h/6, 
          this.charPos.x + 3*w, this.charPos.y - h/2, 
          this.charPos.x - w, this.charPos.y - h/2);
        this.pg.endShape();
        self.p5.image(this.pg, 0, 0);
      }
      else if (durationNow == 0){
        let opacity = (this.duration - durationNow*durationPart) / durationPart;
        targetAngle = 90;
        that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.2);
        this.pg.noStroke();
        this.pg.fill('rgba(127,255,170, ' + opacity + ')');
        this.pg.drawingContext.shadowOffsetX = 5;
        this.pg.drawingContext.shadowOffsetY = -5;
        this.pg.drawingContext.shadowBlur = 10;
        this.pg.drawingContext.shadowColor = 'green';
        this.pg.beginShape();
        this.pg.vertex(this.charPos.x - w, this.charPos.y - h/2);
        this.pg.bezierVertex(
          this.charPos.x + 4*w, this.charPos.y - h - h/4, 
          this.charPos.x + 4*w, this.charPos.y - h - h/6, 
          this.charPos.x + w, this.charPos.y - h);
        this.pg.bezierVertex(
          this.charPos.x + 3*w, this.charPos.y - h, 
          this.charPos.x + 3*w, this.charPos.y - h, 
          this.charPos.x - w, this.charPos.y - h/2);
        this.pg.endShape();
        self.p5.image(this.pg, 0, 0);
      }
      
      this.pos.x = this.charPos.x + w * 2;
      this.pos.y = this.charPos.y - h/2;
      this.collide.w = w * 4;
      this.collide.h = h;
    }

    this.attackList[2].setDur(0.7);
    this.attackList[3].draw = function() {
      let w = 100  * this.direction;
      let h = 50;
      let targetAngle = -30;
      that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.1);
      let opacity = this.duration / this.durationMax;
      this.pg.clear();
      this.pg.noStroke();
      this.pg.fill('rgba(0,250,154, ' + opacity + ')');
      this.pg.drawingContext.shadowOffsetX = 5;
      this.pg.drawingContext.shadowOffsetY = -5;
      this.pg.drawingContext.shadowBlur = 10;
      this.pg.drawingContext.shadowColor = 'green';
      this.pg.quad(
        this.charPos.x, this.charPos.y,
        this.charPos.x + w/2, this.charPos.y - h/2,
        this.charPos.x + w, this.charPos.y - h,
        this.charPos.x + w/2 - 5, this.charPos.y - h/2
        );
      self.p5.image(this.pg, 0, 0);

      this.pos.x = this.charPos.x + w/2;
      this.pos.y = this.charPos.y - h/2;
      this.collide.w = w;
      this.collide.h = h;
    }

    this.attackList[4].setDur(1.5);
    this.attackList[4].draw = function() {
      let w = 100 * this.direction;
      let h = 80;
      let targetAngle = 100;
      that.weaponAngle = self.p5.lerp(that.weaponAngle, targetAngle, 0.1);

      let opacity = this.duration / this.durationMax;
      this.pg.clear();
      this.pg.noStroke();
      this.pg.fill('rgba(0,250,154, ' + opacity + ')');
      this.pg.drawingContext.shadowOffsetX = 5;
      this.pg.drawingContext.shadowOffsetY = -5;
      this.pg.drawingContext.shadowBlur = 10;
      this.pg.drawingContext.shadowColor = 'green';
      this.pg.quad(
        this.charPos.x, this.charPos.y - h,
        this.charPos.x + w/2, this.charPos.y - h/2,
        this.charPos.x + w, this.charPos.y,
        this.charPos.x + w/2 - 10, this.charPos.y - h/2
        );
      self.p5.image(this.pg, 0, 0);

      this.pos.x = this.charPos.x + w/2;
      this.pos.y = this.charPos.y - h/2;
      this.collide.w = w;
      this.collide.h = h;
    }
    
  }

  drawShape(){
    if (this.action == null) {
      this.weaponAngle = self.p5.lerp(this.weaponAngle, 0, 0.2);
    }
    let hilt_w = 4; // width of hilt
    let hilt_h = 10; // length of hilt
    let guard_w = 10; // width of guard
    let guard_h = 2; // length of guard
    let blade_w = 4; // width of blade
    let blade_h = 30; // length of blade
    let ch = this.character.height;
    let direction = this.character.flip;

    this.pg.clear();
    // Start Point: x, y - 2/3 * h
    this.pg.push();
    this.pg.beginShape();
    if (direction == -1) {
      this.pg.scale(-1, 1);
    }
    this.pg.translate(direction * this.pg.width / 2, this.pg.height / 2);
    this.pg.angleMode(this.pg.DEGREES);
    this.pg.rotate(-(60 + this.weaponAngle));
    this.pg.noStroke();
    // hilt
    this.pg.fill(10);
    this.pg.push();
      this.pg.stroke(10);
      this.pg.strokeWeight(2);
      this.pg.rectMode(this.pg.CENTER);
      this.pg.rect(0, hilt_h/2, hilt_w, hilt_h);
    this.pg.pop();
    this.pg.fill(190);
    this.pg.quad(0, 0, direction*hilt_w/2, hilt_h/6, 0, hilt_h/3, -direction*hilt_w/2, hilt_h/6);
    this.pg.quad(0, hilt_h/3, direction*hilt_w/2, hilt_h/2, 0, hilt_h/3 * 2, -direction*hilt_w/2, hilt_h/2);
    this.pg.quad(0, hilt_h/3 * 2, direction*hilt_w/2, 5/6 * hilt_h, 0, hilt_h, -direction*hilt_w/2, 5/6 * hilt_h);
    // Sword Guard
    this.pg.rectMode(this.pg.CENTER);
    this.pg.fill(10);
    this.pg.rect(0, hilt_h + guard_h/2, guard_w, guard_h);

    // Blade
    this.pg.fill(64,224,208);
    this.pg.vertex(-direction*blade_w/2, hilt_h + guard_h);
    this.pg.vertex(direction*blade_w/2, hilt_h + guard_h);
    this.pg.vertex(direction*blade_w/2, hilt_h + guard_h + blade_h);
    this.pg.vertex(0, hilt_h + guard_h + blade_h + 5);
    this.pg.vertex(-direction*blade_w/2, hilt_h + guard_h + blade_h);
    this.pg.endShape();
    this.pg.pop();
    self.p5.image(this.pg, this.character.pos.x - this.pg.width/2, this.character.pos.y - 1/2 * ch - this.pg.height/2);
  }
}

class Claymore extends Weapon {
  range = 80;
}

class Stick extends Weapon {
  range = 100;
}

module.exports = {Rapier, Claymore, Stick}