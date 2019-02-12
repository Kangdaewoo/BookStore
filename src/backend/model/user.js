const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    // name is what others will see the customer as.
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    borrowed: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    }]
});
User.index({email: 1}, {unique: true});


User.statics.findUser = function(query) {
    return this.findOne(query).exec();
};

User.statics.findUsers = function(query) {
    return this.findOne(query).exec();
};

User.statics.getbooksForUser = function(query) {
    return this.findOne(query).populate('borrwed').exec();
};

userSchema.methods.borrow = function(bookId) {
    this.borrowed.push(bookId);
    return this.save();
};

userSchema.methods.returns = function(bookId) {
    for (let i = 0; i < this.borrowed.length; i++) {
        if (this.borrowed[i].equals(bookId)) {
            this.borrowed.splice(i, 1);
            break;
        }
    }
    return this.save();
};


module.exports = mongoose.model('User', user);