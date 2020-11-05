// const express = require("express");
// const redis = require("redis");
// const client = redis.createClient();
// const axios = require("axios");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const routes = require("./router/routes");

// // //setup port constants
// // const port_redis = process.env.PORT || 6379;
// const port = process.env.PORT || 4000;

// //configure redis client on port 6379
// // const redis_client = redis.createClient(port_redis);

// client.on("connect", () =>
//   console.log("You are now connected with Redis-server => 6379 ")
// );

// client.on("error", (error) => console.error(error));

// const server = express();
// // const path = require('path');

// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(cors());
// server.use(cookieParser());

// (async () => {
//   try {
//     //mongoDB Connection
//     await mongoose.connect(
//       process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/poc-project",
//       {
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         serverSelectionTimeoutMS: 5000,
//         dbName: "poc-project",
//       }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// })();

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDB database connection established successfully");
// });

// server.use("/poc-project", routes);

// // if (process.env.NODE_ENV === 'production') {
// //     app.use(express.static( 'client/build' ));

// //     app.get('*', (req, res) => {
// //         res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
// //     });
// // }

// server.listen(port, () =>
//   console.log(`!!!Express Server is Running on port => ${port}`)
// );

// ########################################################################################################
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;


// console.log(`Total Number Of CPUs => ${numCPUs}`)

const port = process.env.PORT || 4000;

// cluster.isMaster
//  True if the process is a master. This is determined by the process.env.NODE_UNIQUE_ID. 
// If process.env.NODE_UNIQUE_ID is undefined, then isMaster is true. 


// cluster.isWorker
// True if the process is not a master (it is the negation of cluster.isMaster).



if (cluster.isMaster) {
  console.log('I am master');
  console.log(`Master ${process.pid} is running`);


 // Keep track of http requests
 let numRequests = 0;
 setInterval(() => {
   console.log(`numRequests = ${numRequests}`);
 }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numRequests += 1;
    }
  }

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    // worker.send('hi there');

    cluster.on('online', (worker, code, signal) => {

      console.log(`Yay, the worker responded after it was forked ${worker.process.pid} died, with code=> ${code}, signal=> ${signal}`);
    });

    // let timeout;

    // worker.on('listening', (address) => {
    //   worker.send('shutdown');
    //   worker.disconnect();
    //   timeout = setTimeout(() => {
    //     worker.kill();
    //   }, 2000);
    // });
  
    // worker.on('disconnect', () => {
    //   clearTimeout(timeout);
    // });

    // worker.on('exit', (code, signal) => {
    //   if (signal) {
    //     console.log(`worker was killed by signal: ${signal}`);
    //   } else if (code !== 0) {
    //     console.log(`worker exited with error code: ${code}`);
    //   } else {
    //     console.log('worker success!');
    //   }
    // });

  }

  //  Start workers and listen for messages containing notifyRequest
  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

  // cluster.on('exit', (worker, code, signal) => {
  //   console.log(`worker ${worker.process.pid} died, with code=> ${code}, signal=> ${signal} `);
  // });

  
  // cluster.on('disconnect',  (worker, code, signal) => {
  //    // Worker has disconnected
  //   console.log(`worker ${worker.process.pid} died/disconnected, with code=> ${code}, signal=> ${signal} `);
  // });


    // add eventlisteners
    Object.values(cluster.workers).forEach(worker => {
      worker.on('message', () => {
        console.log("message for all workers");
      });
    });

} else if (cluster.isWorker){
  console.log(`I am worker #${cluster.worker.id}`);

  const express = require("express");
  const redis = require("redis");
  const client = redis.createClient();
  const axios = require("axios");
  const bodyParser = require("body-parser");
  const cookieParser = require("cookie-parser");
  const cors = require("cors");
  const mongoose = require("mongoose");
  const routes = require("./router/routes");
  const server = express();



  client.on("connect", () =>
  console.log("You are now connected with Redis-server => 6379 ")
);

client.on("error", (error) => console.error(error));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors());
server.use(cookieParser());

(async () => {
  try {
    //mongoDB Connection
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/poc-project",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 5000,
        dbName: "poc-project",
      }
    );
  } catch (error) {
    console.error(error);
  }
})();

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

server.use("/poc-project", routes);

process.send({ cmd: 'notifyRequest' });

server.listen(port, () =>
  console.log(`!!!Express Server is Running on port => ${port}`)
);


process.on('message', () => {
  process.send("msg HEllooo Masteer");
});

// process.send('Hi');
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  // http.createServer((req, res) => {
  //   res.writeHead(200);
  //   res.end('hello world\n');
  // }).listen(8000);




let workerNumber=0;
workerNumber++
  console.log(`Worker ${workerNumber}, id=> ${process.pid} started`);
}