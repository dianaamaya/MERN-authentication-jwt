const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");

// Initializations
const app = express();

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true
  })
);
//avoid to use morgan when it is testing
if(process.env.NODE_ENV !== 'test'){    
    app.use(morgan('dev'));
}
app.use(express.json());

//routes
app.use(require('./routes/user.routes'));

//export module
module.exports = app;