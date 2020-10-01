const UserModel = require('../models/UserModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrpyt = require('bcryptjs');

passport.serializeUser((user,done)=>{
    // for the user session, we want to store its _id as the identifying info
    done(null, user._id);
});

passport.deserializeUser(async (id, done)=>{
    let user = await UserModel.findUserById(id);
    // inform Passport that we have found the user.
    done(null, user);
})

let strategy = new LocalStrategy({
    'usernameField': 'email'
}, async (email,password,done)=>{
    let user = await UserModel.findUserByEmail(email);
    if (user && bcrpyt.compareSync(password, user.password)) {
        done(null, user);
    } else {
        done(null, false, {
            message:'Invalid user or creditentials'
        })
    }
})

passport.use(strategy);

module.exports = passport;