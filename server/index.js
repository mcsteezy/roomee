const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const db = require('../database/index.js');
const env = require('dotenv').config();
const passportLocal = require('passport-local');
// const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;

const app = express();
const cookieparser = require('cookie-parser')
// const models = require("../database/models");
// const authRoute = require('../database/passport_routes/auth.js')(app,passport);
// const passportStrat = require('../database/passport/passport.js')(passport, models.user);

const dbPassport = require('../database/passport/')(passport);

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// for parsing application/x-www-form-urlencode app.use(multer());
// for parsing multipart/form-data
app.use(session({
    secret: 'session',
    resave: true,
    saveUninitialized:true
}))
// initialize passport and the express sessions and passport sessions
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get('/searchListing', (req, res) => {
  let zip = req.param('zip');
  if(zip !== undefined) {zip = zip.substr(0,3)+'__'}
  const queryStr = zip ? { where: { zipCode: { '$like': zip } }} : {};
  db.Listing.findListingsByZip(queryStr, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

app.post('/listing', (req, res) => {
  db.Listing.createListing(req.body, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

// handlers for refresh button on all views
// res.redirect('back') will take user back to homepage
app.get('/createListing', (req, res) => {
  res.redirect('localhost:3000/createListing');
});

app.get('/loginView', (req, res) => {
  // res.render('loginView');
  res.redirect('localhost:3000/loginView');
});

app.get('/house', (req, res) => {
  // res.render('loginView');
  res.redirect('localhost:3000/house');
});

app.get('/search', (req, res) => {
  // res.render('searchView');
  res.redirect('localhost:3000/search');
});




 app.get('/signup', function(req,res) {
     res.render('');
 })
 app.get('/login',function(req,res){
     res.send({
         username: req.body.username
     })
 })

app.post('/signUpView', function(req,res){
    var a = [req.body.email,req.body.username,req.body.password];
    Users.findOne({
       where: { email: a[0],
        username: a[1],
        password: a[2],
       }

    }).then(users => {
        if (users) {
        res.send({
            url:'/loginView'
        })
      }
      else{
          Users.create({
            email: a[0],
            username: a[1],
            password: a[2],

        }).then(users => {
            res.send({
            url:'/login',
            username: a[1]
        })
      })
    }
  })
})
app.post('/login', passport.authenticate('local'),
function(req, res) {
    res.send({
        url:'/login',
        username:req.body.username
    });
  });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
//Synced to roomee database
models.sequelize.authenticate()
.then(function() {
   console.log('Database is working!')
})
.catch(function(err) {
    console.log(err, "Database isn't working!")
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
