const { createReadStream } = require('fs');
const CsvToJsonTransformer = require('./modules/csv-to-json');

const csvToJsonTransformer = new CsvToJsonTransformer();

createReadStream('addresses.csv')
  .pipe(csvToJsonTransformer)
  .pipe(process.stdout)
  .on('error', (err) => console.error('Error reading the file:', err));
