const {stdin, stdout} = process;
let fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname,'file-copy'), { recursive: true }, err => {
  if (err) throw `Ошибка в создании папки${err}`;
});

fs.readdir(path.join(__dirname, 'files'), (err, origFiles) => {
  if(err) throw `Ошибка в открытии файла${err}`;
  fs.readdir(path.join(__dirname, 'file-copy'), (err, copyFiles) => {
    if(err) throw `Ошибка в чтении папки-копии ${err}`;
    copyFiles.forEach(file => {
      if (!origFiles.includes(file)) {
        fs.rm(path.join(__dirname, 'file-copy', file), (err) => {
          if(err) throw `Ошибка в удалении файла из папки-копии${err}`;
        });
      }
    });
  });
  for(let i = 0; i < origFiles.length; i += 1) {
    fs.copyFile(path.join(__dirname, 'files', path.basename(origFiles[i])), path.resolve(__dirname, './file-copy', origFiles[i]), (err) => {
      if(err) throw `Ошибка в копировании файл ${err}`;
    });;
  }
  stdout.write('Файлы скопированы!'); 
});
