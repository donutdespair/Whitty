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


//when pushing a project, module file ignored
//npm install will install dependencies

var db = pgp('postgres://student_07@localhost:5432/whitman_db') || pgp(process.env.DATABASE_URL);
//database route

// set routes
//get routes
app.get('/home', function(req, res) {
    res.render('home/index');
  });

app.get('/analyze', function(req, res) {
    res.render('search/index');
  });

app.get('/notes', function(req, res){
  db.any('SELECT poem_id, poem_title, poem_text, handle, note_text, responses.response_text, responses.response_handle FROM poems LEFT OUTER JOIN responses ON (poems.poem_id=responses.response_id);')
  .then(function(data){
    res.render('notes/index', {poems:data, responses:data})
  });
});

app.get('/notes/:id',function(req, res){
  db.one('SELECT response_title, response_text, response_handle FROM responses WHERE response_id = $1',[req.params.id])
  .then(function(data){
    var notes = data
    console.log(data)
    res.render('notes/response', data);
  });
});


//notes
app.post('/notes',function(req, res){
  poem = req.body

  db.none('INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ($1,$2,$3,$4)',
    [poem.poem_title,poem.poem_text,poem.handle,poem.note_text]),

  res.render('notes/index')
});

app.post('/responses',function(req, res){
  response = req.body

  db.none('INSERT INTO responses (response_title,response_text, response_handle) VALUES ($1,$2,$3)',
    [response.response_title,response.response_text,response.response_handle]),

  res.render('notes/index')
});

var port = process.env.PORT || 3000;
//when deployed on heroku, heroku picks port, when local port 3000
//make sure to cap port

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
