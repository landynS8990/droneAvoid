// Run this to receive a png image stream from your drone.

var arDrone = require('ar-drone');
var http    = require('http');
var fs = require("fs");

console.log('Connecting png stream ...');

var client = arDrone.createClient();
client.createRepl();

client.land();
