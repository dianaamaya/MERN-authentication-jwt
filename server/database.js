const mongoose = require('mongoose');

//get variables
const { APPMONGODB_URI, APPMONGODB_URI_TEST } = process.env;

//set the link to connect to database according to NODE_ENV
let MONGODB_URI = "";
if(process.env.NODE_ENV === 'test') MONGODB_URI = `${APPMONGODB_URI_TEST}`;
else MONGODB_URI = `${APPMONGODB_URI}`;

//connect to database
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then( db => console.log('Database is connected'))
.catch(err => console.log(err));