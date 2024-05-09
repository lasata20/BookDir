const express = require ('express');
const morgan = require ('morgan');

const dirRouter = require('./routes/dirRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));

}
app.use(express.json());

app.use('/api/v1/books', dirRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `${req.originalUrl} not found.`
    })
});

module.exports = app;
