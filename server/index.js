//get variables
require('dotenv').config();

//get the server configuration
const app = require('./server');

//get database configuration
require('./database');

// set server to listen
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
});
