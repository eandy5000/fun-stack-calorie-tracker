import "tachyons/css/tachyons.css";
import model from "./Model";
import view from "./View";
import update from "./Update";
import App from "./App";

(() => {
  const target = document.getElementById("target");
  App(model, update, view, target);
})();
