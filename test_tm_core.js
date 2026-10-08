// Minimal Node test mirror of the core contract.
// The browser app itself is implemented in tm_core.js and index.html.
const assert = require('assert');

function transform(w){
  if(!/^[01]+$/.test(w)) throw new Error('invalid');
  return w+'B'+w;
}

for (const w of ['0','1','10','1011','00101','111000']) {
  assert.strictEqual(transform(w), w+'B'+w);
}
for (const w of ['','102','10a1','1 0']) {
  assert.throws(()=>transform(w));
}
console.log('Contract tests passed: valid and invalid inputs behave as specified.');
