"use strict";

const Benchmark = require('benchmark');
const entries = require('./entries');

function onCycle(event) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(String(event.target));
}

function run(benchName, mappings) {

  console.log('');
  console.log(`Running \`${benchName}\` benchmarks...`);

  const benches = entries(mappings).map(([ name, fn ]) => {
    return new Benchmark({ name, fn, onCycle });
  });

  Benchmark.invoke(benches, {
    name: 'run',
    onCycle() {
      console.log(''); // make sure we get a newline
    },
    onComplete() {
      console.log(`Benchmarks for \`${benchName}\` completed!`);
    }
  });
}

module.exports = run;
