class Collide {
  goThrough = true;
  constructor(w=10, h=10, targets=[]) {
    this.w = w;
    this.h = h;
    this.targets = targets;
    this.initId();
  }
  
  initId() {

    function randId() {
      let id = '';
      for (let i = 0; i < 8; i++) {
        id += Math.floor(Math.random() * 10);
      }
      return id;
    }

    function checkId(id) {
      self.system.blockList.forEach(block => {
        if (block.id == id) {
          return true;
        }
      });
      return false;
    }

    let id = randId();
    while (checkId(id)) {
      id = randId();
    }

    this.id = id;
  }

  isHit(x, y) {
    this.x = x;
    this.y = y;
    let hitTarget = [];
    
    this.targets.forEach(target => {
      // Debug mode
      self.p5.push();
      self.p5.stroke(100,100, 100);
      self.p5.strokeWeight(1);
      self.p5.noFill();
      self.p5.rectMode(self.p5.CORNER);
      self.p5.rect(target.pos.x - target.collide.w/2, target.pos.y - target.collide.h, target.collide.w, target.collide.h);
      self.p5.rect(x - this.w/2, y - this.h/2, this.w, this.h);
      self.p5.pop();
      let hit;
      if (this.w >= 0) {
        hit = self.p5.collideRectRect(
          target.pos.x - target.collide.w/2, target.pos.y - target.collide.h, target.collide.w, target.collide.h,
          x - this.w/2, y - this.h/2, this.w, this.h);
      }
      else {
        hit = self.p5.collideRectRect(
          target.pos.x - target.collide.w/2, target.pos.y - target.collide.h, target.collide.w, target.collide.h,
          x + this.w/2, y - this.h/2, -this.w, this.h);
      }
      
      if (hit) {
        hitTarget.push(target);
      }
    });
    return hitTarget;
    
  }

  block() {}
  
}

class BlockCollide extends Collide {
  goThrough = false;
  constructor(w=10, h=10, parent) {
    super(w, h);
    this.parent = parent;
    
  }

  block(target, hit) {
    if (target === this) {
      // skip
    }
    else {
      if (!this.goThrough && !target.goThrough) {
        let atLeft = target.x + target.w/2 >= this.x - this.w/2 && target.x - target.w/2 < this.x + this.w/2 && hit;
        let atRight = target.x - target.w/2 <= this.x + this.w/2 && target.x + target.w/2 > this.x - this.w/2 && hit;
        let atTop = target.y >= this.y - this.h && target.y - target.h < this.y && hit;
        let atBottom = target.y - target.h <= this.y && target.y > this.y && hit;
        // if (atLeft) console.log(this.id, target.id);
        // // right to left
        // if (atRight && (atTop || atBottom)) {
        //   // touch from right side
        //   console.log('right')
        //   target.parent.block.leftList[this.id] = true;
        //   target.parent.pos.x = this.x + this.w/2 + target.w/2;
        // }
        // else {
        //   target.parent.block.leftList[this.id] = false;
        // }
        
        // // left to right
        // if (atLeft && (atTop || atBottom)) {
        //   // touch from left side
        //   console.log('left')
        //   target.parent.block.rightList[this.id] = true;
        //   target.parent.pos.x = this.x - this.w/2 - target.w/2;
        // }
        // else {
        //   target.parent.block.rightList[this.id] = false;
        // }
  
        // top to bottom
        if (atTop && (atLeft || atRight)) {
          // touch from top
          target.parent.block.bottomList[this.id] = true;
          target.parent.pos.y = this.y - this.h;
        }
        else {
          target.parent.block.bottomList[this.id] = false;
        }
        
        // bottom to top
        if (atBottom && (atLeft || atRight)) {
          // touch from bottom
          
          target.parent.block.topList[this.id] = true;
          target.parent.pos.y = this.y + target.h;
        }
        else {
          target.parent.block.topList[this.id] = false;
        }
      }
    }
    
    
  }

  isHit(x, y) {
    this.x = x;
    this.y = y;
    
    self.system.blockList.forEach(target => {
      if (target === this) {
        // console.log('skip')

      }
      else {
        // Debug mode
        // self.p5.push();
        // self.p5.stroke(200,100, 100);
        // self.p5.strokeWeight(1);
        // self.p5.fill('rgba(10, 10, 10, 0.1)');
        // self.p5.rectMode(self.p5.CORNER);
        // self.p5.rect(target.x - target.w/2, target.y - target.h, target.w, target.h);
        // self.p5.rect(x - this.w/2, y - this.h, this.w, this.h);
        // self.p5.pop();
        let hit;
        
        if (this.w >= 0) {
          hit = self.p5.collideRectRect(
            target.x - target.w/2, target.y - target.h, target.w, target.h,
            x - this.w/2, y - this.h, this.w, this.h);
        }
        else {
          hit = self.p5.collideRectRect(
            target.x - target.w/2, target.y - target.h, target.w, target.h,
            x + this.w/2, y - this.h, -this.w, this.h);
        }

        this.block(target, hit);
      }
    });
    
  }
}
module.exports = {Collide, BlockCollide};