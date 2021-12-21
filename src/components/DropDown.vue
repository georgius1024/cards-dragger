<template>
  <div class="drop-down" :class="{ active }" @click="active = !active">
    <div class="header" :class="{ active }">
      <div class="label"><slot name="label"></slot></div>
      <svg
        class="caret"
        :class="{ active }"
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M7,15L12,10L17,15H7Z" />
      </svg>
    </div>
    <div class="dropdown" :class="{ active }">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: false
    };
  }
};
</script>
<style lang="scss" scoped>
@import '../assets/style.scss';
.drop-down {
  position: relative;
  color: $primary-color;
  transition: all 200ms ease;
}
.header {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 4px;
  .label {
    flex-grow: 1;
  }
  .caret {
    width: 24px;
    transform-origin: center center;
    transition: all 200ms ease;
    transform: rotate(180deg);
    &.active {
      transform: rotate(0deg);
    }
  }
}
.dropdown {
  position: absolute;
  top: 23px;
  left: 0;
  width: fit-content;
  // min-width: 100%;
  display: none;
  opacity: 1;
  background-color: #fff;
  padding: 8px 0;
  outline: 1px solid $primary-color;
  z-index: 10;
  &.active {
    opacity: 1;
    display: block;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.32);
  }
}
</style>
