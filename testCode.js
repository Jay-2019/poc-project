const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {
    console.log('I am master');
  // init cluster
  require('os').cpus().forEach(() => {
    const worker = cluster.fork();
  
    worker.on('message', (msg) => {
      console.log("message form child: ",msg);

    });

    worker.send('Big announcement for all workers');
  });


  // add eventlisteners
  // Object.values(cluster.workers).forEach(worker => {
  //   worker.on('message', () => {
  //     console.log("message for all workers");
  //   });
  // });
} else {
    console.log(`I am worker #${cluster.worker.id}`);

    process.on('message', (msg) => {
      console.log('Message from Master:', msg);
    });

    // process.on('message',(msg)=>{
    //   process.send(msg)
    // });

//     let counter = 0;

// setInterval(() => {
//   process.send({ counter: counter++ });
// }, 1000);


process.send(`Hello MAster,I am worker #${cluster.worker.id}`);

  http.Server((req, res) => {
    res.writeHead(200);
      res.end('hello world\n');


    // process.send('Hiiiiiiiiiiiiiiiiiiiiiii');
  }).listen(8000);
}