<template>
  <header>
    <h1>Cards</h1>
    <div class="separator" />
    <label class="primary-text" @click="$emit('erase')">Erase</label>
    <button class="primary-border primary-text" @click="$emit('erase')">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z"
        />
      </svg>
    </button>
    <label class="primary-text" @click="undo" :disabled="!undoable"
      >Undo/redo</label
    >
    <button class="primary-text" @click="undo" :disabled="!undoable">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
        />
      </svg>
    </button>
    <button class="primary-text" @click="redo" :disabled="!redoable">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
        />
      </svg>
    </button>
    <label class="primary-text">Zoom</label>
    <button class="primary-text" :disabled="!zoomableIn" @click="zoomIn">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z"
        />
      </svg>
    </button>
    <button class="primary-text" :disabled="!zoomableOut" @click="zoomOut">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z"
        />
      </svg>
    </button>
  </header>
</template>
<script>
export default {
  props: {
    undoable: {
      type: Boolean
    },
    redoable: {
      type: Boolean
    },
    zoomableIn: {
      type: Boolean
    },
    zoomableOut: {
      type: Boolean
    }
  },
  methods: {
    undo() {
      this.$emit('undo');
    },
    redo() {
      this.$emit('redo');
    },
    zoomIn() {
      this.$emit('zoomIn');
    },
    zoomOut() {
      this.$emit('zoomOut');
    }
  }
};
</script>
<style lang="scss" scoped>
header {
  flex-grow: 1;
  margin-bottom: 2px;
  box-shadow: 2px 2px 4px 0px #3337;
  display: flex;
  align-items: center;
  padding: 0 32px;
  user-select: none;
  .separator {
    flex-grow: 1;
  }
  button {
    border-radius: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 16px;
    cursor: pointer;
    border-style: none;
    &:disabled {
      color: #33f3;
    }
  }
  button + button {
    margin-left: 0px;
  }
  label {
    cursor: pointer;
  }
}
</style>
