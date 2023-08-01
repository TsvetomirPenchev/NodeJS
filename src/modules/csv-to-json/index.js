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

      const values = line.split(this.separator);
      const object = {};
      for (let i = 0; i < this.headers.length; i += 1) {
        object[this.headers[i]] = values[i];
      }

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
