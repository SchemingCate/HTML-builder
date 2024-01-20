const fs = require('fs');
const path = require('node:path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Welcome, friend!');

rl.on('line', (input) => {
  if (input.match(/exit/)) {
    process.exit();
  } else {
    writableStream.write(input);
  }
});

rl.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => output.write('Farewell, friend!\n'));
