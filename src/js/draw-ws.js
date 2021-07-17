let WS_STATUS_INVALID = 407;
let WS_STATUS_TIMEOUT = 408;
let WS_STATUS_SUCCESS = 200;
let WS_STATUS_ERROR = 400;
class DrawWs {
  constructor(address, port, cookie) {
    var link = 'wss://' + address + ':' + port + '?cookie=' + cookie;
    this.ws = new WebSocket(link);
    this.ws.that = this;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = ()=>{
        console.log("Connection open." + event);
        resolve();
      };
      this.ws.onmessage = this.onMsg;
      this.ws.onclose = this.onClose;
      this.ws.onerror = error => reject(error);
    })
  }

  onMsg(event) {
    console.log("Received Message: ", event.data);
    var msg = JSON.parse(event.data);
    switch(msg['sign']) {
      case WS_STATUS_SUCCESS: // success code 200
        var flag = msg['data']['flag'];
        var data = msg['data']['data'];
        // 'this' here does not point to the class, but the websocket object ws. *
        // Use outer function imported from constructor to load vue
        switch(flag) {
          case 'msg':
            this.handleMsg(data);
            break;
          case 'draw':
            this.handleDraw(data);
            break;
          case 'user-list':
            this.handleUserList(data);
            break;
          case 'room-id':
            this.handleRoomId(data);
            break;
          case 'game':
            this.handleGame(data);
            break;
          default:
            console.log(msg);
            break;
        }
        break;
      case WS_STATUS_INVALID:
        break;
      case WS_STATUS_TIMEOUT:
        break;
      case WS_STATUS_ERROR:
        break;
      default:
        console.log('Unknown error');
        break;
    }
  }

  onClose(event) {
    console.log("Connection closed." + event);
    setTimeout(()=>{
      console.log("Try to reconnect...");
      // this.ws = new WebSocket(this.link);
      this.reload();
    }, 10000);
  }

  GameOrder(uid, event, content='') {
    var msg = {
      flag:'game',
      event:event,
      uid:uid,
      content:content
    }
    this.send(msg);
  }

  askUserList(roomId=0) {
    var msg = {
      flag:'user-list',
      data:roomId
    }
    this.send(msg);
  }


  sendMsg(content) {
    var msg = {
      flag:'msg',
      data:content
    }
    this.send(msg);
  }

  sendDraw(content, isOrder=true, pathing=true) {
    var msg = {
      flag:'draw'
    }
    if (isOrder) {
      msg.data = {
        type:'order',
        content:content
      }
    }
    else {
      msg.data = {
        type:'path',
        content:content,
        status:pathing
      }
    }
    this.send(msg);
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg));
  }

}

export default DrawWs;