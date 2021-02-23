//Routes - The API routes maps to the Controllers
// List All EndPoints
const redis = require("redis");
const express = require("express");
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
const router = express.Router();
// const controllers = require('../controller/controllers');
const services = require("../service/services");

//setup port constants
const port_redis = process.env.PORT || 6379;
//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

//Middleware Function to Check Cache
const checkCache = (req, res, next) => {
  //   const { id } = req.params;
  let id = "exams01";
  let id2="sum";

  // redis_client.get("student", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send(err);
  //   }
  //   //if no match found
  //   if (data != null) {
  //     console.log("--------------------CACHE DATA---------------------------");
  //     res.status(200).send(data);
  //   } else {
  //     //proceed to next middleware function
  //     next();
  //   }
  // });
///////////////////////////////////////////////
  // redis_client.get(id, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send(err);
  //   }
  //   //if no match found
  //   if (data != null) {
  //     console.log("--------------------CACHE DATA---------------------------");
  //     redis_client.del("exams01");
  //     console.log(
  //       "-----------------key => exams01, deleted successfully----------------------- "
  //     );
  //     res.status(200).send(data);
  //   } else {
  //     //proceed to next middleware function
  //     next();
  //   }
  // });
/////////////////////////////////////////////////////////////
  //------------async-lock-------------------------------
  lock.acquire(id, function( ) {
        // Concurrency safe
    redis_client.get(id, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      //if no match found
      if (data != null) {
      
        redis_client.set(id, data+2);

        console.log("--------------------CACHE DATA---------------------------");
        
        // redis_client.del("exams01");
        // console.log(
        //   "-----------------key => exams01, deleted successfully----------------------- "
        // );
        redis_client.get(id,(err,data)=>{
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          //if no match found
          if (data != null) {
            res.status(200).send(data);   console.log("--------------------response DATA---------------------------");
        
          }
        })
        // res.status(200).send(data);   console.log("--------------------response DATA---------------------------");
        
      } else {
        //proceed to next middleware function
        next();
      }
    });
  },function(err, ret) {
        if (err) {
      console.log(err);
      res.status(500).send(err);
    }

    if (ret) {
      console.log("------------------ret----------------------");
     
    }
  });


};

// readDataFromExcelSheet
router.get("/readDataFromExcelSheet",services.readDataFromExcelSheet);

// html=> pdf routes

router.post("/html", services.convertInToPdf);

router.get("/html",services.htmlToPdf);


// users routes/////////////////////////////////////////
router.post("/user", services.addUser);

router.put("/user/:userId", services.updateUser);

router.get("/user", services.getSpecificUser);

router.get("/user/:userId", services.getSpecificUser);

router.get("/exams", checkCache, services.getExams);

//posts routes//////////////////////////////////////////////

router.post("/post/:userId", services.addPost);

router.put("/post/:userId/:postId", services.updatePost);

router.get("/post/:userId", services.getPosts);

// router.get("/post/:userId/:postId", services.getSpecificPost);

//comments routes//////////////////////////////////////////////

router.post("/comment/:userId/:postId", services.addComment);

// router.put("/comment/:userId/:postId", services.updateComment);

router.get("/comment/:commentId", services.getSpecificComment);

module.exports = router;
