// addControls.js

import Config from "../Config";
import Settings from "../Settings";
import { saveJson } from "../utils";

export default (mScene) => {
  setTimeout(() => {
    const o = {
      saveSettings: () => {
        saveJson(Config, "animation-settings");
      },
    };

    const { gui } = window;
    const isDevelopment = !!window.isDevelopment;
    console.log("window.isDevelopment", !!window.isDevelopment);

    gui.add(mScene, "play");
    gui.add(mScene, "pause");

    gui.add(o, "saveSettings").name("Save Setting");
    gui.add(Settings, "reset").name("Reset Default");
  }, 500);
};
