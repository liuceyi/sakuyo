class KeyInput {
  // Boolean


  // Default KeyCode
  TRUE_KEY_CODE = 13; // Enter
  PAUSE_KEY_CODE = 80; // P


  constructor() {
    self.p5.keyPressed = this.keyPressed;
    self.p5.mousePressed = this.mouseClicked;
  }

  // *In these 2 FUNCs, this is equal to p5 object
  keyPressed() {
    switch(this.keyCode) {
    case self.system.currentKeyInput.TRUE_KEY_CODE:
      self.system.question.isTrue();
      return;
    case self.system.currentKeyInput.PAUSE_KEY_CODE:
      
      if (self.system.paused) self.p5.loop();
      else{
        self.p5.noLoop();
      } 
      self.system.paused = !self.system.paused;
      return;
    }
  }

  mouseClicked() {
    // Import button group Func
    self.system.gameUI.buttonGroup[self.system.gameUI.pageFlag].forEach(button => {
      button.click();
    });
  }



}

module.exports = KeyInput;