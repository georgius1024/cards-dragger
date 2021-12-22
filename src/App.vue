<template>
  <Layout>
    <template v-slot:sidebar>
      <Sidebar
        :nodes="availableTypes"
        :rejected="rejected"
        :selected="selectedNode"
        @delete="deleteNode"
        @add="addNode"
        @update="updateNode"
        @unselect="selectedNode = null"
      />
    </template>
    <template v-slot:header>
      <Header
        :undoable="undoable"
        :redoable="redoable"
        :samples="samples"
        :status="savingStatus"
        @undo="undo"
        @redo="redo"
        @erase="erase"
        @select="loadSample"
      />
    </template>
    <Canvas
      :scene="widerScene"
      :rejected="rejected"
      :zoom="zoom"
      :zoomableIn="zoomableIn"
      :zoomableOut="zoomableOut"
      @update="updateScene"
      @dropNode="dropNode"
      @drop="dropOff"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      @select="selectNode"
    />
  </Layout>
</template>
<script>
import debounce from 'lodash.debounce';
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
import treeUtils from './utils/tree';
import defaultTypeText from './utils/DefaultTypeText';
import samples from './samples';
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
      rejected: {},
      zoom: 1,
      selectedNode: null,
      savingStatus: ''
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
    zoomableIn() {
      return this.zoom < 1;
    },
    zoomableOut() {
      return this.zoom > 0.3;
    },
    hasUnsavedChanges() {
      return this.undoable;
    },
    availableTypes() {
      return ['delay', 'email', 'fork'].map((type) => ({
        type,
        id: nanoid()
      }));
    },
    samples() {
      return samples.map(({ id, name }) => ({ id, name }));
    },
    initialScene() {
      return [
        {
          id: nanoid(),
          parent: null,
          left: null,
          type: 'flash',
          text: defaultTypeText('flash')
        }
      ];
    },
    root() {
      return Object.values(this.scene).find((e) => !e.parent);
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
        type: 'delay',
        left: true
      },
      {
        id: id5,
        parent: id3,
        type: 'email',
        left: false
      }
    ];
    this.history = initialize(
      treeUtils.load(
        initial.map((e) => ({ ...e, text: defaultTypeText(e.type) }))
      )
    );
    this.backgroundSaver = debounce(() => this.save(), 1000);
  },
  mounted() {
    try {
      this.load();
    } catch (e) {
      console.error(e);
      this.erase();
    }
    this.savingStatus = 'Saved';
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
    this.backgroundSaver.cancel();
  },
  methods: {
    save() {
      const savedScene = treeUtils.pack(this.scene);
      localStorage['savedScene'] = JSON.stringify(savedScene);
      this.savingStatus = 'autosaved';
    },
    load() {
      try {
        const savedScene = JSON.parse(localStorage['savedScene'] || '0');
        if (Array.isArray(savedScene)) {
          this.history = initialize(treeUtils.load(savedScene));
        }
      } catch (e) {
        console.error(e);
        this.erase();
      }
    },
    loadSample(id) {
      try {
        const sample = samples.find((e) => e.id === id);
        const newScene = treeUtils.load(sample.data);
        this.history = initialize(newScene);
      } catch (e) {
        console.error(e);
        this.erase();
      }
    },
    updateScene(scene) {
      const current = this.scene;
      const problem = Object.values(scene).find(
        (e) => !treeUtils.isInTree(scene, e.id, this.root.id)
      );
      if (problem) {
        console.dir({
          problem,
          current,
          scene
        });
        alert('Health check failed.');
        throw new Error(`Health check failed. Check node "${problem.id}"`);
      }
      this.history = addState(this.history, scene);
      this.savingStatus = '';
      this.backgroundSaver();
    },
    undo() {
      this.history = undo(this.history);
      this.savingStatus = '';
      this.backgroundSaver();
    },
    redo() {
      this.history = redo(this.history);
      this.savingStatus = '';
      this.backgroundSaver();
    },
    erase() {
      this.history = initialize(treeUtils.load(this.initialScene));
    },
    zoomIn() {
      this.zoom = Math.min(this.zoom + 0.1, 1);
    },
    zoomOut() {
      this.zoom = Math.max(this.zoom - 0.1, 0.3);
    },
    dropNode({ from, to, left = null }) {
      const targetNode = this.scene[to];
      if (!targetNode) {
        this.reject(from);
        this.reject(to);
        return;
      }

      const pickerItem = this.availableTypes.find((e) => e.id === from);
      if (pickerItem) {
        return this.attachNewNode(pickerItem, targetNode, left);
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
    addNode(id, left) {
      const pickerItem = this.availableTypes.find((e) => e.id === id);
      if (pickerItem) {
        this.attachNewNode(pickerItem, this.selectedNode, left);
        this.selectedNode = null;
      }
    },
    updateNode(id, node) {
      const updated = treeUtils.clone(this.scene);
      updated[id] = node;
      this.updateScene(updated);
    },
    attachNewNode(picked, targetNode, left = null) {
      const nodeToInsert = {
        ...picked,
        fork: picked.type === 'fork',
        text: defaultTypeText(picked.type),
        id: nanoid()
      };
      try {
        if (nodeToInsert.fork) {
          // only attach to open connections
          if (targetNode.fork) {
            // check both connectons
            if (left && targetNode.left) {
              throw new Error('Can attach new fork only to leaf node');
            }
            if (!left && targetNode.right) {
              throw new Error('Can attach new fork only to leaf node');
            }
          } else {
            // check left connection
            if (targetNode.left) {
              throw new Error('Can attach new fork only to leaf node');
            }
          }
        }
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
        this.reject(picked.id);
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
    deleteNode(id) {
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
        this.selectedNode = null;
      } catch (e) {
        console.error(e);
        this.reject('trash');
        this.reject(id);
        return;
      }
    },
    selectNode(id) {
      this.selectedNode = this.scene[id];
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
