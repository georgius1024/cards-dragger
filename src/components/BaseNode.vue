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
  >
    <div class="icon">
      <img :src="icons[type]" />
    </div>
    <div class="desc">
      {{ type.toUpperCase() }}
    </div>
  </div>
  <LineConnector
    v-if="singleChild"
    :fromX="centralConnectionPoint.x"
    :fromY="centralConnectionPoint.y"
    :toX="singleChildConnection.x"
    :toY="singleChildConnection.y"
    stroke="4"
  />
</template>
<script>
import flash from '../assets/icons/flash.svg';
import delay from '../assets/icons/delay.svg';
import email from '../assets/icons/email.svg';
import fork from '../assets/icons/fork.svg';
import account from '../assets/icons/account.svg';
import run from '../assets/icons/run.svg';
import headset from '../assets/icons/headset.svg';
import LineConnector from './LineConnector.vue';

export default {
  components: {
    LineConnector
  },
  props: {
    id: {
      type: [String, Number]
    },
    parent: {
      type: [String, Number]
    },
    type: {
      type: String,
      validator(value) {
        return [
          'flash',
          'delay',
          'email',
          'fork',
          'account',
          'run',
          'headset',
          'stop',
          'stop-left',
          'stop-right'
        ].includes(value);
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
  emits: ['dropOn', 'dragStart'],
  computed: {
    icons() {
      return {
        flash,
        delay,
        email,
        fork,
        run,
        headset,
        account
      };
    },
    nodeStyle() {
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
