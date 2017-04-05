Recaptcha-jwt is a lib that validates recaptcha and returns a JWT token if the validation succeeded.

# Installation

```shell
$ npm install recaptcha-jwt
```

# Create Recaptcha-jwt object

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

```

## Supported setup options

- recaptcha.secret: Recaptcha secret, required
- recaptcha.ssl: Sll true or false
- recaptcha.mock: Enable mock mode, always validate the token.
- jwt.secret: Jwt secret, required
- jwt.expiresIn: Expiration. Default 600 seconds.
- jwt.mock: Enable mock mode, always validate the token.


# Validates a recaptcha and gets jwt token 

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.validateCaptcha('some_captcha')
                .then(jwt => {
                    console.log(jwt);
                });
```

# Validates a recaptcha and gets jwt token 

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.validateJwt('some_jwt')
                .then(result => {
                    console.log(result);
                });
```