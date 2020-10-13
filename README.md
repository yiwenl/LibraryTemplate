# Installing

```
npm run install
```

# Running

```
npm run start
```

# Building

```
npm run build
```

The bundled js file will be saved in `lib/gl.js`

### All usage and apis example could be found in `src/js/app.js`

# Usage

```
import WebGLAnimation from 'lib/gl';

const webglAnim = new WebGLAnimation('assets/');
document.body.appendChild(webglAnim.canvas);

webglAnim = new WebGLAnimation('assets/', {});
webglAnim.on('onProgress', onProgress);
webglAnim.on('onLoaded', onLoaded);

function onProgress(e) {
	console.log('loading : ', e.percent);
}

function onLoaded(e) {
	//	all assets loaded
}

```

# Public APIs

### Pause WebGL rendering

`webglAnim.pause()`

### Resume WebGL rendering

`webglAnim.play()`
