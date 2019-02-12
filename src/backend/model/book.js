const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = new Schema({
    ISBN: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function(q) {
                return Number.isInteger(q) && q >= 0;
            }
        }
    },
    total: {
        type: Number,
        required: true,
        validate: {
            validator: function(q) {
                return Number.isInteger(q) && q >= 0;
            }
        }
    }
});
Book.index({author: 1, title: 1}, {unique: true});


Book.statics.addBook = function(query) {
    const newBook = new this(query);
    return newBook.save();
};

Book.statics.findBooks = function(query) {
    return this.find(query).exec();
};

Book.statics.findBook = function(query) {
    return this.findOne(query).exec();
};

Book.statics.updateQuantity = function(query, quantity) {
    if (quantity < 0) {
        throw new Error('Incorrect usage');
    }
    return this.findOneAndUpdate(query, {$inc: {quantity: quantity}}).exec();
};

Book.statics.updateTotal = function(query, quantity) {
    if (quantity < 0) {
        throw new Error('Incorrect usage');
    }
    return this.findOneAndUpdate(query, {$inc: {total: quantity, quantity: quantity}}).exec();
};

Book.statics.updateBook = function(query, updateQuery) {
    if (query.title === null || query.author === null || updateQuery === null) {
        throw new Error('Not enough information given');
    }

    return this.findOneAndUpdate(query, {$set: updateQuery}).exec();
};

Book.statics.borrow = function(query) {
    return new Promise((resolve, reject) => {
        this.findOne(query, (err, book) => {
            if (err) throw new Error('An error occurred');

            if (book.quantity <= 0) {
                resolve(false);
            } else {
                book.quantity = book.quantity - 1;
                book.save((err, book) => {
                    if (err) throw new Error('An error occurred');

                    resolve(true);
                });
            }
        });
    });
};

Book.statics.sell = function(query, quantity) {
    return new Promise((resolve, reject) => {
        this.findOne(query, (err, book) => {
            if (err) throw new Error('An error occurred');

            if (book.quantity < quantity) {
                resolve(false);
            } else {
                book.quantity = book.quantity - quantity;
                book.total = book.total - quantity;
                book.save((err, book) => {
                    if (err) throw new Error('An error occurred');

                    resolve(true);
                });
            }
        });
    });
};


module.exports = mongoose.model('Book', Book);