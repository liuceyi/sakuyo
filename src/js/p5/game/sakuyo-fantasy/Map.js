const { BlockCollide } = require("./Collide");

class Wall {
  block = {left:false, right:false, top:false, bottom:false};
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.pos = {x:x, y:y};
    this.collide = new BlockCollide(this.width, this.height, this);
    // self.system.blockList.push(this.collide);
  }

  run() {
    self.p5.push();
    self.p5.rectMode(self.p5.CENTER);
    self.p5.fill(80);
    self.p5.stroke(80);
    self.p5.rect(this.pos.x, this.pos.y - this.height/2, this.width, this.height);
    self.p5.pop();
    this.collide.isHit(this.pos.x, this.pos.y);
  }

}

class Map {
  wallList = [];
  
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.build();
  }

  build() {
    this.wallList.push(new Wall(self.p5.width/2, self.p5.height/2, self.p5.width, 10));

    this.wallList.push(new Wall(100, self.p5.height/2 - 100, 100, 10));

    this.wallList.push(new Wall(self.p5.width - 500, self.p5.height/2 - 10, 100, 50));
  }

  draw() {
    this.wallList.forEach(wall => {
      wall.run();
    });
  }
}
module.exports = Map;