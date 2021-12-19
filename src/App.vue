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
        @erase="erase"
      />
    </template>
    <Canvas
      :scene="widerScene"
      :rejected="rejected"
      @update="updateScene"
      @dropNode="dropNode"
      @drop="dropOff"
    />
  </Layout>
</template>
<script>
import { nanoid } from 'nanoid';
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
const treeUtils = require('./utils/tree');

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
    widerScene() {
      const scene = treeUtils.clone(this.scene);
      return Object.keys(scene).reduce((map, key) => {
        const node = scene[key];
        map[key] = node;
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
      return ['delay', 'email', 'fork', 'run', 'account', 'headset'].map(
        (type) => ({
          type,
          id: nanoid()
        })
      );
    },
    initialScene() {
      return [
        {
          id: nanoid(),
          parent: null,
          left: null,
          type: 'flash'
        }
      ];
    }
  },
  created() {
    const id1 = nanoid();
    const id2 = nanoid();
    const id3 = nanoid();
    const id4 = nanoid();
    const id5 = nanoid();
    const initial = [
      {
        id: id1,
        type: 'flash',
        left: null
      },
      {
        id: id2,
        parent: id1,
        type: 'email',
        left: true
      },
      {
        id: id3,
        parent: id2,
        type: 'fork',
        fork: true,
        left: true
      },
      {
        id: id4,
        parent: id3,
        type: 'headset',
        left: true
      },
      {
        id: id5,
        parent: id3,
        type: 'account',
        left: false
      }
    ];
    this.history = initialize(treeUtils.load(initial));
  },
  mounted() {
    try {
      this.load();
    } catch (e) {
      console.error(e);
      // this.history = initialize(treeUtils.load(this.initialScene));
      this.erase();
    }
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
      const savedScene = treeUtils.pack(this.scene);
      localStorage['savedScene'] = JSON.stringify(savedScene);
    },
    load() {
      try {
        const savedScene = JSON.parse(localStorage['savedScene']);
        if (Array.isArray(savedScene)) {
          this.history = initialize(treeUtils.load(savedScene));
        }
      } catch (e) {
        console.error(e);
        this.erase();
      }
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
    erase() {
      this.history = initialize(treeUtils.load(this.initialScene));
    },
    dropNode({ from, to, left = null }) {
      const targetNode = this.scene[to];
      if (!targetNode) {
        this.reject(from);
        this.reject(to);
        return;
      }

      const sampleItem = this.samples.find((e) => e.id === from);
      if (sampleItem) {
        return this.attachNewNode(sampleItem, targetNode, left);
      }
      const sceneItem = this.scene[from];
      if (sceneItem) {
        return this.moveNode(sceneItem, targetNode, left);
      }
      return this.reject(from);
    },
    dropOff(event) {
      const from = event.dataTransfer.getData('id');
      this.reject(from);
    },
    attachNewNode(sample, targetNode, left = null) {
      const nodeToInsert = {
        ...sample,
        fork: sample.type === 'fork',
        id: nanoid()
      };
      try {
        const updated = treeUtils.insert(
          this.scene,
          targetNode.id,
          nodeToInsert.id,
          left,
          treeUtils.payload(nodeToInsert)
        );
        this.updateScene(updated);
      } catch (e) {
        console.error(e);
        return this.reject(targetNode.id);
      }
    },
    moveNode(sourceNode, targetNode, left = null) {
      try {
        if (sourceNode.fork) {
          const updated = treeUtils.moveSubtree(
            this.scene,
            targetNode.id,
            sourceNode.id,
            left
          );
          this.updateScene(updated);
        } else {
          const updated = treeUtils.moveNode(
            this.scene,
            targetNode.id,
            sourceNode.id,
            left
          );
          this.updateScene(updated);
        }
      } catch (e) {
        console.error(e);
        this.reject(targetNode.id);
        this.reject(sourceNode.id);
      }
    },
    deleteNode(event) {
      const id = event.dataTransfer.getData('id');
      try {
        const node = this.scene[id];
        if (!node) {
          throw new Error('Not scene item');
        }
        if (node.fork && (node.left || node.right)) {
          throw new Error("Can't remove fork node with children");
        }
        const updated = treeUtils.removeNode(this.scene, id);
        this.updateScene(updated);
      } catch (e) {
        console.error(e);
        this.reject('trash');
        this.reject(id);
        return;
      }
    },
    reject(id) {
      this.rejected[id] = true;
      setTimeout(() => {
        this.rejected[id] = false;
      }, 1000);
    }
  }
};
</script>
