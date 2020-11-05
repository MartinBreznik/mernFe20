let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');

// Express Route
const studentRoute = require('./routes/student.route')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;

const options =  {
  "user": dbConfig.user,
  "pass": dbConfig.password,
  "useNewUrlParser": true,
  "useCreateIndex": true,
  "useUnifiedTopology": true
}; 
mongoose.connect(
  dbConfig.db, 
  options,
  (err) => {
      if (!err) { console.log('MongoDB connection succeeded.'); }
      else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
  }
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/students', studentRoute)


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
//app.options('*', cors());
// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});