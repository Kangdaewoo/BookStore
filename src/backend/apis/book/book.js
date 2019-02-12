var Book = require('../../model/book');

module.exports = {
    getBooks: function(req, res) {
        const returnResult = function(books) {
            if (books === null) {
                res.status(400).json({message: 'An error occurred'});
            } else {
                res.status(200).json({books: books});
            }
        };

        Book.findBooks(req.query.query)
        .then(returnResult)
        .catch((err) => {
            res.status(400).json({message: err.message});
        });
    },

    getBook: function(req, res) {
        const returnResult = function(books) {
            if (books === null) {
                res.status(400).json({message: 'An error occurred'});
            } else {
                res.status(200).json({books: books});
            }
        };

        Book.findBook({_id: mongoose.Types.ObjectId(req.params.bookId)})
        .then(returnResult)
        .catch((err) => {
            res.status(400).json({message: err.message});
        });
    }
};