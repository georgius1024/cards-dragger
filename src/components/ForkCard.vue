<template>
  <div
    class="fork-card"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="cardStyle"
    draggable="true"
    @dragstart="startDrag"
    @dragend="dragEnd"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
    @drop.stop="drop"
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
import ActionCard from './ActionCard.vue';
import SideConnector from './SideConnector.vue';

export default {
  extends: ActionCard,
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
<style lang="scss" scoped>
.fork-card {
  display: flex;
  border: 1px solid blue;
  background-color: #fff;
  border-radius: 4px;
  padding: 4px;
  user-select: none;
  cursor: pointer;
  align-items: center;
  transition: all 200ms ease;
  transform-origin: center;
  &:hover {
    transform: translate(0, -2px);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.32);
  }
  & * {
    pointer-events: none;
  }
  .icon {
    margin: 4px;
  }
  &.drag-over {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
</style>
