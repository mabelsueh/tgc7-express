const express = require('express');
let app = express();

// add routes here
app.get('/', (req,res)=>{
    res.send("<h1>Hello World</h1>")
})

app.get('/about', (req,res)=>{
    res.send("<h1>About Us</h1>")
})

app.get('/contact-us', (req,res)=>{
    res.send("<h1>Contact Us</h1>")
})

app.get('/greet/:name', (req, res)=>{
    let name = req.params.name;
    res.send(`<h1>Hello ${name}</h1>`)
})

app.listen(3000, ()=>{
    console.log("Server has started")
})