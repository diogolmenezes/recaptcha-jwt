const jsonWebToken = require('jsonwebtoken');
const request = require('request');
const mergeOptions = require('merge-options');
const GOOGLE_CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';
const DEFAULT_CONFIG = {
    recaptcha: {
        ssl: true,
        secret: '',
        mock: false
    },
    jwt: {
        secret: '',
        expiresIn: 10 * 60,
        mock: false
    },
};

class RecaptchaJwt {

    constructor(config = DEFAULT_CONFIG) {
        this.config = mergeOptions(DEFAULT_CONFIG, config);
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
    };

    validateJwt(jwt) {
        var self = this;

        if (self.config.jwt.mock === true)
            return Promise.resolve(true);

        return new Promise(function (resolve, reject) {
            jsonWebToken.verify(jwt, self.config.jwt.secret, function (error, decoded) {
                if (error) {
                    console.log(`RecaptchaJwt => O JWT não foi validado. [${error}]`);
                    reject(false);
                }

                if (decoded)
                    console.log(`RecaptchaJwt => O JWT é ${JSON.stringify(decoded)}`);

                resolve(true);
            });
        });
    };

    validateJwtAndContent(jwt, content) {
        var self = this;

        if (self.config.jwt.mock === true)
            return Promise.resolve(true);

        return new Promise(function (resolve, reject) {
            jsonWebToken.verify(jwt, self.config.jwt.secret, function (error, decoded) {
                if (error) {
                    console.log(`RecaptchaJwt => O JWT não foi validado. [${error}]`);
                    reject(false);
                }

                if (decoded && decoded.content == content) {
                    console.log(`RecaptchaJwt => O JWT e seu conteúdo foram validados.`);
                    resolve(true);
                }
                else {
                    console.log(`RecaptchaJwt => O JWT e seu conteúdo não foram validados.`);
                    reject(false);
                }

            });
        });
    };

    validateAndGetContent(jwt) {
        var self = this;

        if (self.config.jwt.mock === true)
            return Promise.resolve(true);

        return new Promise(function (resolve, reject) {
            jsonWebToken.verify(jwt, self.config.jwt.secret, function (error, decoded) {
                if (error) {
                    console.log(`RecaptchaJwt => O JWT não foi validado. [${error}]`);
                    reject(false);
                }

                resolve(decoded);
            });
        });
    };

    _getJwt(content) {
        return jsonWebToken.sign({ content: content }, this.config.jwt.secret, {
            expiresIn: this.config.jwt.expiresIn
        });
    };

    _verifyRecaptcha(captcha) {
        var self = this;

        if (self.config.recaptcha.mock === true)
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

            console.log(`RecaptchaJwt => Validando o captcha [${captcha}] em [${self.recaptchaEndpoint}]`);

            return request(options, function (error, response, body) {
                if (error) {
                    console.log(`RecaptchaJwt => Erro na validação do captcha [${captcha}] em [${self.recaptchaEndpoint}]`);
                    return reject(error);
                }

                if (body.success === true)
                    return resolve(true);
                else {
                    console.log(`RecaptchaJwt =>  Captcha invalido [${captcha}] em [${self.recaptchaEndpoint}]`);
                    return reject(false);
                }
            });
        });
    };
};

module.exports = RecaptchaJwt;