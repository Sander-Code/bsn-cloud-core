import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {inspect} from 'util';
import * as isomorphicPath from 'isomorphic-path';
import * as fs from 'fs';
import {isNil} from 'lodash';

import {
  bscCreateAbsoluteRect,
  bsDmReducer,
  dmAddZone,
  dmGetSignState,
  dmGetZoneMediaStateContainer,
  dmNewSign,
  dmPlaylistAppendMediaState,
  fsGetAssetItemFromFile, PlayerModel, VideoMode,
  ZoneType,
} from '../main';

// Substitute other file paths for tests if desired
const imagePath1 = isomorphicPath.resolve('./examples/testMedia/images/Amazon Moon.jpg');
const imagePath2 = isomorphicPath.resolve('./examples/testMedia/images/Ecuador Flower.jpg');

const imageAsset1 = fsGetAssetItemFromFile(imagePath1);
const imageAsset2 = fsGetAssetItemFromFile(imagePath2);

function createInteractivePresentation() {
  const store = createStore(bsDmReducer, applyMiddleware(thunk));
  const videoMode = VideoMode.v1920x1080x60p;
  const player = PlayerModel.XT1144;
  store.dispatch(dmNewSign('simplePresentationExample', videoMode, player));

  // Video/Images zone
  const position = bscCreateAbsoluteRect(0, 0, 1920, 1080);
  const action = store.dispatch(dmAddZone('Zone1', ZoneType.VideoOrImages, 'vi1', {position}));
  const videoZoneContainer = dmGetZoneMediaStateContainer(action.payload.id);

  try {
    let image1StateId;
    if (!isNil(imageAsset1)) {
      const addAction = store.dispatch(dmPlaylistAppendMediaState(videoZoneContainer, imageAsset1));
      image1StateId = addAction.payload.id;
    } else {
      throw new Error('Invalid path to image1 file.');
    }
    let image2StateId;
    if (!isNil(imageAsset2)) {
      const addAction = store.dispatch(dmPlaylistAppendMediaState(videoZoneContainer, imageAsset2));
      image2StateId = addAction.payload.id;
    } else {
      throw new Error('Invalid path to image2 file.');
    }

    // Make sure we have an output subdirectory
    const dir = './examples/output';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const output = JSON.stringify({bsdm: dmGetSignState(store.getState())}, null, 2);
    // Write the file
    fs.writeFileSync('./examples/output/simplePresentationExample.bpfx', output);
    console.log(inspect(store.getState(), {depth: null, colors: true}));
  } catch (error) {
    console.log(error.name + ': ' + error.message);
  }
}

createInteractivePresentation();
