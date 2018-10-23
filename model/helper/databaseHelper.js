
const chainData = './chaindata'
const level = require('level');
const db = level(chainData)

class DatabaseHelper {
  constructor() {
  }

  persist(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          reject(error)
        }
        resolve('Saved  # ' + key)
      })
    })
      .catch(err => {
        return `Database error! Failed on get block! ${err.toString()}`;
      });
  }

  get(key) {
    try {
      return new Promise((resolve, reject) => {
        db.get(key, (err, value_1) => {
          if (err) {
            if (err.toString().includes('NotFoundError'))
              reject(`Data #${key} not found!`);
            reject(err.toString());
          }
          resolve(value_1);
        });
      })
      .catch(err => {
        return err;
      });
    }
    catch (err) {
      return `{"error": "${err}"}`;
    }
  }

  getBlockHeight() {
    let i = -1;
    return new Promise((resolve, reject) => {
      console.log('Get block height');
      db.createReadStream()
        .on('error', function (err) {
          throw err;
        })
        .on('data', function (data) {
          i++
        })
        .on('end', function () {
          resolve(i);
        });
    })
      .catch(err => {
        return `Database error! Failed on get block height! ${err.toString()}`;
      });
  }

  getBlockByAddress(address) {
    let blockArray = [];
    return new Promise((resolve, reject) => {
      console.log(`Get block by address ${address}`);
      db.createReadStream()
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('data', function (data) {
          let block = JSON.parse(data.value);

          if (block.body) {
            if (block.body.address === address) {
              blockArray.push(block);
            }
          }

        })
        .on('end', function () {
          resolve(blockArray);
        });
    })
      .catch(err => {
        return `Database error! Failed on get block height! ${err.toString()}`;
      });
  }

  getBlockByHash(hash) {
    let blockArray = [];
    return new Promise((resolve, reject) => {
      console.log(`Get block by hash ${hash}`);
      db.createReadStream()
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('data', function (data) {
          let block = JSON.parse(data.value);

          if (block.body) {
            if (block.hash === hash) {
              blockArray.push(block);
            }
          }

        })
        .on('end', function () {
          resolve(blockArray);
        });
    })
      .catch(err => {
        return `Database error! Failed on get block height! ${err.toString()}`;
      });
  }
}

module.exports = DatabaseHelper;