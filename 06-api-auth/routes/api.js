const express = require('express')
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/', (req,res)=>{
    res.send({
        'message':'API working'
    })
});

router.post('/login', async (req,res)=>{
    let authProcess = passport.authenticate('local', async(err, user, info) =>{
        if (err) {
            res.send({'message':"Cannot login"});
            // res.redirect('/errors')
        } 

        if (!user) {
            res.send({"message":"User not found"});
        } 

        let loginError = req.logIn(user, {session:false}, (loginError)=>{
            
            if (loginError) {
                console.log(loginError);
                res.send({"message": loginError})
            } else {
                // generate jwt 
                const body = {
                    _id: user.id,
                    email: user.email
                }
                const token = jwt.sign({
                    user:body
                }, "TOP_SECRET")
                return res.send({
                    'token': token                    
                })
            }
        })
    } )
    authProcess(req,res);
});

router.get('/protected', passport.authenticate('jwt', {session:false}), (req,res)=>{
    res.send("accessing top secret area");
})

module.exports = router;