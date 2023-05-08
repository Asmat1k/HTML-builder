const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Привет!\n');
stdout.write('Записать в файл этот текст:\n');

stdin.on('data', data => {
  const stringData = data.toString().trim();
  if(stringData.toLowerCase() === 'exit') {
    exit();
  } else {
    output.write(`${stringData} `);
  }
});

process.on('exit', (code) => {
  if(code === 0) {
    stdout.write('Удачи!\n');
  } else {
    stderr.write(`Ой... что-то пошло не так, вот код ошибки: ${code}\n`);
  }
});

process.on('SIGINT', (code) => {
  exit();
});
