const isWin = process.platform === 'win32';

// unixify path for cross-platform testing
function unixify(arr) {
    return isWin ? arr.map(str => {
      return Array.isArray(str) ? unixify(str) : str.replace(/\\/g, '/');
    }) : arr;
}

function toIgnore(str) {
  return !str.includes('.DS_Store');
}

function order(arr) {
  return arr.filter(str => {
      return Array.isArray(str) ? order(str) : toIgnore(str);
  }).sort();
}

module.exports = { unixify, order };
