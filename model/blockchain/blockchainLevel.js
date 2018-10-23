/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './data';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  console.log('Add data to level db ' + key + ' value ' + value);
  db.put(key, value, function(err) {
    if (err) return `Block ${key} submission failed: ${err}`;
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  db.get(key, function(err, value) {
    if (err) return 'Not found!';
    return value;
  })
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return `Unable to read data stream!' ${err}`
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}