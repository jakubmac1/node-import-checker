var express = require("express");
var app = express();
const fs = require('fs');
const lineReader = require('line-reader');

let importsArray = [];

let functionsArr = [];
const functionRelations = () => {
  lineReader.eachLine(`./reader.js`, (line) => {
    // show functions related with readDir();
    if(line.includes(' = (') && !line.includes("line.includes(' = (')")) {
      line = line.split(' ')[1];
      functionsArr.push(line)
    }
  });
};

const handleImport = (lineWithImport, sourceFile) => {
  let importedFileName = lineWithImport.split(' ');
  importedFileName = importedFileName[1];
  // console.log(importedFileName);
  lineReader.eachLine(`./${sourceFile}`, (line) => {
    let importObject = {};
    // check if line includes functionName
    if (line.includes(`${importedFileName}.`)) {
      importObject.functionName = line.split('.')[1].split('(')[0];
      importObject.sourceFile = sourceFile;
      importObject.importedFileName = importedFileName;
      importsArray.push(importObject);
    }
  });
}

//function that reads file

const readFile = (fileName) => {
  lineReader.eachLine(`./${fileName}`, (line) => {
    if(line.includes('require')) {
      handleImport(line, fileName);
    }
  });
}

//function that read all dirs in the scope and reads .js files

const readDir = () => {
  fs.readdir('./', (err, filenames) => {
    filenames.map(file => {
      if (file.includes('.js') && file !== 'reader.js' && !file.includes('.json')) {
        readFile(file);
      }
    })
  });
}

functionRelations();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send(importsArray)
  }, 1000);
});

app.get('/functions', (req, res) => {
  setTimeout(() => {
    res.send(functionsArr)
  }, 1000);
});

readDir();