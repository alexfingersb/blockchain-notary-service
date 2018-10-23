
const messageData = './messageData'
const level = require('level');
const db = level(messageData)

class ValidationHelper {
    constructor() {
    }

    persist(key, value) {
        console.log('persist key:' + key + ', value:' + value);
        try {
            return new Promise((resolve, reject) => {
                db.put(key, value, (error) => {
                    if (error) {
                        console.log('persist error: ' + error);
                        reject(error);
                    }
                    console.log('saved:' + key);
                    resolve(value);
                });
            })
                .catch(err => {
                    return err;
                });
        }
        catch (err) {
            return err;
        }
    }

    get(key) {
        return new Promise((resolve, reject) => {
            db.get(key, (err, value) => {
                if (err) {
                    if (err.toString().includes('NotFoundError')) {
                        resolve(`{"error": "Key #${key} not found!"}`);
                    } else {
                        reject(err.toString());
                    }
                }
                else {
                    console.log('Get data resolve to ' + value);
                    resolve(value);
                }
            });
        })
            .catch(err => {
                return err;
            });

    }
    
    deleteKey(address) {
        db.del(address);
    }
    
}

module.exports = ValidationHelper;