<template>
  <header class="header">
    <h1>Infinite Scroll Users</h1>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainHeader",
});
</script>

<style scoped>
.header {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  max-width: 1200px;
  margin: 0 auto;
  color: var(--primary-color);
  font-size: 1.75rem;
  text-align: center;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
