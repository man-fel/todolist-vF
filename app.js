//node boiler plate
const express = require("express");

const bodyParser = require("body-parser");

const app= express();

const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Storing items using mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = {
   
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todolist."
})
const item2 = new Item ({
    name: "Hit the ➕ button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
.then(()=>{
    console.log("Successfully inserted the items");
})
.catch(()=>{
    console.log("Failed to insert the items!", error);
})
.finally(()=>{
    mongoose.connection.close();
})

//rendering to "/" route
app.get("/", function(req, res){

    res.render("list", {listTitle: "Today", newListItems: items});
})

//posting items to "/" route"
app.post("/", function(req, res){
    let item = req.body.newItem;

    if (req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work")
    }else{
        items.push(item);
        res.redirect("/")
    }
})

//rendering to "/work" route
app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems})
})

//rendering to "/about" route
app.get("/about", function(req, res){
    res.render("about");
})

//node server listening on port:3000
app.listen(3000, function(){
    console.log("Server started on port 3000");
})