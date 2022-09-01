// declare querying tab globally so it can be used for return message
var queryingTab;

// listen for sendMessage requests from content script
browser.runtime.onMessage.addListener(intercetpedForwarToWS);

// forward intercepted message to android via WebSocket
async function intercetpedForwarToWS(msg){
    console.log("Received request.");
    console.log("Received parameters: " +  JSON.stringify(msg));
  
    // query and save active tabID
    browser.tabs.query({active: true}).then(gotTabID, gotError);

    // construct protobuf message
    var proto = await buildCredentials(msg);
    console.log("Built proto: " + proto);

    let socket = new WebSocket("ws://192.168.178.32:11111");
    socket.onopen = function(e) {
      console.log("WebSocket connection open.");
      socket.send(proto);
    };

    socket.onmessage = function(event) {
      console.log("Received WSS message: " + event);
        returnedForwardToOverwriteJs(event);
    };
}

function gotTabID(msg){
  queryingTab = msg;
}

function gotError(err){
  console.log("Error when querying tabID where request originated: " + err);
}

// parse to object and forward return to overwrite.js
async function returnedForwardToOverwriteJs(msg){
  console.log("Received WebSocket message:" + JSON.stringify(msg));
  
  let publicKeyCredential = await parseReturn(msg);

  sendMessage(publicKeyCredential);
}

// send return message to content script
async function sendMessage(msg){
  console.log("Sending message to content script: " + JSON.stringify(msg));
  let promisedSending = browser.tabs.sendMessage(queryingTab[0].id, msg);
  promisedSending.then(sentMessage, sendMessageError)
}

function sentMessage(msg){
  console.log("Sent message to content script.");
}

function sendMessageError(err){
  console.log("Error during sendMessage communication to content script: " + err);
}
