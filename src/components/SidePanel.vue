<template>
  <div ref="background" class="background">
    <div
      class="panel"
      ref="panel"
      :style="panelStyle"
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
    afterTransition() {
      if (!this.modelValue) {
        document.body.style.overflowY = 'auto';
        this.$refs.background.classList.remove('show');
      }
    },
    show() {
      document.body.style.overflowY = 'hidden';
      this.$refs.background.classList.add('show');
      this.$refs.panel.classList.add('show');
    },
    handleClickOutside() {
      if (this.modelValue && this.closeClick) {
        this.$emit('update:modelValue', false);
      }
    },
    handleClose() {
      if (this.modelValue) {
        this.$emit('update:modelValue', false);
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
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
  .panel {
    position: fixed;
    text-align: center;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #0093ff;
    z-index: 11;
    display: block;
    text-align: left;
    box-shadow: 4px 6px 2px rgba(0, 0, 0, 0.32);
    transform: translateX(-100vw);
    transition: transform 200ms ease;
    &.show {
      transform: translateX(0);
    }
    .close-control {
      background: transparent;
      outline: none;
      border: none;
      font-size: 32px;
      color: white;
      margin: 16px;
      margin-top: 8px;
      float: right;
      cursor: pointer;
    }
  }
}
</style>
