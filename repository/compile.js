const fs = require('fs-extra');
const path = require('path');
const uglify = require('uglify-js-harmony');

const outputPath = __dirname + '/dist';
const mout = require('mout');

console.log('output path', outputPath);

function walkDir(dir, rootPointer, currentPointer = rootPointer) {
  const fulldir = __dirname + '/' + dir;
  const files = fs.readdirSync(fulldir);


  files.forEach(filename => {
    const fullname = path.join(fulldir, filename);
    const stats = fs.statSync(fullname);
    if (stats.isFile()) {
      const extname = path.extname(fullname);
      const distPath = path.relative(__dirname, fullname).replace('tweaks', 'dist');
      if (extname === '.js') {
        if (currentPointer !== rootPointer) {
          currentPointer.js = true;
        }
        const minified = uglify.minify([fullname], {mangle: false}).code;
        fs.outputFileSync(path.join(__dirname, distPath), minified);
      } else {
        currentPointer.css = true;
        fs.copySync(fullname, path.join(__dirname, distPath));
      }
    } else {
      if (!currentPointer[filename]) {
        currentPointer[filename] = {};
      }
      walkDir(dir + '/' + filename, rootPointer, currentPointer[filename]);
    }
  });
}

function applyTweaks(target, source) {
  target.tweaks = {};

  for (var i in source) {
    const node = source[i];
    if (node.js || node.css) {
      target.tweaks[i] = node;
    } else {
      target.tweaks[i] = {};
      applyTweaks(target.tweaks[i], node);
    }
  }
}

function rebuild() {
  console.log('Rebuilding...');
  const tweaksMap = {};

  if (fs.existsSync(outputPath)) {
    fs.removeSync(outputPath);
  }

  fs.mkdirSync(outputPath);

  walkDir('tweaks', tweaksMap);

  const options = {
    version: +(new Date())
  };

  applyTweaks(options, tweaksMap);

  fs.outputFileSync(path.join(outputPath, 'options.json'), JSON.stringify(options));
}

rebuild();

if (process.argv.indexOf('--watch') !== -1) {
  console.log('Watch mode enabled');

  const debouncedRebuild = mout.function.debounce(rebuild, 250);

  fs.watch(__dirname + '/tweaks', {
    recursive: true
  }, debouncedRebuild)
}