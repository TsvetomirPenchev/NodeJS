const TextToSpeechConverter = require('./modules/text-to-speech');

const converter = new TextToSpeechConverter();
converter.save('The quick brown fox jumps over the lazy dog!');
