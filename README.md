# FeIDo Firefox Browser Extension
The Firefox prototype of the FeIDo browser extension (for the FF desktop version).
The extension forwards FIDO requests between a web page and the Middleware app.


## Configuration
In the current prototype, the address of the Middleware's websocket server must
be manually configured into the browser extension before installation.
To do this, adapt the IP address (and optionally, port) in `background.js` (line 19)
to that of your phone's FeIDo Middleware (websocket server).


## Installation
It is currently recommended to install the Firefox browser extension as a temporary
extension.
To load the extension into your desktop Firefox, perform the following steps:

* browse to `about:debugging#/runtime/this-firefox`
* click on `Load Temporary Add-on`
* select `feido-browser-extension/manifest.json`

Note that you have to reload the extension on a Firefox restart and on changes to
the extension.


## Warning
The `FEIDOProto.proto` protobuf file must be *manually* synchronized with the
version of the main FeIDo repository at the moment.
