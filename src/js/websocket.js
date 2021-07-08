var ws = new WebSocket('ws://localhost:9998');
ws.onopen = function (event) {
    console.log("Connection open ..." + event);
    ws.send("Hello WebSockets!");
};
ws.onmessage = function (event) {
        if (typeof event.data === String) {
            console.log("Received data string");
        }
 
        if (event.data instanceof ArrayBuffer) {
            var buffer = event.data;
            console.log("Received arraybuffer" + buffer);
        }
    console.log("Received Message: " + event.data);
    // ws.close();
};
ws.onclose = function (event) {
    console.log("Connection closed." + event);
};
// ws.send("Hello WebSockets!");