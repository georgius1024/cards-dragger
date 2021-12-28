<template>
  <div
    class="panel"
    ref="panel"
    :style="panelStyle"
    v-click-outside="handleClickOutside"
  >
    <button v-if="closeClick" class="close-control" @click="handleClose">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"
        />
      </svg>
    </button>
    <slot> </slot>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    closeControl: {
      type: Boolean,
      default: true
    },
    closeClick: {
      type: Boolean,
      default: true
    },
    left: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 300
    }
  },
  computed: {
    panelStyle() {
      return {
        width: `${this.width}px`
      };
    }
  },
  watch: {
    modelValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!newValue) {
          this.hide();
        } else {
          this.show();
        }
      }
    }
  },
  methods: {
    hide() {
      this.$refs.panel.classList.remove('show');
    },
    show() {
      this.$refs.panel.classList.add('show');
    },
    handleClickOutside() {
      if (this.modelValue && this.closeClick) {
        this.$emit('update:modelValue', false);
        this.$emit('close');
      }
    },
    handleClose() {
      if (this.modelValue) {
        this.$emit('update:modelValue', false);
        this.$emit('close');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 11;
  display: block;
  box-shadow: 4px 6px 2px rgba(0, 0, 0, 0.32);
  transform: translateX(calc(-100% - 5px));
  transition: transform 500ms ease;
  background-color: #fff;
  padding: 48px 16px 16px;
  &.show {
    transform: translateX(0);
  }
  .close-control {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    outline: none;
    border: none;
    font-size: 32px;
    color: #0093ff;
    cursor: pointer;
  }
}
</style>
