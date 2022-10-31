//jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
const https = require("https");
const mongoose = require("mongoose");

var app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true});

const taskschema={
  task : String
};

const customlistschema={
  name: String,
  items: [taskschema]
};

const Task=mongoose.model("task", taskschema);
const Comment=mongoose.model("comment",taskschema);
const Customlist = mongoose.model("customlist",customlistschema);

const first=new Task({
  task: "Click on First Section to see list of Tasks"
});

const second=new Task({
  task: "Click on Second Section to Add a New Task"
});

const third=new Task({
  task: "Click on Third Section to Add Comments"
});

var nday=new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};

var day= nday.toLocaleDateString("en-US", options);

app.get("/",function (req,res) {
  Task.find({},function (err, foundItems) {
    if(foundItems.length==0)
    {
      Task.insertMany([first, second, third], function (err) {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/");
    }
    else
    res.render("index.ejs", {listTitle:"today" , date: day, listitems:foundItems});
  });
});

app.post("/addtask",function (req,res) {
  var newtask=req.body.newtask;
  var listname=req.body.button;
  // console.log(listname);

  var newTask= new Task({
    task: newtask
  });

  if(listname==="today")
  {
  newTask.save();
  res.redirect("/");
}
else {
  Customlist.findOne({name: listname},function (err, foundlist) {
    // console.log(foundlist);
    foundlist.items.push(newTask);
    foundlist.save();
    res.redirect("/"+listname);
  });
}
});

app.post("/delete", function(req,res){
  var id=req.body.checkbox;
  const listname = req.body.input;
  // console.log(listname);
  // console.log(id);
  if(listname==="today")
  {
  Task.findByIdAndRemove(id,function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
}
else {
    Customlist.findOneAndUpdate({name: listname}, {$pull: {items: {_id: id}}},function(err, foundList){
      if(err)
      console.log(err);
  });
  res.redirect("/"+listname);
}
});

app.get("/comments",function (req,res) {
  Comment.find({},function (err,foundComments) {
    if(err)
    console.log(err);
    else
    res.render("comments.ejs",{date : day, comments : foundComments});
  });
});

app.post("/comments", function (req,res) {
  var txt=req.body.txtarea;
  var newcomment= new Comment({
    task: txt
  });
  newcomment.save();
  res.redirect("/comments");
});

app.post("/deletecomment",function (req,res) {
  var id=req.body.checkbox;
  Comment.findByIdAndRemove(id,function (err) {
    if(err)
    console.log(err);
  });
  res.redirect("/comments");
});

app.post("/updatefirst",function (req,res) {
  var id=req.body.button;
  var listname=req.body.input;
  res.render("update",{id: id, listTitle: listname});
});

app.post("/update",function (req,res) {
  var id=req.body.button;
  var task=req.body.updatedtask;
  var listname=req.body.input;
  console.log(id);
  console.log(task);
  if(listname==="today")
  {
  Task.findOneAndUpdate({_id: id}, {$set:{task:task}},function (err) {
    if(err)
    console.log(err);
  });
  res.redirect("/");
}
else {
  Customlist.findOneAndUpdate({name: listname, 'items._id': id}, {$set: {'items.$.task': task}}, function(err){
    if(err)
    console.log(err);
  });
  res.redirect("/"+listname);
}
});

app.get("/:custom",function (req,res) {
  const customname=req.params.custom;
  // console.log(customname);
  Customlist.findOne({name: customname},function(err, foundItems){
    if(!foundItems)
    {
      newlist= new Customlist({
        name: customname,
        items: []
      });
      newlist.save();
      res.redirect("/"+customname);
    }
    else
    {
      res.render("index",{listTitle: customname, date: day, listitems: foundItems.items});
    }
  });
});


app.listen(3000, function(){
  console.log("Server started at port : 3000");
});
