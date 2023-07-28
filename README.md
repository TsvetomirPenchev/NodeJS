## Buffers - Text to Speech

Create a program that converts CSV files to JSON. To achieve that, implement your own extension of the Transform stream using ES6 Classes. Do not use any external npm modules. As a result, you should be able to execute something like this:

```
fs.createReadStream(‘example.csv’)
  .pipe(CSVtoJSONTransformer)
  .pipe(process.stdout);
```

## Install Node modules

```bash
npm install
```

## Running the app

```bash
npm run start
```
