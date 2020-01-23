const test3 = require('./test3');

const sumFunction = (a, b) => {
  console.log(a, b)
};

test3.logInfo('Custom logged info!');

module.exports.sumFunction = sumFunction;