const expect = require('chai').expect;
const RecaptchaJwt = require('../lib/recaptchaJwt');
const InvalidContentError = require('../lib/error/invalidContentError');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

describe('Recaptcha JWT', () => {

    describe('Constructor', () => {
        it('Must not contruct without set JWT secret', done => {

            let create = function () {
                new RecaptchaJwt({ recaptcha: { secret: '6Lf-GhoUAAAAAN6ROO0i6UVfJFcZjCD01Ykvmatr' } });
            };

            expect(create).to.throw(Error, "RecaptchaJwt => You must set jwt: { secret: '' } option to RecaptchaJwt contructor.");

            done();
        });

        it('Must not contruct without set recaptcha secret', done => {

            let create = function () {
                new RecaptchaJwt({ jwt: { secret: '123' } });
            };

            expect(create).to.throw(Error, "RecaptchaJwt => You must set recaptcha: { secret: '' } option to RecaptchaJwt contructor.");

            done();
        });

        it('Must have expiresIn', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            expect(r.config.jwt.expiresIn).to.be.equals(600);
            done();
        });

        it('Must have defined expiresIn', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123', expiresIn: 42 } });
            expect(r.config.jwt.expiresIn).to.be.equals(42);
            done();
        });
    });

    describe('Captcha', () => {

        it('Must always validate captcha with mock: true option', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123', mock: true }, jwt: { secret: '123', mock: true } });

            r.validateCaptcha('some_invalid_captcha')
                .then(result => {
                    done();
                });
        });

        it('Must invalidate invalid captchas', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

            r.validateCaptcha('some_invalid_captcha')
                .catch(result => {
                    done();
                });
        });

    });

    describe('JWT', () => {

        it('Must always validate jwt with mock: true option', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123', mock: true }, jwt: { secret: '123', mock: true } });

            r.validateJwt('some_invalid_jwt')
                .then(result => {
                    done();
                });
        });

        it('Must invalidate invalid jwts', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

            r.validateJwt('some_invalid_jwt')
                .catch(error => {
                    expect(error instanceof JsonWebTokenError).to.be.ok;
                    done();
                });
        });

        it('Must validate valid jwts', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            let jwt = r.getJwt('some_captcha');

            r.validateJwt(jwt)
                .then(result => {
                    done();
                });
        });

        it('Must validate non expirated tokens', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123', expiresIn: 10 } });
            let jwt = r.getJwt('some_captcha');

            setTimeout(() => {
                r.validateJwt(jwt)
                    .then(() => {
                        done();
                    });
            }, 1000);
        });

        it('Must not validate expirated tokens', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123', expiresIn: 1 } });
            let jwt = r.getJwt('some_captcha');

            // Aguarda mais que o tempo do token para realizar o teste
            setTimeout(() => {
                r.validateJwt(jwt)
                    .catch(error => {
                        expect(error instanceof TokenExpiredError).to.be.ok;
                        done();
                    });
            }, 1200);
        });

        it('Must get JWT content', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            let jwt = r.getJwt('some_captcha');

            r.validateJwt(jwt)
                .then(result => {
                    expect(result == 'some_captcha');
                    done();
                });
        });
    });

    describe('JWT Content', () => {

        it('Must always validate jwt with mock: true option', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123', mock: true }, jwt: { secret: '123', mock: true } });

            r.validateJwtAndContent('some_invalid_jwt', 'some_value')
                .then(result => {
                    done();
                });
        });

        it('Must invalidate invalid jwts', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

            r.validateJwtAndContent('some_invalid_jwt', 'some_value')
                .catch(error => {
                    expect(error instanceof JsonWebTokenError).to.be.ok;
                    done();
                });
        });

        it('Must validate valid jwts and content', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            let jwt = r.getJwt('some_value');

            r.validateJwtAndContent(jwt, 'some_value')
                .then(result => {
                    done();
                });
        });

        it('Must validate non expirated tokens', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123', expiresIn: 10 } });
            let jwt = r.getJwt('some_value');

            setTimeout(() => {
                r.validateJwtAndContent(jwt, 'some_value')
                    .then(() => {
                        done();
                    });
            }, 1000);
        });

        it('Must not validate expirated tokens', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123', expiresIn: 1 } });
            let jwt = r.getJwt('some_value');

            // Aguarda mais que o tempo do token para realizar o teste
            setTimeout(() => {
                r.validateJwtAndContent(jwt, 'some_value')
                    .catch(error => {
                        expect(error instanceof TokenExpiredError).to.be.ok;
                        done();
                    });
            }, 1200);
        });

        it('Must not validate with invalid content', done => {
            let r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });
            let jwt = r.getJwt('some_value');

            r.validateJwtAndContent(jwt, 'some_invalid_value')
                .catch(error => {
                    expect(error instanceof InvalidContentError).to.be.ok;
                    done();
                });
        })
    });
});