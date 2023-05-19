const sketch = (p5) => {
  let container;
  // Font's Property
  let palette = ["#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4"];
  let vmin;
  // let vmax;
  let font;
  let fs;
  let points;
  let bounds;
  let contours = [];
  let txt = 'SAKUYO';
  let ctx;

  // Preload Func
  p5.preload = () => {
    font = p5.loadFont(require('@/assets/font/Allerta-Stencil-Regular.ttf'));
  }

  // Setup Func
  p5.setup = () => {
    container = document.querySelector('#p5Sketch-logo');
    let logoCnv = p5.createCanvas(container.offsetWidth, container.offsetHeight);
    logoCnv.parent("#p5Sketch-logo");
    p5.frameRate(10);
    // Font's Setup
    
    vmin = (p5.width < p5.height) ? p5.width : p5.height;
    fs = vmin * 0.0085;
    points = font.textToPoints(txt, 0, 0, fs, {
      sampleFactor: 8,
      simplifyThreshold: 0
    });
    bounds = font.textBounds(txt, 0, 0, fs);
    
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      if (i === 0) {
        contours.push([]);
      } else {
        let p0 = points[i - 1];
        let d = p5.dist(p0.x, p0.y, p1.x, p1.y);
        if (d > fs / 10) {
          contours.push([]);
        }
      }
      contours[contours.length - 1].push(p1);
    }

    contours.sort(function (a, b) {
      let avrAx = 0;
      for (let i = 0; i < a.length; i++) {
        avrAx += a[i].x;
      }
      avrAx /= a.length;
      let avrBx = 0;
      for (let i = 0; i < b.length; i++) {
        avrBx += b[i].x;
      }
      avrBx /= b.length;
      return avrAx - avrBx;
    });
    
    ctx = p5.drawingContext;
    ctx.shadowBlur = fs * 3;
    p5.strokeWeight(fs * 0.0225);
    p5.strokeJoin(p5.ROUND);
    p5.noFill();
    
  }
  
  // Draw Func
  p5.draw = () => {
    p5.resizeCanvas(container.offsetWidth, container.offsetHeight);
    p5.background(30);

    // Font's Draw
    p5.blendMode(p5.ADD);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.scale((vmin * 0.175) / fs);
    p5.translate(-bounds.w / 2, bounds.h / 2);
    neon(false);
    neon(true);
    p5.blendMode(p5.BLEND);

  }
  
  function neon(drawStroke) {
    for (let i = 0; i < contours.length; i++) {
      let points = contours[i];
      p5.beginShape(p5.TESS);
      for (let j = 0; j < points.length; j++) {
        let p = points[j];
        let c = p5.color(palette[i % palette.length]);
        let r = c.levels[0];
        let g = c.levels[1];
        let b = c.levels[2];
        let n = p5.noise(i, p5.frameCount * (drawStroke ? 0.03 : 6));
        n = 1.0 - n * n;
        let a = (p5.floor(n * 2) / 2 + 0.1)  * 255;
        ctx.shadowColor = `rgba(${ r }, ${ g }, ${ b }, ${ drawStroke ? 1 : n })`;
        if (drawStroke) {
          p5.stroke(r, g, b, a);
        } else {
          p5.stroke(0);
        }
        p5.vertex(p.x, p.y);
      }
      p5.endShape(p5.CLOSE);
    }
  }

    
      
    
}






module.exports = sketch;