const { readdir } = require('node:fs/promises');
const { stat } = require('node:fs');
const path = require('node:path');

const files = readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
});

files.then(function (result) {
  result.forEach((dirent) => {
    if (dirent.isFile()) {
      const fileName = dirent.name;
      stat(path.join(__dirname, 'secret-folder', fileName), (err, stats) => {
        const fileNameSplitted = fileName.split('.');
        console.log(
          `${fileNameSplitted[0]} - ${fileNameSplitted[1]} - ${stats.size} bytes`,
        );
      });
    }
  });
});
