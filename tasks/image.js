const recursive = require("recursive-readdir");
const colors = require('./utils/colors');

let scale = 1;
if(process.argv.length >= 2) {
	scale = process.argv[2] || 0.5;
}

console.log(`Texture packing, scale : ${scale}`.cyan);

const constants = require('./constants');
const path = require('path');
const fs = require('fs-extra');
const isDirectory = require('./utils/is-directory');
const emptyDir = require('./utils/empty-folder');
const texturepack = require('./images/texturepack');

const getFolders = () => new Promise((resolve, reject) => {
	fs.readdir(constants.PATH_SRC, (err, files)=> {
		files = files.filter((fileName)=> {
			return fileName.indexOf('DS_Store') == -1;
		});

		const dir = files.filter((fileName)=> {
			const filePath = path.resolve(constants.PATH_SRC, fileName);
			return isDirectory(filePath);
		});

		resolve(dir);
	});
});


const pack = (folderName) => new Promise((resolve, reject) => {
	const destPath = path.resolve(constants.PATH_OUTPUT, folderName);
	const srcPath = path.resolve(constants.PATH_SRC, folderName);
	console.log(`Packing ${folderName} : \n${srcPath} => ${destPath}`.yellow);
	texturepack(srcPath, folderName, destPath, scale, ()=> {
		resolve(folderName);
	});
});


const getAllfiles = () => new Promise((resolve, reject) => {
	console.log(`Output : , ${constants.PATH_OUTPUT}`.yellow);

	recursive(constants.PATH_OUTPUT, ['*.png', '.DS_Store'])
	.then((files) => {
		resolve(files);
	}, (err) => {
		console.log('Error :', err);
		reject(err);
	} )
});

const getJsonNames = (jsonPaths) => new Promise((resolve, reject) => {
	const fileNames = jsonPaths.map( p => {
		let str = p.substring(p.lastIndexOf('/') + 1)
		return str.split('_data')[0];
	});
	resolve(fileNames);
});


const createJsonList = (jsonNames) => new Promise((resolve, reject) => {
	console.log(`Saving json lists : ${constants.PATH_OUTPUT_LIST}`.yellow);
	let strJs = '';
	jsonNames.forEach((json, i) => {
		let s = `'${json}'${i === jsonNames.length -1 ? '' : ','}`; 
		strJs += s
	});

	strJs = `export default [${strJs}];`;

	fs.writeFile(constants.PATH_OUTPUT_LIST, strJs, function(err) {
	    if(err) {
	        reject(err);
	    }
	    resolve(jsonNames);
	}); 
	
});



emptyDir(constants.PATH_OUTPUT)
.then( getFolders )
.then( (mFolders) => Promise.all(mFolders.map(pack)))
.then( getAllfiles )
.then( getJsonNames )
.then( createJsonList )
.then( (o) => {
	console.log(`All done`.green);
})
.catch((err)=> {
	console.log('Error :', err);
});



