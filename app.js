//node boiler plate
const express = require("express");

const bodyParser = require("body-parser");

const app= express();

const mongoose = require("mongoose");

const _ = require("lodash");

const { ObjectId } = mongoose.Types;

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

const listSchema = ({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);



//rendering to "/" route
app.get("/", function(req, res){
    Item.find({})
    .then((foundItems)=>{
        if(defaultItems.length === 0){
            Item.insertMany(defaultItems);
            }else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
            }
    })
     .then(()=>{
        if(!res.headersSent){
        res.redirect("/");
        }
     })  
     .catch((error)=>{
        console.log("Error in GET route",error);
     })
});

//posting items to "/" route"
app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if(listName === "Today"){
        item.save();
    res.redirect("/");
    }else{
        List.findOne({name: listName})
        .then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})
//Deleting items in the todolist
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    console.log("Checked Item ID:", checkedItemId);

if(!ObjectId.isValid(checkedItemId)){
    console.log("Invalid ObjectId:", checkedItemId);
    return res.redirect("/");
}
    let redirectFlag = false;
    
    if(listName === "Today"){
        Item.findByIdAndDelete(checkedItemId)
    .then((deletedItem)=>{
        if(deletedItem){
        console.log("Successfully deleted the checked item:", deletedItem);
        }else{
        console.log("Item not found or could not be deleted. ID", checkedItemId);
        }
    redirectFlag = true;
    })
    .catch((error)=>{
        console.log("Error deleting the checked item:", error);
    redirectFlag = true;
    })
    .finally(()=>{
        if(redirectFlag){
            res.redirect("/");
        }
    })
    }else{
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: {items: {_id: checkedItemId}}}
            )
        .then(()=>{
            console.log("Update succesful");
            res.redirect("/" + listName);
        })
        .catch(()=>{
            console.log("Error updating the list:", error);
            res.redirect("/" + listName);
        })
    }
    

})
//rendering to "/work" route
app.get("/:customListName", function (req, res) {
    let customListName = _.capitalize(req.params.customListName);
    

    List.findOne({ name: customListName })
        .then((foundList) => {
            if (foundList) {
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            } else {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems,
                });

                list.save();
                res.redirect("/" + customListName);

                // Create a new list only if it doesn't exist
                
            }
        })
        .catch((err) => {
            console.log("Error finding items:", err);
        });
});


//rendering to "/about" route
app.get("/about", function(req, res){
    res.render("about");
})

//node server listening on port:3000
app.listen(3000, function(){
    console.log("Server started on port 3000");
})