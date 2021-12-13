class GameUI {
  constructor() {
    
  }

  draw() {
    this.drawUI();
    this.drawPlayerHP();
    this.drawSkillCd();
  }

  drawUI(){

  }

  setGradient(x, y, w, h, c1, c2, axis=0) {
    self.p5.push();
    self.p5.noFill();
    self.p5.strokeWeight(1);
    const X_AXIS = 0;
    const Y_AXIS = 1;
    
    if (axis === Y_AXIS) {
      // Vertical
      for (let i = y; i <= y + h; i++) {
        let inter = self.p5.map(i, y, y + h, 0, 1);
        let c = self.p5.lerpColor(c1, c2, inter);
        self.p5.stroke(c);
        self.p5.line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Horizonal
      for (let i = x; i <= x + w; i++) {
        let inter = self.p5.map(i, x, x + w, 0, 1);
        let c = self.p5.lerpColor(c1, c2, inter);
        self.p5.stroke(c);
        self.p5.line(i, y, i, y + h);
      }
    }
    self.p5.pop();
  }

  drawPlayerHP(){
    let border_x = 15;
    let border_y = 15;
    let border_w = 10;
    let hp_w = self.p5.width/3;
    let hp_h = self.p5.height/50;

    let hpRate = self.system.player.hp / self.system.player.hpMax;
    self.p5.push();
    self.p5.rectMode(self.p5.CORNER);
    self.p5.strokeWeight(border_w);
    self.p5.stroke(100);
    
    // self.p5.rect(10, 10, hpRate * hp_w, hp_h, hp_h);
    this.setGradient(border_x + border_w, border_y + border_w, hpRate * hp_w, hp_h, self.p5.color(50,205,50), self.p5.color(127,255,170), 0);
    self.p5.noFill();
    self.p5.rect(border_x, border_y, hp_w + border_w * 2, hp_h + border_w * 2, border_w);
    self.p5.pop();
  }

  drawSkillCd(){
    let skb_w = self.p5.width/3;
    let skb_h = self.p5.height/10;
    let sk_w = skb_w / 5;
    
    self.p5.push();
    self.p5.rectMode(self.p5.CORNER);
    self.p5.noStroke();
    self.p5.fill(self.p5.color('rgba(30, 30, 30, 0.5)'));
    self.p5.rect(self.p5.width - skb_w, self.p5.height - skb_h, skb_w, skb_h);
    {
      let cdRate = self.system.player.skill1.cd / self.system.player.skill1.cdMax;
      self.p5.fill(230);
      self.p5.ellipse(self.p5.width - skb_w + skb_w/6, self.p5.height - skb_h/2, sk_w * 0.5);
      self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
      self.p5.fill(30);
      self.p5.textSize(10);
      self.p5.text("Skill 1", self.p5.width - skb_w + skb_w/6, self.p5.height - skb_h/2);
      self.p5.fill(self.p5.color('rgba(50, 50, 50, 0.5)'));
      self.p5.arc(self.p5.width - skb_w + skb_w/6, self.p5.height - skb_h/2, sk_w * 0.5, sk_w * 0.5, -self.p5.HALF_PI, -self.p5.HALF_PI + self.p5.TWO_PI * cdRate);
    }

    {
      let cdRate = self.system.player.skill2.cd / self.system.player.skill2.cdMax;
      self.p5.fill(230);
      self.p5.ellipse(self.p5.width - skb_w + skb_w/2, self.p5.height - skb_h/2, sk_w * 0.5);
      self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
      self.p5.fill(30);
      self.p5.textSize(10);
      self.p5.text("Skill 2", self.p5.width - skb_w + skb_w/2, self.p5.height - skb_h/2);
      self.p5.fill(self.p5.color('rgba(50, 50, 50, 0.5)'));
      self.p5.arc(self.p5.width - skb_w + skb_w/2, self.p5.height - skb_h/2, sk_w * 0.5, sk_w * 0.5, -self.p5.HALF_PI, -self.p5.HALF_PI + self.p5.TWO_PI * cdRate);
    }
    
    
    {
      let cdRate = self.system.player.skill3.cd / self.system.player.skill3.cdMax;
      self.p5.fill(230);
      self.p5.ellipse(self.p5.width - skb_w + skb_w/6 * 5, self.p5.height - skb_h/2, sk_w * 0.5);
      self.p5.textAlign(self.p5.CENTER, self.p5.CENTER);
      self.p5.fill(30);
      self.p5.textSize(10);
      self.p5.text("Skill 3", self.p5.width - skb_w + skb_w/6 * 5, self.p5.height - skb_h/2);
      self.p5.fill(self.p5.color('rgba(50, 50, 50, 0.5)'));
      self.p5.arc(self.p5.width - skb_w + skb_w/6 * 5, self.p5.height - skb_h/2, sk_w * 0.5, sk_w * 0.5, -self.p5.HALF_PI, -self.p5.HALF_PI + self.p5.TWO_PI * cdRate);
      self.p5.pop();
    }
    
  }
}
module.exports = GameUI;