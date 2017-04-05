var expect = require('chai').expect;
var RecaptchaJwt = require('../lib/recaptchaJwt');

describe('Recaptcha JWT', () => {

    describe('Constructor', () => {
        it('Must not contruct without set JWT secret', done => {

            var create = function () {
                new RecaptchaJwt({ recaptcha: { secret: '6Lf-GhoUAAAAAN6ROO0i6UVfJFcZjCD01Ykvmatr' } });
            };

            expect(create).to.throw(Error, "RecaptchaJwt => You must set jwt: { secret: '' } option to RecaptchaJwt contructor.");

            done();
        });

        it('Must not contruct without set recaptcha secret', done => {

            var create = function () {
                new RecaptchaJwt({ jwt: { secret: '123' } });
            };

            expect(create).to.throw(Error, "RecaptchaJwt => You must set recaptcha: { secret: '' } option to RecaptchaJwt contructor.");

            done();
        });
    });

    describe('Captcha', () => {

        it('Must always validate captcha with mock: true option', done => {
            var r = new RecaptchaJwt({ recaptcha: { secret: '123', mock: true }, jwt: { secret: '123', mock: true } });

            r.validateCaptcha('some_invalid_captcha')
                .then(result => {
                    done();
                });
        });

        it('Must invalidate invalid captchas', done => {
            var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

            r.validateCaptcha('some_invalid_captcha')
                .catch(result => {
                    done();
                })
        });

    });

    describe('JWT', () => {

        it('Must always validate jwt with mock: true option', done => {
            var r = new RecaptchaJwt({ recaptcha: { secret: '123', mock: true }, jwt: { secret: '123', mock: true } });

            r.validateJwt('some_invalid_jwt')
                .then(result => {
                    done();
                })
        });

        it('Must invalidate invalid jwts', done => {
            var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

            r.validateJwt('some_invalid_jwt')
                .catch(result => {
                    done();
                })
        });

        it('Must validate valid jwts', done => {
            var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            var jwt = r._getJwt('some_captcha');

            r.validateJwt(jwt)
                .then(result => {
                    done();
                })
        });

    });

});