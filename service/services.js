//Services - The services contains the database queries and returning objects or throwing errors.

const mongoose = require("mongoose");
const redis = require("redis");
const Axios = require("axios");

const User = require("../model/user");
const Post = require("../model/post");
const Comment = require("../model/comment");

const { log } = console;

//setup port constants
const port_redis = process.env.PORT || 6379;
//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

//  users services////////////////////////////
exports.addUser = (req, res) => {
  const { name, gender, age } = req.body;

  const newUser = new User({
    name,
    gender,
    age,
  });

  newUser
    .save()
    .then((user) => res.status(200).json("User Added Successfully"))
    .catch((err) => log(err.message));
};

exports.getExams = (req, res) => {
  // const { id } = req.params;
  let id = "exams01";

  // redis_client.set("student", "Laylaa", function (err, reply) {
  //   console.log("--------------------STUDENT Reply------------------", reply);
  // });

  Axios.get(`https://api.instasolv.com/v2/home/exams`)
    .then((exams) => {
      //add data to Redis
      // asynchronous function
      redis_client.setex(id, 3600, JSON.stringify(exams.data), (err, reply) => {
        if (err) console.log(err);
        if (reply)
          console.log(
            "--------------------Redis Reply------------------",
            reply
          );
      });

      console.log(
        "------------------API CALL----------------------------------------"
      );

      res.status(200).json(exams.data);
    })
    .catch((error) => error.message);
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, gender, age } = req.body;

  const user = await User.findById(userId);

  (() => {
    user.name = name;
    user.gender = gender;
    user.age = age;
  })();

  user
    .save()
    .then((user) => res.status(200).json("User Updated Successfully"))
    .catch((err) => log(err.message));
};

exports.getSpecificUser = async (req, res) => {
  // const { userId } = req.params;

  User.find({})
    .populate(["posts"])
    .then((user) => res.status(200).json(user))
    .catch((err) => log(err.message));
};

//  posts services////////////////////////////////////////////////////////////////////
exports.addPost = (req, res) => {
  const { userId } = req.params;
  const { title, description } = req.body;
  console.log(userId);
  const newPost = new Post({
    title: title,
    description: description,
    userId: userId,
  });

  newPost
    .save()
    .then(async () => {
      const user = await User.findById(userId);

      user.posts = user.posts.concat(user._id);

      user
        .save()
        .then(() => res.status(200).json("Post Updated Successfully"))
        .catch((err) => log(err.message));
    })
    .catch((err) => log(err.message));
};

exports.updatePost = async (req, res) => {
  const { userId, postId } = req.params;
  const { title, description } = req.body;

  const post = await Post.findById(postId);

  (() => {
    post.title = title;
    post.description = description;
    post.userId = userId;
  })();

  await post
    .save()
    .then(() => res.status(200).json("Post Updated Successfully"))
    .catch((err) => log(err.message));

  //   (() => {
  //     const user = await User.findById(userId);

  //     user.posts.push(post._id);

  //     user
  //       .save()
  //       .then((user) => res.status(200).json("User Updated Successfully"))
  //       .catch((err) => log(err.message));

  //   })();
};

exports.getPosts = async (req, res) => {
  const { userId } = req.params;

  //   Post.find({})
  //     .populate("userId")
  //     .populate({
  //       path: "comments",
  //       match: { title: { $eq: "Same To You Bro" } },
  //     })
  //     .then((post) => res.status(200).json(post))
  //     .catch((err) => log(err.message));

  //Happy Dussahra To You
  // Post.find({})
  // .populate("userId")
  // .populate({
  //   path: "comments",
  //   match: { title: { $eq: "Happy Dussahra To You" } },
  // })
  // .then((post) => res.status(200).json(post))
  // .catch((err) => log(err.message));

  // get all comments
  Post.find({})
    .populate("userId")
    // .populate(["comments"])
    .populate("comments")
    .then((post) => res.status(200).json(post))
    .catch((err) => log(err.message));
};

//  comments services////////////////////////////
exports.addComment = (req, res) => {
  const { userId, postId } = req.params;

  const { title } = req.body;

  const newComment = new Comment({
    title,
    userId,
    postId,
  });

  newComment
    .save()
    .then(async () => {
      const post = await Post.findById(postId);
      log(newComment._id);
      post.comments = post.comments.concat(newComment._id);

      post
        .save()
        .then((comment) => res.status(200).json("comment Added Successfully"))
        .catch((err) => log(err.message));
    })
    .catch((err) => log(err.message));
};

exports.updateComment = async (req, res) => {
  const { userId } = req.params;
  const { name, gender, age } = req.body;

  const comment = await Comment.findById(userId);

  (() => {
    comment.name = name;
    user.gender = gender;
    user.age = age;
  })();

  comment
    .save()
    .then((comment) => res.status(200).json("Comment Updated Successfully"))
    .catch((err) => log(err.message));
};

exports.getSpecificComment = async (req, res) => {
  const { commentId } = req.params;

  Comment.findById(commentId)
    .populate("userId")
    .populate("postId")
    .then((comment) => res.status(200).json(comment))
    .catch((err) => log(err.message));
};
