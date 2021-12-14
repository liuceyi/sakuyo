const { Rapier } = require('./Weapon.js');
const { BlockCollide } = require('./Collide.js');
const {FlySkill, BuffSkill, StaticSkill} = require('./Skill.js');

class Character{
  fightSpeed = 1;
  initSpeed = 10;
  block = {left:false, right:false, top:false, bottom:false, leftList:{}, rightList:{}, topList:{}, bottomList:{}};
  initJumpSpeed = 15;
  fightGravity = 0.01;
  initGravity = 1;
  width = 10;
  height = 30;
  flip = 1;
  hpMax = 100;
  initHurtTime = 0.5;
  isHurt = false;
  isJumping = false;
  isGuard = false;

  constructor(x, y, team, color=self.p5.color(220,20,60), label='', weapon=new Rapier(this, 10)){
    this.team = team;
    this.pos = {x:x, y:y};
    this.speed = this.initSpeed;
    this.jumpSpeed = 0;
    this.gravity = this.initGravity;
    this.hp = this.hpMax;
    this.label = label;
    this.color = color;
    this.weapon = weapon;
    this.collide = new BlockCollide(this.width, this.height, this);
    self.system.blockList.push(this.collide);
    this.initGraphics();
  }
  
  initGraphics() {
    this.pg1 = self.p5.createGraphics(50, 50);
    this.pg2 = self.p5.createGraphics(50, 50);
  }

  initSkill() {}

  move() {}

  calBlock() {
    // left
    {
      let bool;
      for (let key in this.block.leftList) {
        bool = bool || this.block.leftList[key];
      }
      this.block.left = bool;
    }

    // right
    {
      let bool;
      for (let key in this.block.rightList) {
        bool = bool || this.block.rightList[key];
      }
      this.block.right = bool;
    }

    // top
    {
      let bool;
      for (let key in this.block.topList) {
        bool = bool || this.block.topList[key];
      }
      this.block.top = bool;
    }
    // bottom
    {
      let bool;
      for (let key in this.block.bottomList) {
        bool = bool || this.block.bottomList[key];
      }
      this.block.bottom = bool;
    }
    
  }

  moveBlock() {
    this.collide.isHit(this.pos.x, this.pos.y);
  }

  moveLeft() {
    if (!this.block.left) {
      this.flip = -1;
      this.pos.x -= this.speed;
      if (this.pos.x <= 0) {
        this.pos.x = 0;
      }
    }
  }

  moveRight() {
    if (!this.block.right) {
      this.flip = 1;
      this.pos.x += this.speed;
      if (this.pos.x >= self.p5.width) {
        this.pos.x = self.p5.width;
      }
    }
  }

  moveJump() {
    if(!this.isJumping && this.block.bottom) {
      this.isJumping = true;
      this.jumpSpeed = this.initJumpSpeed;
      this.pos.y -= this.jumpSpeed;
    }
  }

  moveDrop() {
    if(!this.block.bottom) {
      if (this.block.top && this.jumpSpeed > 0) {
        console.log('head');
        this.jumpSpeed = 0;
      }
      this.jumpSpeed -= this.gravity;
      this.pos.y -= this.jumpSpeed;

    }
    else {
      this.isJumping = false;
      this.jumpSpeed = 0;
    }
  }

  drawWeapon() {}

  skill() {}

  setTarget() {
    let targetList = [];
    for (let key in self.system.teamList) {
      if (key != this.team) {
        for (let i = 0; i < self.system.teamList[key].length; i++) {
          targetList.push(self.system.teamList[key][i]);
        }
      }
    }
    this.targets = targetList;
    // Export to weapon
    this.weapon.setTarget(targetList);
  }

  setBlocks() {

  }

  draw() {
    this.calBlock();
    this.move();
    this.moveBlock();
    this.drawBody();
    this.drawLabel();
    this.skill();
    this.drawWeapon();
    this.drawHurt();
    this.drawHp();
  }

  drawHp() {}

