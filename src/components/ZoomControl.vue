<template>
  <div class="zoom-controls">
    <div
      class="control top"
      :class="{ disabled: !zoomableIn }"
      @click="$emit('zoom', 'zoomIn')"
    >
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
        />
      </svg>
    </div>
    <div
      class="control bottom"
      :class="{ disabled: !zoomableOut }"
      @click="$emit('zoom', 'zoomOut')"
    >
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,13H5V11H19V13Z" />
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    zoomableIn: {
      type: Boolean
    },
    zoomableOut: {
      type: Boolean
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../assets/style.scss';
.zoom-controls {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: calc(100vw - 100px);
  top: calc(100vh - 160px);
  cursor: pointer;
  user-select: none;
  z-index: 10;
  .control {
    color: #333;
    background: #fffd;
    padding: 8px;
    border: 2px solid $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .control.top {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: none;
  }
  .control.bottom {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .control.disabled {
    color: #33f3;
    cursor: not-allowed;
  }
}
</style>
