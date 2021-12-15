<template>
  <header>
    <h1>Cards</h1>
    <div class="separator" />
    <button @click="undo" :disabled="!undoable">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
        />
      </svg>
    </button>
    <button @click="redo" :disabled="!redoable">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
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
    }
  },
  methods: {
    undo() {
      this.$emit('undo');
    },
    redo() {
      this.$emit('redo');
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
  .separator {
    flex-grow: 1;
  }
  button {
    border-radius: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: 32px;
    height: 32px;
    margin: 32px;
    color: blue;
    border: 1px solid blue;
    cursor: pointer;
    &:disabled {
      background-color: #ccf7;
      color: #33f7;
    }
  }
}
</style>