  hurt(damage) {
    if (this.isGuard) {
      //
    }
    else {
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
        self.system.die(this);
      }
      this.isHurt = true;
      this.hurtTime = this.initHurtTime;
    }

  }

  drawHurt() {
    if (this.isHurt) {
      // Effect
      this.hurtTime -= self.p5.deltaTime / 1000;
      if (this.hurtTime <= 0) {
        this.isHurt = false;
      }
    }
  }

  drawBody() {
    if (this.isHurt) {
      this.pg1.clear();
      this.pg1.push(); 
      {
        if(this.flip == -1) {
          this.pg1.scale(-1, 1);
        }
        this.pg1.translate(this.flip * this.pg1.width / 2, this.pg1.height / 2);
        this.pg1.angleMode(this.pg1.DEGREES);
        this.pg1.rotate(30);
        this.pg1.rectMode(this.pg1.CENTER);
        this.pg1.strokeWeight(1);
        this.pg1.fill(this.color);
        this.pg1.rect(0, 0, this.width, this.height/2);
        this.pg1.fill(255);
        this.pg1.noStroke();
        this.pg1.rect(this.width/4, -this.height/20, this.width/2, this.width/2);
      }
      this.pg1.pop();

      this.pg2.clear();  
      this.pg2.push();
      {
        if(this.flip == -1) {
          this.pg2.scale(-1, 1);
        }
        this.pg2.translate(this.flip * this.pg2.width / 2, this.pg2.height / 2);
        this.pg2.angleMode(this.pg2.DEGREES);
        this.pg2.rotate(-30);
        this.pg2.rectMode(this.pg2.CENTER);
        this.pg2.strokeWeight(1);
        this.pg2.fill(this.color);
        this.pg2.rect(0, 0, this.width, this.height/2);
      }
      this.pg2.pop();
        
      self.p5.image(this.pg1, this.pos.x - this.pg1.width/2, this.pos.y - this.pg1.height/2 - 2/3 * this.height);
      self.p5.image(this.pg2, this.pos.x - this.pg2.width/2, this.pos.y - this.pg2.height/2 - 1/3 * this.height);
    }
    else {
      self.p5.push();
        if(this.flip == -1) {
          self.p5.scale(-1, 1);
        }
        self.p5.strokeWeight(1);
        self.p5.fill(this.color);
        self.p5.rectMode(self.p5.CENTER);
        self.p5.rect(this.flip*this.pos.x, this.pos.y - this.height/2, this.width, this.height);
        self.p5.fill(255);
        self.p5.noStroke();
        self.p5.rect(this.flip*this.pos.x + this.width/4, this.pos.y - this.height + this.height/5, this.width/2, this.width/2);
      self.p5.pop();
    }

  }

  drawLabel() {
    self.p5.push();
      self.p5.textSize(12);
      self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
      self.p5.text(this.label, this.pos.x, this.pos.y - this.height - 10);
    self.p5.pop();
  }

}

class AI extends Character {
  attackTarget = null;
  move() {
    if (this.isFight || this.isHurt) {
      if (this.jumpSpeed > 0) this.jumpSpeed = 0;
      this.speed = this.fightSpeed;
      this.gravity = this.fightGravity;
    }
    else {
      this.speed = this.initSpeed;
      this.gravity = this.initGravity;
    }

    // Track Target
    if (this.attackTarget == null) {
      this.attackTarget = this.targets[Math.floor(Math.random()*this.targets.length)];
    }
    let targetDist = self.p5.dist(this.attackTarget.pos.x, this.attackTarget.pos.y, this.pos.x, this.pos.y);
    this.targets.forEach(target => {
      let dist = self.p5.dist(target.pos.x, target.pos.y, this.pos.x, this.pos.y);
      if (dist <= targetDist) {
        this.attackTarget = target;
      }
    });

    // Horizonal Moving (LEFT and RIGHT)
    if (this.isHurt){
      // Can't move when hurt
    }
    else {
      if (this.attackTarget.pos.x <= this.pos.x) {
        this.moveLeft();
      }
      else {
        this.moveRight();
      }
    }

    this.moveDrop();
    // Vertical Moving (JUMP)
    if (this.isHurt) {
      // Cant jump when hurt
    }
    else {
      if (this.attackTarget.pos.y >= this.pos.y) {
        //
      }
      else {
        this.moveJump();
      }
    }
  }

