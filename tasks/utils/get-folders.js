// get-folders.js
const fs = require('fs-extra');
const path = require('path');
const isDirectory = require('./is-directory');

module.exports = (mPath) => new Promise((resolve, reject) => {
	console.log('Folder path');
	console.log(mPath);
	fs.readdir(mPath, (err, files)=> {
		files = files.filter((fileName)=> {
			return fileName.indexOf('DS_Store') == -1;
		});

		console.log('files :', files);

		const dir = files.filter((fileName)=> {
			const filePath = path.resolve(mPath, fileName);
			return isDirectory(filePath);
		});

		console.log('dirs :', dir);

		resolve(dir);
	});
});