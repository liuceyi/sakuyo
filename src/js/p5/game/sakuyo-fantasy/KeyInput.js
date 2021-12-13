



class KeyInput {
  // Boolean
  isUpPressed = false;
  isDownPressed = false;
  isLeftPressed = false;
  isRightPressed = false;
  isAttackPressed = false;
  isJumpPressed = false;
  isDefencePressed = false;
  isSkill1Pressed = false;
  isSkill2Pressed = false;
  isSkill3Pressed = false;

  // Default KeyCode
  UP_KEY_CODE = 87; // W
  DOWN_KEY_CODE = 83; // S
  LEFT_KEY_CODE = 65; // A
  RIGHT_KEY_CODE = 68; // D
  PAUSE_KEY_CODE = 80; // P
  ATTACK_KEY_CODE = 74; // J
  JUMP_KEY_CODE = 75; // K
  DEFENCE_KEY_CODE = 76; // L
  SKILL1_KEY_CODE = 85; // U
  SKILL2_KEY_CODE = 73; // I
  SKILL3_KEY_CODE = 79; // O

  constructor() {
    self.p5.keyPressed = this.keyPressed;
    self.p5.keyReleased = this.keyReleased;
  }

  // *In these 2 FUNCs, this is equal to p5 object
  keyPressed() {
    switch(this.keyCode) {
    case self.system.currentKeyInput.UP_KEY_CODE:
      self.system.currentKeyInput.isUpPressed = true;
      return;
    case self.system.currentKeyInput.DOWN_KEY_CODE:
      self.system.currentKeyInput.isDownPressed = true;
      return;
    case self.system.currentKeyInput.LEFT_KEY_CODE:
      self.system.currentKeyInput.isLeftPressed = true;
      return;
    case self.system.currentKeyInput.RIGHT_KEY_CODE:
      self.system.currentKeyInput.isRightPressed = true;
      return;
    case self.system.currentKeyInput.PAUSE_KEY_CODE:
      
      if (self.system.paused) self.p5.loop();
      else{
        self.p5.noLoop();
      } 
      self.system.paused = !self.system.paused;
      return;
    case self.system.currentKeyInput.ATTACK_KEY_CODE:
      self.system.currentKeyInput.isAttackPressed = true;
      return;
    case self.system.currentKeyInput.JUMP_KEY_CODE:
      self.system.currentKeyInput.isJumpPressed = true;
      return;
    case self.system.currentKeyInput.DEFENCE_KEY_CODE:
      self.system.currentKeyInput.isDefencePressed = true;
      return;
    case self.system.currentKeyInput.SKILL1_KEY_CODE:
      self.system.currentKeyInput.isSkill1Pressed = true;
      return; 
    case self.system.currentKeyInput.SKILL2_KEY_CODE:
      self.system.currentKeyInput.isSkill2Pressed = true;
      return;    
    case self.system.currentKeyInput.SKILL3_KEY_CODE:
      self.system.currentKeyInput.isSkill3Pressed = true;
      return;    
    }
  }

  keyReleased() {
    switch(this.keyCode) {
      case self.system.currentKeyInput.UP_KEY_CODE:
        self.system.currentKeyInput.isUpPressed = false;
        return;
      case self.system.currentKeyInput.DOWN_KEY_CODE:
        self.system.currentKeyInput.isDownPressed = false;
        return;
      case self.system.currentKeyInput.LEFT_KEY_CODE:
        self.system.currentKeyInput.isLeftPressed = false;
        return;
      case self.system.currentKeyInput.RIGHT_KEY_CODE:
        self.system.currentKeyInput.isRightPressed = false;
        return;
      // case self.system.currentKeyInput.PAUSE_KEY_CODE:
      //   if (self.system.paused) this.loop();
      //   else this.noLoop();
      //   self.system.paused = !self.system.paused;
      //   return;
      case self.system.currentKeyInput.ATTACK_KEY_CODE:
        self.system.currentKeyInput.isAttackPressed = false;
        return;
      case self.system.currentKeyInput.JUMP_KEY_CODE:
        self.system.currentKeyInput.isJumpPressed = false;
        return;
      case self.system.currentKeyInput.DEFENCE_KEY_CODE:
        self.system.currentKeyInput.isDefencePressed = false;
        return;
      case self.system.currentKeyInput.SKILL1_KEY_CODE:
        self.system.currentKeyInput.isSkill1Pressed = false;
        return; 
      case self.system.currentKeyInput.SKILL2_KEY_CODE:
        self.system.currentKeyInput.isSkill2Pressed = false;
        return;    
      case self.system.currentKeyInput.SKILL3_KEY_CODE:
        self.system.currentKeyInput.isSkill3Pressed = false;
        return;    
        
    }
  }


}

module.exports = KeyInput;