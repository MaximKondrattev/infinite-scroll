<template>
  <div
    class="user-list"
    ref="listContainer"
    @scroll="handleScroll"
  >
    <div class="user-list__grid">
      <user-card
        v-for="user in users"
        :key="user.login.uuid"
        :user="user"
      />
    </div>
    <div
      v-if="loading"
      class="user-list__loading"
    >
      <div class="user-list__spinner"></div>
      Loading more users...
    </div>
    <div
      v-if="error"
      class="user-list__error"
    >
      {{ error }}
      <button
        @click="retryLoading"
        class="user-list__retry-btn"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import UserCard from "./UserCard.vue";
import type { User } from "@/entities/user";
import { createUserService } from "@/services/api";
import { debounce } from "@/utils/debounce";

/**
 * Component that displays a list of users with infinite scroll functionality
 * @component UserList
 */
export default defineComponent({
  name: "UserList",

  components: {
    UserCard,
  },

  setup() {
    /**
     * Instance of user service with caching and logging
     */
    const userService = createUserService({
      enableCaching: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache
    });

    /**
     * Reference to the list container element for scroll handling
     */
    const listContainer = ref<HTMLElement | null>(null);

    /**
     * Array of loaded users
     */
    const users = ref<User[]>([]);

    /**
     * Current page number for pagination
     */
    const currentPage = ref(1);

    /**
     * Loading state indicator
     */
    const loading = ref(false);

    /**
     * Error message if any
     */
    const error = ref<string | null>(null);

    /**
     * Flag indicating if there are more users to load
     */
    const hasMore = ref(true);

    /**
     * Loads the next batch of users from the API
     * @returns {Promise<void>}
     */
    const loadUsers = async (): Promise<void> => {
      if (loading.value || !hasMore.value) return;

      try {
        loading.value = true;
        error.value = null;

        const response = await userService.fetchUsers({
          page: currentPage.value,
          results: 10,
        });

        if (response && response.results.length === 0) {
          hasMore.value = false;
          return;
        }

        if (response) {
          currentPage.value++;
          users.value = [...users.value, ...response.results];
        }
      } catch (err) {
        error.value =
          err instanceof Error
            ? err.message
            : "An error occurred while loading users";
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };

    /**
     * Retries loading users after an error
     */
    const retryLoading = (): void => {
      error.value = null;
      hasMore.value = true; // Reset hasMore flag on retry
      loadUsers();
    };

    /**
     * Handles scroll events and triggers loading more users when needed
     * Debounced to improve performance
     */
    const handleScroll = debounce((event: Event): void => {
      const target = event.target as HTMLElement;
      const { scrollHeight, scrollTop, clientHeight } = target;

      // Load more when user is 100px from bottom
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadUsers();
      }
    }, 200);

    /**
     * Cleans up scroll event listeners and cache
     */
    const cleanup = (): void => {
      if (listContainer.value) {
        listContainer.value.removeEventListener("scroll", handleScroll);
      }
      // Clear cache on unmount if service has caching
      if ("clearCache" in userService) {
        (userService as any).clearCache();
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      loadUsers();
    });

    onUnmounted(() => {
      cleanup();
    });

    return {
      listContainer,
      users,
      loading,
      error,
      handleScroll,
      retryLoading,
    };
  },
});
</script>

<style scoped>
.user-list {
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 1rem;
}

.user-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-list__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: var(--primary-color);
}

.user-list__spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.user-list__error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
}

.user-list__retry-btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.user-list__retry-btn:hover {
  opacity: 0.9;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .user-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>
ы
