const jsonWebToken = require('jsonwebtoken');
const request = require('request');

GOOGLE_CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

DEFAULT_CONFIG = {
    recaptcha: {
        ssl: true,
        secret: ''
    },
    jwt: {
        secret: '',
        expiresIn: 60 * 10
    },
    mock: false
};

class RecaptchaJwt {

    constructor(config) {
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.recaptchaEndpoint = GOOGLE_CAPTCHA_ENDPOINT;

        if (this.config.recaptcha.ssl === false)
            this.recaptchaEndpoint = this.recaptchaEndpoint.replace("https", "http");

        if (this.config.recaptcha.secret == '')
            throw new Error("RecaptchaJwt => You must set recaptcha: { secret: '' } option to RecaptchaJwt contructor.");

        if (this.config.jwt.secret == '')
            throw new Error("RecaptchaJwt => You must set jwt: { secret: '' } option to RecaptchaJwt contructor.");
    };

    validateCaptcha(captcha) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self._verifyRecaptcha(captcha)
                .then(result => {
                    var tokenJwt = self._getJwt(captcha);
                    resolve({ jwt: tokenJwt });
                })
                .catch(error => {
                    console.log(`RecaptchaJwt => O Captcha não foi validado. [${error}]`);
                    reject(false);
                });
        });
    }

    validateJwt(jwt) {
        var self = this;

        if (self.config.mock === true)
            return Promise.resolve(true);

        return new Promise(function (resolve, reject) {
            jsonWebToken.verify(jwt, self.config.jwt.secret, function (error, decoded) {
                if (error) {
                    console.log(`RecaptchaJwt => O JWT não foi validado. [${error}]`)
                    reject(false);
                }

                resolve(true);
            });
        });
    }

    _getJwt(captcha) {
        return jsonWebToken.sign({ captcha: captcha }, this.config.jwt.secret, {
            expiresIn: this.config.jwt.expiresIn
        });
    }

    _verifyRecaptcha(captcha) {
        var self = this;

        if (self.config.mock === true)
            return Promise.resolve(true);

        return new Promise(function (resolve, reject) {
            var options = {
                uri: self.recaptchaEndpoint,
                method: 'POST',
                json: true,
                form: {
                    secret: self.config.recaptcha.secret,
                    response: captcha
                }
            };

            return request(options, function (error, response, body) {
                if (error)
                    return reject(error);

                if (body.success === true)
                    return resolve(true);
                else
                    return reject(false);
            });
        });
    }
};

module.exports = RecaptchaJwt;