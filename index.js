const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const unirest = require('unirest');
const methodOverride = require('method-override');
//declare constants



app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//call functions
/*
var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});*/
//when pushing a project, module file ignored
//npm install will install dependencies

//var db = pgp(process.env.DATABASE_URL) || pgp('postgres://student_07@localhost:5432/whitman_db');
//database route
var db = pgp('postgres://student_07@localhost:5432/whitman_db');
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
  poem = req.body
//create - insert poem from ajax call and user notes into poems table in whitman_db
  db.none('INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ($1,$2,$3,$4)',
    [poem.poem_title,poem.poem_text,poem.handle,poem.note_text]
    ).catch(function(){
    res.redirect('/no_dice')
  }).then(function(){
  res.redirect('/analyses')
  });
});
//delete route
app.delete('/analyses/:id',function(req, res){
  id = req.params.id
  db.none("DELETE FROM poems WHERE poem_id=$1", [id])
  res.redirect('/analyses')
  });

//update route
app.put('/analyses/:id',function(req, res){
  analysis = req.body
  id = req.params.id

  db.none("UPDATE poems SET note_text=$1 WHERE poem_id=$2",
    [analysis.note_text, id])

  res.redirect('/analyses');
});

//signup route
app.post('/signup', function(req, res){
  var data = req.body;
    db.none(
      "INSERT INTO users (user_handle) VALUES ($1)",
      [data.user_handle]
    ).catch(function(){
    res.redirect('/no_dice')
  }).then(function(){
      res.redirect('/signedup')}
    )
  });


var port = process.env.PORT || 3000;
//when deployed on heroku, heroku picks port, when local port 3000
//make sure to cap port

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
