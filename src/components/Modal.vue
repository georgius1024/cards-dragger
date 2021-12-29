<template>
  <div ref="background" class="background" :class="left">
    <div
      class="panel"
      ref="panel"
      @transitionend="afterTransition"
      v-click-outside="handleClickOutside"
    >
      <button v-if="closeClick" class="close-control" @click="handleClose">
        &times;
      </button>
      <slot> </slot>
    </div>
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
      document.body.style.overflowY = 'hidden';
      this.$refs.background.classList.add('show');
      this.$refs.panel.classList.add('show');
    },
    afterTransition() {
      if (!this.modelValue) {
        document.body.style.overflowY = 'auto';
        this.$refs.background.classList.remove('show');
      }
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
.background {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  opacity: 0;
  transform: translateY(-100%);
  display: flex;
  align-items: center;
  justify-content: center;
  &.show {
    backdrop-filter: saturate(10%) blur(5px);
    transform: translateY(0);
    opacity: 1;
  }

  .panel {
    min-width: 400px;
    min-height: 300px;
    z-index: 11;
    display: block;
    text-align: left;
    box-shadow: 4px 6px 2px rgba(0, 0, 0, 0.32);
    transition: transform 500ms ease;
    transform: translateY(calc(-50vh - 50% - 10px));
    background-color: #fff;
    padding: 48px 16px 16px;
    &.show {
      transform: translateY(0);
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
}
</style>
