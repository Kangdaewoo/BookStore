var jwt = require('jsonwebtoken');

module.exports = {
    logOut: function(req, res) {
        const token = req.body.token || req.query.token;
        if (!token) {
            return res.status(401).json({message: 'You are not logined'});
        }
        res.status(200).json({message: 'Good bye'});
    },

    identify: function(req, res, next) {
        const token = req.body.token || req.query.token;
        if (!token) {
            return res.status(401).json({message: 'Log in required'});
        }

        const verify = function() {
            return new Promise((resolve, reject) => {
                jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
                    if (err) {
                        reject();
                    } else {
                        req.decoded = decoded;
                        resolve();
                    }
                });
            });
        };

        verify()
        .then(next, () => {
            throw new Error('Log in required');
        })
        .catch((err) => {
            res.status(403).json({message: err.message});
        });
    }
};