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

// 1E. Setup forms
app.use(express.urlencoded({
    extended: false
}))

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

app.get('/food/add', (req,res) => {
    res.render('add_food')
})

app.post('/food/add', (req,res)=>{
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    /*
    let tags = req.body.tags;
    if (!Array.isArray(tags)) {
        tags = [tags]
    }
    */
    res.send(`${foodName}, ${calories}, ${tags}`)
})

app.listen(3000, ()=>{
    console.log("Server has started")
})