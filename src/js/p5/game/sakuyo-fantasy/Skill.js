const {Collide} = require('./Collide.js');
class Skill {
  durationMax = 1;
  duration = 0;
  cdMax = 3;
  cd = 0;
  isUsed = false;
  pos = {x: 0, y: 0};
  charPos = {x: 0, y: 0};
  direction = 1;

  constructor(drawFunc, durationMax=3, cdMax=1) {
    this.durationMax = durationMax;
    this.cdMax = cdMax;
    this.draw = drawFunc;
    this.initGraphics();
  }

  initGraphics() {
    this.pg = self.p5.createGraphics(self.p5.width, self.p5.height);
  }

  draw() {

  }

  use(x, y, direction) {
    if (this.cd == 0) {
      this.charPos.x = x;
      this.charPos.y = y;
      this.pos.x = x;
      this.pos.y = y;
      this.direction = direction;
      this.isUsed = true;
      this.cd = this.cdMax;
      this.duration = this.durationMax;
      return true;
    }
    else {
      return false;
    }
  }

  run() {
    this.dur();
    this.cooldown();
    if (this.isUsed) {
      this.move();
      this.draw();
      this.hit();
      
    }
  }

  move(){}

  hit(){}

  dur() {
    if (this.isUsed) {
      this.duration -= self.p5.deltaTime/1000;
      if (this.duration < 0) {
        this.duration = 0;
        this.destroy();
      }
    }

  }

  setDur(newVal) {
    this.durationMax = newVal;
  }

  cooldown() {
    if (this.cd == 0 && !this.isUsed) {
      //
    }
    else {
      this.cd -= self.p5.deltaTime/1000;
    }
    
    if (this.cd < 0) {
      this.cd = 0;
    }
  }

  setCd(newVal) {
    this.cdMax = newVal;
  }

  isCd() {
    if (this.cd == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  destroy() {
    this.isUsed = false;
  }

}

// Ordinary Skills that will be the normal attack
class AttackSkill extends Skill {
  constructor(drawFunc, targets=[], durationMax=0.35, cdMax=0.2, damage=10){
    super(drawFunc, durationMax, cdMax);
    this.initDamage = damage;
    this.damage = this.initDamage;
    this.collide = new Collide();
    this.collide.targets = targets;
  }

  hit() {
    if (!this.isCd()) {
      let hitTargets = this.collide.isHit(this.pos.x, this.pos.y);
      hitTargets.forEach(target => {
        if (target.isHurt) {
          console.log('is Hurt');
        }
        else{
          target.hurt(this.damage);
        }
        
      });
    }
    
  }


}

// Skills that will move (fly) in a target direction
class FlySkill extends AttackSkill {
  absSpeed = 15;
  speed = 15;
  sizeMin = 100;
  sizeMax = 500;
  size = 100;
  chargeTime = 0;
  constructor(drawFunc, targets, durationMax=1, cdMax=1, absSpeed=15, damage=10, sizeMin=100){
    super(drawFunc, targets, durationMax, cdMax, damage);
    this.absSpeed = absSpeed;
    this.sizeMin = sizeMin;
    this.size = this.sizeMin;
  }

  charge() {
    this.size += 2;
    this.chargeTime += self.p5.deltaTime/1000;
    if (this.size > this.sizeMax) {
      this.size = this.sizeMax;
    }
    this.damage = this.initDamage * (1 + this.size / this.sizeMax);
  }

  use(x, y, direction) {
    if (this.cd == 0) {
      this.charPos.x = x;
      this.charPos.y = y;
      this.pos.x = x;
      this.pos.y = y;
      this.direction = direction;
      this.speed = this.absSpeed * direction;
      this.isUsed = true;
      this.cd = this.cdMax;
      this.duration = this.durationMax + this.chargeTime;
      return true;
    }
    else {
      return false;
    }
  }


  move() {
    this.pos.x += this.speed;
    if (this.pos.x > self.p5.width || this.pos.x < 0) {
      this.destroy();
    }
  }

  destroy() {
    this.isUsed = false;
    this.size = this.sizeMin;
    this.chargeTime = 0;
  }
}

// Skills that will add a buff to user (without collidation)
class BuffSkill extends Skill {

}

// Skills that will stay still
class StaticSkill extends Skill {

}


module.exports = {AttackSkill, FlySkill, BuffSkill, StaticSkill};