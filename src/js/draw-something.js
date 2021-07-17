class DrawCanvas {
  constructor(id) {
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
    this.wsDrawing = false;
    this.penColor = 'black';
    this.lineWidth = 10;
    this.eraserWidth = 30;
    this.actionList = [];
    this.actionStage = null;
    this.isActive = false;
    this.saveImage();
    this.wsSetOrder('init');
  }

  reset() {
    this.clearCanvas();
    this.isDrawing = false;
    this.wsDrawing = false;
    this.penColor = 'black';
    this.lineWidth = 10;
    this.eraserWidth = 30;
    this.actionList = [];
    this.actionStage = null;
    this.isActive = false;
    this.saveImage();
    this.wsSetOrder('init');
  }

  // change the color of stroke (border) and fill
  changeColor(newColor) {
    this.penColor = newColor;
    this.ctx.strokeStyle = this.penColor;
    this.ctx.fillStyle = this.penColor;
    this.wsSetOrder('pen-color:' + newColor);
  }

  // change the width of stroke
  changeLineWidth(newWidth) {
    this.ctx.lineWidth = newWidth;
    this.lineWidth = newWidth;
    this.wsSetOrder('pen-width:' + newWidth);
  }
  changeEraserWidth(newWidth) {
    this.ctx.lineWidth = newWidth;
    this.eraserWidth = newWidth;
    this.wsSetOrder('eraser-width:' + newWidth);
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
      that.path.beginX = event.offsetX;
      that.path.beginY = event.offsetY;
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
        that.path.endX = event.offsetX;
        that.path.endY = event.offsetY;
        // Draw a line to the end point (per frame)
        that.ctx.lineTo(
          that.path.endX,
          that.path.endY
        );
        // Paint the line
        that.ctx.stroke();
        that.wsDraw(that.path, false);
      }
    }
    this.canvas.onmouseup = () => {
      // Stop drawing
      that.isDrawing = false;
      that.wsDraw(that.path, false, false);

      // Record the action
      this.saveImage();
      this.wsSetOrder('save');
    }
    this.canvas.onmouseleave = () => {
      that.isDrawing = false;
    }
  }
  cancel() {
    this.isDrawing = false;
    this.canvas.onmousedown = () => {
      return false;
    }
    this.canvas.onmousemove = () => {
      return false;
    }
    this.canvas.onmouseup = () => {
      return false;
    }
    this.canvas.onmouseleave = () => {
      return false;
    }
  }
  pen() {
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.lineWidth;
    this.wsSetOrder('pen');
  }
  eraser() {
    this.ctx.strokeStyle = 'white';
    this.ctx.eraserWidth = this.eraserWidth;
    this.wsSetOrder('eraser');
  }
  clear() {
    this.clearCanvas();
    this.saveImage();
    this.wsSetOrder('clear');
  }
  undo() {
    if (this.actionStage != null && this.actionStage > 0) {
      console.log('combo undo');
      this.actionStage -= 1;
      this.resumeImage(this.actionList[this.actionStage]);
      this.wsSetOrder('undo');
    }
    else if (this.actionStage == null && this.actionList.length > 1) {
      console.log('first undo');
      this.actionStage = this.actionList.length - 2;
      this.resumeImage(this.actionList[this.actionStage]);
      this.wsSetOrder('undo');
    }
    else {
      console.log('cant undo', this.actionStage, this.actionList);
    }
  }
  redo() {
    if (this.actionStage != null && this.actionStage < this.actionList.length - 1) {
      this.actionStage += 1;
      this.resumeImage(this.actionList[this.actionStage]);
      this.wsSetOrder('redo');
    }
  }
  saveImage() {
    let action = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.actionList.push(action);
    this.actionList = this.actionList.slice(-10);
  }
  resumeImage(imageData) {
    this.clearCanvas();
    this.ctx.putImageData(imageData, 0, 0);
  }
  wsGetOrder(order) {
    console.log('getOrder:', order);
    if (!this.isActive) {
      console.log('not active now');
      var index;
      var width;
      switch (order) {
      case 'init':
        this.saveImage();
        break;
      case 'save':
        this.saveImage();
        break;
      case 'clear':
        this.clear();
        break;
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case 'pen':
        this.pen();
        break;
      case 'eraser':
        this.eraser();
        break;
      case (order.match(/^pen-color:/) || {}).input:
        index = order.indexOf(":");
        var color = order.substring(index+1, order.length);
        this.changeColor(color);
        break;
      case (order.match(/^pen-width:/) || {}).input:
        index = order.indexOf(":");
        width = order.substring(index+1,order.length);
        this.changeLineWidth(width);
        break;
      case (order.match(/^eraser-width:/) || {}).input:
        index = order.indexOf(":");
        width = order.substring(index+1,order.length);
        this.changeEraserWidth(width);
        break;
      default:
        break;
      }
    }
  }
  wsSetOrder(order) {
    if (this.isActive) {
      this.wsDraw(order, true);
    }
    
  }
  wsGetPath(path) {
    if (!this.wsDrawing) {
      this.ctx.beginPath();
      // Set the start point
      this.ctx.moveTo(
        path.beginX,
        path.beginY
      )
      this.wsDrawing = true;
      if (this.actionStage != null) {
        this.actionList = this.actionList.slice(0, this.actionStage + 1);
      }
      this.actionStage = null;
    }
    
    this.ctx.lineTo(
      path.endX,
      path.endY
    )
    this.ctx.stroke();
  }

  wsPathStop() {
    this.wsDrawing = false;
  }
}
export default DrawCanvas;