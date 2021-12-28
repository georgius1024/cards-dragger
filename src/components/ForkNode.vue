<template>
  <div
    class="generic-node"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="nodeStyle"
    draggable="true"
    @dragstart="startDrag"
    @dragend="dragEnd"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
    @drop.stop="dropOn"
    @click.stop="click"
    @mousedown.stop
  >
    <div class="icon">
      <img :src="icons[type]" />
    </div>
    <div class="content">
      <div class="desc">
        {{ type.toUpperCase() }}
      </div>
      <div class="text" v-html="text" />
    </div>
    <svg
      v-if="absolute"
      class="node-delete-control"
      ref="delete"
      viewBox="0 0 24 24"
    >
      <path
        fill="#DE3618"
        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
      />
    </svg>
  </div>
  <template v-if="bothChildren">
    <SideConnector
      v-if="leftConnection"
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="leftConnection.x"
      :toY="leftConnection.y"
      :add="true"
      text="Yes"
      stroke="4"
      radius="6"
      @addThere="addThereLeft"
      @dropOn="dropOnLeft"
    />
    <SideConnector
      v-if="rightConnection"
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="rightConnection.x"
      :toY="rightConnection.y"
      :add="true"
      text="No"
      stroke="4"
      radius="6"
      @addThere="addThereRight"
      @dropOn="dropOnRight"
    />
  </template>
  <template v-else-if="singleChild">
    <LineConnector
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="singleChildConnection.x"
      :toY="singleChildConnection.y"
      text="X3"
      stroke="4"
    />
  </template>
</template>
<script>
import BaseNode from './BaseNode.vue';
import SideConnector from './SideConnector.vue';

export default {
  extends: BaseNode,
  components: {
    SideConnector
  },
  computed: {
    bothChildren() {
      return this.children.length === 2;
    },
    singleChild() {
      return this.children.length === 1;
    },
    centralConnectionPoint() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height
      };
    },
    leftConnectionPoint() {
      return {
        x: this.x,
        y: this.y + this.height / 2
      };
    },
    rightConnectionPoint() {
      return {
        x: this.x + this.width,
        y: this.y + this.height / 2
      };
    },
    singleChildConnection() {
      if (this.leftConnection) {
        return this.leftConnection;
      }
      if (this.rightConnection) {
        return this.rightConnection;
      }
    }
  },
  methods: {
    addThereLeft() {
      this.$emit('addThere', this.id, true);
    },
    addThereRight() {
      this.$emit('addThere', this.id, false);
    },
    dropOnLeft(event) {
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.id;
      this.$emit('dropOn', { from, to, left: true });
    },
    dropOnRight(event) {
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.id;
      this.$emit('dropOn', { from, to, left: false });
    }
  }
};
</script>
