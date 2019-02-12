var User = require('../../model/user');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
    logIn: function(req, res) {
        if (req.body.name === null || req.body.password === null) {
            return res.status(400).json({message: '?'});
        }

        const secret = req.app.get('superSecret');

        const issueToken = function(user) {
            if (user) {
                const password = crypto.createHmac('sha1', secret).update(req.body.password).digest('base64');
                if (password === req.body.password) {
                    return new Promise((resolve, reject) => {
                        jwt.sign({
                            email: user.email,
                            isAdmin: user.isAdmin
                        }, secret, {expiresIn: '1d'}, 
                        (err, token) => {
                            if (err) {
                                reject();
                            } else {
                                resolve(token);
                            }
                        });
                    });
                } 
            }
            throw new Error('Log in failed');
        };

        User.findUser({name: req.body.name})
        .then(issueToken)
        .then((token) => {
            res.status(200).json({token: token});
        }, () => {
            throw new Error('Server issue: try again later');
        })
        .catch((err) => {
            res.status(403).json({message: err.message});
        });
    }
};