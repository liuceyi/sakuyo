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

  intersect(a1, a2, b1, b2) {
    if(a2 < a1) {
      let temp = a2;
      a2 = a1;
      a1 = temp;
    }

    if (b2 < b1) {
      let temp = b2;
      b2 = b1;
      b1 = temp;
    }
    if(a2 <= b1 || a1 >= b2) {
      return false;
    }
    return true;
  }

  block(target, hit) {
    if (target === this) {
      // skip
    }
    else {
      if (!this.goThrough && !target.goThrough && hit) {  
        // target hit from which side of this
        let top = this.y > target.y;
        let bottom = this.y < target.y;
        let left = this.x > target.x;
        let right = this.x < target.x;
        let xD = null;
        let yD = null;

        if (left) {
          xD = (target.x + target.w/2) - (this.x - this.w/2);
        }

        if (right) {
          xD = (this.x + this.w/2) - (target.x - target.w/2);
        }

        if (top) {
          yD = target.y - (this.y - this.h);
        }

        if (bottom) {
          yD = (target.y - target.h) - this.y;
        }
        

        let flag = null;

        if (xD != null && yD == null) {
          // left or right
          if (left) flag = 0;
          if (right) flag = 1;
        }
        else if (yD != null & xD == null) {
          // top or bottom
          if (top) flag = 2;
          if (bottom) flag = 3;
        }
        else if (xD == null && yD == null) {
          // no hit
        }
        else {
          if (xD <= yD) {
            // left or right
            if (left) flag = 0;
            if (right) flag = 1;
          }
          else {
            // top or bottom
            if (top) flag = 2;
            if (bottom) flag = 3;
          }
        }



        switch (flag) {
          case 0:
            target.parent.block.rightList[this.id] = true;
            target.parent.pos.x = this.x - this.w/2 - target.w/2;
            break;
          case 1:
            target.parent.block.leftList[this.id] = true;
            target.parent.pos.x = this.x + this.w/2 + target.w/2;
            break;
          case 2:
            target.parent.block.bottomList[this.id] = true;
            target.parent.pos.y = this.y - this.h;
            break;
          case 3:
            target.parent.block.topList[this.id] = true;
            target.parent.pos.y = this.y + target.h;
            break;
          default:
            target.parent.block.rightList[this.id] = false;
            target.parent.block.leftList[this.id] = false;
            target.parent.block.bottomList[this.id] = false;
            target.parent.block.topList[this.id] = false;
            break;
        }
      }
      else if (!this.goThrough && !target.goThrough && !hit) {
        target.parent.block.rightList[this.id] = false;
        target.parent.block.leftList[this.id] = false;
        target.parent.block.bottomList[this.id] = false;
        target.parent.block.topList[this.id] = false;
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
        // self.p5.strokeWeight(10);
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