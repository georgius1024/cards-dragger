<template>
  <Modal :modelValue="modelValue" @close="$emit('update:modelValue', false)">
    <label>Selected node</label>
    <BaseNode
      v-if="node.id"
      :id="node.id"
      :draggable="false"
      :type="node.type"
      :text="node.text"
    />
    <label>Choose delete action</label>
    <button class="primary-border" @click="select('left')">
      Delete left branch
    </button>
    <button class="primary-border" @click="select('right')">
      Delete right branch
    </button>
    <button class="primary-border" @click="select('both')">
      Delete both branches
    </button>
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
      this.$emit('selected', what);
      this.$emit('update:modelValue', false);
      this.$emit('close');
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  margin-top: 6px;
  padding: 16px;
  background-color: #fff;
  display: block;
  width: 100%;
}
</style>
