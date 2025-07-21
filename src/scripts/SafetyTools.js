import { registerSocket } from "./socket.js";
import { setApi } from "../module.js";
import { SafetyCard } from "./SafetyCard.js";
import { SafetyToolsLayer } from "./SafetyToolsLayer.js";
import API from "./api.js";
import { SafetyCardName } from "./SafetyCardName.js";
import { registerSettings } from "./settings.js";
import CONSTANTS from "./constants.js";
export class SafetyTools {
    constructor() {
        this.onInit = () => {
            registerSettings();
            Hooks.once("socketlib.ready", registerSocket);
            // TODO not enter on socketlib.ready
            registerSocket();
        };
        this.onSetup = () => {
            console.log("Safety Tools | Registering layer v2");
            setApi(API);
            CONFIG.Canvas.layers[CONSTANTS.MODULE_NAME] = {
                group: "interface",
                layerClass: SafetyToolsLayer,
            };
            // console.log("Safety Tools | Registering event listener");
            //   game.socket.on(EVENT_KEY, this.showCardEvent);
            console.log("Safety Tools | Generating cards");
            if (foundry.utils.isNewerVersion(game.version, 13)) {
                this.cards = Object.values(SafetyCardName).reduce((map, cardName) => {
                    map[cardName] = new SafetyCard(ui, cardName, game);
                    return map;
                }, {});
                this.cards["dummytool"] = {
                    name: "dummytool",
                    title: "Active Tool that Does Nothing",
                    icon: "fas fa-wrench",
                    toggle: true,
                    visible: true,
                    onChange: () => console.log("Tool toggled"),
                }
            }
            else {
                this.cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
            }
        };
        // private readonly showCardEvent = (event: SafetyCardEvent) => {
        //   console.log(`Safety Tools | Received ${event.card}`)
        //   const target = <SafetyCard>this.cards.find((card:SafetyCard) => card.name === event.card);
        //   void target?.show();
        // }
        this.onGetSceneControlButtons = (buttons) => {
            console.log("Safety Tools | Adding scene controls");
            const safetyToolController = {
                name: CONSTANTS.MODULE_NAME,
                title: `${CONSTANTS.MODULE_NAME}.Control.Title`,
                activeTool: "",
                visible: true,
                tools: this.cards,
                icon: "fas fa-hard-hat",
                layer: CONSTANTS.MODULE_NAME,
            };

            if (foundry.utils.isNewerVersion(game.version, 13)){
                safetyToolController.activeTool = "dummytool"
                buttons[CONSTANTS.MODULE_NAME] = safetyToolController
            }
            else {
                buttons.push(safetyToolController);
            }
        };
        this.onReady = () => {
            console.log(`Safety Tools | If your friends don't dance,`);
            console.log(`Safety Tools | They're no friends of mine!`);
        };
    }
}
