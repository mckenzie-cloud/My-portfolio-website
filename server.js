require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const path = require('path');


const app = express();
const PORT = 3000 || process.env.PORT;

app.use(morgan('common'));

// Database connection here.
const connectDB = require('./server/config/db.js');
// Connect to DB
connectDB();

const pages_routes = require('./server/routes/pages-route.js');
const admin_routes = require('./server/routes/admin-route.js');
const other_routes = require('./server/routes/other-route.js');

// Templating engine.
app.use(expressLayout);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

// serve static files
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'mckenzie',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));

app.use(flash());

// Our page middleware
app.use('/', pages_routes);
app.use('/', admin_routes);
app.use('/other', other_routes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})