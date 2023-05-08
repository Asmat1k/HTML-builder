const {stdin, stdout} = process;
let fs = require('fs');
const path = require('path');

// СОЗДАНИЕ ПАПКИ
function makeDir() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
    if (err) throw `Ошибка в создании папки${err}`;
    stdout.write('Папка создана\n');
  });
}

// ЕДИНЫЙ ФАЙЛ ДЛЯ CSS
function oneStyle() {
  const distToFile = path.join(__dirname,'project-dist','style.css');
  const output = fs.createWriteStream(distToFile);
  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if(err) throw `Ошибка в чтении папки. Ошибка ${err}`;
    for(let i = 0; i < files.length; i += 1) {
      let dataForCss = '';
      const pathToFile = path.join(path.dirname(__filename),'styles', files[i]);
      const fileExpansion = path.extname(files[i]).toString().slice(1);
      if(fileExpansion === 'css') {
        const stream = fs.createReadStream(pathToFile, 'utf-8');
        stream.on('data', chunk => dataForCss += chunk);
        stream.on('end', () => output.write(dataForCss));
        stream.on('error', error => stdout.write(`Ошибка в потоке чтения из файла ${files[i]}\n ошибка ${error.message}`));
      }
    }
    stdout.write(`style.css создан\n`); 
  });
}

// КОПИРОВАНИЕ ПАПКИ ASSETS
function assetsCopy() {
  const pathToNewAssets = path.join(__dirname,'project-dist', 'assets');
  const pathToSource = path.join(__dirname, 'assets');
  fs.mkdir(pathToNewAssets, { recursive: true }, err => {
    if (err) throw `Ошибка в создании папки ${err}`;
  });
  // чтение исходников
  fs.readdir(pathToSource, (err, foldersNames) => {
    if(err) throw `Не найдена папка assets`;
    // Чтение файлов в папке
    for(let i = 0; i < foldersNames.length; i += 1) {
      const pathToFolder = path.join(pathToSource, foldersNames[i]);
      // статистика файла в папке
      fs.stat(pathToFolder, (err, stats) => {
        if(err) throw `Ошибка в чтении файла: ${path.join(__dirname, 'secret-folder', foldersNames[i])} код-2: ${err}`;
        // если это директория
        if(stats.isDirectory()) {
          // создаем ее в новой папке
          fs.mkdir(path.join(pathToNewAssets, foldersNames[i]), { recursive: true }, err => {
            if (err) throw `Ошибка в создании папки в assets ${err}`;
          });
          // читаем директорию
          fs.readdir(pathToFolder, (err, filesInFolder) => {
            if(err) throw `Папка не найдена`;
            // копируем содержимое
            for(let j = 0; j < filesInFolder.length; j += 1) {
              fs.copyFile(path.join(pathToSource, foldersNames[i], filesInFolder[j]), path.join(pathToNewAssets, foldersNames[i], filesInFolder[j]), (err) => {
                if(err) throw `Не удалось скопировать файлы из папки ${folderNames[i]}. ERROR ${err}`;
              });
            }
          });
        // если это просто файл
        } else {
          fs.readdir(pathToSource, (err, filesInFolder) => {
            if(err) throw `Папка не найдена`;
            // копируем содержимое
            for(let j = 0; j < filesInFolder.length; j += 1) {
              fs.copyFile(path.join(__dirname, 'assets', foldersNames[i]), path.join(pathToNewAssets, foldersNames[i]), (err) => {
                if(err) throw `Не удалось скопировать файлы из папки ${folderNames[i]}. ERROR ${err}`;
              });
            }
          });
        }
      });
    }
    stdout.write('assets создан\n'); 
  });  
}

function htmlGen() {
  let flag = false;
  const output = fs.createWriteStream(path.join(__dirname,'project-dist', 'index.html'));
  // создаем компоненты для поиска
  let comp = {};
  fs.readdir(path.join(__dirname, 'components'), (err, filesInFolder) => {
    if(err) throw `Папка не найдена`;
    // копируем содержимое
    for(let j = 0; j < filesInFolder.length; j += 1) {
      // читаем компоненты
      fs.readFile(path.join(__dirname, 'components', filesInFolder[j]), "utf8", (err, component) => {
        if(err) throw `Папка не найдена`; 
        // записываем их в обьект по принципу: ключ ({{footer}}): код HTML (<h1></h1>...)
        comp[`{{${filesInFolder[j].toString().slice(0,filesInFolder[j].indexOf('.'))}}}`] = component;
        // читаем исходник с не подключенными компонентами
        fs.readFile(path.join(__dirname, "template.html"), "utf8", (err, data) => {
          if(err) throw `Папка не найдена`; 
          for(key in comp) {
            data = data.replace(key, comp[key]);
          }
          if(j === filesInFolder.length-1) {
            output.write(data);
          } 
        });
      });
    }
  }); 
}

makeDir();
htmlGen();
assetsCopy();
oneStyle();
