var ws = new WebSocket('wss://39.108.93.3:9998');
// ws.binaryType = 'arraybuffer';

ws.onopen = function (event) {
  console.log("Connection open." + event);
  login();
};

ws.onmessage = function (event) {
  console.log("Received Message: ", event);
};

ws.onclose = function (event) {
  console.log("Connection closed." + event);
};

function login() {
  var testObj = {flag:'login', cookie:'1'};
  ws.send(JSON.stringify(testObj));
}

function wsMsg(content) {
  var msg = {
    flag:'msg',
    data:content
  }
  ws.send(JSON.stringify(msg));
}
function wsDraw(content, isOrder=true, pathing=true) {
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
  console.log(msg);
  setTimeout(()=>{
    ws.send(JSON.stringify(msg));
  }, 0);
  
}

export {ws, wsMsg, wsDraw};