"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var util_1 = require("util");
var isomorphicPath = require("isomorphic-path");
var fs = require("fs");
var lodash_1 = require("lodash");
var main_1 = require("../main");
var imagePath1 = isomorphicPath.resolve('./examples/testMedia/images/Amazon Moon.jpg');
var imagePath2 = isomorphicPath.resolve('./examples/testMedia/images/Ecuador Flower.jpg');
var imageAsset1 = main_1.fsGetAssetItemFromFile(imagePath1);
var imageAsset2 = main_1.fsGetAssetItemFromFile(imagePath2);
function createInteractivePresentation() {
    var store = redux_1.createStore(main_1.bsDmReducer, redux_1.applyMiddleware(redux_thunk_1.default));
    var videoMode = main_1.VideoMode.v1920x1080x60p;
    var player = main_1.PlayerModel.XT1144;
    store.dispatch(main_1.dmNewSign('simplePresentationExample', videoMode, player));
    var position = main_1.bscCreateAbsoluteRect(0, 0, 1920, 1080);
    var action = store.dispatch(main_1.dmAddZone('Zone1', main_1.ZoneType.VideoOrImages, 'vi1', { position: position }));
    var videoZoneContainer = main_1.dmGetZoneMediaStateContainer(action.payload.id);
    try {
        var image1StateId = void 0;
        if (!lodash_1.isNil(imageAsset1)) {
            var addAction = store.dispatch(main_1.dmPlaylistAppendMediaState(videoZoneContainer, imageAsset1));
            image1StateId = addAction.payload.id;
        }
        else {
            throw new Error('Invalid path to image1 file.');
        }
        var image2StateId = void 0;
        if (!lodash_1.isNil(imageAsset2)) {
            var addAction = store.dispatch(main_1.dmPlaylistAppendMediaState(videoZoneContainer, imageAsset2));
            image2StateId = addAction.payload.id;
        }
        else {
            throw new Error('Invalid path to image2 file.');
        }
        var dir = './examples/output';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        var output = JSON.stringify({ bsdm: main_1.dmGetSignState(store.getState()) }, null, 2);
        fs.writeFileSync('./examples/output/simplePresentationExample.bpfx', output);
        console.log(util_1.inspect(store.getState(), { depth: null, colors: true }));
    }
    catch (error) {
        console.log(error.name + ': ' + error.message);
    }
}
createInteractivePresentation();
//# sourceMappingURL=createSimplePresentation.js.map