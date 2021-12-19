<template>
  <svg
    class="connector"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :style="style"
  >
    <line
      :x1="startingPoint.x"
      :y1="startingPoint.y"
      :x2="firstJunction.x"
      :y2="firstJunction.y"
      :stroke="black"
      :stroke-width="stroke"
    />

    <line
      :x1="firstJunction.x"
      :y1="firstJunction.y"
      :x2="secondJunction.x"
      :y2="secondJunction.y"
      :stroke="black"
      :stroke-width="stroke"
      stroke-linecap="round"
    />

    <path
      :d="`
      M ${secondJunction.x} ${secondJunction.y} 
      C ${secondJunction.x + (isRight ? +radius : -radius)} ${
        secondJunction.y
      }  
        ${thirdJunction.x} ${thirdJunction.y}  
        ${thirdJunction.x} ${thirdJunction.y}
      `"
      :stroke="black"
      :stroke-width="stroke"
      fill="transparent"
      stroke-linecap="round"
    />

    <line
      :x1="thirdJunction.x"
      :y1="thirdJunction.y"
      :x2="endingPoint.x"
      :y2="endingPoint.y"
      :stroke="black"
      :stroke-width="stroke"
      stroke-linecap="round"
      marker-end="url(#triangle)"
    />

    <marker
      id="triangle"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerUnits="strokeWidth"
      markerHeight="4"
      orient="auto"
      :fill="black"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>

    <circle
      :cx="x1"
      :cy="y1"
      :r="stroke"
      :stroke="black"
      fill="white"
      stroke-width="2"
    />

    <circle
      :cx="x2"
      :cy="y2"
      :r="stroke"
      :stroke="black"
      fill="white"
      stroke-width="2"
    />
  </svg>
  <div
    style="
      position: absolute;
      padding: 8px;
      height: 32px;
      background-color: #fff;
      z-index: 11;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: blue;
      width: 64px;
    "
    :style="{
      left: `${this.left + textPoint.x - 32}px`,
      top: `${this.top + textPoint.y - 16}px`
    }"
  >
    {{ text }}
  </div>
</template>
<script>
export default {
  props: ['fromX', 'fromY', 'toX', 'toY', 'stroke', 'radius', 'text'],
  computed: {
    isRight() {
      return this.toX > this.fromX;
    },
    padding() {
      return this.stroke * 2;
    },
    left() {
      return (this.fromX < this.toX ? this.fromX : this.toX) - this.padding;
    },
    top() {
      return (this.fromY < this.toY ? this.fromY : this.toY) - this.padding;
    },
    width() {
      return Math.abs(this.fromX - this.toX) + this.padding * 2;
    },
    height() {
      return Math.abs(this.fromY - this.toY) + this.padding * 2;
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    x1() {
      return this.fromX < this.toX ? this.padding : this.width - this.padding;
    },
    y1() {
      return this.fromY < this.toY ? this.padding : this.height - this.padding;
    },
    x2() {
      return this.fromX < this.toX ? this.width - this.padding : this.padding;
    },
    y2() {
      return this.fromY < this.toY ? this.height - this.padding : this.padding;
    },
    startingPoint() {
      return {
        x: this.fromX < this.toX ? this.padding : this.width - this.padding,
        y: this.fromY < this.toY ? this.padding : this.height - this.padding
      };
    },
    textPoint() {
      const dx = (this.width - this.radius) / 2;
      return {
        x:
          this.fromX < this.toX
            ? this.padding + dx
            : this.width - this.padding - dx,
        y: this.startingPoint.y + this.height / 2 - this.padding
      };
    },
    endingPoint() {
      return {
        x: this.fromX < this.toX ? this.width - this.padding : this.padding,
        y: this.fromY < this.toY ? this.height - this.padding : this.padding
      };
    },
    firstJunction() {
      return {
        x: this.startingPoint.x,
        y: this.startingPoint.y + this.height / 2 - this.padding
      };
    },
    secondJunction() {
      return {
        x:
          this.fromX < this.toX
            ? this.endingPoint.x - this.padding
            : this.endingPoint.x + this.padding,
        y: this.startingPoint.y + this.height / 2 - this.padding
      };
    },
    thirdJunction() {
      return {
        x: this.endingPoint.x,
        y: this.startingPoint.y + this.height / 2 - this.padding + +this.radius
      };
    },
    black() {
      return 'blue';
    },
    style() {
      return {
        position: 'absolute',
        left: `${this.left}px`,
        top: `${this.top}px`,
        zIndex: 10
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.connector {
  transition: all 200ms ease;
  .small {
    position: absolute;
    padding: 8px;
    border: 1px solid blue;
    background-color: white;
    width: 120px;
    text-align: right;
  }
}
</style>
