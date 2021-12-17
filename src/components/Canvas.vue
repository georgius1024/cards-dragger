<template>
  <main class="canvas" ref="canvas" @dragover.prevent @dragenter.prevent>
    <component
      v-for="item in tree"
      :is="getComponent(item)"
      :key="item.id"
      :parent="item.parent"
      :id="item.id"
      :x="gridToCanvasX(item.x)"
      :y="gridToCanvasY(item.y)"
      :absolute="true"
      :rejected="Boolean(rejected[item.id])"
      :width="nodeWidth"
      :height="nodeHeight"
      :type="item.type"
      :leftConnection="connectionPoint(item.left)"
      :rightConnection="connectionPoint(item.right)"
      @dropOn="$emit('dropNode', $event)"
    />
  </main>
</template>
<script>
import ReingoldTilford from '../utils/ReingoldTilford';
import ActionCard from './ActionCard.vue';
import ForkCard from './ForkCard.vue';
import TerminatorNode from './TerminatorNode.vue';

const GRID_STEP_X = 200;
const GRID_STEP_Y = 120;
const GRID_OFFSET_X = 120;
const GRID_OFFSET_Y = 100;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;
export default {
  components: {
    ActionCard,
    ForkCard,
    TerminatorNode
  },
  props: {
    scene: {
      type: Object,
      required: true
    },
    rejected: {
      type: Object,
      required: true
    }
  },
  computed: {
    root() {
      return Object.values(this.scene).find((e) => !e.parent);
    },
    tree() {
      return ReingoldTilford(this.scene, this.root?.id ?? 0);
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
    getComponent(node) {
      if (node.type === 'fork') {
        return ForkCard;
      }
      if (node.type === 'stop') {
        return TerminatorNode;
      }
      return ActionCard;
    }
  }
};
</script>
<style lang="scss">
.canvas {
  background-color: #eee;
  flex-grow: 1;
  position: relative;
  overflow: auto;
}
</style>
