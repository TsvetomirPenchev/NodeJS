import { https } from 'https';
import { fs } from 'fs';

function saveAudioToFile(audioData, filename) {
  fs.writeFile(filename, audioData, 'binary', (error) => {
    if (error) {
      console.error('Error while saving the MP3 file:', error);
    }
  });
}

function convertTextToSpeech(text, language) {
  // eslint-disable-next-line prettier/prettier
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Request failed with status code: ${response.statusCode}`);
      return;
    }

    const chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const audioData = Buffer.concat(chunks);
      saveAudioToFile(audioData, `${language}_output.mp3`);
      console.log('Conversion completed.');
    });

    response.on('error', (error) => {
      console.error('Error occurred while processing the response:', error);
    });
  });
}
const textToConvert = 'Hello, this is a test message.';
const languageCode = 'en';

convertTextToSpeech(textToConvert, languageCode);
