import EventEmitter from "eventemitter3";

import {
  GL,
  CameraPerspective,
  OrbitalControl,
  DrawAxis,
  DrawDotsPlane,
} from "alfrid";
import Scheduler from "scheduling";
import preload from "./utils/preload";
import { logError, RAD } from "./utils";

const LOADED = "loaded";

class WebGLAnimation extends EventEmitter {
  constructor() {
    super();
    this.canvas = document.createElement("canvas");
    GL.init(this.canvas, { alpha: true, preserveDrawingBuffer: true });

    // states
    this._isPlaying = false;

    // enterframe
    this._efIndex = Scheduler.addEF(() => this._loop());

    // load assets
    preload().then(() => this._onAssetsLoaded(), logError);
  }

  _onAssetsLoaded() {
    console.log("Assets loaded");

    this._initWorld();
    this.emit(LOADED);
  }

  _initWorld() {
    this._camera = new CameraPerspective();
    this._camera.setPerspective(70 * RAD, GL.aspectRatio, 0.1, 50);
    this._orbitalControl = new OrbitalControl(this._camera, window, 5);
    this._orbitalControl.rx.value = this._orbitalControl.ry.value = 0.3;

    // debug views
    this._dAxis = new DrawAxis();
    this._dDots = new DrawDotsPlane();

    this._isPlaying = true;
  }

  play() {
    this._isPlaying = true;
  }

  pause() {
    this._isPlaying = false;
  }

  _loop() {
    if (!this._isPlaying) {
      return;
    }

    this._update();

    this._render();
  }

  _update() {}

  _render() {
    // setup view port
    GL.viewport(0, 0, GL.width, GL.height);
    GL.clear(0, 0, 0, 1);
    GL.setMatrices(this._camera);

    this._dAxis.draw();
    this._dDots.draw();
  }

  resize(mWidth, mHeight) {
    GL.setSize(mWidth, mHeight);
    if (this._camera) {
      this._camera.setPerspective(70 * RAD, GL.aspectRatio, 0.1, 50);
    }
  }

  destroy() {
    Scheduler.removeEF(this._efIndex);
  }
}

export default WebGLAnimation;
