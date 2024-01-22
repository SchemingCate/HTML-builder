const { mkdir, copyFile } = require('node:fs/promises');
const path = require('node:path');
const fs = require('fs');

async function makeDirectory() {
  const newFolder = path.join(__dirname, 'files-copy');
  const dirCreation = await mkdir(newFolder, { recursive: true });

  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    files.forEach((file) => {
      copyFile(path.join(__dirname, 'files', file), path.join(newFolder, file));
    });
  });
  return dirCreation;
}

makeDirectory();
