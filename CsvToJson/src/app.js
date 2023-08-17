const { createReadStream, access, F_OK, createWriteStream } = require('fs');
const path = require('path');
const CsvToJsonTransformer = require('./modules/csv-to-json');
const { getCommandLineArgument } = require('./utils/cl');

const csvToJsonTransformer = new CsvToJsonTransformer();

const rootPath = path.resolve(__dirname, '..');
const fileName = getCommandLineArgument('file');
const filePath = path.join(rootPath, 'data', `${fileName}.csv`);
const outputPath = path.join(rootPath, 'output', `${fileName}.json`);

access(filePath, F_OK, (err) => {
  if (err) {
    console.error('File does not exist!');
    return;
  }

  createReadStream(filePath)
    .pipe(csvToJsonTransformer)
    .pipe(createWriteStream(outputPath))
    .on('error', (error) => console.error('Error reading the file:', error));
});
