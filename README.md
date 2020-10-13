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
webglAnim.on('onCountrySelected', (country) => {
	console.log('on Country Selected', country);
	//	{
	//		centerPosition: [941, 262],
	//		color: "#66ccff",
	//		name: "Spain"
	//	}
});
webglAnim.on('onGlobeReady', () => {
	console.log('Globe Ready');	//	all meshes loaded
});

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

### Show Commodities
`showCommodities( mColors, mData, mZoomIn)`

### Get country position in screen position 
`getCountryPosition(mColor)`

### Update Countries Data
`updateCountryData(mData)`

### Update Countries Map
`updateCountryMap(img)`

