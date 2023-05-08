const {stdin, stdout} = process;
let fs = require('fs');
const path = require('path');

const distToFile = path.join(__dirname,'project-dist','bundle.css');
const output = fs.createWriteStream(distToFile);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if(err) throw `Ошибка в чтении папки. Ошибка ${err}`;
  for(let i = 0; i < files.length; i += 1) {
    let data = '';
    const pathToFile = path.join(path.dirname(__filename),'styles', files[i]);
    const fileExpansion = path.extname(files[i]).toString().slice(1);
    if(fileExpansion === 'css') {
      const stream = fs.createReadStream(pathToFile, 'utf-8');
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => output.write(data));
      stream.on('error', error => stdout.write(`Ошибка в потоке чтения из файла ${files[i]}\n ошибка ${error.message}`));
    }
  }
  stdout.write(`Можете найти собраный файл по пути: ${distToFile}`); 
});