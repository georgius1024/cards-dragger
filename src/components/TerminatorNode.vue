<template>
  <div
    class="end-card"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="cardStyle"
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
import ActionCard from './ActionCard.vue';
import plus from '../assets/icons/plus.svg';

export default {
  extends: ActionCard,
  computed: {
    plus() {
      return plus;
    },
    size() {
      return this.height;
    },
    cardStyle() {
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
.end-card {
  display: flex;
  border: 1px solid blue;
  background-color: #fff;
  border-radius: 100%;
  padding: 4px;
  user-select: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  transform-origin: center;
  &:hover {
    transform: translate(0, -2px);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.32);
  }
  .dropzone {
    position: absolute;
    inset: -50px;
    transition: all 200ms ease;
  }
  &.drag-over {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
</style>
