const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
let app = express();

// 1B SETUP HBS
app.set('view engine', 'hbs');

// 1C. SETUP STATIC FILES
app.use(express.static('public'));

// 1D. SETUP TEMPLATE INHERITANCE
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// add routes here
app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/about', (req,res)=>{
    res.send("<h1>About Us</h1>")
})

app.get('/contact-us', (req,res)=>{
    res.send("<h1>Contact Us</h1>")
})

app.get('/greet/:name', (req, res)=>{
    let name = req.params.name;
    res.render('hello', {
        name
    })
})

app.listen(3000, ()=>{
    console.log("Server has started")
})