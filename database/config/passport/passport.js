// /* eslint-disable no-use-before-define */

var bCrypt = require('bcrypt-nodejs');


module.exports = function(passport, user) {


    var User = user;

    var LocalStrategy = require('passport-local').Strategy;


    passport.use('local-signup', new LocalStrategy(

        {

            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true // allows us to pass back the entire request to the callback

        },



        function(req, email, password, done) {

            var generateHash = function(password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

            };



            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (user)

                {

                    return done(null, false, {
                        message: 'That email is already taken'
                    });

                } else

                {

                    var userPassword = generateHash(password);

                    var data =

                        {
                            email: email,

                            password: userPassword,

                            firstname: req.body.firstname,

                            lastname: req.body.lastname

                        };

                    User.create(data).then(function(newUser, created) {

                        if (!newUser) {

                            return done(null, false);

                        }

                        if (newUser) {

                            return done(null, newUser);

                        }

                    });

                }

            });

        }

    ));

}

// //this file will contain our local passport strategie(s)
// //first importing bcrpyt to secure passwords
// var bCrypt = require('bcrypt-nodejs');

// //initialize passport-local strategy and user model
// module.exports = function(passport, user) {

//     var User = user;
//     var LocalStrategy = require('passport-local').Strategy;

// }

// //define strategy with our instance of the local strategy
// passport.use('local-signup', new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true // allows us to pass back the entire request to the callback
//     },

//     function(req, email, password, done) {
//       var generateHash = function(password) {
//         return bCrypt.hashSync(password, bCrypt.genSaltSync(8),null);
//     };

//   }
// ));

// const LocalStrategy = require('passport-local').Strategy
// const Users = require('./database/index.js').User
// module.exports = function(passport)
// {
//     console.log("passport is up and running!");
// passport.serializeUser(function (users, done) {
//     return done(null, users.id);
//     console.log("Serialize");

// })

// passport.deserializeUser(function (id, done) {
//     console.log("DeSerialize");
//     Users.findById(id).then((users) => {
//         console.log(users);
//         return done(null, users);
//     });
// })

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         Users.findOne({ where: { username: username } })
//              .then(function (users) {
//                  if (!users) {
//                      return done(null, false, { message: 'Incorrect username.' });
//                  }
//                  if (!users.password === password) {
//                      return done(null, false, { message: 'Incorrect password.' });
//                  }
//                  return done(null, users);
//              })
//              .catch(err => done(err));
//     }
// ));