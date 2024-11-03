<template>
  <div id="app">
    <main-header />
    <main class="main">
      <user-list />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserList from "@/components/UserList.vue";
import MainHeader from "@/components/MainHeader.vue";
/**
 * Root application component
 * @component App
 */
export default defineComponent({
  name: "App",

  components: {
    UserList,
    MainHeader,
  },
});
</script>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #42b983;
  --background-color: #f5f5f5;
  --text-color: #333333;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .main {
    padding: 1rem;
  }
}
</style>
