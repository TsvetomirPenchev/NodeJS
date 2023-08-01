const { Transform } = require('stream');

module.exports = class CsvToJsonTransformer extends Transform {
  constructor(options) {
    super(options);
    this.separator = options?.separator || ',';
    this.headers = null;
    this.firstChunk = true;

    this.push('[');
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');

    // If this is the first chunk, extract headers
    if (this.firstChunk) {
      this.headers = lines.shift().split(this.separator);
    }

    // Process each line and convert to JSON
    lines.forEach((line) => {
      if (line.trim() === '') return;

      const values = line.split(this.separator);
      const object = {};
      for (let i = 0; i < this.headers.length; i += 1) {
        object[this.headers[i]] = values[i];
      }

      if (this.firstChunk) {
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
