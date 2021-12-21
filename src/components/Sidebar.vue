<template>
  <div class="sidebar">
    <template v-if="selected">
      <BlockViewer
        :node="selected"
        :nodes="nodes"
        @delete="$emit('delete', $event)"
        @add="addNode"
        @update="updateNode"
        @close="$emit('unselect')"
      />
    </template>
    <template v-else>
      <b>Drag and drop cards</b>
      <div v-for="node in nodes" class="container" :key="node.type">
        <BaseNode
          :rejected="Boolean(rejected[node.id])"
          :id="node.id"
          :type="node.type"
        />
      </div>
      <div class="separator"></div>
      <Trash :rejected="rejected['trash']" @drop="onDelete" />
    </template>
  </div>
</template>
<script>
import BaseNode from './BaseNode.vue';
import BlockViewer from './BlockViewer.vue';
import Trash from './Trash.vue';
export default {
  components: {
    BaseNode,
    Trash,
    BlockViewer
  },
  props: {
    nodes: {
      type: Array,
      required: true
    },
    rejected: {
      type: Object,
      required: true
    },
    selected: {
      type: Object
    }
  },
  methods: {
    onDelete(event) {
      const id = event.dataTransfer.getData('id');
      this.$emit('delete', id);
    },
    addNode(id, left) {
      this.$emit('add', id, left);
    },
    updateNode(id, node) {
      this.$emit('update', id, node);
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  background-color: #fff;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 32px;
  user-select: none;
  * > * {
    margin-top: 6px;
  }
  .sample {
    padding: 12px 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .separator {
    flex-grow: 1;
  }
  .trash {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}
</style>
