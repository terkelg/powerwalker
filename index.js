const fs = require('fs');
const flat = require('1d');
const path = require('path');
const { promisify } = require('util');

const stat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);

/**
 * List all files in a directory recursively, async
 * @param {String} dir Start directory
 * @param {Object} [options] Options object
 * @param {String} [options.maxdepth=Infinity] Max walker depth
 * @param {String} [options.flatten=true] Flatten the output array
 * @param {String} [options.relative=true] Use relative or absolute paths
 * @param {String} [options.cwd='.'] Define custom current working directory
 * @returns {Array} List of files and directories
 */
async function walk(dir, {maxdepth = Infinity, flatten = true, filesonly = false, relative = true, cwd = '.'} = {}) {
    const format = file => relative ? path.relative(cwd, file) : file;

    async function walker(dir, depth = 0) {
        if (dir === '') dir = cwd;
        if (depth >= maxdepth) return format(dir);
        const isDir = (await stat(dir)).isDirectory();
        if (isDir) {
            depth++;
            const files = await readdir(dir);
            const arr = await Promise.all(files.map(async file => walker(path.join(dir, file), depth)))
            if (filesonly) return arr
            if (cwd === dir && relative) {
                const prev = path.parse(dir).dir;
                const base = path.parse(dir).base;
                return arr.concat(path.relative(prev, base));
            }
            return arr.concat(format(dir));
        }
        return format(dir);
    }

    const joined = path.isAbsolute(dir) ? dir : path.join(cwd, dir);
    const p = relative ? joined : path.resolve(joined);
    return flatten ? flat(await walker(p)) : walker(p);
}

module.exports = walk;
