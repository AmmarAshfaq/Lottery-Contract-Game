const path = require('path');// to connect with inbox.js file not use require('.\contracts...') bcs file is in sol format
const fs = require('fs');// file use for read file

const solc = require('solc'); // make compiler for compile code solidity


const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol'); // takes three param resolve
const source = fs.readFileSync(lotteryPath,'utf8');//UTF-8 is a compromise character encoding that can be as compact as ASCII

module.exports = solc.compile(source,1).contracts[':Lottery'];
