// build the needed credentials.create or credentials.get protobuf 
async function buildCredentials(msg) {
    if (msg.type == "credentials.create") {
        return buildCredentialsCreate(msg.opts.publicKey, msg.origin);
    } 
    else if (msg.type == "credentials.get"){
        return buildCredentialsRequest(msg.opts.publicKey, msg.origin);
    }
    else {
        console.log("Message not of credentials.create or credentials.get type!");
    }
}

// build a credentials.create protobuf from an intercepted browser FIDO request
async function buildCredentialsCreate(msg, orig) {
    let root = await protobuf.load("FEIDOProto.proto");
    
    // Obtain a message type
    var FEIDOPacket = root.lookupType("de.cispa.feido.FEIDOWrapper");


    console.log("Challenge: " + msg.challenge);
    // Exemplary payload
    var wrapper = {
        publicKeyCredentialCreationOptions: {
            origin: orig,
            challenge: msg.challenge,
            rp: {
                id: msg.rp.id
            },
            user: {
                id: msg.user.id,
                displayName: msg.user.displayName
            },
            pubKeyCredParams: {
                type: msg.pubKeyCredParams[0].type,
                alg: msg.pubKeyCredParams[0].alg
            }
        }
        }

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg1 = FEIDOPacket.verify(wrapper);
    if (errMsg1)
        throw Error(errMsg1);

    // Create a new message
    var message = FEIDOPacket.create(wrapper); // or use .fromObject if conversion is necessary

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    buffer = FEIDOPacket.encode(message).finish();
    console.log(buffer);

    let test = FEIDOPacket.decode(buffer);
    console.log(test);

    return buffer;
}

// build a credentials.request protobuf from an intercepted browser FIDO request
async function buildCredentialsRequest(msg, orig) {
    let root = await protobuf.load("FEIDOProto.proto");
    
    // Obtain a message type
    var FEIDOPacket = root.lookupType("de.cispa.feido.FEIDOWrapper");


    console.log("Challenge: " + msg.challenge);
    // Exemplary payload
    var wrapper = {
        publicKeyCredentialRequestOptions: {
            origin: orig,
            rpId: msg.rpId,
            challenge:  msg.challenge
        }
    }

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg1 = FEIDOPacket.verify(wrapper);
    if (errMsg1)
        throw Error(errMsg1);

    // Create a new message
    var message = FEIDOPacket.create(wrapper); // or use .fromObject if conversion is necessary

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    buffer = FEIDOPacket.encode(message).finish();
    console.log(buffer);

    let test = FEIDOPacket.decode(buffer);
    console.log(test);

    return buffer;
}

async function parseReturn(buffer) {
    let arrayBuff = await buffer.data.arrayBuffer();
    let uint8Arr = new Uint8Array(arrayBuff);


    let root = await protobuf.load("FEIDOProto.proto");
    
    // Obtain a message type
    var FEIDOPacket = root.lookupType("de.cispa.feido.FEIDOWrapper");

    // Decode message
    let message;
    try {
        message = FEIDOPacket.decode(uint8Arr);
        console.log("Decoded protobuf: " + message);
    } catch (e) {
        if (e instanceof protobuf.util.ProtocolError) {
            console.log("Could only decode partial returned protobuf message!");
          } else {
            console.log("Could not decode returned message!");
          }
    }
    
    // Sanity check
    if (message.publicKeyCredential == null){
        console.log("Returned protobuf message not of publicKeyCredential type!");
    }

    // Check if Attestation or AssertionResponse
    let response;
    if (message.publicKeyCredential.response.authenticatorAttestationResponse){
        response = new AuthenticatorAttestationResponse(
            message.publicKeyCredential.response.authenticatorAttestationResponse.clientDataJSON,
            message.publicKeyCredential.response.authenticatorAttestationResponse.attestationObject);

    }
    else if (message.publicKeyCredential.response.authenticatorAssertionResponse){
        response = new AuthenticatorAssertionResponse(
            message.publicKeyCredential.response.authenticatorAssertionResponse.clientDataJSON,
            message.publicKeyCredential.response.authenticatorAssertionResponse.authenticatorData,
            message.publicKeyCredential.response.authenticatorAssertionResponse.signature,
            message.publicKeyCredential.response.authenticatorAssertionResponse.userHandle);
    }

    // Create WebAuthn compatible PublicKeyCredential
    let publicKeyCredential = new PublicKeyCredential(
        message.publicKeyCredential.rawId,
        response,
        "cross-platform");

    return publicKeyCredential;
}
