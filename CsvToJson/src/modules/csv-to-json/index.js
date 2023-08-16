const { Transform } = require('stream');

module.exports = class CsvToJsonTransformer extends Transform {
  constructor(options) {
    super(options);
    this.separator = options?.separator || ',';
    this.headers = null;
    this.firstChunk = true;
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');

    if (this.firstChunk) {
      this.headers = lines.shift().split(this.separator);
    }

    lines.forEach((line) => {
      if (line.trim() === '') return;

      let inQuotes = false;
      let object = {};
      let currentField = '';
      let headersCn = 0;

      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === this.separator && !inQuotes) {
          object = {
            ...object,
            [this.headers[headersCn]]: currentField,
          };
          currentField = '';
          headersCn += 1;
        } else {
          currentField += char;
        }
      }

      object = {
        ...object,
        [this.headers[headersCn]]: currentField,
      };

      if (this.firstChunk) {
        this.push('[');
        this.firstChunk = false;
      } else {
        this.push(',');
      }

      this.push(`${JSON.stringify(object)}`);
    });

    callback();
  }

  _flush(callback) {
    this.push(']');

    callback();
  }
};
