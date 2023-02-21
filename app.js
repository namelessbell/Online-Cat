const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const multer  = require('multer');

// DB Config
const db = require('./config/db').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//EJS
app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Express body parser
app.use(express.urlencoded({ extended: true }));
  
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


// Routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/user.js'));
app.use('/', require('./routes/admin.js'));

const PORT = process.env.PORT || 5000;

app.listen (PORT, console.log(`Server started on port ${PORT}`));