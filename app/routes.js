const mongoose = require("mongoose");
module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs'); // spits out the html and respond
  });


  // PROFILE SECTION =========================
  //isloggedin is a function all the way at the bottom to see if theyre logged in
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('demo-day').find({ user: req.body.user }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('profile.ejs', {
        userEntries: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

//   app.post('/messages', (req, res) => {
//     db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0 }, (err, result) => {
//       if (err) return console.log(err)
//       console.log('saved to database')
//       res.redirect('/profile')
//     })
//   })

//   app.post('/budget', (req, res) => {
//     console.log('req.body:', req.body)
//     db.collection('budget')
//       .save({
//         'goal': req.body.goal,
//         'amount': req.body.amount,
//         'spent': req.body.spent,
//         'balance': req.body.balance,
//         'amountLeft': req.body.amountLeft,
//         'note': req.body.note,
//         'completed': req.body.completed,
//         'userEmail': req.user.local.email
//       }, (err, result) => {
//         if (err) return res.send(err)
//         res.send(result)
//       })
//   })

//   // Promises Example - Then / Catch
//   // app.post('/budget', (req, res) => {
//   //   db.collection('budget')
//   //   .save({
//   //     'goal': req.body.goal,
//   //     'amount': req.body.amount,
//   //     'balance':req.body.balance,
//   //     'note': req.body.note,
//   //     'completed': req.body.completed,
//   //   })
//   //   .then(result => { res.send(result) })
//   //   .catch(err => { res.send(err) })
//   // })
//   app.put("/checkOne", (req, res) => {
//     db.collection("budget").findOneAndUpdate(
//       { _id: new mongoose.mongo.ObjectID(req.body.id) },
//       {
//         $set: {
//           completed: true,
//         },
//       },
//       {
//         sort: { _id: -1 },
//         upsert: false,
//       },
//       (err, result) => {
//         if (err) return res.send(500, err);
//         res.send("checked!");
//       }
//     );
//   });


//   app.delete("/deleteOne", (req, res) => {
//     db.collection("budget").findOneAndDelete(
//       { _id: new mongoose.mongo.ObjectID(req.body.id) },
//       (err, result) => {
//         if (err) return res.send(500, err);
//         res.send("deleted!");
//         // console.log(result);
//       }
//     );
//   });

//   app.delete('/clear', (req, res) => {
//     db.collection('budget').deleteMany({ userEmail: req.user.local.email }, (err, result) => {
//       if (err) return res.send(500, err)
//       res.send('Spreadsheet deleted!')
//       console.log(result)
//     })
//   })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================

//   // show the login form
//   app.get('/login', function (req, res) {
//     res.render('login.ejs', { message: req.flash('loginMessage') });
//   });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
