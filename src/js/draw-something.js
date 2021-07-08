import './websocket.js';

class DrawCanvas {
  constructor(id, ws) {
    this.ws = ws;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.canvasBox = this.canvas.getBoundingClientRect();
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0
    }
    this.isDrawing = false;
    this.penColor = 'black';
    this.lineWidth = 10;
    this.eraserWidth = 30;
    this.actionList = [];
    this.actionStage = null;
    let action = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.actionList.push(action); // Initial empty scene record into action list
  }

  // change the color of stroke (border) and fill
  changeColor(newColor) {
    this.penColor = newColor;
    this.ctx.strokeStyle = this.penColor;
    this.ctx.fillStyle = this.penColor;
  }
  // change the width of stroke
  changeLineWidth(newWidth) {
    this.ctx.lineWidth = newWidth;
    this.lineWidth = newWidth;
  }
  changeEraserWidth(newWidth) {
    this.ctx.lineWidth = newWidth;
    this.eraserWidth = newWidth;
  }
  clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  assign() {
    let that = this;
    this.canvas.onmousedown = () => {
      // Init a new line
      that.ctx.beginPath();
      // Get the start vectors
      that.path.beginX = event.clientX - that.canvasBox.left;
      that.path.beginY = event.clientY - that.canvasBox.top;
      // Set the start point
      that.ctx.moveTo(
        that.path.beginX,
        that.path.beginY
      )
      // Switch to drawing mode
      that.isDrawing = true;
      // Check the action status (if it's at one of the stage of action list)
      if (that.actionStage != null) {
        that.actionList = that.actionList.slice(0, that.actionStage + 1);
      }
      that.actionStage = null;
    }
    this.canvas.onmousemove = () => {
      // When drawing
      if(that.isDrawing) {
        // Calculate the end vectors
        that.path.endX = event.clientX - that.canvasBox.left;
        that.path.endY = event.clientY - that.canvasBox.top;
        // Draw a line to the end point (per frame)
        that.ctx.lineTo(
          that.path.endX,
          that.path.endY
        );
        // Paint the line
        that.ctx.stroke();
        // that.ws.send();
      }
    }
    this.canvas.onmouseup = () => {
      // Stop drawing
      that.isDrawing = false;
      // that.ws.send('stop,');

      // Record the action
      let action = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height);
      that.actionList.push(action);
      that.actionList = that.actionList.slice(-10);
    }
    this.canvas.onmouseleave = () => {
      that.isDrawing = false;
    }
  }
  pen() {
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.lineWidth;
  }
  eraser() {
    this.ctx.strokeStyle = 'white';
    this.ctx.eraserWidth = this.eraserWidth;
  }
  clear() {
    this.clearCanvas();
    let action = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.actionList.push(action);
    this.actionList = this.actionList.slice(-10);
  }
  undo() {
    if (this.actionStage != null && this.actionStage > 0) {
      this.clearCanvas();
      this.actionStage -= 1;
      this.ctx.putImageData(this.actionList[this.actionStage], 0, 0);
    }
    else if (this.actionStage == null && this.actionList.length > 1) {
      this.clearCanvas();
      this.actionStage = this.actionList.length - 2;
      this.ctx.putImageData(this.actionList[this.actionStage], 0, 0);
    }
  }
  redo() {
    if (this.actionStage != null && this.actionStage < this.actionList.length - 1) {
      this.clearCanvas();
      this.actionStage += 1;
      this.ctx.putImageData(this.actionList[this.actionStage],0 ,0);
    }
  }
}
export default DrawCanvas;