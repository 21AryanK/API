//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const mongoURL = 'mongodb://0.0.0.0:27017/wikiDB';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    // Start your application logic here

    const app = express();

    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static("public"));

    //Schema
    const wikiSchema = new mongoose.Schema({
        title: String,
        content: String
    });

    //Model
    const Article= mongoose.model("Article", wikiSchema);

    app.get("/articles", function(req, res){
        Article.find()
        .then(function(foundArticles){
            res.send(foundArticles);
            console.log(foundArticles);
        })
        .catch(function(err){
            res.send(err);
            console.log(err);
        });
    });

    app.post("/articles", function(req, res){
        const newArticle= new Article({
            title : req.body.title,
            content : req.body.content
        });
        newArticle.save();
    });

    app.delete("/articles", async function(req, res){
        await Article.deleteMany()
        .then(function(){
            console.log("Successfully deleted all articles");
        })
        .catch(function(err){
            console.log(err);
        })
    })

    ////////////////////////////////Requests Targetting A Specific Article////////////////////////

    app.route("/articles/:articleTitle")

    .get(async function(req, res){

    await Article.findOne({title: req.params.articleTitle})
        .then(function(foundArticle){
            res.send(foundArticle);
        })
        .catch(function(err){
            res.send("No articles matching that title was found.");
        })
    });
    app.put(async function(req, res){

    await Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        
    );
    })

    .patch(async function(req, res){

    await Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
    );
    })

    .delete(async function(req, res){

    await Article.deleteOne(
        {title: req.params.articleTitle},
    );
    });

    app.listen(3000, function() {
        console.log("Server started on port 3000");
    });
    
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
