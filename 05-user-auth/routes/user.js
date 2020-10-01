const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const passport = require('passport');
const isAuthenticated = require('../middleware/IsAuthenticated');

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/register", async (req, res) => {
  let newUserID = await UserModel.createUser(req.body.name,
    req.body.email, 
    req.body.password);

    res.send(newUserID);
});

router.get('/login', (req,res)=>{
    res.render('user/login');
});

router.post('/login', async (req,res)=>{
    let authProcess = passport.authenticate('local', async(err, user, info) =>{
        if (err) {
            res.send("Cannot login");
            console.log(err);
            // res.redirect('/errors')
        } 

        if (!user) {
            res.send("User not found");
        } 

        let loginError = req.logIn(user, (loginError)=>{
         
            if (loginError) {
                res.send("Login error")
            } else {
                res.send("user has logged in")
            }
        })
    } )
    authProcess(req,res);


})

router.get('/profile', (req,res)=>{
    if (req.isAuthenticated()) {
            res.send(req.user);
    } else {
        res.send("not logged in");
    }
})

router.get('/protected', isAuthenticated, (req,res)=>{
    res.send("top secret");
})

router.get('/logout', (req,res)=>{
    req.logOut();
    res.send("You have been logged out");
})

module.exports = router;
