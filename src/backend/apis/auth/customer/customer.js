var User = require('../../../model/user');
var Transaction = require('../../../model/transaction');
var Book = require('../../../model/book');


module.exports = {
    isCustomer: function(req, res, next) {
        if (req.decoded.isAdmin) {
            return res.status(403).json({message: 'This is for customers'});
        }
        next();
    },

    transactBooks: function(req, res) {
        var result = {};
        var user;

        const buy = function(foundUser) {
            user = foundUser;
            if (user === null) {
                throw new Error('User not found');
            }
            
            if (req.body.buy !== null) {
                result.buy = [];
                return Promise.all(req.body.buy.map(
                    (info) => {
                        const handleResult = function(book) {
                            if (book === null) {
                                result.buy.push({_id: info._id, success: false});
                            } else {
                                result.buy.push({_id: info._id, success: true});
                            }
                            return Promise.resolve(true);
                        };
                        return Book.updateTotal({_id: info._id}, info.quantity)
                        .then(handleResult);
                    }
                ));
            } else {
                return Promise.resolve(false);
            }
        };

        const buyTransaction = function(success) {
            if (success) {
                if (result.buy !== null) {
                    let query = {};
                    query.books = [];
                    for (let i = 0; i < result.buy.length; i++) {
                        if (result.buy[i].success) {
                            query.books.push(result.buy[i]._id);
                        }
                    }
                    if (query.books.length > 0) {
                        query.action = 'BUY';
                        query.date = new Date();
                        query.user = user._id;
                        return Transaction.createTransaction(query);
                    } else {
                        return Promise.resolve(true);
                    }
                }
            } else {
                return Promise.resolve(true);
            }
        };

        const sell = function(underscore) {
            if (req.body.sell !== null) {
                result.sell = [];
                return Promise.all(req.body.sell.map(
                    (info) => {
                        const handleResult = function(success) {
                            if (success) {
                                result.sell.push({_id: info._id, success: false});
                            } else {
                                result.sell.push({_id: info._id, success: true});
                            }
                            return Promise.resolve(true);
                        };
                        return Book.sell({_id: info._id}, info.quantity)
                        .then(handleResult);
                    }
                ));
            } else {
                return Promise.resolve(false);
            }
        };

        const sellTransaction = function(success) {
            if (success) {
                if (result.sell !== null) {
                    let query = {};
                    query.books = [];
                    for (let i = 0; i < result.sell.length; i++) {
                        if (result.sell[i].success) {
                            query.books.push(result.sell[i]._id);
                        }
                    }
                    if (query.books.length > 0) {
                        query.action = 'SELL';
                        query.date = new Date();
                        query.user = user._id;
                        return Transaction.createTransaction(query);
                    } else {
                        return Promise.resolve(true);
                    }
                }
            } else {
                return Promise.resolve(true);
            }
        };

        const borrow = function(underscore) {
            if (req.body.borrow !== null) {
                result.borrow = [];
                return Promise.all(req.body.borrow.map(
                    (info) => {
                        const userBorrows = function(success) {
                            if (success) {
                                result.borrow.push({_id: info._id, success: true});
                                return user.borrow(info._id);
                            } else {
                                result.borrow.push({_id: info._id, success: false});
                                return Promise.resolve(false);
                            }
                        };
                        
                        if (user.borrowed.includes(info._id)) {
                            result.borrow.push({_id: info._id, success: false});
                            return Promise.resolve(false);
                        } else {
                            return Book.borrow({_id: info._id})
                            .then(userBorrows);
                        }
                    }
                ));
            } else {
                return Promise.resolve(true);
            }
        };

        const borrowTransaction = function(success) {
            if (success) {
                if (result.borrow !== null) {
                    let query = {};
                    query.books = [];
                    for (let i = 0; i < result.borrow.length; i++) {
                        if (result.borrow[i].success) {
                            query.books.push(result.borrow[i]._id);
                        }
                    }
                    if (query.books.length > 0) {
                        query.action = 'BORROW';
                        query.date = new Date();
                        query.user = user._id;
                        return Transaction.createTransaction(query);
                    } else {
                        return Promise.resolve(true);
                    }
                }
            } else {
                return Promise.resolve(true);
            }
        };

        const returns = function(underscore) {
            if (req.body.returns !== null) {
                result.returns = [];
                return Promise.all(req.body.returns.map(
                    (info) => {
                        const userBorrows = function(success) {
                            if (success) {
                                result.returns.push({_id: info._id, success: true});
                                return user.returns(info._id);
                            } else {
                                result.returns.push({_id: info._id, success: false});
                                return Promise.resolve(false);
                            }
                        };
                        
                        if (!user.borrowed.includes(info._id)) {
                            result.returns.push({_id: info._id, success: false});
                            return Promise.resolve(false);
                        } else {
                            return Book.updateQuantity({_id: info._id}, 1)
                            .then(userBorrows);
                        }
                    }
                ));
            } else {
                return Promise.resolve(true);
            }
        };

        const returnsTransaction = function(success) {
            if (success) {
                if (result.returns !== null) {
                    let query = {};
                    query.books = [];
                    for (let i = 0; i < result.returns.length; i++) {
                        if (result.returns[i].success) {
                            query.books.push(result.returns[i]._id);
                        }
                    }
                    if (query.books.length > 0) {
                        query.action = 'RETURN';
                        query.date = new Date();
                        query.user = user._id;
                        return Transaction.createTransaction(query);
                    } else {
                        return Promise.resolve(true);
                    }
                }
            } else {
                return Promise.resolve(true);
            }
        };

        const handleResult = function(success) {
            res.status(200).json({result: result});
        }
        
        User.findUser(req.decoded.email)
        .then(buy)
        .then(buyTransaction)
        .then(sell)
        .then(sellTransaction)
        .then(borrow)
        .then(borrowTransaction)
        .then(returns)
        .then(returnsTransaction)
        .then(handleResult)
        .catch((err) => {res.status(403).json({message: err.message})});
    },

    getTransactions: function(req, res) {
        const returnResult = function(res) {
            if (res === null) {
                throw new Error('An error occurred');
            } else {
                res.status(200).json({message: 'Successful'});
            }
        };

        Transaction.findUser({email: req.decoded.email})
        .then(returnResult)
        .catch((err) => {
            res.status(400).json({message: err.message});
        });
    }
};