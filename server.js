const express = require('express');
const path = require('path');
const db = require('./db/db');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs" );

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res) => {
    res.render("index.ejs");
});


const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);

app.listen(PORT,() => {
    console.log("server is listening on port '3000'.");
});