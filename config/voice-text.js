var config = {
  apiKey; '<your api key>',

  message: {
    default: 'すみません、もう一度お願いします。',

    stop: 'いえいえ、またいつでも呼んでください。',
    start: 'はい、なんでしょう。',

    learn: {
      start: '学習を始めます。',
      name: '信号を検知しました。名前を入力してください。',
      end: '保存します。'
    }
  }
};

module.exports = config;
