<template>
  <div class="layout">
    <div class="header">
      <slot name="header">HEADER</slot>
    </div>
    <div class="sidebar">
      <slot name="sidebar">SIDEBAR</slot>
    </div>
    <div class="main">
      <slot>MAIN</slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas: 'header header' 'sidebar main';
  width: 100vw;
  height: 100vh;
  .header {
    grid-area: header;
    display: flex;
  }
  .sidebar {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
  }
  .main {
    grid-area: main;
    display: flex;
  }
}
</style>
