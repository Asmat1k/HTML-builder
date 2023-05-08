const {stdin, stdout} = process;
let fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if(err) throw `Ошибка в чтении папки: ${path.join(__dirname, 'secret-folder')} код-1: ${err}`;
  for(let i = 0; i < files.length; i += 1) {
    let fileName = path.basename(files[i]);
    let fileExpansion = path.extname(files[i]).toString().slice(1);
    fs.stat(path.join(__dirname, 'secret-folder', fileName), (err, stats) => {
      if(err) throw `Ошибка в чтении файла: ${path.join(__dirname, 'secret-folder', fileName)} код-2: ${err}`;
      if(stats.isFile()) {
        // я отрезал тысячные и тд у числа, чтобы не резало глаз, если это не нужно для проверки, надо убрать .toFixed(2)
        stdout.write(`${fileName.toString().slice(0,fileName.indexOf('.'))} - ${fileExpansion} - ${(stats.size/1024).toFixed(2)} Кб\n`);
      }
    });
  }
})