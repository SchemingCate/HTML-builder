const path = require('node:path');
const fs = require('fs');

fs.readdir(
  path.join(__dirname, 'styles'),
  {
    withFileTypes: true,
  },
  (err, files) => {
    const output = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );
    files.forEach((dirent) => {
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        const input = fs.createReadStream(
          path.join(__dirname, 'styles', dirent.name),
          'utf-8',
        );
        input.pipe(output);
      }
    });
  },
);
