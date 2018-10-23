
const MessageSignature = require('../blockchain/messageSignature');
const ValidationHelper = require('../helper/validationHelper');
const bitcoinMessage = require('bitcoinjs-message');
const TIMEOUT = 0;
const TIME_RESET = 300;

class Validation {
    constructor() {
        this.validationHelper = new ValidationHelper();
    }

    async signatureValidation(address, signature) {
        let messageSignature = JSON.parse(await this.validationHelper.get(address));
        let register = true;
        let timeRemaining = await this.calculateTimeRemaining(messageSignature);
        let valid = bitcoinMessage.verify(messageSignature.message, address, signature)

        messageSignature.validationWindow = timeRemaining;

        if (timeRemaining === 0) {
            register = false;
        }

        let response = {
            "registerStar": register,
            "status": {
                "address": messageSignature.address,
                "requestTimeStamp": messageSignature.requestTimeStamp,
                "message": messageSignature.message,
                "validationWindow": timeRemaining,
                "messageSignature": valid
            }
        };

        return response;
    }

    async validate(address) {
        let messageSignature = await this.validationHelper.get(address);
        let data = JSON.parse(messageSignature);
        if (data.error) {
            return `Blockchain Address wasn't authenticated! Please make a request validation prior!`;
        } else {
            let timeRemaining = await this.calculateTimeRemaining(data);
            if (Number(timeRemaining) === TIMEOUT) {
                return `Blockchain validation Address has expired. Please make another one to proceed!`;
            } else {
                return 'access granted';
            }
        }
    }

    async validateAddress(address) {
        return await this.validate(address);
    }

    async requestValidation(address) {
        let messageSignature = await this.validationHelper.get(address);
        let data = JSON.parse(messageSignature);

        if (data.error) {
            if (data.error.includes('not found')) {
                //No message signature was found, lets create one!
                let newMessageSignature = new MessageSignature(address);
                return await this.validationHelper.persist(address, JSON.stringify(newMessageSignature));
            } else {
                return err;
            }
        } else {
            let timeRemaining = await this.calculateTimeRemaining(data);
            data.validationWindow = timeRemaining;

            // So the time has expired, renew it!
            if (Number(timeRemaining) === TIMEOUT) {
                data.requestTimeStamp = new Date().getTime();
                data.validationWindow = TIME_RESET;
                await this.validationHelper.persist(address, JSON.stringify(data));
            }

            return data;
        }
    }

    async calculateTimeRemaining(data) {
        const now = new Date().getTime();
        let diffSeconds = Math.round((now - data.requestTimeStamp) / 1000);
        let timeRemaining = (data.validationWindow - diffSeconds);

        if (Number(timeRemaining) > TIMEOUT) {
            return timeRemaining;
        } else {
            return TIMEOUT;
        }
    }

    async removeMessageSignature(address) {
        this.validationHelper.deleteKey(address);
    }

}

module.exports = Validation;