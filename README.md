# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site) https://nodejs.org/en/.

### Tech
This project uses open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [LevelDB] - A light-weight library for persistence with bindings to many platforms
* [crypto-js] - JavaScript library of crypto standards
* [npm] - the package manager for JavaScript
* [bitcoinjs-lib] - A javascript Bitcoin library for node.js and browsers
* [bitcoinjs-message] - Library to sign and verify a message

### Endpoints

**URL Base:** http://localhost:8000

**To visualize a block on the chain**
Title|Params|
---------------------|--------
**URL** | /block/:height |
**Method** | GET|
**URL Params** | The block height. Integer type|
**Success Response** | The block in JSON format

**To create a new block on the chain - Star Registration**
Title|Params
 ------ | ------
**URL** | /block
**Method** | POST
 **Payload** | Specify the contents of the data block
**Payload example:**
```
{
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
            "dec": "-26° 29'\'' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
      }
}
```

**Validate User Request**
Title | Params
 ------ | ------
 **URL** | /requestValidation 
 **Method** | POST
 **Success Response** |The block in JSON format
 **Payload** | Specify the contents of the data block
**Payload example:**
```
{
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}
```
**Allow User Message Signature**
Title | Params
 ------ | ------ 
 **URL** | /message-signature/validate 
 **Method** | POST
 **Success Response** |The block in JSON format
 **Payload** | Specify the contents of the data block
**Payload example:**
```
{
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}
```
**Search by Blockchain Wallet Address**
Title | Params
 ------ | ------
 **URL** | /stars/address:[ADDRESS]
 **Method** | GET
 **Success Response** | The block in JSON format
 **URL Params** | The Wallet address

**Search by Star Block Hash**
Title | Params
 ------ | ------
 **URL** | /stars/hash:[HASH] 
 **Method** | GET
 **Success Response** | The block in JSON format
 **URL Params** | The Hash of the block

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
- Use --save flag to save dependency to our package.json file
```
npm init
```
- Install crypto-js with --save
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express with --save
```
npm install express --save
```
- Install bitcoinjs-message
```
npm install bitcoinjs-message
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Execute the server
```
node index.js
```
3: Open a new command prompt or shell terminal
4: Enter the command below to create a new block on the chain
```
curl -X POST -H "Content-Type: text/plain" --data "Testing block with test string data" http://localhost:8000/block
```
5: The response of command above should be a JSON string with the block created
```
{"hash":"1e07e63278cb8d47805b442d1ca83ffdd858326b83eb05de1b88f60622cbb611","height":1,"body":"Testing block with test string data","time":"1537891415","previousBlockHash":"7c17cb7132388ea5d63f"}
```
6: To visualize a specific block on the chain, run on terminal
```
curl -X GET -H "Content-type: application/json" http://localhost:8000/block/1
```

7: Induce errors 
```
curl -X POST -H "Content-Type: text/plain" --data "" http://localhost:8000/block
```
8: The response from the above command should be a warning message and no block should have been created
```
Hey buddy, your're traying to send an empty block body!
```


[node.js]: <http://nodejs.org>
[express]: <http://expressjs.com>
[LevelDB]: http://leveldb.org
[crypto-js]: https://github.com/brix/crypto-js
[npm]: https://www.npmjs.com
[bitcoinjs-message]: https://github.com/bitcoinjs/bitcoinjs-message
[bitcoinjs-lib]: https://github.com/bitcoinjs/bitcoinjs-lib


