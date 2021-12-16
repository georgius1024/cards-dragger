<template>
  <div
    class="card"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="cardStyle"
    draggable="true"
    @dragstart="startDrag"
    @dragend="dragEnd"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
    @drop="drop"
  >
    <div class="icon">
      <img :src="icons[type]" />
    </div>
    <div class="desc">
      {{ type.toUpperCase() }}
    </div>
  </div>
  <template v-if="isFork">
    <SideConnector
      v-if="leftConnection"
      :fromX="leftConnectionPoint.x"
      :fromY="leftConnectionPoint.y"
      :toX="leftConnection.x"
      :toY="leftConnection.y"
      stroke="4"
      radius="24"
    />
    <SideConnector
      v-if="rightConnection"
      :fromX="rightConnectionPoint.x"
      :fromY="rightConnectionPoint.y"
      :toX="rightConnection.x"
      :toY="rightConnection.y"
      stroke="4"
      radius="24"
    />
  </template>
  <template v-else>
    <LineConnector
      v-if="singleChild"
      :fromX="centralConnectionPoint.x"
      :fromY="centralConnectionPoint.y"
      :toX="singleChildConnection.x"
      :toY="singleChildConnection.y"
      stroke="4"
    />
  </template>
</template>
<script>
import flash from '../assets/icons/flash.svg';
import delay from '../assets/icons/delay.svg';
import email from '../assets/icons/email.svg';
import fork from '../assets/icons/fork.svg';
import LineConnector from './LineConnector.vue';
import SideConnector from './SideConnector.vue';

export default {
  components: {
    LineConnector,
    SideConnector
  },
  props: {
    id: {
      type: [String, Number]
    },
    type: {
      type: String,
      validator(value) {
        return ['flash', 'delay', 'email', 'fork'].includes(value);
      }
    },
    x: {
      type: [String, Number]
    },
    y: {
      type: [String, Number]
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    leftConnection: {
      type: Object
    },
    rightConnection: {
      type: Object
    },
    absolute: {
      type: Boolean,
      default: false
    },
    rejected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragOver: false
    };
  },
  emits: ['dropOn'],
  computed: {
    icons() {
      return {
        flash,
        delay,
        email,
        fork
      };
    },
    cardStyle() {
      if (this.absolute) {
        return {
          position: 'absolute',
          left: `${this.x}px`,
          top: `${this.y}px`,
          width: `${this.width}px`,
          height: `${this.height}px`
        };
      }
    },
    isFork() {
      return this.type === 'fork';
    },
    children() {
      return [this.leftConnection, this.rightConnection].filter(Boolean);
    },
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
    startDrag(event) {
      event.dataTransfer.setData('id', this.id);
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      this.$emit('dragStart', { from: this.id });
    },
    dragend() {
      this.dragOver = false;
    },
    dragenter() {
      this.dragOver = true;
    },
    dragleave() {
      this.dragOver = false;
    },
    drop(event) {
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.id;
      this.$emit('dropOn', { from, to });
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
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
