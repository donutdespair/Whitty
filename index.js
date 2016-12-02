const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const request = require('request');
//declare constants

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//call functions
//when pushing a project, module file ignored
//npm install will install dependencies


app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

var db = pgp(process.env.DATABASE_URL || 'postgres://student_07@localhost:5432/whitman_db');
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log('Node app is running on port', PORT);
});

//create proxy to bypass xdomain resource sharing prohibition
//http://blog.modulus.io/node.js-tutorial-how-to-use-request-module
//https://www.sitepoint.com/making-http-requests-in-node-js/
app.get("/api", function(req, res) {
    var poem =  req.query.value; //gets val from input in AJAX call
    var poemApi = "http://poetrydb.org/author,title/Walt Whitman;" + poem;
    request.get({
        url: poemApi,
        json: true},
        function(err, resp, data) {
        res.json(data[0])//returns JSON object
    });
});



app.get('/', function(req, res){ // request and response
 // need to take sessions into account and
 //add a few more lines before the res.render
 var logged_in;
 var user_handle;
 if(req.session.user){ // the session is remembered
   logged_in = true;
   user_handle = req.session.user.user_handle
 }
 var data = {
   'logged_in': logged_in,
   'user_handle': user_handle
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
      db.none('INSERT INTO users (user_handle, password_digest) VALUES ($1,$2)',
    [data.user_handle, hash]
    ).catch(function(){
    res.redirect('/no_dice')
  }).then(function(){
      res.redirect('/signedup')}
    )
  });
//hash pw, insert user and hash into db
    })

app.post('/login', function(req, res){
  var data = req.body;
//login screen

  db.one(
    "SELECT * FROM users WHERE user_handle = $1",
    [data.user_handle]
//searches db for user user_handle
  ).catch(function(){
    res.send('user_handle/Password not found.')
//if user_handle not found
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
 //compares password hash
      if(cmp){
        req.session.user = user;
        res.redirect('/');
//send user to profile if pw/user_handle correct
      } else {
        res.send('Handle/Password not found.')
//sends user message
      }
    });
  });
});
// set routes
//get routes
app.get('/home', function(req, res) {
    res.render('home/index');
  });
app.get('/analyze', function(req, res) {
    res.render('search/index');
  });
app.get('/signup', function(req, res) {
    res.render('signup/index');
  });
app.get('/signedup', function(req, res) {
    res.render('signedup/index');
  });
app.get('/no_dice', function(req, res) {
    res.render('no_dice/index');
  });
app.get('/login', function(req, res) {
    res.render('login/index');
  });
app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect("/")
  });
})


//analyses with data
app.get('/analyses', function(req, res){
  db.any('SELECT poem_id, poem_title, poem_text, handle, note_text FROM poems;')
  .then(function(data){
    res.render('analyses/index', {poems:data})
  });
});

app.get('/analyses', function(req, res) {
    res.render('analyses');
  });

//add poem and notes to db
app.post('/analyses',function(req, res){
  var user = req.session.user;
  var data = {data:user};
if(user){
  poem = req.body
//create - insert poem from ajax call and user notes into poems table in whitman_db
  db.none('INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ($1,$2,$3,$4)',
    [poem.poem_title,poem.poem_text,poem.handle,poem.note_text])
  res.redirect('/analyses');
  }else{res.redirect('/no_dice')
  };
});

//delete route
app.delete('/analyses/:id',function(req, res){
  var user = req.session.user;
  var data = {data:user};
if(user){
  id = req.params.id
  db.none("DELETE FROM poems WHERE poem_id=$1", [id])
  res.redirect('/analyses');
}else{res.redirect('/no_dice')
  }
});

//update route
app.put('/analyses/:id',function(req, res){
  var user = req.session.user;
  var data = {data:user};
if(user){  analysis = req.body
  id = req.params.id
  db.none("UPDATE poems SET note_text=$1 WHERE poem_id=$2 ",
    [analysis.note_text, id])
    res.redirect('/analyses');
}else{res.redirect('/no_dice')
  }
});

//SELECT * FROM poems LEFT OUTER JOIN users ON (poems.handle=users.user_handle);


