const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const unirest = require('unirest');
//declare constants



app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//call functions



app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
//establishes that you are logged in
//when pushing a project, module file ignored
//npm install will install dependencies

var db = pgp('postgres://student_07@localhost:5432/p2_user') || pgp(process.env.DATABASE_URL);
//database route

// set routes
app.get('/', function(req, res){ // request and response
 // need to take sessions into account and
 //add a few more lines before the res.render
 var logged_in;
 var email;
 if(req.session.user){ // the session is remembered
   logged_in = true;
   email = req.session.user.email
 }
 var data = {
   'logged_in': logged_in,
   'email': email
 }
 res.render('index', data);
})


app.get('/signup', function(req, res){
  res.render('signup/index')
});
//signup screen

app.post('/signup', function(req, res){
  //save user to db and encrypt pw
  var data = req.body;
  //body parser pulls input data
  bcrypt.hash(data.password, 10, function(err, hash){
      db.none('INSERT INTO users (email, password_digest) VALUES ($1,$2)',
    [data.email, hash]
    ).then(function(){
      res.send('User Created')
//hash pw, insert user and hash into db
    })
  });
});

app.post('/login', function(req, res){
  var data = req.body;
//login screen

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
//searches db for user email
  ).catch(function(){
    res.send('Email/Password not found.')
//if email not found
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
 //compares password hash
      if(cmp){
        req.session.user = user;
        res.redirect('/');
//send user to profile if pw/email correct
      } else {
        res.send('Email/Password not found.')
//sends user message
      }
    });
  });
});



var port = process.env.PORT || 3000;
//when deployed on heroku, heroku picks port, when local port 3000
//make sure to cap port

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
