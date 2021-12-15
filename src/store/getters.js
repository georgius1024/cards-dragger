import {
  initialize,
  addState,
  getCurrent,
  undoable,
  redoable,
  undo,
  redo
} from '../utils/history';
import ReingoldTilford from '../utils/ReingoldTilford';

function getScene({ history }) {
  return history ? getCurrent(history) : [];
}

function getRoot(scene) {
  return scene.find((e) => !e.parent);
}

function getMap(scene) {
  return scene.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
}

function getTree(scene) {
  const { id } = getRoot(scene);
  return ReingoldTilford(scene, id);
}

export default {
  scene: getScene,
  root: (state) => getRoot(getScene(state)),
  map: (state) => getMap(getScene(state)),
  tree: (state) => getTree(getScene(state))
};
