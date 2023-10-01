# Javascript Library template

A template for building javascript library using rollup.js

## Installation

```sh
$ npm i
```

## Start local environment

```sh
$ npm start
```

The starting point is the `index.js` file.

## Build webpage

```sh
$ npm run build
```

This builds the webpage for uploading, files are located in the `dist/` folder.

## Build library

```sh
$ npm run lib
```

This builds the library for importing, file are located in the `lib/` folder.

## Configuration

### Input class

Currently target `src/WebGLAnimation.js`.

### Library output path

The built library path can be set in the `package.json` under `module` and `browser` field.

### Alias

If using any alias, make sure update the alias setup in the `rollup.config.js`

### Shaders

Includes `*.vert`, `*.frag` and `*.glsl`
