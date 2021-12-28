<template>
  <div
    class="generic-node"
    :class="{ 'drag-over': dragOver, rejected }"
    :style="nodeStyle"
    :draggable="draggable"
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
      viewBox="0 0 24 24"
      @click.stop="$emit('delete', node.id)"
    >
      <path
        fill="#DE3618"
        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
      />
    </svg>
  </div>
  <LineConnector
    v-if="singleChild"
    :fromX="centralConnectionPoint.x"
    :fromY="centralConnectionPoint.y"
    :toX="singleChildConnection.x"
    :toY="singleChildConnection.y"
    stroke="4"
    :add="true"
    @addThere="addThere"
    @dropOn="dropOn"
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
    text: {
      type: String
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
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dragOver: false
    };
  },
  emits: ['dropOn', 'dragStart', 'click', 'addThere', 'delete'],
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
    dropOn(event) {
      this.dragOver = false;
      const from = event.dataTransfer.getData('id');
      const to = this.id;
      this.$emit('dropOn', { from, to });
    },
    click() {
      this.$emit('click', this.id);
    },
    addThere() {
      this.$emit('addThere', this.id);
    }
  }
};
</script>
