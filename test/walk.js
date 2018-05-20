const fs = require('fs');
const walk = require('../');
const test = require('tape');
const { unixify, order } = require('./helpers');

const isMatch = async (t, dir, expect, opts) => {
    let files = order(unixify(await walk(dir, opts)));
    if (Array.isArray(expect)) {
        t.equal(files.length, expect.length, 'find all files');
        t.deepEqual(files, order(expect), 'matches');
    }
    return files;
}

test('standard', async t => {
    t.plan(3);
    t.equal(typeof walk, 'function', 'consturctor is a typeof function');
    t.equal(Array.isArray(await walk('.')), true, 'returns array');
    t.equal(Array.isArray(await walk('')), true, 'empty string uses current dir .');
});

test('list', async t => {
    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/c',
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b',
        'test/fixtures/a/file_a1.js',
        'test/fixtures/a/file_a2.js',
        'test/fixtures/a'
    ];
    isMatch(t, 'test/fixtures/a', expect);
    t.end();
});

test('find', async t => {
    let match = await isMatch(t, 'test/fixtures');
    t.equal(match.includes('test/fixtures/.hiddenfile'), true, 'find hidden files');
    t.equal(match.includes('test/fixtures/.hiddendir/file.js'), true, 'find content in hidden dirs');
    t.end();
});

test('option maxdepth', async t => {
    const expect = [
        'test/fixtures/.hiddendir',
        'test/fixtures/.hiddenfile',
        'test/fixtures/a',
        'test/fixtures/file.js',
        'test/fixtures/readme.md',
        'test/fixtures'
    ];
    await isMatch(t, 'test/fixtures', expect, { maxdepth:1 });
    t.end();
});

test('option flatten', async t => {
    const expect = [
        [
            'test/fixtures/a/b/c/file_c1.js',
            'test/fixtures/a/b/c'
        ],
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b'
    ]
    await isMatch(t, 'test/fixtures/a/b', expect, { flatten:false });
    t.end();
});

test('option filesonly', async t => {
    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/file_b1.js',
    ]
    await isMatch(t, 'test/fixtures/a/b', expect, { filesonly:true });
    t.end();
});

test('option relative', async t => {
    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/c',
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b'
    ]

    const relative = await isMatch(t, 'test/fixtures/a/b', expect, { relative:true });
    const abs = await isMatch(t, 'test/fixtures/a/b', null, { relative:false });
    abs.forEach((file, i) => {
        t.equal(file.endsWith(relative[i]), true);
    });
    t.end();
});

test('option cwd', async t => {
    const expect = [
        'a/b/c/file_c1.js',
        'a/b/c',
        'a/b/file_b1.js',
        'a/b'
    ]
    await isMatch(t, 'a/b', expect, { cwd:'test/fixtures' });
    t.end();
});

test('option cwd, relative backwards', async t => {
    const expect = [
        'c/file_c1.js',
        'c',
        'file_b1.js',
        '../../../b',
        '../file_a1.js',
        '../file_a2.js',
        '..'
    ]
    await isMatch(t, '../', expect, { cwd:'test/fixtures/a/b' });
    t.end();
});
