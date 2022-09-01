// code to overwrite navigator.credentials.get and .create
var code = `
  // intercept webauthn credentials.get and forward to FeIDo extension
  navigator.credentials.get = async function(opts) {
    console.log("Intercepted navigator.credentials.get().");
    window.postMessage([opts, "fromWebsite", "credentials.get"], origin);
  // listen for postMessage from content script and in Promise 
    return new Promise(resolve => {
      window.addEventListener("message", function(event) {
          if (event.source == window && event.data && event.data[1] == "fromContentScript") {
            console.log("Received message from content script." + JSON.stringify(event.data));
            resolve(event.data[0]);
          }});
        });
  };

  // intercept webauthn credentials.create and forward to FeIDo extension
  navigator.credentials.create = async function(opts) {
    console.log("Intercepted navigator.credentials.create().");
    window.postMessage([opts, "fromWebsite", "credentials.create"], origin);
  // listen for postMessage from content script and in Promise 
    return new Promise(resolve => {
      window.addEventListener("message", function(event) {
          if (event.source == window && event.data && event.data[1] == "fromContentScript") {
            console.log("Received message from content script." + JSON.stringify(event.data));
            resolve(event.data[0]);
          }});
        });
  };
`;

// inject code into website
var script = document.createElement('script');
script.textContent = code;
(document.head||document.documentElement).appendChild(script);
script.remove();

// listen for postMessage from website and forward to background script
window.addEventListener("message", function(event) {
    if (event.source == window && event.data && event.data[1] == "fromWebsite") {
	    console.log("Forwarding navigator." + event.data[2] + " to background script.");
      browser.runtime.sendMessage({"opts": event.data[0], "type": event.data[2], "origin": origin})
    }
  });

// listen for sendMessage from background script and forward to injected code
browser.runtime.onMessage.addListener(function(event) {
    console.log("Recevied sendMessage from background script: " + event);
    window.postMessage([event, "fromContentScript"], origin);
});

