<template>
  <div class="node-viewer">
    <BaseNode :id="node.id" :draggable="false" :type="node.type" />
    <div class="tabs">
      <div
        class="tab"
        :class="{ current: currentTab === 0 }"
        @click="currentTab = 0"
      >
        Edit
      </div>
      <div
        class="tab"
        :class="{ current: currentTab === 1 }"
        @click="currentTab = 1"
      >
        Stats
      </div>
      <div
        v-if="node.type === 'email'"
        class="tab"
        :class="{ current: currentTab === 2 }"
        @click="currentTab = 2"
      >
        Preview
      </div>
    </div>
    <div class="panels">
      <div class="tab" :class="{ current: currentTab === 0 }">
        <div class="form-group">
          <label>Enter text:</label>
          <input :value="node.text" @change="updateNodeText" />
        </div>
      </div>
      <div class="tab" :class="{ current: currentTab === 1 }">
        <svg width="96px" height="96px" viewBox="0 0 122.88 111.04">
          <defs></defs>
          <title>financial-growth</title>
          <path
            class="cls-1"
            d="M19.1,70v39.24A1.8,1.8,0,0,1,17.3,111H1.8A1.8,1.8,0,0,1,0,109.25V70ZM41,0a20.6,20.6,0,1,1-20.6,20.59A20.59,20.59,0,0,1,41,0ZM39.24,10.62V8.55h2.85v2c.35,0,.7,0,1,.09.73.08,1.41.17,2,.29s1.22.23,1.73.35v4.06c-.81-.07-1.72-.13-2.73-.17s-1.93-.07-2.75-.07a7.49,7.49,0,0,0-1.32.11,1.62,1.62,0,0,0-.89.42,1.21,1.21,0,0,0-.32.92v.27a1.22,1.22,0,0,0,.42,1,2,2,0,0,0,1.29.34h1.74a6.09,6.09,0,0,1,3.07.7,4.57,4.57,0,0,1,1.85,1.9,5.83,5.83,0,0,1,.61,2.72v.87A6.92,6.92,0,0,1,47,28.18,4.27,4.27,0,0,1,44.54,30a11.48,11.48,0,0,1-2.45.41v2.27H39.24V30.38H39c-.55,0-1.1-.09-1.63-.16s-1-.15-1.54-.24-1-.19-1.43-.31V25.6c.6,0,1.25.1,1.94.13s1.4.06,2.11.08l2,0a7.26,7.26,0,0,0,1.45-.13,1.86,1.86,0,0,0,.87-.42,1.11,1.11,0,0,0,.29-.8v-.31a1,1,0,0,0-.41-.87,1.58,1.58,0,0,0-1-.29h-1.4a7,7,0,0,1-4.64-1.35q-1.58-1.34-1.58-4.5V16.3A5.31,5.31,0,0,1,35.79,12a6.66,6.66,0,0,1,3.45-1.34ZM0,57.19,21.17,38.67l.84.88h0a26.83,26.83,0,0,0,12.64,7.11L22.78,57.19ZM58.9,40.52c3,3.22,5.92,6.38,8.91,9.33L100.54,17,90,6.42l32.88-2.48L121,37.44,110.92,27.33c-7.26,7.35-24.43,23.56-31.69,30.83-9.19,9.18-13.57,9.35-22.76.16L46.2,46.89a26.87,26.87,0,0,0,12.7-6.37Zm53.75,7v61.74a1.8,1.8,0,0,1-1.8,1.79H95.35a1.81,1.81,0,0,1-1.8-1.79V62.57c3-2.87,6.41-6.2,9.93-9.59l7.34-7.07.31.29a12.65,12.65,0,0,0,1.52,1.31ZM81.47,73.45v35.8a1.81,1.81,0,0,1-1.8,1.79H64.17a1.8,1.8,0,0,1-1.8-1.79v-32A23.12,23.12,0,0,0,68,77.9a23.64,23.64,0,0,0,13.46-4.45Zm-31.19-2.9v38.7a1.8,1.8,0,0,1-1.8,1.79H33a1.81,1.81,0,0,1-1.8-1.79v-42c.32-.23.62-.48.92-.74l7.75-6.87,6.24,6.94.48.51c1.26,1.26,2.5,2.42,3.71,3.46Z"
          />
        </svg>
      </div>
      <div class="tab" :class="{ current: currentTab === 2 }">
        <svg width="96px" height="96px">
          <g>
            <path
              class="st0"
              d="M102.55,122.88H0V0h77.66l24.89,26.44L102.55,122.88L102.55,122.88z M29.82,45.51c4.33,0,7.84,3.5,7.84,7.83 c0,4.32-3.51,7.83-7.84,7.83c-4.32,0-7.83-3.51-7.83-7.83C21.99,49.01,25.5,45.51,29.82,45.51L29.82,45.51z M62.71,75.27 l14.02-24.24l2.07-3.57l1.52,3.84l9.45,44.84h-75.3v-9.12l2.87-0.1l5.26-0.27l6.06-14.81l3.77,0.2l2.84,9.98l6.92,0l8-20.59 l1.43-3.69l2.12,3.33L62.71,75.27L62.71,75.27L62.71,75.27z M96.13,115.98V32.36H73.45V5.91H6.51v110.07H96.13L96.13,115.98 L96.13,115.98z"
            />
          </g>
        </svg>
      </div>
    </div>
    <div style="flex-grow: 1"></div>
    <b>Add card below</b>
    <template v-if="(type = 'fork')">
      <div class="tabs centered">
        <div class="tab" :class="{ current: left }" @click="left = true">
          <svg
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
            tooltip="To the left side"
          >
            <path
              fill="currentColor"
              d="M11,9L12.42,10.42L8.83,14H18V4H20V16H8.83L12.42,19.58L11,21L5,15L11,9Z"
            />
          </svg>
        </div>
        <div class="tab" :class="{ current: !left }" @click="left = false">
          <svg
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
            tooltip="To the right side"
          >
            <path
              fill="currentColor"
              d="M19,15L13,21L11.58,19.58L15.17,16H4V4H6V14H15.17L11.58,10.42L13,9L19,15Z"
            />
          </svg>
        </div>
      </div>
    </template>

    <div v-for="node in nodes" class="container" :key="node.type">
      <BaseNode
        :id="node.id"
        :type="node.type"
        :draggable="false"
        @click="addNode(node.id)"
      />
    </div>

    <div class="container">
      <button class="generic-node" @click="$emit('delete', node.id)">
        <b>Delete node</b>
      </button>
    </div>
  </div>
