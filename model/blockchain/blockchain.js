const SHA256 = require('crypto-js/sha256');
const level = require("level");
const Block = require("./block");
const DatabaseHelper = require('../helper/databaseHelper');


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.databaseHelper = new DatabaseHelper();
  }

  async createGenesisBlock() {
    const genesisBlock = new Block('The Genesis Block');
    genesisBlock.height = 0;
    genesisBlock.time = new Date().getTime().toString().slice(0, -3);
    genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
    await this.databaseHelper.persist(genesisBlock.height, JSON.stringify(genesisBlock));
    return genesisBlock.height;
  }

  async addBlock(newBlock) {
    let height = parseInt(await this.getBlockHeight());

    if (height === -1) {
      height = await this.createGenesisBlock();
    }

    newBlock.height = height + 1
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    
    const previousBlock = await this.getBlock(height)
    newBlock.previousBlockHash = previousBlock.hash
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    
    await this.databaseHelper.persist(newBlock.height, JSON.stringify(newBlock));
    return await this.getBlock(newBlock.height);

  }

  async getBlock(blockHeight) {
    return JSON.parse(await this.databaseHelper.get(blockHeight))
  }

  async getBlockByAddress(address) {
    return await this.databaseHelper.getBlockByAddress(address);
  }

  async getBlockByHash(hash) {
    return await this.databaseHelper.getBlockByHash(hash);
  }

  async getBlockHeight() {
    return await this.databaseHelper.getBlockHeight()
  }

  async validateBlock(blockHeight) {
    let block = await this.getBlock(blockHeight);
    let hash = block.hash;
    block.hash = '';

    let validHash = SHA256(JSON.stringify(block)).toString();

    if (hash === validHash) {
      return true;
    } else {
      return false;
    }
  }

  async validateChain() {
    let errorArray = []
    let previousHash = ''
    let isValid = false
    let promiseArray = []

    const height = await this.databaseHelper.getBlockHeight()

    for (let i = 0; i <= height; i++) {
      promiseArray.push(this.getBlock(i));
    }

    Promise.all(promiseArray)
      .then(data => {
        data.map(async (block) => {

          isValid = await this.validateBlock(block.height)
            .catch(err => {
              console.log('catch getBlock' + err);
              reject(err);
            });

          if (!isValid)
            errorArray.push(block.height)

          if (block.previousBlockHash !== previousHash)
            errorArray.push(block.height)

          previousHash = block.hash

          if (block.height === height) {
            if (errorArray.length > 0) {
              return false;
            } else {
              return true;
            }
          }
        })
      })
      .catch(err => {
        return `Unknow error: ${err.toString()}`;
      })
  }
}
module.exports = Blockchain;