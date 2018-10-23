/* ===== Star Class ==============================
|  Class with a constructor for star 			   |
|  ===============================================*/
const TIME_EXPIRE = 5;
const SECONDS_UNIT = 60;
class MessageSignature {
    constructor(address) {
        this.address = address;
        this.requestTimeStamp = new Date().getTime();
        this.message = `${this.address}:${this.requestTimeStamp}:starRegistry`,
        this.validationWindow = TIME_EXPIRE * SECONDS_UNIT;
    }
}
module.exports = MessageSignature;