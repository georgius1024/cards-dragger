<template>
  <header>
    <h1>Flow composer</h1>
    <div class="separator" />
    <DropDown class="mx-1">
      <template v-slot:label> Create workflow </template>
      <template v-slot:dropdown>
        <div class="dropdown-item" @click="$emit('erase')">
          <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          <span class="label">Empty workflow</span>
        </div>
        <div
          v-for="sample in samples"
          class="dropdown-item"
          :key="sample.id"
          @click="$emit('select', sample.id)"
        >
          <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 1A2.5 2.5 0 0 0 9.5 3.5A2.5 2.5 0 0 0 11 5.79V7H7A2 2 0 0 0 5 9V9.71A2.5 2.5 0 0 0 3.5 12A2.5 2.5 0 0 0 5 14.29V15H4A2 2 0 0 0 2 17V18.21A2.5 2.5 0 0 0 .5 20.5A2.5 2.5 0 0 0 3 23A2.5 2.5 0 0 0 5.5 20.5A2.5 2.5 0 0 0 4 18.21V17H8V18.21A2.5 2.5 0 0 0 6.5 20.5A2.5 2.5 0 0 0 9 23A2.5 2.5 0 0 0 11.5 20.5A2.5 2.5 0 0 0 10 18.21V17A2 2 0 0 0 8 15H7V14.29A2.5 2.5 0 0 0 8.5 12A2.5 2.5 0 0 0 7 9.71V9H17V9.71A2.5 2.5 0 0 0 15.5 12A2.5 2.5 0 0 0 17 14.29V15H16A2 2 0 0 0 14 17V18.21A2.5 2.5 0 0 0 12.5 20.5A2.5 2.5 0 0 0 15 23A2.5 2.5 0 0 0 17.5 20.5A2.5 2.5 0 0 0 16 18.21V17H20V18.21A2.5 2.5 0 0 0 18.5 20.5A2.5 2.5 0 0 0 21 23A2.5 2.5 0 0 0 23.5 20.5A2.5 2.5 0 0 0 22 18.21V17A2 2 0 0 0 20 15H19V14.29A2.5 2.5 0 0 0 20.5 12A2.5 2.5 0 0 0 19 9.71V9A2 2 0 0 0 17 7H13V5.79A2.5 2.5 0 0 0 14.5 3.5A2.5 2.5 0 0 0 12 1M12 2.5A1 1 0 0 1 13 3.5A1 1 0 0 1 12 4.5A1 1 0 0 1 11 3.5A1 1 0 0 1 12 2.5M6 11A1 1 0 0 1 7 12A1 1 0 0 1 6 13A1 1 0 0 1 5 12A1 1 0 0 1 6 11M18 11A1 1 0 0 1 19 12A1 1 0 0 1 18 13A1 1 0 0 1 17 12A1 1 0 0 1 18 11M3 19.5A1 1 0 0 1 4 20.5A1 1 0 0 1 3 21.5A1 1 0 0 1 2 20.5A1 1 0 0 1 3 19.5M9 19.5A1 1 0 0 1 10 20.5A1 1 0 0 1 9 21.5A1 1 0 0 1 8 20.5A1 1 0 0 1 9 19.5M15 19.5A1 1 0 0 1 16 20.5A1 1 0 0 1 15 21.5A1 1 0 0 1 14 20.5A1 1 0 0 1 15 19.5M21 19.5A1 1 0 0 1 22 20.5A1 1 0 0 1 21 21.5A1 1 0 0 1 20 20.5A1 1 0 0 1 21 19.5Z"
            />
          </svg>
          <span class="label">
            {{ sample.name }}
          </span>
        </div>
      </template>
    </DropDown>
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
    <label v-text="status" class="mx-1 indicator" />
  </header>
</template>
<script>
import DropDown from './DropDown.vue';
export default {
  components: {
    DropDown
  },
  props: {
    undoable: {
      type: Boolean
    },
    redoable: {
      type: Boolean
    },
    samples: {
      type: Array,
      required: true
    },
    status: {
      type: String
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
  .dropdown-item {
    padding: 8px;
    cursor: cointer;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    svg {
      margin-right: 8px;
    }
    .label {
      flex-grow: 1;
      white-space: nowrap;
    }
    &:hover {
      background-color: #ccc3;
    }
  }
  .indicator {
    text-transform: capitalize;
    min-width: 80px;
    text-align: right;
  }
}
</style>
