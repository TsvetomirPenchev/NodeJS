const fs = require('fs');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

module.exports = class TextToSpeechConverter {
  baseUrl = 'https://translate.google.com/translate_tts';

  queryParams = {
    ie: 'UTF-8',
    client: 'tw-ob',
    tl: 'en',
    q: '',
  };

  text = '';

  getUrl() {
    this.queryParams.q = this.text;
    return `${this.baseUrl}?${querystring.stringify(this.queryParams)}`;
  }

  getAudioData() {
    return new Promise((resolve, reject) => {
      https.get(this.getUrl(), (response) => {
        const chunks = [];

        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Request failed with status code: ${response.statusCode}`,
            ),
          );
        }

        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', (error) => reject(error));
      });
    });
  }

  getFileName() {
    const cleanedText = this.text
      .replace(/[/\\?*:|,\\!"<>]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
      .toLowerCase();

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const day = currentDate.getDate().toString();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    return path.resolve('output', `${year}-${month}-${day}-${cleanedText}.mp3`);
  }

  saveDataToFile(audioData) {
    return new Promise((resolve, reject) => {
      const filename = this.getFileName();

      fs.writeFile(filename, audioData, (error) => {
        if (error) {
          reject(error);
        }
        resolve(`${filename} saved`);
      });
    });
  }

  save(text) {
    this.text = text;

    this.getAudioData()
      .then((result) => this.saveDataToFile(result))
      .then((result) => console.log(result))
      .catch((error) => console.log(error.toString()));
  }
};
