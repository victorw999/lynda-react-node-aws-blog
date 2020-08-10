// define models for mongoDB
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SCHEMA: defines the structure of documents
const articleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    upvotes: {
      type: Number,
      required: false,
    },
    comments: {
      type: [],
      required: false,
    },
  },
  { timestamps: true }
);

// MODEL: cap 1st letter,
// model()'s parameter is important, it will look at this name, and pluralized it and look for that collection
// so we put "Article" in paramter, it'll look for "articles" collection
const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
