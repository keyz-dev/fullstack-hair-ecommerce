// src/utils/loadModules.js
const path = require('path');
const fs = require('fs');

function generateIndex(directory) {
  const modules = {};
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.js')) {
      const fileName = file.split('.')[0];
      modules[fileName] = require(path.join(directory, fileName));
    }
  });

  return modules;
}

module.exports = generateIndex;
