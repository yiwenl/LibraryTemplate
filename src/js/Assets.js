// Assets.js

import assetsToLoad from './asset-list'

const Assets = {}
let _assets = []
let assets

const getAsset = function (id) {
  return assets.find((a) => a.id === id).file
}

const getExtension = function (mFile) {
  const ary = mFile.split('.')
  return ary[ary.length - 1]
}

Assets.init = function (o) {
  assets = o
  _assets = assetsToLoad.map((o) => {
    const ext = getExtension(o.url)
    const file = getAsset(o.id)

    switch (ext) {
      case 'jpg':
      case 'png':
      case 'gif':
        return {
          id: o.id,
          file
        }
      case 'json':
        return {
          id: o.id,
          file: JSON.parse(file)
        }
      // case 'obj':
      //   const mesh = ObjLoader.parse(file)
      //   return {
      //     id: o.id,
      //     file: mesh,
      //     source: file
      //   }
      //   break
    }
  })

  if (_assets.length > 0) {
    console.debug('ASSETS:')
    console.table(_assets)
  }
}

Assets.get = function (mId) {
  return _assets.find((a) => {
    return a.id === mId
  }).file
}

Assets.getTexture = function (GL, mId) {
  const img = Assets.get(mId)
  return GL.createTexture(img)
}

Assets.getSource = function (mId) {
  return _assets.find((a) => {
    return a.id === mId
  }).source
}

export default Assets
