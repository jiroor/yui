var Julius = require('julius');

var grammar = new Julius.Grammar();
// registry grammar
grammar.add('おはようございます');
grammar.add('こんにちは');
grammar.add('おやすみなさい');
grammar.compile(function(err, res) {
  if (err) {
    return;
  }

  // create julius instance
  var julius = new Julius(grammar.getJconf());
  julius.on('result', resultFn);
  julius.start();
});

function resultFn(res) {
  console.log(res);
}
