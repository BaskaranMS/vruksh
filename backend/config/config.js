const dotenv = require('dotenv');

dotenv.config();

class Config{

    constructor(){
        this.MONGO_URL = process.env.MONGO_URL;
        this.port = process.env.PORT;
        this.clientEmail = process.env.clientEmail
        this.ServerEmail = process.env.serverEmail
        this.appPassword = process.env.APP_PASSWORD
    };

};

module.exports = new Config();