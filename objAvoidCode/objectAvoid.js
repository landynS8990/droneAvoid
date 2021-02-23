// Run this to receive a png image stream from your drone.

var arDrone = require('..');
var http    = require('http');
var fs = require("fs");

console.log('Connecting png stream ...');

var client = arDrone.createClient();
client.createRepl();

var pngStream = arDrone.createClient().getPngStream();


var lastPng;


setTimeout(function(){ 
  console.log("Taking off...");
  client.takeoff();
  client.stop();
}, 5000);


setTimeout(function(){ 
  pngStream
    .on('error', console.log)
    .on('data', function(pngBuffer) {
        lastPng = pngBuffer;
        fs.writeFile("pic.png", lastPng, function(err) {
            if (err) throw err; 
        });
        var direc = fs.readFileSync('direction.txt', 'utf8').toString();
        var stopVal = fs.readFileSync('stopVal.txt', 'utf8').toString();
        console.log(direc);
        if (direc == "land") {
          console.log("Land");
          client.land();
        }
        else if (direc == "forward") {
          client.front(0.1);
          client.after(200, function() {
            this.stop();
          });
          console.log("Forward");
        } 
        else if (direc == "right") {
          client.right(0.1);
          client.after(200, function() {
            this.stop();
          });
          console.log("Right");
        } 
        else if (direc == "left") {
          client.left(0.1);
          client.after(200, function() {
            this.stop();
          });
          console.log("Left");
        } 
    });
}, 5500);



var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});
