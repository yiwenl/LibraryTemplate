import "../scss/global.scss";
import "./utils/Capture";

// import WebGLAnimation from "../../lib/gl.js";
import WebGLAnimation from "./WebGLAnimation";
import Settings from "./Settings";
import addControls from "./debug/addControls";

let webglAnim;

function _init() {
  webglAnim = new WebGLAnimation("assets/", { test: 5 });
  Settings.init();

  webglAnim.on("onProgress", onProgress);
  webglAnim.on("onLoaded", onLoaded);
}

function onProgress(p) {
  console.log("progress:", p);
}

function onLoaded() {
  addControls(webglAnim);
  window.addEventListener("resize", resize);
  webglAnim.canvas.className = "Main-Canvas";
  document.body.appendChild(webglAnim.canvas);

  resize();
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  webglAnim.resize(w, h);
}

if (document.body) {
  _init();
} else {
  window.addEventListener("DOMContentLoaded", _init);
}
