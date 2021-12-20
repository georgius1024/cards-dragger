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
    @drop.stop="drop"
    @click.stop="click"
    @mousedown.stop
  >
    <div class="icon">
      <img :src="icons[type]" />
    </div>
    <div class="desc">
      {{ type.toUpperCase() }}
    </div>
  </div>
  <template v-if="bothChildren">
    <SideConnector
      v-if="leftConnection"
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="leftConnection.x"
      :toY="leftConnection.y"
      text="Yes"
      stroke="4"
      radius="6"
    />
    <SideConnector
      v-if="rightConnection"
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="rightConnection.x"
      :toY="rightConnection.y"
      text="No"
      stroke="4"
      radius="6"
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
  }
};
</script>
