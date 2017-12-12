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


# Validate recaptcha and get jwt token

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.validateCaptcha('some_captcha')
                .then(jwt => {
                    console.log(jwt);
                });
```

# Validate JWT token

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.validateJwt('some_jwt')
                .then(content => {
                    console.log(content);
                });
```

# Validate JWT token and content

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.validateJwtAndContent('some_jwt', 'some_content')
                .then(content => {
                    console.log(content);
                });
```

# Create JWT

```javascript
var RecaptchaJwt = require('recaptcha-jwt');

var r = new RecaptchaJwt({ recaptcha: { secret: '123' }, jwt: { secret: '123' } });

r.getJwt('some_content')
                .then(jwt => {
                    console.log(jwt);
                });
```