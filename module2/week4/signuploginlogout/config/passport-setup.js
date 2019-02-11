const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
const User = require('../models/user-model');

//serializeUser => what to be saved in the session
                                //cb stands for callback
passport.serializeUser((User, cb)=> {
  //null === no errors, all good
  cb(null, User._id)
  
})
// deserializeUser => retrieve users' data from the database
//this function gets called every time we request for a user (every time when we need re.user)
passport.deserializeUser((userId, cb) =>{
  User.findById(userId)
  .then(user =>{
    cb(null, user);
  })
  .catch( err => cb(err));
})

passport.use(new localStrategy({
  usernameField: 'email'        // this step we take because we don't use username but email to register
  // and if we use username  we don't have to put this object: (usernameField: 'email)
}, (email, password, next) => {
  User.findOne({ email })
  .then (userFromDb =>{
      if(!userFromDb){
        return next(null, false, { message: 'Incorrect email!'})
      }
      if(!bcrypt.compareSync(password, userFromDb.password)){
        return next(null, false, { message: 'Incorrect password!'})
      }
      return next(null, userFromDb)
  })
  .catch( err => next(err))
}))