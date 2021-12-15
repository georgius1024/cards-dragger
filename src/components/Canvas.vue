<template>
  <main class="canvas" ref="canvas">
    <ActionCard
      v-for="item in tree"
      :id="item.id"
      :x="gridToCanvasX(item.x)"
      :y="gridToCanvasY(item.y)"
      :absolute="true"
      :width="nodeWidth"
      :height="nodeHeight"
      :type="item.type"
      :key="item.id"
      :leftConnection="connectionPoint(item.left)"
      :rightConnection="connectionPoint(item.right)"
      @drag="dragging = $event"
    />
  </main>
</template>
<script>
import ReingoldTilford from '../utils/ReingoldTilford';
import ActionCard from './ActionCard.vue';
const GRID_STEP_X = 140;
const GRID_STEP_Y = 120;
const GRID_OFFSET_X = 100;
const GRID_OFFSET_Y = 100;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 60;
export default {
  components: {
    ActionCard
  },
  props: {
    scene: {
      type: Array,
      required: true
    }
  },
  computed: {
    root() {
      return this.scene.find((e) => !e.parent);
    },
    tree() {
      return ReingoldTilford(this.scene, this.root.id);
    },
    map() {
      return this.scene.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
    },
    nodeWidth() {
      return NODE_WIDTH;
    },
    nodeHeight() {
      return NODE_HEIGHT;
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
    }
  },
  methods: {
    updateScene(scene) {
      this.$emit(scene);
    },
    gridToCanvasX(col) {
      return col * this.sceneStepX + this.sceneOffsetX - this.nodeWidth / 2;
    },
    gridToCanvasY(row) {
      return row * this.sceneStepY + this.sceneOffsetY - this.nodeHeight / 2;
    },
    connectionPoint(id) {
      const node = this.tree[id];
      if (node) {
        return {
          x: node.x * this.sceneStepX + this.sceneOffsetX,
          y: node.y * this.sceneStepY + this.sceneOffsetY - this.nodeHeight / 2
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
<style lang="scss">
.canvas {
  background-color: #eee;
  flex-grow: 1;
  position: relative;
}
</style>
