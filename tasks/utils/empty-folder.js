// empty-folder.js

const fs = require('fs-extra');

module.exports = (mDestPath) => new Promise((resolve, reject) => {
	fs.emptyDir(mDestPath, (err) => {
		if(err) {
			reject(err);

			return;
		}

		resolve(mDestPath);
	});
});