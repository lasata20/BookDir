const express = require ('express');
const morgan = require ('morgan');

const dirRouter = require('./routes/dirRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));

}
app.use(express.json());

// app.get('/api/v1/books', getAllBooks);
// app.get('/api/v1/books/:id', getBookById);
// app.post('/api/v1/books', createBook);
// app.patch('/api/v1/books/:id', updateBook);
// app.delete('/api/v1/books/:id', deleteBook);


app.use('/api/v1/books', dirRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
