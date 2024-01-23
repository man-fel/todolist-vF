const express = require("express");

const bodyParser = require("body-parser");

const app= express();

let items = ["",];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    var date = new Date();

    var options = {
        weekday: "long",
        month: "2-digit",
        day: "numeric",
        year: "numeric"
       
    };
    let day = date.toLocaleDateString("en", options);
    res.render("list", {kindOfDay: day, newListItems: items});
})
app.post("/", function(req, res){
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})
   

app.listen(3000, function(){
    console.log("Server started on port 3000");
})