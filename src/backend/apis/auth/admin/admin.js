var User = require('../../../model/user');
var Transaction = require('../../../model/transaction');
var Book = require('../../../model/book');


module.exports = {
    isAdmin: function(req, res, next) {
        if (!req.decoded.isAdmin) {
            return res.status(403).json({message: 'Not permitted'});
        }
        next();
    },

    getUsers: function(req, res) {
        const returnResult = function(users) {
            if (users !== null) {
                res.status(200).json({users: users});
            } else {
                throw new Error('An error occurred');
            }
        };

        User.findUsers(req.query)
        .then(returnResult)
        .carch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    getUser: function(req, res) {
        const returnResult = function(user) {
            if (user !== null) {
                res.status(200).json({user: user});
            } else {
                throw new Error('An error occurred');
            }
        };

        User.findUsers({_id: mongoose.Types.ObjectId(req.params.userId)})
        .then(returnResult)
        .carch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    getTransactionsForUser: function(req, res) {
        const returnResult = function(user) {
            if (user !== null) {
                res.status(200).json({transactions: user.transactions});
            } else {
                throw new Error('An error occurred');
            }
        };

        Transaction.getTransactionsForUser({_id: mongoose.Types.ObjectId(req.params.userId)})
        .then(returnResult)
        .carch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    getBooksForUser: function(req, res) {
        const returnResult = function(user) {
            if (user !== null) {
                res.status(200).json({books: user.books});
            } else {
                throw new Error('An error occurred');
            }
        };

        User.getbooksForUser({_id: mongoose.Types.ObjectId(req.params.userId)})
        .then(returnResult)
        .carch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    buyBooks: function(req, res) {
        const returnResult = function(res) {
            if (res === null) {
                throw new Error('An error occurred');
            } else {
                res.status(200).json({message: 'Successful'});
            }
        };

        Book.addBook(req.body.query, req.body.quantity)
        .then(returnResult)
        .catch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    updateBook: function(req, res) {
        const returnResult = function(res) {
            if (res === null) {
                throw new Error('An error occurred');
            } else {
                res.status(200).json({message: 'Successful'});
            }
        };

        Book.updateBook(req.body.query, req.body.update)
        .then(returnResult)
        .catch((err) => {
            res.status(400).json({message: err.message});
        });
    }
};