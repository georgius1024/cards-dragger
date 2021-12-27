<template>
  <SidePanel
    :modelValue="modelValue"
    @close="$emit('update:modelValue', false)"
  >
    <label>Selected node</label>
    <BaseNode
      v-if="node.id"
      :id="node.id"
      :draggable="false"
      :type="node.type"
      :text="node.text"
    />

    <label v-if="isBelowConnection">Add after selected</label>
    <label v-if="isLeftConnection">Add to the left side of selected</label>
    <label v-if="isRightConnection">Add to the right side of selected</label>
    <div v-for="node in validChilds" class="container" :key="node.type">
      <BaseNode
        :id="node.id"
        :type="node.type"
        :draggable="false"
        @click="$emit('selected', node.id)"
      />
    </div>
  </SidePanel>
</template>
<script>
import SidePanel from './SidePanel.vue';
import BaseNode from './BaseNode.vue';

export default {
  components: {
    SidePanel,
    BaseNode
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    nodes: {
      type: Array,
      requiered: true
    },
    node: {
      type: Object,
      required: true
    },
    left: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isFreeConnection() {
      if (this.left) {
        return !this.node?.left;
      }
      return !this.node?.right;
    },
    validChilds() {
      if (this.isFreeConnection) {
        return this.nodes;
      }
      return this.nodes.filter((e) => e.type !== 'fork');
    },
    isBelowConnection() {
      return !this.node?.fork;
    },
    isLeftConnection() {
      return this.node?.fork && this.left;
    },
    isRightConnection() {
      return this.node?.fork && !this.left;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 6px;
}
</style>
