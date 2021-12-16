<template>
  <Layout>
    <template v-slot:sidebar>
      <Sidebar :samples="samples" :rejected="rejected" @delete="deleteNode" />
    </template>
    <template v-slot:header>
      <Header
        :undoable="undoable"
        :redoable="redoable"
        @undo="undo"
        @redo="redo"
      />
    </template>
    <Canvas
      :scene="scene"
      :rejected="rejected"
      @update="updateScene"
      @dropNode="dropNode"
    />
  </Layout>
</template>
<script>
import { nanoid } from 'nanoid';
import initialState from './initialState.json';
import Layout from './components/Layout.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import Canvas from './components/Canvas.vue';
import {
  initialize,
  addState,
  getCurrent,
  undoable,
  redoable,
  undo,
  redo
} from './utils/history';

export default {
  components: {
    Layout,
    Sidebar,
    Header,
    Canvas
  },
  data() {
    return {
      history: null,
      rejected: {}
    };
  },
  computed: {
    scene() {
      return this.history ? getCurrent(this.history) : [];
    },
    map() {
      return this.scene.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
    },
    undoable() {
      return Boolean(this.history && undoable(this.history));
    },
    redoable() {
      return Boolean(this.history && redoable(this.history));
    },
    hasUnsavedChanges() {
      return this.undoable;
    },
    samples() {
      return [
        'delay',
        'email',
        'fork',
        'flash',
        'run',
        'account',
        'headset'
      ].map((type) => ({
        type,
        id: nanoid()
      }));
    },
    initialScene() {
      return initialState;
      // const id1 = nanoid();
      // const id2 = nanoid();
      // const id3 = nanoid();
      // const id4 = nanoid();
      // const id5 = nanoid();
      // return [
      //   {
      //     id: 'flash',
      //     type: 'flash',
      //     left: 'delay'
      //   },
      //   {
      //     id: 'delay',
      //     type: 'delay',
      //     parent: 'flash',
      //     left: 'email'
      //   },
      //   {
      //     id: 'email',
      //     type: 'email',
      //     parent: 'delay',
      //     left: 'account'
      //   },
      //   {
      //     id: 'account',
      //     parent: 'email',
      //     type: 'account'
      //   }

      //   // {
      //   //   id: id1,
      //   //   type: 'flash',
      //   //   left: id2
      //   // },
      //   // {
      //   //   id: id2,
      //   //   parent: id1,
      //   //   type: 'email',
      //   //   left: id3
      //   // },
      //   // {
      //   //   id: id3,
      //   //   parent: id2,
      //   //   type: 'fork',
      //   //   left: id4,
      //   //   right: id5
      //   // },
      //   // {
      //   //   id: id4,
      //   //   parent: id3,
      //   //   type: 'delay'
      //   // },
      //   // {
      //   //   id: id5,
      //   //   parent: id3,
      //   //   type: 'delay'
      //   // }
      // ];
    }
  },
  created() {
    this.history = initialize(this.initialScene);
  },
  mounted() {
    // try {
    //   const scene = JSON.parse(localStorage['scene']);
    //   if (Array.isArray(scene)) {
    //     this.history = initialize(scene);
    //   }
    // } catch {
    //   this.history = initialize(this.initialScene);
    // }
    this.keyHandler = (e) => {
      const undoPressed =
        (e.code === 'KeyZ' && e.ctrlKey) ||
        (e.code === 'Backspace' && e.ctrlKey);
      const redoPressed = e.code === 'KeyY' && e.ctrlKey;
      if (undoPressed && this.undoable) {
        this.undo();
        e.stopPropagation();
      }
      if (redoPressed && this.redoable) {
        this.redo();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyHandler);
  },
  methods: {
    save() {
      localStorage['scene'] = JSON.stringify(this.scene);
    },
    updateScene(scene) {
      this.history = addState(this.history, scene);
      this.save();
    },
    undo() {
      this.history = undo(this.history);
      this.save();
    },
    redo() {
      this.history = redo(this.history);
      this.save();
    },
    clear() {
      this.history = initialize(this.initialScene);
    },
    dropNode({ from, to }) {
      if (!to || !from) {
        this.reject(from);
        this.reject(to);
        return;
      }
      const sampleItem = this.samples.find((e) => e.id === from);
      if (sampleItem) {
        return this.attachNewNode(from, to);
      }
      const sceneItem = this.scene.find((e) => e.id === from);
      if (sceneItem) {
        return this.moveNode(from, to);
      }

      // const { offsetLeft, offsetTop, scrollLeft, scrollTop } =
      //   this.$refs.canvas;
      // const id = event.dataTransfer.getData('id');
      // const coords = {
      //   x: event.pageX - offsetLeft + scrollLeft,
      //   y: event.pageY - offsetTop + scrollTop
      // };
      // const { row, col } = this.snapToGrid(coords.x, coords.y);
      // const parent = Object.values(this.tree).find((item) => {
      //   return item.x === col && item.y === row;
      // });
      // if (!parent) {
      //   return;
      // }
      // const pickerItem = this.pickerItems.find((e) => e.id === id);
      // if (pickerItem) {
      //   return this.placeNewNode(parent, pickerItem);
      // }
      // const sceneItem = this.scene.find((e) => e.id === +id);
      // if (sceneItem) {
      //   return this.moveNode(parent, sceneItem);
      // }
    },
    attachNewNode(from, to) {
      const target = this.map[to];
      if (!target) {
        this.reject(from);
        return;
      }
      const sampleItem = this.samples.find((e) => e.id === from);
      if (!sampleItem) {
        this.reject(to);
        return;
      }
      if (target.type === 'fork') {
        if (!target.left) {
          const nodeToMakeParent = to;
          const nodeToInsert = {
            ...sampleItem,
            parent: to,
            id: nanoid()
          };
          const scene = [
            ...this.scene.map((e) => {
              if (e.id === nodeToMakeParent) {
                return { ...e, left: nodeToInsert.id };
              }
              return e;
            }),
            nodeToInsert
          ];
          this.updateScene(scene);
        } else if (!target.right) {
          const nodeToMakeParent = to;
          const nodeToInsert = {
            ...sampleItem,
            parent: to,
            id: nanoid()
          };
          const scene = [
            ...this.scene.map((e) => {
              if (e.id === nodeToMakeParent) {
                return { ...e, right: nodeToInsert.id };
              }
              return e;
            }),
            nodeToInsert
          ];
          this.updateScene(scene);
        } else {
          this.reject(from);
          this.reject(to);
          return;
        }
      } else {
        // Make child for target
        const nodeToMakeChild = target.left || target.right;
        const nodeToMakeParent = to;
        const nodeToInsert = {
          ...sampleItem,
          parent: to,
          left: nodeToMakeChild ? nodeToMakeChild : null,
          id: nanoid()
        };
        const scene = [
          ...this.scene.map((e) => {
            if (e.id === nodeToMakeParent) {
              return { ...e, left: nodeToInsert.id };
            } else if (e.id === nodeToMakeChild) {
              return { ...e, parent: nodeToInsert.id };
            }
            return e;
          }),
          nodeToInsert
        ];
        this.updateScene(scene);
      }
    },
    hasAsParent(node, parent) {
      if (node.parent === parent.id) {
        return true;
      }
      const currentParent = this.map[node.parent];
      return currentParent && this.hasAsParent(currentParent, parent);
    },
    moveNode(from, to) {
      const source = { ...this.map[from] };
      if (!source) {
        this.reject(to);
        return;
      }
      if (!source.parent) {
        this.reject(from);
        return;
      }

      const target = { ...this.map[to] };
      if (!target) {
        this.reject(from);
        return;
      }
      if (target.type === 'fork' || source.type === 'fork') {
        this.reject(to);
        this.reject(from);
        return;
      }
      const parent = this.map[target.parent];
      if (!parent || parent.type === 'fork') {
        this.reject(to);
        return;
      }
      if (to === from) {
        this.reject(to);
        return;
      }
      if (source.parent === target.id) {
        return this.moveNode(to, from);
      }
      const changedNodes = {};
      changedNodes[source.id] = { ...source };
      changedNodes[target.id] = { ...target };
      changedNodes[source.parent] = { ...this.map[source.parent] };

      if (source.left) {
        changedNodes[source.left] = { ...this.map[source.left] };
      }
      if (target.left) {
        changedNodes[target.left] = { ...this.map[target.left] };
      }

      const sourceParent = changedNodes[source.parent];
      const sourceChild = changedNodes[source.left];
      const targetChild = changedNodes[target.left];
      const sourceNode = changedNodes[source.id];
      const targetNode = changedNodes[target.id];
      sourceParent.left =
        sourceParent.left === source.id ? sourceChild?.id : sourceParent.left;
      sourceParent.right =
        sourceParent.right === source.id ? sourceChild?.id : sourceParent.right;

      if (sourceChild) {
        sourceChild.parent = sourceParent.id;
      }

      if (targetChild) {
        targetChild.parent = source.id;
      }

      targetNode.left = sourceNode.id;
      sourceNode.parent = targetNode.id;
      sourceNode.left = targetChild && targetChild.id;
      console.log(changedNodes);

      const scene = [
        ...this.scene.map((e) => {
          if (changedNodes[e.id]) {
            return changedNodes[e.id];
          }
          return e;
        })
      ];

      console.log(source, target);
      console.dir(JSON.parse(JSON.stringify(scene)));
      this.updateScene(scene);
    },
    deleteNode(event) {
      const id = event.dataTransfer.getData('id');
      const node = this.map[id];
      if (!node) {
        // Error - deleted node deletion
        this.reject('trash');
        return;
      }
      const parent = this.map[node.parent];
      if (!parent) {
        // Error - root deletion
        this.reject(node.id);
        this.reject('trash');
        return;
      }
      if (parent.left === id) {
        this.deleteSubtree(parent, true);
      }
      if (parent.right === id) {
        this.deleteSubtree(parent, false);
      }
    },
    reject(id) {
      this.rejected[id] = true;
      setTimeout(() => {
        this.rejected[id] = false;
      }, 1000);
    },
    deleteSubtree(parent, left) {
      const nodesToDelete = [];
      const startFrom = left ? parent.left : parent.right;
      const walk = (node) => {
        if (node.left) {
          walk(this.map[node.left]);
        }
        if (node.right) {
          walk(this.map[node.right]);
        }
        nodesToDelete.push(node.id);
      };
      walk(this.map[startFrom]);
      const newParent = { ...parent };
      if (left) {
        delete newParent.left;
      } else {
        delete newParent.right;
      }
      const scene = this.scene
        .filter((e) => !nodesToDelete.includes(e.id))
        .map((e) => (e.id === parent.id ? newParent : e));
      this.updateScene(scene);
    }
  }
};
</script>
