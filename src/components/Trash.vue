<template>
  <div
    class="trash"
    :class="{ 'drag-over': dragOver, rejected }"
    @dragend="dragend"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
    @drop.stop="drop"
    @click="$emit('click')"
  >
    <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
      />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
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
  emits: ['delete'],
  computed: {
    nodeStyle() {
      if (this.absolute) {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`
        };
      }
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
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      this.$emit('delete', from);
    }
  }
};
</script>
<style lang="scss" scoped>
.trash {
  display: flex;
  padding: 4px;
  user-select: none;
  cursor: pointer;
  align-items: center;
  transition: all 200ms ease;
  transform-origin: center;
  &:hover {
    transform: translate(0, -2px);
  }
  & * {
    pointer-events: none;
  }
  .icon {
    margin: 4px;
  }
  &.drag-over {
    transform: scale(1.2);
    opacity: 0.5;
  }
}
</style>
