// WebGLAnimation.js

import alfrid, { GL } from "alfrid";
import assets from "./asset-list";
import Assets from "./Assets";
import Config from "./Config";
import AssetsLoader from "assets-loader";
import Emitter from "events";
import objectAssign from "object-assign";

class WebGLAnimation extends Emitter {
  constructor(mAssetsUrl = "assets/", mConfig = {}) {
    super();

    this._isPlaying = true;
    objectAssign(Config, mConfig);

    this.canvas = document.createElement("canvas");
    GL.init(this.canvas, { preserveDrawingBuffer: !!window.isDevelopment });
    this._loadAssets(mAssetsUrl);
  }

  _loadAssets(assetsPath) {
    const assetsAry = assets.map((oAsset) => {
      oAsset.url = oAsset.url.replace("assets/", assetsPath);
      return oAsset;
    });

    if (assetsAry.length === 0) {
      setTimeout(() => {
        this._onAssetsLoaded();
      }, 1000 / 60);
    }

    const loader = new AssetsLoader({
      assets: assetsAry,
    })
      .on("error", (error) => {
        console.log("Error :", error);
      })
      .on("progress", (p) => {
        this.emit("onProgress", { percent: p });
      })
      .on("complete", (o) => this._onAssetsLoaded(o))
      .start();
  }

  _onAssetsLoaded(o) {
    console.log("assets loaded");
    Assets.init(o);
    this._initScenes();

    alfrid.Scheduler.addEF(() => this.render());

    this.emit("onLoaded");
  }

  play() {
    this._isPlaying = true;
  }

  pause() {
    this._isPlaying = false;
  }

  _initScenes() {
    // camera
    const RAD = Math.PI / 180;
    this.camera = new alfrid.CameraPerspective();
    this.camera.setPerspective(90 * RAD, GL.aspectRatio, 0.1, 100);
    this.orbitalControl = new alfrid.OrbitalControl(this.camera, window, 5);
    this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;

    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
  }

  render() {
    if (!this._isPlaying) {
      return;
    }

    GL.viewport(0, 0, GL.width, GL.height);
    GL.clear(0, 0, 0, 1);

    GL.setMatrices(this.camera);
    this._bAxis.draw();
    this._bDots.draw();
  }

  resize(w, h) {
    GL.setSize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default WebGLAnimation;
