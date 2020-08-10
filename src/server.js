import express from "express";
import bodyParser from "body-parser";
const mongoose = require("mongoose");
const Article = require("./models/article");
import path from "path";
import dbURI from "./config";
const app = express();

// link to the frontend's build "dir"
app.use(express.static(path.join(__dirname, "/build")));

// parse the JSON obj we included along w/ our POST request
// add a "body" property to the "request" parameter of the route
app.use(bodyParser.json());

// mongoDB Atlas: connect to mongodb
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

// get article name
app.get("/api/articles/:name", (req, res) => {
  const articleName = req.params.name;
  Article.findOne({
    name: articleName,
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log.err);
});

// wrap func(): this syntax can be used to to extract out the begining & end of a series of async operations
// so to keep the "operation" dry
const wrap = async (operations, res) => {
  try {
    await operations();
  } catch (err) {
    res.status(500).json({ message: "error connecting to db" });
  }
};

// upvote an article
app.post("/api/articles/:name/upvote", async (req, res) => {
  wrap(async () => {
    const articleName = req.params.name;
    const articleInfo = await Article.findOne({
      name: articleName,
    });
    await Article.updateOne(
      { name: articleName },
      {
        $set: {
          upvotes: articleInfo.upvotes + 1,
        },
      }
    );
    const updatedArticleInfo = await Article.findOne({
      name: articleName,
    });
    res.status(200).json(updatedArticleInfo);
  }, res);
});

// add comment to an article
app.post("/api/articles/:name/add-comment", async (req, res) => {
  wrap(async () => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    const article = await Article.findOne({
      name: articleName,
    });
    await Article.updateOne(
      { name: articleName },
      {
        $set: {
          comments: article.comments.concat({ username, text }),
        },
      }
    );
    const updatedArticle = await Article.findOne({
      name: articleName,
    });
    res.status(200).json(updatedArticle);
  }, res);
});

//--> testing add new article
app.get("/api/articles/add-article", (req, res) => {
  const article = new Article({
    name: "article 2",
    title: "hooah !",
    content: "this is freaking awasome aritcle",
  });
  article
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log.err);
});

//--> retrieve all
app.get("/api/article/all-articles", (req, res) => {
  Article.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log.err);
});

// all requests that are NOT caught by routes should be past on to our app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

//
app.listen(8000, () => console.log("listening on prot 8000"));
