// import WebGLAnimation from "../lib/webgl-anim.es.js";
import WebGLAnimation from "./WebGLAnimation";

const LOADED = "loaded";
const isDev = process.env.NODE_ENV === "development";
const keepDebug = false;
let webglAnim;

const initAnim = () => {
  // initialize WebGL animation
  webglAnim = new WebGLAnimation();
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
};

// init settings
if (isDev || keepDebug) {
  console.log("development mode");

  import("./Settings").then(({ default: Settings }) => {
    Settings.init();
    initAnim();

    import("./debug");
    import("./utils/addControl").then(({ default: addControl }) => {
      addControl(webglAnim);
    });
  });
} else {
  initAnim();
}
