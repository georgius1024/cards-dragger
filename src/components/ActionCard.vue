<template>
  <div
    class="card"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="cardStyle"
    draggable="true"
    @dragstart="startDrag"
    @dragend="dragEnd"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
    @drop="drop"
  >
    <div class="icon">
      <img :src="icons[type]" />
    </div>
    <div class="desc">
      {{ type.toUpperCase() }}
    </div>
  </div>
</template>
<script>
import flash from '../assets/icons/flash.svg';
import delay from '../assets/icons/delay.svg';
import email from '../assets/icons/email.svg';
import fork from '../assets/icons/fork.svg';

export default {
  props: {
    id: {
      type: [String, Number]
    },
    type: {
      type: String,
      validator(value) {
        return ['flash', 'delay', 'email', 'fork'].includes(value);
      }
    },
    x: {
      type: [String, Number]
    },
    y: {
      type: [String, Number]
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    absolute: {
      type: Boolean,
      default: false
    },
    rejected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragOver: false
    };
  },
  computed: {
    icons() {
      return {
        flash,
        delay,
        email,
        fork
      };
    },
    cardStyle() {
      if (this.absolute) {
        return {
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
          width: `${this.width}px`,
          height: `${this.height}px`
        };
      }
    }
  },
  methods: {
    startDrag(event) {
      event.dataTransfer.setData('id', this.id);
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      this.$emit('dragStart', { from: this.id });
    },
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
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.id;
      this.$emit('dropOn', { from, to });
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  display: flex;
  border: 1px solid blue;
  background-color: #fff;
  border-radius: 4px;
  padding: 4px;
  user-select: none;
  cursor: pointer;
  align-items: center;
  transition: all 200ms ease;
  transform-origin: center;
  & * {
    pointer-events: none;
  }
  .icon {
    margin: 4px;
  }
  &.drag-over {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
</style>
