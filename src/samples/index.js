import { nanoid } from 'nanoid';
import tree1 from './tree1.json';
import tree2 from './tree2.json';
import tree3 from './tree3.json';
import tree4 from './tree4.json';
import tree5 from './tree5.json';
import defaultTypeText from '../utils/DefaultTypeText';
function withDesc(tree) {
  return tree.map((e) => {
    if (e.text) {
      return e;
    }
    return { ...e, text: defaultTypeText(e.type) };
  });
}
export default [
  {
    id: nanoid(),
    name: 'Welcome series',
    data: withDesc(tree1)
  },
  {
    id: nanoid(),
    name: 'Post-purchase series',
    data: withDesc(tree2)
  },
  {
    id: nanoid(),
    name: 'Retention series',
    data: withDesc(tree3)
  },
  {
    id: nanoid(),
    name: 'Winback series',
    data: withDesc(tree4)
  },
  {
    id: nanoid(),
    name: 'Abandoned series',
    data: withDesc(tree5)
  }
];
