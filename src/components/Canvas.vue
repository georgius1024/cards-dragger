<template>
  <div
    class="canvas-outer"
    ref="scroller"
    :class="{ dragging: Boolean(dragging) }"
    @mousedown="mouseStartScroll"
    @mouseover="mouseStartScroll"
    @mouseup="mouseStopScroll"
    @mouseout="mouseStopScroll"
    @mousemove="mouseScroll"
    @wheel="mouseZoom"
    @click.stop="nodeClick(null)"
  >
    <div
      class="canvas-inner"
      :style="canvasStyle"
      ref="canvas"
      @dragover.prevent
      @dragenter.prevent
    >
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
        :text="item.text"
        :leftConnection="connectionPoint(item.left)"
        :rightConnection="connectionPoint(item.right)"
        @dropOn="$emit('dropOn', $event)"
        @click="nodeClick(item.id)"
        @delete="$emit('delete', item.id)"
        @addThere="addThere"
      />
    </div>
    <ZoomControl
      :zoomableIn="zoomableIn"
      :zoomableOut="zoomableOut"
      @zoom="$emit($event)"
    />
  </div>
</template>
<script>
import ReingoldTilford from '../utils/ReingoldTilford';
import BaseNode from './BaseNode.vue';
import ForkNode from './ForkNode.vue';
import TerminatorNode from './TerminatorNode.vue';
import ZoomControl from './ZoomControl.vue';
const GRID_STEP_X = 320;
const GRID_STEP_Y = 180;
const NODE_WIDTH = 300;
const NODE_HEIGHT = 100;
export default {
  components: {
    BaseNode,
    ForkNode,
    TerminatorNode,
    ZoomControl
  },
  props: {
    scene: {
      type: Object,
      required: true
    },
    rejected: {
      type: Object,
      required: true
    },
    zoom: {
      type: Number,
      default: 1
    },
    zoomableIn: {
      type: Boolean
    },
    zoomableOut: {
      type: Boolean
    }
  },
  data() {
    return {
      dragging: null
    };
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
    sceneStepX() {
      return GRID_STEP_X;
    },
    sceneStepY() {
      return GRID_STEP_Y;
    },
    sceneMaxWidth() {
      const maxX = Object.values(this.tree).reduce((maxX, node) => {
        if (node.x > maxX) {
          return node.x;
        }
        return maxX;
      }, -Infinity);
      return this.gridToCanvasX(maxX + 1);
    },
    sceneMaxHeight() {
      const maxY = Object.values(this.tree).reduce((maxY, node) => {
        if (node.y > maxY) {
          return node.y;
        }
        return maxY;
      }, -Infinity);
      return this.gridToCanvasY(maxY + 1);
    },
    canvasStyle() {
      return {
        minWidth: `${this.sceneMaxWidth * this.zoom}px`,
        minHeight: `${this.sceneMaxHeight * this.zoom}px`,
        transform: `scale(${this.zoom})`
      };
    }
  },
  watch: {
    zoom(newZoom, oldZoom) {
      if (newZoom !== oldZoom) {
        const { width, height } = this.$refs.scroller.getBoundingClientRect();
        const { scrollLeft, scrollTop } = this.$refs.scroller;
        const scaling = newZoom / oldZoom;
        const centerX = scrollLeft + width / 2;
        const centerY = scrollTop + height / 2;
        const newCenterX = centerX * scaling;
        const newCenterY = centerY * scaling;
        const newScrollLeft = newCenterX - width / 2;
        const newScrollTop = newCenterY - height / 2;
        this.$refs.scroller.scrollLeft = newScrollLeft;
        this.$refs.scroller.scrollTop = newScrollTop;
      }
    },
    scene(newScene, oldScene) {
      const { id: oldRoot = null } = Object.values(oldScene).find(
        (e) => !e.parent
      );
      const { id: newRoot = null } = Object.values(newScene).find(
        (e) => !e.parent
      );
      if (oldRoot !== newRoot) {
        this.$nextTick(() => {
          const rootNode = this.tree[newRoot];
          const x = this.gridToCanvasX(rootNode.x);
          const { width } = this.$refs.scroller.getBoundingClientRect();
          this.$refs.scroller.scrollTop = 0;
          this.$refs.scroller.scrollLeft =
            (x - width / 2 + this.nodeWidth / 2) * this.zoom;
        });
      }
    }
  },
  methods: {
    gridToCanvasX(col) {
      return col * this.sceneStepX;
    },
    gridToCanvasY(row) {
      return row * this.sceneStepY;
    },
    connectionPoint(id) {
      const node = this.tree[id];
      if (node) {
        return {
          x: node.x * this.sceneStepX + this.nodeWidth / 2,
          y: node.y * this.sceneStepY
        };
      }
    },
    getComponent(node) {
      if (node.type === 'fork') {
        return ForkNode;
      }
      if (['stop', 'stop-left', 'stop-right'].includes(node.type)) {
        return TerminatorNode;
      }
      return BaseNode;
    },
    nodeClick(id) {
      this.$emit('select', id);
    },
    addThere(id, left) {
      this.$emit('addThere', id, left);
    },
    mouseStartScroll(event) {
      if (event.buttons === 1) {
        this.dragging = {
          x: event.pageX,
          y: event.pageY,
          initialScrollLeft: this.$refs.scroller.scrollLeft,
          initialScrollTop: this.$refs.scroller.scrollTop
        };
      }
    },
    mouseStopScroll() {
      this.dragging = null;
    },
    mouseScroll(event) {
      if (this.dragging && event.buttons === 1) {
        const deltaX = this.dragging.x - event.pageX;
        const deltaY = this.dragging.y - event.pageY;
        this.$refs.scroller.scrollLeft =
          this.dragging.initialScrollLeft + deltaX;
        this.$refs.scroller.scrollTop = this.dragging.initialScrollTop + deltaY;
      }
    },
    mouseZoom(event) {
      if (event.ctrlKey) {
        if (event.deltaY < 0) {
          this.$emit('zoomIn');
        }
        if (event.deltaY > 0) {
          this.$emit('zoomOut');
        }
        event.preventDefault();
      }
    }
  }
};
</script>
<style lang="scss">
.canvas-outer {
  background-color: #eee;
  flex-grow: 1;
  display: flex;
  overflow: auto;
  max-width: calc(100vw - 300px);
  max-height: calc(100vh - 64px);
  cursor: default;
  &.dragging {
    cursor: move;
    cursor: dragging;
  }
}
.canvas-inner {
  position: relative;
  margin: 64px;
  transform-origin: top left;
}
</style>
