import Game from "./engine/game.js"
import {View} from "./view.js"
import {Controller} from "./controller.js"
let model = null;
let controller = null; 
let view = null;

$(document).ready(() => {
    model = new Game(4);
    view = new View(model);
    controller = new Controller(model, view);
});