<template>
  <div class="sidebar">
    <template v-if="selected">
      <BaseNode :id="selected.id" :draggable="false" :type="selected.type" />

      {{ selected }}
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
      <br />
      <b>Or select premade series</b>
      <div
        v-for="sample in samples"
        class="generic-node sample"
        :key="sample.id"
        @click="$emit('select', sample.id)"
      >
        {{ sample.name }}
      </div>
      <div class="separator"></div>
      <Trash :rejected="rejected['trash']" @drop="onDelete" />
    </template>
  </div>
</template>
<script>
import BaseNode from './BaseNode.vue';
import Trash from './Trash.vue';
export default {
  components: {
    BaseNode,
    Trash
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
    samples: {
      type: Array,
      required: true
    },
    selected: {
      type: Object
    }
  },
  methods: {
    onDelete(event) {
      this.$emit('delete', event);
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
}
</style>