</template>
<script>
import BaseNode from './BaseNode.vue';
export default {
  components: {
    BaseNode
  },
  props: {
    node: {
      type: Object,
      requiered: true
    },
    nodes: {
      type: Array,
      requiered: true
    }
  },
  data() {
    return {
      currentTab: 0,
      left: true
    };
  },
  watch: {
    node(newNode, oldNode) {
      if (newNode.id !== oldNode.id) {
        this.currentTab = 0;
        this.left = true;
      }
    }
  },
  methods: {
    addNode(id) {
      this.$emit('add', id, this.left);
    },
    updateNodeText({ target: { value } }) {
      this.$emit('update', this.node.id, { ...this.node, text: value });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../assets/style.scss';

.node-viewer {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .container {
    margin-top: 6px;
    button {
      width: 100%;
      padding: 16px;
    }
  }
  .tabs {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    &.centered {
      justify-content: center;
    }
    .tab {
      padding: 8px;
      cursor: pointer;
      &.current {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
      }
    }
  }
  .panels {
    border-top: 1px solid $primary-color;
    padding-top: 8px;
    .tab {
      display: none;
      &.current {
        display: block;
      }
      color: #777;
      text-align: center;
    }
  }
  .form-group {
    text-align: left;
    display: flex;
    flex-direction: column;
    &:focus-within {
      color: $primary-color;
    }
    input {
      margin-top: 8px;
      display: block;
      outline: none;
      padding: 8px;
      color: #333;
      border: 1px solid #333;
      &:focus {
        border-color: $primary-color;
      }
    }
  }
}
</style>
