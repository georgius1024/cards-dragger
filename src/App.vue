<template>
  <Layout>
    <template v-slot:sidebar>
      <Sidebar @delete="delßeteNode"/>
    </template>
    <template v-slot:header>
      <Header @undo="undo" @redo="redo"/>
    </template>
    <Canvas :scene="scene" @update="updateScene"/>
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
import ReingoldTilford from './utils/ReingoldTilford';

const GRID_STEP_X = 100;
const GRID_STEP_Y = 120;
const GRID_OFFSET_X = 100;
const GRID_OFFSET_Y = 100;

export default {
  components: {
    Layout,
    Sidebar,
    Header,
    Canvas
  },
  data() {
    return {
      history: null
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
    hasUnsavedChanges() {
      return this.undoable;
    },
    tree() {
      return ReingoldTilford(this.scene, 101);
    },
    map() {
      return this.scene.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
    },
    nodeSize() {
      return 80;
    },
    sceneOffsetX() {
      return GRID_OFFSET_X;
    },
    sceneOffsetY() {
      return GRID_OFFSET_Y;
    },
    sceneStepX() {
      return GRID_STEP_X;
    },
    sceneStepY() {
      return GRID_STEP_Y;
    },
    nextId() {
      return this.scene.reduce((max, item) => {
        if (max > item.id) {
          return max;
        }
        return item.id + 1;
      }, 101);
    },
    pickerItems() {
      return [];
    },
    initialScene() {
      return [];
    }
  },
  created() {
    this.history = initialize(this.initialScene);
  },
  mounted() {
    try {
      const scene = JSON.parse(localStorage['scene']);
      if (Array.isArray(scene)) {
        this.history = initialize(scene);
      }
    } catch {
      this.history = initialize(this.initialScene);
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
    gridToCanvasX(col) {
      return col * this.sceneStepX + this.sceneOffsetX - this.nodeSize / 2;
    },
    gridToCanvasY(row) {
      return row * this.sceneStepY + this.sceneOffsetY - this.nodeSize / 2;
    },
    connectionPoint(id) {
      const node = this.tree[id];
      if (node) {
        return {
          x: node.x * this.sceneStepX + this.sceneOffsetX,
          y: node.y * this.sceneStepY + this.sceneOffsetY - this.nodeSize / 2
        };
      }
    },
    snapToGrid(x, y) {
      const col = +Math.round((x - GRID_OFFSET_X) / GRID_STEP_X);
      const row = +Math.round((y - GRID_OFFSET_Y) / GRID_STEP_Y);
      return { col, row };
    },
    onDrop(event) {
      const { offsetLeft, offsetTop, scrollLeft, scrollTop } =
        this.$refs.canvas;
      const id = event.dataTransfer.getData('id');
      const coords = {
        x: event.pageX - offsetLeft + scrollLeft,
        y: event.pageY - offsetTop + scrollTop
      };
      const { row, col } = this.snapToGrid(coords.x, coords.y);
      const parent = Object.values(this.tree).find((item) => {
        return item.x === col && item.y === row;
      });
      if (!parent) {
        return;
      }
      const pickerItem = this.pickerItems.find((e) => e.id === id);
      if (pickerItem) {
        return this.placeNewNode(parent, pickerItem);
      }
      const sceneItem = this.scene.find((e) => e.id === +id);
      if (sceneItem) {
        return this.moveNode(parent, sceneItem);
      }
    },
    onDelete(event) {
      const id = +event.dataTransfer.getData('id');
      const parent = this.scene.find((e) => e.left === id || e.right === id);
      if (!parent) {
        // Error - root deletion
        const node = this.scene.find((e) => e.id);
        this.reject(node.id);
        return;
      }
      if (parent.left === id) {
        this.deleteSubtree(parent, true);
      }
      if (parent.right === id) {
        this.deleteSubtree(parent, false);
      }
    },
    placeNewNode(parent, pickerItem) {
      const parentId = parent.id;
      if (parent.left && parent.right) {
        // Error - parent is full
        this.reject(parent.id);
        return false;
      }
      const node = {
        ...pickerItem,
        id: this.nextId,
        parent: parentId
      };
      if (parent.left) {
        parent.right = node.id;
      } else {
        parent.left = node.id;
      }
      const scene = [
        ...this.scene.map((e) => (e.id === parentId ? parent : e)),
        node
      ];
      this.updateScene(scene);
    },
    hasAsParent(node, parent) {
      if (node.parent === parent.id) {
        return true;
      }
      const currentParent = this.map[node.parent];
      return currentParent && this.hasAsParent(currentParent, parent);
    },
    moveNode(parent, node) {
      if (parent.left && parent.right) {
        // Error - parent full
        this.reject(parent.id);
        return;
      }
      if (parent.id === node.id) {
        // Error - can not be child for himself
        this.reject(parent.id);
        return;
      }
      if (parent.id === node.parent) {
        // Error - closest parent can not be target
        this.reject(parent.id);
        return;
      }
      if (this.hasAsParent(parent, node)) {
        // Error - can not be parent for himself
        this.reject(parent.id);
        return;
      }
      const scene = this.scene.map((e) => {
        if (e.id === node.id) {
          return { ...e, parent: parent.id };
        } else if (e.id === parent.id) {
          if (e.left) {
            return { ...e, right: node.id };
          } else {
            return { ...e, left: node.id };
          }
        } else if (e.id === node.parent) {
          if (e.left === node.id) {
            return { ...e, left: undefined };
          } else {
            return { ...e, right: undefined };
          }
        }
        return e;
      });
      this.updateScene(scene);
    },
    reject(id) {
      this.rejected = id;
      setTimeout(() => {
        this.rejected = null;
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
