<template>
  <SidePanel
    :modelValue="modelValue"
    @close="$emit('update:modelValue', false)"
  >
    <div class="node-viewer">
      <label>Selected node</label>
      <BaseNode
        v-if="node.id"
        :id="node.id"
        :draggable="false"
        :type="node.type"
        :text="node.text"
      />
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
          Preview campaign
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
          <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M18,14H22V16H18V14M12,6H16V9H12V6M16,15H12V10H16V15M6,10H10V12H6V10M10,16H6V13H10V16Z"
            />
          </svg>
          <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z"
            />
          </svg>
          <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H14V19H4V17Z"
            />
          </svg>
          <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z"
            />
          </svg>
        </div>
        <div class="tab" :class="{ current: currentTab === 2 }">
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z"
              />
            </svg>
            <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22 13H14V11H22V13M22 7H14V9H22V7M14 17H22V15H14V17M12 9V15C12 16.1 11.1 17 10 17H4C2.9 17 2 16.1 2 15V9C2 7.9 2.9 7 4 7H10C11.1 7 12 7.9 12 9M10.5 15L8.3 12L6.5 14.3L5.3 12.8L3.5 15H10.5Z"
              />
            </svg>
            <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H14V19H4V17Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex-center">
        <label>Delete node</label>
        <br />
        <Trash @click="$emit('delete', node.id)" />
      </div>
    </div>
  </SidePanel>
</template>
<script>
import SidePanel from './SidePanel.vue';
import BaseNode from './BaseNode.vue';
import Trash from './Trash.vue';
export default {
  components: {
    SidePanel,
    BaseNode,
    Trash
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
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
    updateNodeText({ target: { value } }) {
      this.$emit('update', this.node.id, { ...this.node, text: value });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../assets/style.scss';

.node-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
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
    label {
      margin: 0 !important;
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
