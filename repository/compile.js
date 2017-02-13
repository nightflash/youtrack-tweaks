const fs = require('fs-extra');
const path = require('path');
const uglify = require('uglify-js');


// fs.watch(__dirname + '/tweaks', {
//   recursive: true
// }, (type, filename) => {
//   console.log('changes', type, filename);
// });

const outputPath = __dirname + 'dist';

if (fs.existsSync(outputPath)) {
  fs.removeSync(outputPath);
}

fs.mkdirSync(outputPath);

const tweaksMap = {};

function walkDir(dir, currentPointer) {
  const fulldir = __dirname + '/' + dir;
  const files = fs.readdirSync(fulldir);


  files.forEach(filename => {
    const fullname = path.join(fulldir, filename);
    const stats = fs.statSync(fullname);
    if (stats.isFile()) {
      const extname = path.extname(fullname);
      const distPath = path.relative(__dirname, fullname).replace('tweaks', 'dist');
      if (extname === '.js') {
        if (currentPointer !== tweaksMap) {
          currentPointer.js = true;
        }
        const result = uglify.minify([fullname]).code;
        fs.outputFileSync(path.join(__dirname, distPath), result);
      } else {
        if (currentPointer !== tweaksMap) {
          currentPointer.css = true;
        }
        fs.copySync(fullname, path.join(__dirname, distPath));
      }
    } else {
      if (!currentPointer[filename]) {
        currentPointer[filename] = {};
      }
      walkDir(dir + '/' + filename, currentPointer[filename]);
    }
  });
}

walkDir('tweaks', tweaksMap);

console.log(tweaksMap);