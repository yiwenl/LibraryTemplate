// import WebGLAnimation from "../lib/webgl-anim.es.js";
import WebGLAnimation from "./WebGLAnimation";
import Settings from "./Settings";
import "./debug";
import addControl from "./utils/addControl";

const LOADED = "loaded";

// init settings
Settings.init();

// initialize WebGL animation
const webglAnim = new WebGLAnimation();
document.body.appendChild(webglAnim.canvas);

// event handling
webglAnim.on(LOADED, () => {
  console.log("WebGL Ready");
});

// resizing
const resize = () => {
  const { innerWidth, innerHeight } = window;
  webglAnim.resize(innerWidth, innerHeight);
};

window.addEventListener("resize", resize);
resize();

// debugging
addControl(webglAnim);
