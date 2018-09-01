<p align="center">
  <img src="https://github.com/terkelg/powerwalker/raw/master/powerwalker.png" alt="Power Walker" width="300" />
</p>

<h1 align="center">Power Walker</h1>

<p align="center">
  <a href="https://npmjs.org/package/powerwalker">
    <img src="https://img.shields.io/npm/v/powerwalker.svg" alt="version" />
  </a>
  <a href="https://travis-ci.org/terkelg/powerwalker">
    <img src="https://img.shields.io/travis/terkelg/powerwalker.svg" alt="travis" />
  </a>
  <a href="https://ci.appveyor.com/project/terkelg/powerwalker/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/svaorudqednb1tyi/branch/master?svg=true" alt="AppVeyor"/>
  </a>
  <a href="https://npmjs.org/package/powerwalker">
    <img src="https://img.shields.io/npm/dm/powerwalker.svg" alt="downloads" />
  </a>
</p>

<p align="center"><b>Walk directories recursively</b></p>

<br />


> "All truly great thoughts are conceived by walking"
> – Friedrich Nietzsche


## Installation

```
npm install powerwalker
```


## Usage

```js
const walk = require('powerwalker');

let files = await walk('path/to/walk');
```

## API


### walk(dir, options)

Type: `Promise`<br>
Returns: `Array`

List all files and directories in `dir` recursively.

#### dir

Type: `String`

A directory path to walk recursively.

#### options

Type: `Object`<br>
Default: `{ maxdepth: Infinity, flatten: true, filesonly: false }`

Optional options object.

#### options.maxdepth

Type: `Number`<br>
Default: `Infinity`

Max number of directories to walk before stopping.

#### options.flatten

Type: `Boolean`<br>
Default: `true`

Option to flatten the output to a 1D array.

#### options.filesonly

Type: `Boolean`<br>
Default: `false`

Exclude directories from result.

#### options.relative

Type: `Boolean`<br>
Default: `true`

Return relative paths, or absolute paths.

#### options.cwd

Type: `String`<br>
Default: `'.'`

Custom working directory. All paths are relative to this.


## License

MIT © [Terkel Gjervig](https://terkel.com)