  drawWeapon() {
    let targetDist = self.p5.dist(this.attackTarget.pos.x, this.attackTarget.pos.y, this.pos.x, this.pos.y);
    if (targetDist <= this.weapon.range && !this.isHurt) {
      this.weapon.attack(this.pos.x, this.pos.y, this.flip);
    }

    this.weapon.run();

    if (this.weapon.action != null) {
      if (!this.weapon.action.isUsed) {
        this.isFight = false;
      }
      else {
        this.isFight = true;
      }
      
    }
  }

  drawHp() {
    let hp_w = 100;
    let hp_h = 10;
    self.p5.push();
    self.p5.rectMode(self.p5.CORNER);
    self.p5.fill(200);
    self.p5.stroke(30);
    self.p5.strokeWeight(2);
    self.p5.rect(this.pos.x - hp_w/2, this.pos.y - this.height - 10 - hp_h/2, hp_w, hp_h);
    self.p5.fill(139, 0, 0);
    self.p5.rect(this.pos.x - hp_w/2, this.pos.y - this.height - 10 - hp_h/2, hp_w * this.hp / this.hpMax, hp_h);
    self.p5.pop();
  }
}

class Player extends Character{

  initSkill() {
    this.skill1 = new FlySkill(
      function(){
        this.pg.clear();
        this.pg.push();
        this.pg.noStroke();
        let opacity = this.duration / (this.durationMax + this.chargeTime);
        this.pg.fill(this.pg.color('rgba(75, 0, 130, ' + opacity + ')'));
        this.pg.ellipse(this.pos.x - this.direction * this.size / 5, this.pos.y, this.size);
        this.pg.erase();
        this.pg.ellipse(this.pos.x - this.direction * (this.size / 5 + 10), this.pos.y, this.size);
        this.pg.noErase();
        this.pg.pop();
        self.p5.image(this.pg, 0, 0);

        this.collide.w = this.size / 2;
        this.collide.h = this.size;
      }, this.targets, 0.3);
    
    this.skill2 = new StaticSkill(
      function() {

      }
    );
    this.skill3 = new BuffSkill(
      function() {

      }
    );
  }

  move() {
    if (this.isFight || this.isHurt) {
      if (this.jumpSpeed > 0) this.jumpSpeed = 0;
      this.speed = this.fightSpeed;
      this.gravity = this.fightGravity;
    }
    else {
      this.speed = this.initSpeed;
      this.gravity = this.initGravity;
    }
    // // UP
    // if (self.system.currentKeyInput.isUpPressed) {
    //   this.pos.y -= this.speed;
    //   if (this.pos.y <= 0) {
    //     this.pos.y = 0;
    //   }
    // }

    // DOWN (GUARD)
    if (self.system.currentKeyInput.isDownPressed && !this.isJumping && !this.isHurt) {
      this.isGuard = true;

    }
    else {
      this.isGuard = false;
    }

    // LEFT
    if (self.system.currentKeyInput.isLeftPressed) {
      this.moveLeft();
    }

    // RIGHT
    if (self.system.currentKeyInput.isRightPressed) {
      this.moveRight();
    }

    // DROP
    this.moveDrop();

    // JUMP
    if (self.system.currentKeyInput.isJumpPressed) {
      this.moveJump();
    }


  }

  drawWeapon() {
    if (self.system.currentKeyInput.isAttackPressed && !this.isHurt) {
      this.weapon.attack(this.pos.x, this.pos.y, this.flip);
    }

    this.weapon.run();

    if (this.weapon.action != null) {
      if (!this.weapon.action.isUsed) {
        this.isFight = false;
      }
      else {
        this.isFight = true;
      }
      
    }
  }

  skill() {
    if (self.system.currentKeyInput.isSkill1Pressed && !this.isHurt) {
      this.isSkill1Pressed = true;
      this.skill1.charge();
      this.isFight = true;
    }
    else {
      if (this.isSkill1Pressed && !this.isHurt) {
        this.isSkill1Pressed = false;
        this.skill1.use(this.pos.x, this.pos.y - this.height/2, this.flip);
        this.isFight = false;
      }
      else {
        // this.skill1.destroy();
      }
    }
    this.skill1.run();
  }


}

module.exports = {AI, Player};