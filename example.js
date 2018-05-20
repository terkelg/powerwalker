const { walk, walkSync } = require('./src');
const path = require('path');

(async function() {
    let ls = walkSync('../');
    console.log(ls.length)

    ls = await walk('../', { cwd: 'test/fixtures/a/b', relative: true });
    console.log(ls)

})().catch(console.log);
