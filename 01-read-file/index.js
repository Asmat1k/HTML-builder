const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
let pathToFile = path.join(path.dirname(__filename), 'text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');
let data = '';
stream.on('data', chunk => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', error => console.log('Error', error.message));