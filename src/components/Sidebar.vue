<template>
  <div class="sidebar">
    <ActionCard
      v-for="card in cards"
      :key="card.type"
      :id="card.id"
      :type="card.type"
    />
    <div class="separator"></div>
    <div class="trash" @drop="onDelete" @dragover.prevent @dragenter.prevent>
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
import { nanoid } from 'nanoid';
import ActionCard from './ActionCard.vue';
export default {
  components: {
    ActionCard
  },
  computed: {
    cards() {
      return ['flash', 'delay', 'email', 'fork'].map((type) => ({
        type,
        id: nanoid()
      }));
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
