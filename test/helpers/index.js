const isWin = process.platform === 'win32';

// unixify path for cross-platform testing
function unixify(arr) {
    return isWin ? arr.map(str => {
      return Array.isArray(str) ? unixify(str) : str.replace(/\\/g, '/');
    }) : arr;
}

module.exports = { unixify };
