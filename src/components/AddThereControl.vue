<template>
  <div
    class="generic-node add-there-control"
    :class="{ 'drag-over': dragOver }"
    :style="controlStyle"
    @click.stop="$emit('click', $event)"
    @mousedown.stop
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
import plus from '../assets/icons/plus.svg';

export default {
  props: {
    x: {
      type: [String, Number]
    },
    y: {
      type: [String, Number]
    },
    size: {
      type: [String, Number],
      default: 28
    }
  },
  emits: ['click', 'drop'],
  data() {
    return {
      dragOver: false
    };
  },
  computed: {
    plus() {
      return plus;
    },
    controlStyle() {
      return {
        position: 'absolute',
        left: `${this.x - this.size / 2}px`,
        top: `${this.y - this.size / 2}px`,
        width: `${this.size}px`,
        height: `${this.size}px`,
        zIndex: 11
      };
    }
  },
  methods: {
    dragend() {
      this.dragOver = false;
    },
    dragenter() {
      this.dragOver = true;
    },
    dragleave() {
      this.dragOver = false;
    },
    drop(event) {
      this.$emit('drop', event);
      this.dragOver = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.add-there-control {
  border-radius: 100%;
  padding: 4px;
  align-items: center;
  justify-content: center;
  &.drag-over {
    transform: scale(1.5);
    opacity: 0.5;
  }
  .dropzone {
    position: absolute;
    inset: -20px;
    transition: all 200ms ease;
    pointer-events: auto;
  }
}
</style>
