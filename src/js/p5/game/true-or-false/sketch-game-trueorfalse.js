const sketch = (p5) => {
  let container;
  let GameSystem = require('./GameSystem.js');
  let gameSystem;
  // Setup Func
  p5.setup = () => {
    container = document.querySelector('#p5Sketch-trueorfalse');
    let gameCnv = p5.createCanvas(container.offsetHeight * 1920/1080, container.offsetHeight);
    gameCnv.parent("#p5Sketch-trueorfalse");
    p5.frameRate(60);
    gameSystem = new GameSystem(p5);

  }
  
  // Draw Func
  p5.draw = () => {
    if (container.noLoop) {
      p5.noLoop();
    }
    p5.background(200);
    gameSystem.run();
  }
}
module.exports = sketch;






