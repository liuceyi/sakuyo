module.exports = function () {
  return (sketch) => {
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
    sketch.preload = () => {
      font = sketch.loadFont(require('@/assets/font/Allerta-Stencil-Regular.ttf'));
    }

    // Setup Func
    sketch.setup = () => {
      container = document.querySelector('#p5Sketch-logo');
      let logoCnv = sketch.createCanvas(container.offsetWidth, container.offsetHeight);
      logoCnv.parent("#p5Sketch-logo");
      sketch.frameRate(30);
      // Font's Setup
      
      vmin = (sketch.width < sketch.height) ? sketch.width : sketch.height;
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
          let d = sketch.dist(p0.x, p0.y, p1.x, p1.y);
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
      
      ctx = sketch.drawingContext;
      ctx.shadowBlur = fs * 3;
      sketch.strokeWeight(fs * 0.0225);
      sketch.strokeJoin(sketch.ROUND);
      sketch.noFill();
      
    }
    
    // Draw Func
    sketch.draw = () => {
      sketch.resizeCanvas(container.offsetWidth, container.offsetHeight);
      sketch.background(30);

      // Font's Draw
      sketch.blendMode(sketch.ADD);
      sketch.translate(sketch.width / 2, sketch.height / 2);
      sketch.scale((vmin * 0.175) / fs);
      sketch.translate(-bounds.w / 2, bounds.h / 2);
      neon(false);
      neon(true);
      sketch.blendMode(sketch.BLEND);

    }
    
    function neon(drawStroke) {
      for (let i = 0; i < contours.length; i++) {
        let points = contours[i];
        sketch.beginShape(sketch.TESS);
        for (let j = 0; j < points.length; j++) {
          let p = points[j];
          let c = sketch.color(palette[i % palette.length]);
          let r = c.levels[0];
          let g = c.levels[1];
          let b = c.levels[2];
          let n = sketch.noise(i, sketch.frameCount * (drawStroke ? 0.03 : 6));
          n = 1.0 - n * n;
          let a = (sketch.floor(n * 2) / 2 + 0.1)  * 255;
          ctx.shadowColor = `rgba(${ r }, ${ g }, ${ b }, ${ drawStroke ? 1 : n })`;
          if (drawStroke) {
            sketch.stroke(r, g, b, a);
          } else {
            sketch.stroke(0);
          }
          sketch.vertex(p.x, p.y);
        }
        sketch.endShape(sketch.CLOSE);
      }
    }

    
      
    
  }
}






