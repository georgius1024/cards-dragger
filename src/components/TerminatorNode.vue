<template>
  <div class="generic-node end-node" :style="terminatorStyle">END</div>
</template>
<script>
import BaseNode from './BaseNode.vue';

export default {
  extends: BaseNode,
  computed: {
    size() {
      return this.height / 2;
    },
    terminatorStyle() {
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
    transform: scale(1);
    opacity: 1;
  }
}
</style>
