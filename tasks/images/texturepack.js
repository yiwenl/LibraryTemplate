// texturepack.js
const fs = require('fs-extra');
const path = require('path');
const execFile = require('child_process').execFile;
const colors = require('../utils/colors');
const lowResScale = 0.5;

const texturepack = function(mFolderPath, mId, mDestPath, mScale, mCb) {
	const tpsId = mId;
	const srcPath = mFolderPath;
	const outpath = mDestPath;
	const name = outpath + '/' + tpsId + '{v}';

	const variant = ['1:'];
	const opts = [
	    '--data', name + '{n}_data.json',
	    '--format', 'pixijs',
	    '--sheet', name + '{n}.png',
	    mFolderPath,
	    '--multipack',
	    '--scale', mScale

	];

	variant.forEach((v) => {
		opts.push('--variant', v);
	});

	fs.readdir(mFolderPath, (err, files)=> {
		files = files.filter((f)=> {
			return f.indexOf('DS_Store') === -1;
		});

		if(files.length == 0) {
			mCb();
			return;
		}

		fs.ensureDir(path.resolve(mDestPath), ()=> {
			execFile('TexturePacker', opts, function(error, stdout, stderr) {
			    if (error) {
			        throw error;
			    } else {
			        console.log(`${tpsId} texture packing complete`.green);
			        if(mCb) {
			        	mCb();
			        }
			    }
			});
		});
	});
}


module.exports = texturepack;