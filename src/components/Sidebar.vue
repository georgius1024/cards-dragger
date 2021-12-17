<template>
  <div class="sidebar">
    <div v-for="card in samples" class="container" :key="card.type">
      <ActionCard
        :rejected="Boolean(rejected[card.id])"
        :id="card.id"
        :type="card.type"
      />
    </div>
    <div class="separator"></div>
    <div
      class="trash"
      :class="{ rejected: rejected['trash'] }"
      @drop="onDelete"
      @dragover.prevent
      @dragenter.prevent
    >
      <svg style="width: 96px; height: 96px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
        />
      </svg>
    </div>
  </div>
</template>
<script>
import ActionCard from './ActionCard.vue';
export default {
  components: {
    ActionCard
  },
  props: {
    samples: {
      type: Array,
      required: true
    },
    rejected: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDelete(event) {
      this.$emit('delete', event);
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  background-color: #fff;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 32px;
  user-select: none;
  * > * {
    margin-top: 6px;
  }
  .separator {
    flex-grow: 1;
  }
  .trash {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
