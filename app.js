const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("p"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

//create new database

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true }, { useUnifiedTopology: true });

const listSchema = {
    Name: String,
    List: []
};
const list = mongoose.model("list", listSchema);


const itemSchema = {
    Work: String
};
const workm = mongoose.model("item", itemSchema);
const item1 = new workm({
    Work: "welcome to your todolist!"
});
const item2 = new workm({
    Work: "Hit the + button to add a new item!"
});
const item3 = new workm({
    Work: "<--hit this to delete an item!"
});
var addes = [item1, item2, item3];

app.get("/", function (req, res)
{

    workm.find({}, function (err, founditems)
    {
        if (founditems.length == 0)
        {
            workm.insertMany(addes, function (err)
            {
                console.log(err);
            });
            res.redirect("/");
        }
        else
        {
            res.render("list", { din: "Today", items: founditems });
        }

    });



});
app.post("/", function (req, res)
{
    var adds = req.body.add;
    const listName = req.body.submit;
    const item = new workm({
        Work: adds
    });
    if (listName == "Today")
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        list.findOne({ Name: listName }, function (err, foundlist)
        {
            foundlist.List.push(item);
            foundlist.save();
            res.redirect("/" + listName);

        })
    }

});
app.post("/delete", function (req, res)
{
    var ck = req.body.checkbox;
    workm.deleteOne({ _id: ck }, function (err)
    {
        console.log(err);
        res.redirect("/");
    })
});


app.get("/:customListName", function (req, res)
{
    const customListName = req.params.customListName;
    list.findOne({ Name: customListName }, function (err, foundList)
    {
        if (!err)
        {
            if (!foundList)
            {
                const q = new list({
                    Name: customListName,
                    List: addes
                });
                q.save();
                res.redirect("/" + customListName);
            }
            else
            {
                res.render("list", { din: foundList.Name, items: foundList.List });
            }
        }


    });
});
// app.get("/work", function (req, res)
// {
//     res.render("list", { din: "Work",items:works,action:"/work" });
// });
//  app.post("/work", function (req, res)
//  {
//      var w = req.body.add;
//      works.push(w);
//      res.redirect("/work");
//  });
// app.get("/about", function (res, req)
// {
//     req.render("about");  
// });

app.listen(3001, function ()
{

});