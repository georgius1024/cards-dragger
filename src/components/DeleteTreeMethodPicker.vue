<template>
  <Modal :modelValue="modelValue" @close="$emit('update:modelValue', false)">
    <label>How to delete selected node</label>
    <BaseNode
      v-if="node.id"
      :id="node.id"
      :draggable="false"
      :type="node.type"
      :text="node.text"
    />
    <button @click="select('left')">Left</button>
    <button @click="select('right')">Right</button>
    <button @click="select('both')">Both</button>
  </Modal>
</template>
<script>
import Modal from './Modal.vue';
import BaseNode from './BaseNode.vue';

export default {
  components: {
    Modal,
    BaseNode
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    select(what) {
      this.$emit('select', what);
      this.$emit('update:modelValue', false);
      this.$emit('close');
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 6px;
}
</style>
