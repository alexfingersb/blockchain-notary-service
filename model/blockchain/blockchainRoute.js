const express = require('express')
const router = express.Router()
const Block = require("./block");
const Blockchain = require('../blockchain/blockchain')
const Star = require("./star");
const Validation = require('../blockchain/validation')
const buffer = require('buffer');


router.get('/', function (req, res) {
  res.jsonp({
    body: `Welcome to Webservice for Blockchain!
  Version: 1.0
  Author: Alexandre Finger Sobrinho` })
})

router.post('/block', function (req, res, next) {
  const validation = new Validation();
  let promise = validation.validateAddress(req.body.address);

  promise
    .then(msg => {
      if (!msg.toString().includes('access granted')) {
        res.json({ error: msg.toString() });
      } else {
        next();
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
})

router.post('/block', (req, res) => {

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    throw Error(`Hey buddy, your're traying to send an empty block body!`);
  } else {

    if (req.body.star === undefined) {
      throw Error(`Property required 'star' is missing!`);
    }

    const star = new Star(req.body);

    if (star.ra === undefined || Object.keys(star.ra).length === 0) {
      throw Error(`Property required 'Right Ascension' is missing or empty!`);
    }

    if (star.dec === undefined || Object.keys(star.dec).length === 0) {
      throw Error(`Property required 'Declination' is missing or empty!`);
    }

    if (star.story === undefined || Object.keys(star.story).length === 0) {
      throw Error(`Property required 'Story' is missing or empty!`);
    } else {
      star.storyDecoded = star.story;
      star.story = buffer.transcode(Buffer.from(star.storyDecoded, 'ascii', 'utf8')).toString('hex');
      if (star.story.length > 500) {
        throw Error(`Property 'Story' is too large!`);
      }
    }

    const blockchain = new Blockchain();
    const validation = new Validation();

    blockchain.addBlock(new Block(star))
      .then(block => {
        validation.removeMessageSignature(req.body.address);
        res.send(block);
      })
      .catch(err => {
        throw Error(err);
      });
  }
});

router.get('/block/:blockHeight', (req, res) => {
  const blockHeight = parseInt(req.params.blockHeight);

  if (isNaN(blockHeight))
    throw Error(`The value '${req.params.blockHeight}' isn't a valid block number!`);

  if (blockHeight < 0) {
    throw Error('Invalid block!');
  }

  const blockchain = new Blockchain();
  blockchain.getBlock(blockHeight)
    .then(block => {
      res.json(block)
    })
    .catch(err => {
      throw Error(err);
    });
});

router.get('/block', (req, res) => {
  throw Error(`It looks like you are trying to send a block. Please, use POST method for this!`);
});

router.post('/requestValidation', (req, res) => {
  let address = req.body.address;
  const validation = new Validation();

  validation.requestValidation(address)
    .then(value => {
      res.send(value);
    })
    .catch(err => {
      throw Error(err);
    });
})

router.post('/message-signature/validate', (req, res) => {
  let address = req.body.address;
  let signature = req.body.signature;
  const validation = new Validation();
  validation.signatureValidation(address, signature)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      throw Error(err);
    });
})

router.get('/stars/address:address', (req, res) => {
  const address = req.params.address.substring(1);
  const blockchain = new Blockchain();
  blockchain.getBlockByAddress(address)
    .then(blockArray => {
      res.json(blockArray);
    })
    .catch(err => {
      throw Error(err);
    });
});

router.get('/stars/hash:hash', (req, res) => {
  const hash = req.params.hash.substring(1);
  const blockchain = new Blockchain();
  blockchain.getBlockByHash(hash)
    .then(blockArray => {
      res.json(blockArray);
    })
    .catch(err => {
      throw Error(err);
    });

});

module.exports = router