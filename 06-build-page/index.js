const path = require('node:path');
const fs = require('fs');
const { readFile, mkdir, copyFile, readdir } = require('node:fs/promises');

async function fileContent(filePath) {
  const output = await readFile(filePath, { encoding: 'utf8' });
  return output;
}

async function makeDirectory(dirPath) {
  const output = await mkdir(dirPath, { recursive: true });
  return output;
}

async function createFile(path, content) {
  const writeStream = fs.createWriteStream(path);
  writeStream.write(content);
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

async function init() {
  let template = await fileContent(path.join(__dirname, 'template.html'));

  const tagNamesArr = template.match(/\{\{([^{}]+)\}\}/gm);
  const componentsNamesArr = tagNamesArr.map((tag) =>
    tag.replaceAll('{', '').replaceAll('}', ''),
  );

  for (let i = 0; i < componentsNamesArr.length; i++) {
    const componentPath = path.join(
      __dirname,
      'components',
      `${componentsNamesArr[i]}.html`,
    );
    const componentContent = await fileContent(componentPath);
    template = template.replace(tagNamesArr[i], componentContent);
  }

  await makeDirectory(path.join(__dirname, 'project-dist'));
  await createFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    template,
  );

  //05-merge-styles
  fs.readdir(
    path.join(__dirname, 'styles'),
    {
      withFileTypes: true,
    },
    (err, files) => {
      const output = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'style.css'),
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

  await copy(
    path.join(__dirname, 'project-dist', 'assets'),
    path.join(__dirname, 'assets'),
  );
}

init();
