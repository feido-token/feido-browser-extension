// recreate the FIDO return value objects as they are not accessible from JS
class PublicKeyCredential{
    id;
    rawId;
    response;
    authenticatorAttachment;
    type;

    constructor(rawId, response, authenticatorAttachment){
        this.rawId = rawId;
        this.id = btoa((String.fromCharCode.apply(null, new Uint8Array(rawId)))).replaceAll("=", "");
        this.response = response;
        this.authenticatorAttachment = authenticatorAttachment;
        this.type = "public-key";
    }

    getClientExtensionResults(){
        console.log("Not implemented yet!");
        return null;
    }

    /* Not visible in Firefox?
    discovery(){
        console.log("Not implemented yet!");
        return null;
    }

    identifier(){
        console.log("Not implemented yet!");
        return null;
    }

    clientExtensionsResults(){
        console.log("Not implemented yet!");
        return null;
    }
    */
}

class AuthenticatorAttestationResponse{

    clientDataJSON;
    attestationObject;

    constructor(clientDataJSON, attestationObject){
        this.clientDataJSON = clientDataJSON;
        this.attestationObject = attestationObject;
    }

    /* Not visible in Firefox?
    getTransports(){
        console.log("Not implemented yet!");
        return null;
    }

    getAuthenticatorData(){
        console.log("Not implemented yet!");
        return null;
    }

    getPublicKey(){
        console.log("Not implemented yet!");
        return null;
    }

    getPublicKeyAlgorithm(){
        console.log("Not implemented yet!");
        return null;
    }
    */
}

class AuthenticatorAssertionResponse{

    clientDataJSON;
    authenticatorData;
    signature;
    userHandle;


    constructor(clientDataJSON, authenticatorData, signature, userHandle){
        this.clientDataJSON = clientDataJSON;
        this.authenticatorData = authenticatorData;
        this.signature = signature;
        this.userHandle = userHandle;
    }

    /* Not visible in Firefox?
    getTransports(){
        console.log("Not implemented yet!");
        return null;
    }

    getAuthenticatorData(){
        console.log("Not implemented yet!");
        return null;
    }

    getPublicKey(){
        console.log("Not implemented yet!");
        return null;
    }

    getPublicKeyAlgorithm(){
        console.log("Not implemented yet!");
        return null;
    }
    */
}
