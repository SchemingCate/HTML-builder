const { mkdir, copyFile, readdir } = require('node:fs/promises');
const path = require('node:path');

async function makeDirectory(dirPath) {
  const output = await mkdir(dirPath, { recursive: true });
  return output;
}

async function copy(newDir, dirToRead) {
  const newFolder = newDir;
  await makeDirectory(newFolder);

  const files = await readdir(dirToRead, {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(
        path.join(dirToRead, file.name),
        path.join(newFolder, file.name),
      );
    } else {
      await copy(path.join(newDir, file.name), path.join(dirToRead, file.name));
    }
  }
}

copy(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));
