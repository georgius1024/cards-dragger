import { nanoid } from 'nanoid';
import treeUtils from './tree';

export default function withExitNodes(tree) {
  const scene = treeUtils.clone(tree);
  return Object.keys(scene).reduce((map, key) => {
    const node = scene[key];
    map[key] = node;
    if (!['stop-left', 'stop-right', 'stop'].includes(node.type)) {
      if (!node.left) {
        const terminator = {
          id: nanoid(),
          parent: node.id,
          type: 'stop-left'
        };
        node.left = terminator.id;
        map[terminator.id] = terminator;
      }
      if (node.type === 'fork' && !node.right) {
        const terminator = {
          id: nanoid(),
          parent: node.id,
          type: 'stop-right'
        };
        node.right = terminator.id;
        map[terminator.id] = terminator;
      }
    }
    return map;
  }, {});
}
