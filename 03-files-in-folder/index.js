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
        const fileExtension =
          fileNameSplitted[0] === ''
            ? ''
            : fileNameSplitted[fileNameSplitted.length - 1];
        const file =
          fileNameSplitted[0] === ''
            ? `.${fileNameSplitted[fileNameSplitted.length - 1]}`
            : fileName.replace(`.${fileExtension}`, '');
        console.log(`${file} - ${fileExtension} - ${stats.size} bytes`);
      });
    }
  });
});
