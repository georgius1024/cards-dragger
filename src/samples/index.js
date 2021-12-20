import { nanoid } from 'nanoid';
import tree1 from './tree1.json';
import tree2 from './tree2.json';
import tree3 from './tree3.json';
import tree4 from './tree4.json';
import tree5 from './tree5.json';

export default [
  {
    id: nanoid(),
    name: 'Welcome series',
    data: tree1
  },
  {
    id: nanoid(),
    name: 'Post-purchase series',
    data: tree2
  },
  {
    id: nanoid(),
    name: 'Retention series',
    data: tree3
  },
  {
    id: nanoid(),
    name: 'Winback series',
    data: tree4
  },
  {
    id: nanoid(),
    name: 'Abandoned series',
    data: tree5
  }
];
