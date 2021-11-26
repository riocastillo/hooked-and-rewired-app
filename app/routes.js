const mongoose = require("mongoose");
const { sendSMS } = require('./services/twilio.js')
const ObjectId = require("mongodb").ObjectId;

const { signUpMsg } = require('./services/smsTemplates/template.js');
const { constant } = require("lodash");
module.exports = function (app, passport, db) {

  // normal routes  ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs'); // spits out the html and respond
  });

  app.get('/edit-habits', function (req, res) {
    db.collection('habits').find({ email: req.user.local.email }).toArray((err, habits) => {
      res.render('edit-habits.ejs', {
        habits
      });
    })
  });

  // PROFILE SECTION =========================
  //isloggedin is a function all the way at the bottom to see if theyre logged in
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('habits').find({ email: req.user.local.email }).toArray((err, habits) => {
      if (err) return console.log(err)
      db.collection('triggers').findOne({ userId: req.user._id }, (err, triggers) => {
        console.log('triggers', triggers)
        if (err) return console.log(err)
        db.collection('calendar').find({ email: req.user.local.email }).toArray((err2, calendar) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            habits,
            calendar,
            triggers: triggers ? triggers : { triggers: [] },
            email: req.user.local.email,
            userId: req.user._id
          })
        })
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // habit profile routes ===============================================================



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
  //  



  app.get("/getHabits/:email", isLoggedIn, (req, res) => {
    const userEmail = req.params.email
    db.collection('calendar').find({ email: userEmail }).toArray((err, habits) => {
      if (err) return console.log(err)
      return res.send(habits)
    })
  })



  app.post("/calendar", (req, res) => {
    db.collection("calendar").insertOne(
      { dataForServer: req.body.dataForServer, email: req.body.email },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send(200, "sent!");
      }
    );
  });

  app.post("/intakeHabit", isLoggedIn, (req, res) => {
    // object destructuring
    const { habit, cost, reward, extraNotes } = req.body
    let dailyCost = (Number(cost)) / 7
    db.collection("habits").insertOne(
      //we can omit the colon 'ex. habit: habit' because when properties
      // and the value are the same, the computer knows they are the same
      // this only works if the value is a variable***
      { habit, cost, dailyCost, reward, extraNotes, email: req.user.local.email }
    )
    //add error handling
    res.redirect("/profile")
  });

  app.post("/getTexts", isLoggedIn, (req, res) => {
    const phoneNumber = req.body.phone
    sendSMS(signUpMsg, phoneNumber)
    //add error handling
    res.redirect("/profile/texts")
  });


  app.put("/triggers", isLoggedIn, (req, res) => {
    db.collection("triggers").findOneAndUpdate({ userId: req.user._id }, {
      $push: { triggers: req.body.trigger }
    })
  })

  app.post("/streaks", isLoggedIn, (req, res) => {
    const streakData = req.body.streakData
    const email = req.user.local.email
    const dataForServer = req.body.dataForServer

    db.collection("streaks").insertOne(
      { streakData, email: req.user.local.email, dataForServer }
    )
    //add error handling
    res.redirect("/profile")
  });

  app.delete('/deleteHabit', (req, res) => {
    db.collection('habits').deleteOne({ _id: ObjectId(req.body.habitId) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('habit deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================

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

  app.get('/profile/texts', function (req, res) {
    res.render('texts.ejs', { message: req.flash('texts page accessed') });
  });

  app.get('/profile/dashboard', function (req, res) {
    db.collection('habits').find({ email: req.user.local.email }).toArray((err, habits) => {
      if (err) return console.log(err)
      db.collection('triggers').find().toArray((err, triggers) => {
        triggerList = {}
        triggers.forEach((trigger) => {
          console.log('info we want:', trigger.triggers)
        })
        if (err) return console.log(err)
    
        db.collection('calendar').find({ email: req.user.local.email }).toArray((err2, calendar) => {
          if (err) return console.log(err)

          db.collection('miles')
            .find({ email: req.user.local.email })
            .toArray((err, trackedEvents) => {
              let milesObj = trackedEvents.reduce((totalWorkouts, currentEntry) => {
                return totalWorkouts + currentEntry.miles
              })

              let totalRewards = 0
              let habitsAvoided = 0
              let habitsNotAvoided = 0
              let cost = 0
              let milesArray = []
              trackedEvents.forEach((workout) => {
                milesArray.push(workout.miles)
              })

              const reducer = (previousWorkout, currentWorkout) => previousWorkout + currentWorkout
              let miles = milesArray.reduce(reducer)
              let feetConversion = (miles * 5280).toFixed(2) + ' ft'

              if (miles < 0.01) {
                feetConversion
              }

              let daysRefrainedFromHabit = []
              habits.forEach((habit) => {
                let habits = {
                  name: habit.habit, count: 0,
                }
                daysRefrainedFromHabit.push(habits)
              })

              calendar.forEach((day) => {
                if (day.dataForServer.rewardData) {
                  day.dataForServer.rewardData.forEach((reward) => {
                    if (reward.gaveReward === true) {
                      totalRewards += 1
                    }
                  })
                }

                if (day.dataForServer.habits) {
                  day.dataForServer.habits.forEach((habit) => {
                    if (habit.didHabit === true) {
                      habitsAvoided += 1
                      //going thru each element of the array and increments count for daysRefrainedFromHabit tracker
                      daysRefrainedFromHabit =
                        daysRefrainedFromHabit.map((habitCount) => {
                          if (habitCount.name === habit.habit) {
                            habitCount.count += 1
                            // if(parseInt(habit.cost) >= 0){
                            //   let dailyNum = Number(parseInt(habit.cost) / 7)
                            //   dailyCostNum = dailyNum * habitCount.count
                            //   return dailyCostNum
                            // }
                          }
                          return habitCount
                        })
                      if (!isNaN(parseInt(habit.cost))) {
                        let result = (((parseInt(habit.cost)) / 7).toFixed(2))
                        cost += Number(result)
                      }
                    }

                    if (habit.didHabit === false) {
                      habitsNotAvoided += 1
                    }

                  })
                }
              })

              let totalHabits = habitsAvoided + habitsNotAvoided
              let habitsAvoidedPercentage = Math.floor((habitsAvoided / totalHabits) * 100)
              let habitsNotAvoidedPercentage = Math.floor((habitsNotAvoided / totalHabits) * 100)

              res.render('dashboard.ejs', {
                daysRefrainedFromHabit,
                habits,
                calendar,
                cost,
                totalRewards,
                habitsAvoidedPercentage,
                habitsNotAvoidedPercentage,
                email: req.user.local.email,
                milesObj,
                miles,
                trackedEvents,
                milesArray,
                feetConversion,
              })
            })
        })
      })
    })
  });

  //create a new collection that stores data of the miles tracked
  app.get('/trackMiles', function (req, res) {
    db.collection('miles')
      .find({ email: req.user.local.email })
      .sort({ _id: -1 })
      .toArray((err, trackedEvents) => {
        res.render('trackMiles.ejs', { message: req.flash('trackMiles doc accessed'), trackedEvents });
      })
  });

  app.post("/miles", (req, res) => {
    db.collection("miles").insertOne(
      { email: req.user.local.email, miles: req.body.miles, date: req.body.date },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send(200, "sent!");
      }
    );
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get("/shareCalendar/:userid", function (req, res) {
    let calendarId = ObjectId(req.params.userid);
    db.collection("users")
      .find({ _id: calendarId })
      .toArray((err, user) => {
        db.collection("calendar")
          .find({ email: user[0].local.email })
          .toArray((err, calendar) => {
            if (err) return console.log(err);
            res.render("shareCalendar.ejs", {
              calendar
            });
          });
      })
  });

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
