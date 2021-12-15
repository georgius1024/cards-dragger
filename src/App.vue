<template>
  <Layout>
    <template v-slot:sidebar>
      <Sidebar />
    </template>
    <template v-slot:header>
      <Header />
    </template>

    <Canvas />
  </Layout>
</template>
<script>
import Layout from './components/Layout.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import Canvas from './components/Canvas.vue';
export default {
  components: {
    Layout,
    Sidebar,
    Header,
    Canvas
  }
};
</script>
