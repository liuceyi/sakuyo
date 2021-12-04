module.exports = function () {
  return (sketch) => {
    // Particle's Property
    let particleArr = [];
    let centerRadius = 100;
    let angle = 0;
    let container;

    // Setup Func
    sketch.setup = () => {
      container = document.querySelector('#p5Sketch-particles');
      let particleCnv = sketch.createCanvas(container.offsetWidth, container.offsetHeight);
      particleCnv.parent("#p5Sketch-particles");
      sketch.frameRate(60);
      
      // Particle's Setup
      sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.angleMode(sketch.DEGREES);
        for (let i = 0; i < 100; i++) {
          let particle = new Particle();
          particleArr.push(particle);
        }
      sketch.pop();
    }
    
    // Draw Func
    sketch.draw = () => {
      sketch.resizeCanvas(container.offsetWidth, container.offsetHeight);
      // sketch.background(30);

      // Particle's Draw
      // sketch.push();
      sketch.noFill();
      sketch.push();
        sketch.translate(sketch.mouseX, sketch.mouseY);
        sketch.rotate(angle);
        sketch.square(0, 0, centerRadius * 2);
      sketch.pop();
      for (let i = 0; i < particleArr.length; i++) {
        particleArr[i].collipse();
        particleArr[i].move();
        particleArr[i].getCenter(sketch.createVector(sketch.mouseX, sketch.mouseY));
        particleArr[i].changeSize();
        particleArr[i].draw();
        particleArr[i].wrap();
      }
        
      angle += 10;
      // sketch.pop();
    }
    
    class Particle {
      constructor() {
        // Initialize
      
        // Size
        this.radius = 5;
        // Fill Color
        this.color = sketch.color(sketch.random(100, 200), sketch.random(255), 200);
        // Border Color
        this.lineColor = sketch.color(200, 200, 200);
        this.lineWidth = 2;
        // Movement Property
        this.pos = sketch.createVector(sketch.random(0, sketch.width), sketch.random(0, sketch.height)); // Position
        this.vec = sketch.createVector(sketch.random(-5, 5), sketch.random(-5, 5)); // Velocity
        this.acc = sketch.createVector(0 , 0); // Acceleration
        
        // Movement Limitation
        this.minSpeed = 10;
        this.maxSpeed = 30;
    
        this.gap = 30;
        // Shape
        this.displayShape = function() {
          sketch.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        }
      }
      
      move() {
        this.vec.add(this.acc);
        this.vec.limit(this.maxSpeed, this.maxSpeed);
        this.pos.add(this.vec);
        this.vec.lerp(sketch.createVector(0, 0), 0.1);
        this.acc.lerp(sketch.createVector(0, 0), 0.3);
      }
      
      getCenter(center) {
        let posDist = sketch.dist(this.pos.x, this.pos.y, sketch.mouseX, sketch.mouseY);
        let r1r2 = centerRadius + this.radius;
        
        if (posDist < r1r2 + this.gap) {
          this.acc = this.pos.copy();
          this.acc.sub(center).lerp(0, 0, 0.5);
          // this.acc = sketch.Vector.sub(this.pos, center).lerp(0, 0, 0.5);
        }
        
        else {
          this.acc = center.copy();
          this.acc.sub(this.pos).div(1000);
        }
      }

      changeSize() {
        let posDist = sketch.dist(this.pos.x, this.pos.y, sketch.mouseX, sketch.mouseY);
        let r1r2 = centerRadius + this.radius;
        this.radius = sketch.lerp(5, 30, r1r2 / posDist);
      }

      changeColor() {
        let r = sketch.random(255);
        let g = sketch.random(255);
        let b = sketch.random(255);
        return sketch.color(r, g, b);
      }
        
      draw() {
        // Color
        sketch.fill(this.color);
        sketch.stroke(this.lineColor);
        sketch.noStroke();
        // Width
        sketch.strokeWeight(this.lineWidth);
        // Display
        this.displayShape();
        // rect(this.pos.x, this.pos.y, this.width, this.height);
      }
        
      wrap() {
        if (this.pos.x > sketch.width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = sketch.width;
        if (this.pos.y > sketch.height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = sketch.height;
      }
        
      collipse() {
        let posDist = sketch.dist(this.pos.x, this.pos.y, sketch.mouseX, sketch.mouseY);
        let r1r2 = centerRadius + this.radius;
        
        if (posDist < r1r2) {
          let accRate = 1 - (posDist - r1r2) / r1r2;
          this.vec = sketch.createVector(this.pos.x - sketch.mouseX, this.pos.y - sketch.mouseY);
          this.acc = sketch.createVector((this.pos.x - sketch.mouseX)*accRate, (this.pos.y - sketch.mouseY)*accRate);
        }
      }
    }
  }
}






