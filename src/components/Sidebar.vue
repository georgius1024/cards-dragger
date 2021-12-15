<template>
  <div class="sidebar">
    <ActionCard type="flash" />
    <ActionCard type="email" />
    <ActionCard type="email" />
    <ActionCard type="fork" />
  </div>
</template>
<script>
import ActionCard from './ActionCard.vue';
export default {
  components: {
    ActionCard
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  background-color: #fff;
  flex-grow: 1;
  padding: 32px;
  * > * {
    margin-top: 6px;
  }
}
</style>
