const { createReadStream, createWriteStream } = require('fs');
const CsvToJsonTransformer = require('./modules/csv-to-json');

const csvToJsonTransformer = new CsvToJsonTransformer();

createReadStream('addresses.csv')
  .pipe(csvToJsonTransformer)
  .pipe(createWriteStream('output.json'))
  // .pipe(process.stdout)
  .on('error', (err) => console.error('Error reading the file:', err));
