<template>
  <SidePanel
    :modelValue="modelValue"
    @close="$emit('update:modelValue', false)"
  >
    <b>Select node to add</b>
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
    }
  },
  computed: {
    isLeaf() {
      return !this.node?.left && !this.node?.right;
    },
    validChilds() {
      if (this.isLeaf) {
        return this.nodes;
      }
      return this.nodes.filter((e) => e.type !== 'fork');
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 6px;
}
</style>
