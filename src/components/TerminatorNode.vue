<template>
  <div
    class="generic-node end-node"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="nodeStyle"
  >
    <div
      class="dropzone"
      @drop.stop="drop"
      @dragend="dragEnd"
      @dragover.prevent
      @dragenter.prevent="dragenter"
      @dragleave.prevent="dragleave"
    />
    <img :src="plus" class="icon" />
  </div>
</template>
<script>
import BaseNode from './BaseNode.vue';
import plus from '../assets/icons/plus.svg';

export default {
  extends: BaseNode,
  computed: {
    plus() {
      return plus;
    },
    size() {
      return this.height / 2;
    },
    nodeStyle() {
      if (this.absolute) {
        return {
          position: 'absolute',
          left: `${this.x + (this.width - this.size) / 2}px`,
          top: `${this.y}px`,
          width: `${this.size}px`,
          height: `${this.size}px`
        };
      }
    }
  },
  methods: {
    drop(event) {
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.parent;
      const left = ['stop-left', 'stop'].includes(this.type);
      this.$emit('dropOn', { from, to, left });
    }
  }
};
</script>
<style lang="scss" scoped>
.end-node {
  border-radius: 100%;
  padding: 4px;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  &.drag-over {
    transform: scale(1.5);
    opacity: 0.5;
  }
  .dropzone {
    position: absolute;
    inset: -50px;
    transition: all 200ms ease;
    pointer-events: auto;
  }
}
</style>
