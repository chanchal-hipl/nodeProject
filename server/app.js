require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = 4000;

// DB connection
mongoose.connect('mongodb://localhost:27017/node_auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: 'secretkey', resave: false, saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
