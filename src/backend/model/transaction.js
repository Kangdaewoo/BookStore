const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book'
    }],
    date: {
        type: Date,
        required: true
    }
});

const actions = {
    borrow: 'BORROW',
    return: 'RETURN',
    buy: 'BUY',
    sell: 'SELL'
};

Transaction.statics.getTransactionsForUser = function(query) {
    return this.find(query).exec();
};

Transaction.statics.createTransaction = function(query) {
    const newTrans = new this(query);
    return newTrans.save();
};


module.exports = mongoose.model('Transaction', Transaction);