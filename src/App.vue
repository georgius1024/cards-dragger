<template>
  <Layout>
    <template v-slot:sidebar>
      <Sidebar
        :nodes="availableTypes"
        :rejected="rejected"
        @delete="deleteNode"
      />
      <AddThereModal
        :nodes="availableTypes"
        :node="addThere.node"
        :left="addThere.left"
        v-model="addThere.show"
        @selected="selectedAddThere"
      />
      <ViewNodeModal
        :node="viewNode.node"
        v-model="viewNode.show"
        @update="updateNode"
        @delete="deleteNode"
      />
      <DeleteTreeMethodPicker
        :node="selectDeleteMethod.node"
        @selected="selectedDeleteMethod"
        v-model="selectDeleteMethod.show"
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
      :scene="scene"
      :rejected="rejected"
      :zoom="zoom"
      :zoomableIn="zoomableIn"
      :zoomableOut="zoomableOut"
      @update="updateScene"
      @dropOn="dropOn"
      @drop="dropOff"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      @select="initializeViewNode"
      @addThere="initializeAddThere"
      @delete="deleteNode"
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
  replaceState,
  undoable,
  redoable,
  undo,
  redo
} from './utils/history';
import treeUtils from './utils/tree';
import withExitNodes from './utils/WithExitNodes';
import defaultTypeText from './utils/DefaultTypeText';
import samples from './samples';
import AddThereModal from './components/AddThereModal.vue';
import ViewNodeModal from './components/ViewNodeModal.vue';
import DeleteTreeMethodPicker from './components/DeleteTreeMethodPicker.vue';
export default {
  components: {
    Layout,
    Sidebar,
    Header,
    Canvas,
    AddThereModal,
    ViewNodeModal,
    DeleteTreeMethodPicker
  },
  data() {
    return {
      history: null,
      rejected: {},
      zoom: 1,
      selectedNode: null,
      savingStatus: '',
      addThere: {
        show: false,
        node: {},
        left: null
      },
      viewNode: {
        show: false,
        node: {}
      },
      selectDeleteMethod: {
        show: false,
        node: {}
      }
    };
  },
  computed: {
    scene() {
      return this.history ? getCurrent(this.history) : [];
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
      withExitNodes(
        treeUtils.load(
          initial.map((e) => ({ ...e, text: defaultTypeText(e.type) }))
        )
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
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedScene = treeUtils.pack(this.scene);
          localStorage['savedScene'] = JSON.stringify(savedScene);
          this.savingStatus = 'autosaved';
          let counter = 1000;
          const translations = Object.keys(this.scene).reduce((map, item) => {
            return { ...map, [item]: counter++ };
          }, {});
          const updated = treeUtils.translateKeys(this.scene, translations);
          this.history = replaceState(this.history, updated);
          resolve();
        }, 10);
      });
    },
    load() {
      try {
        const savedScene = JSON.parse(localStorage['savedScene'] || '0');
        if (Array.isArray(savedScene)) {
          this.history = initialize(withExitNodes(treeUtils.load(savedScene)));
        }
      } catch (e) {
        console.error(e);
        this.erase();
      }
    },
    loadSample(id) {
      try {
        const sample = samples.find((e) => e.id === id);
        const newScene = withExitNodes(treeUtils.load(sample.data));
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
      this.history = initialize(
        withExitNodes(treeUtils.load(this.initialScene))
      );
    },
    zoomIn() {
      this.zoom = Math.min(this.zoom + 0.1, 1);
    },
    zoomOut() {
      this.zoom = Math.max(this.zoom - 0.1, 0.3);
    },
    dropOn({ from, to, left = null }) {
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
    initializeViewNode(id) {
      if (id && id !== this.viewNode.node?.id) {
        this.viewNode.node = this.scene[id];
        this.addThere.show = false;
        if (this.viewNode.show) {
          this.viewNode.show = false;
          setTimeout(() => (this.viewNode.show = true), 400);
        } else {
          this.viewNode.show = true;
        }
      } else {
        this.viewNode.node = {};
        this.viewNode.show = false;
      }
    },
    initializeDeleteTree(id) {
      this.selectDeleteMethod.node = this.scene[id];
      this.selectDeleteMethod.show = true;
      this.addThere.show = false;
      this.addThere.node = {};
      this.viewNode.show = false;
      this.viewNode.node = {};
    },
    initializeAddThere(id, left) {
      if (id && (id !== this.addThere.node.id || left !== this.addThere.left)) {
        this.addThere.node = this.scene[id];
        this.addThere.left = left;
        this.viewNode.show = true;
        if (this.addThere.show) {
          this.addThere.show = false;
          setTimeout(() => (this.addThere.show = true), 400);
        } else {
          this.addThere.show = true;
        }
      } else {
        this.addThere.node = {};
        this.addThere.show = false;
      }
      this.viewNode.show = false;
    },
    selectedAddThere(id) {
      const pickerItem = this.availableTypes.find((e) => e.id === id);
      if (pickerItem) {
        this.attachNewNode(pickerItem, this.addThere.node, this.addThere.left);
        this.selectedNode = null;
      }
      this.addThere.show = false;
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
        const updated = treeUtils.insert(
          this.scene,
          targetNode.id,
          nodeToInsert.id,
          left,
          treeUtils.payload(nodeToInsert)
        );
        this.updateScene(withExitNodes(updated));
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
          return this.initializeDeleteTree(id);
          //throw new Error("Can't remove fork node with children");
        }
        const updated = treeUtils.removeNode(this.scene, id);
        this.updateScene(updated);
        this.viewNode.show = false;
      } catch (e) {
        console.error(e);
        this.reject('trash');
        this.reject(id);
        return;
      }
    },
    selectedDeleteMethod(method) {
      const { id } = this.selectDeleteMethod.node;
      try {
        if (DeleteTreeMethodPicker === 'both') {
          const updated = treeUtils.removeNode(this.scene, id);
          this.updateScene(updated);
        } else {
          const keepLeft = method === 'right';
          const updated = treeUtils.removeNode(this.scene, id, keepLeft);
          this.updateScene(updated);
        }
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
