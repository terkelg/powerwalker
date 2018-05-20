const test = require('tape');
const fs = require('fs');
const walk = require('../');

test('standard', async t => {
    t.plan(3);
    t.equal(typeof walk, 'function', 'consturctor is a typeof function');
    t.equal(Array.isArray(await walk('.')), true, 'returns array');
    t.equal(Array.isArray(await walk('')), true, 'empty string uses current dir .');
});

test('list', async t => {
    t.plan(2);

    const files = await walk('test/fixtures/a');
    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/c',
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b',
        'test/fixtures/a/file_a1.js',
        'test/fixtures/a/file_a2.js',
        'test/fixtures/a'
    ];

    t.equal(files.length, 7, 'find all files');
    t.deepEqual(files, expect, 'return array with files');
});

test('find', async t => {
    t.plan(3);

    const files = await walk('test/fixtures');
    t.equal(files.length, 13, 'find all files and folders');
    t.equal(
        files.includes('test/fixtures/.hiddenfile'), true, 'find hidden files');
    t.equal( files.includes('test/fixtures/.hiddendir/file.js'), true, 'find content in hidden dirs'
    );
});

test('option maxdepth', async t => {
    t.plan(2);

    const files = await walk('test/fixtures', { maxdepth: 1 });
    const expect = [
        'test/fixtures/.hiddendir',
        'test/fixtures/.hiddenfile',
        'test/fixtures/a',
        'test/fixtures/file.js',
        'test/fixtures/readme.md',
        'test/fixtures'
    ];

    t.equal(files.length, 6, 'find all files, with maxdepth = 1');
    t.deepEqual(files, expect, 'return array with files');
});

test('option flatten', async t => {
    t.plan(2);

    const files = await walk('test/fixtures/a/b', { flatten: false });
    const expect = [
        [
            'test/fixtures/a/b/c/file_c1.js',
            'test/fixtures/a/b/c'
        ],
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b'
    ]

    t.equal(files.length, 3, 'contains three elements');
    t.deepEqual(files, expect, 'contains nested arrays');
});

test('@robin/walk: option filesonly', async t => {
    t.plan(2);

    const files = await walk('test/fixtures/a/b', { filesonly: true });
    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/file_b1.js',
    ]

    t.equal(files.length, 2, 'contains two elements');
    t.deepEqual(files, expect, 'contains nested arrays');
});

test('option relative', async t => {
    t.plan(5);

    const expect = [
        'test/fixtures/a/b/c/file_c1.js',
        'test/fixtures/a/b/c',
        'test/fixtures/a/b/file_b1.js',
        'test/fixtures/a/b'
    ]

    const files = await walk('test/fixtures/a/b', { relative: true });

    t.equal(files.length, expect.length, 'contains four elements');
    files.forEach((file, i) => {
        t.equal(file.endsWith(expect[i]), true)
    });
});

test('option cwd', async t => {
    t.plan(2);

    const expect = [
        'a/b/c/file_c1.js',
        'a/b/c',
        'a/b/file_b1.js',
        'a/b'
    ]

    const files = await walk('a/b', { cwd: 'test/fixtures' });

    t.equal(files.length, expect.length, 'contains four elements');
    t.deepEqual(files, expect, 'contains path relative to cwd');
});

test('option cwd, relative backwards', async t => {
    t.plan(2);

    const expect = [
        'c/file_c1.js',
        'c',
        'file_b1.js',
        '../../../b',
        '../file_a1.js',
        '../file_a2.js',
        '..'
    ]

    const files = await walk('../', { cwd: 'test/fixtures/a/b' });

    t.equal(files.length, expect.length, 'contains seven elements');
    t.deepEqual(files, expect, 'contains path relative to cwd');
});
