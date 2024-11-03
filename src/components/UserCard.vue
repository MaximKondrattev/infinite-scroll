<template>
  <div
    class="user-card"
    :class="{ 'user-card--loading': isImageLoading }"
    @click="toggleExpanded"
  >
    <div class="user-card__header">
      <div class="user-card__image-container">
        <img
          :src="user.picture.large"
          :alt="fullName"
          class="user-card__image"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        <div
          v-if="isImageLoading"
          class="user-card__image-skeleton"
        ></div>
      </div>
      <div class="user-card__basic-info">
        <h3 class="user-card__name">{{ fullName }}</h3>
        <p class="user-card__username">@{{ user.login.username }}</p>
      </div>
    </div>

    <div
      class="user-card__content"
      :class="{ 'user-card__content--expanded': isExpanded }"
    >
      <div class="user-card__section">
        <h4 class="user-card__section-title">Contact</h4>
        <p class="user-card__detail">
          <span class="user-card__label">Email:</span>
          {{ user.email }}
        </p>
        <p class="user-card__detail">
          <span class="user-card__label">Phone:</span>
          {{ user.phone }}
        </p>
        <p class="user-card__detail">
          <span class="user-card__label">Cell:</span>
          {{ user.cell }}
        </p>
      </div>

      <div class="user-card__section">
        <h4 class="user-card__section-title">Location</h4>
        <p class="user-card__detail">
          <span class="user-card__label">Address:</span>
          {{ formatAddress }}
        </p>
        <p class="user-card__detail">
          <span class="user-card__label">Country:</span>
          {{ user.location.country }} ({{ user.nat }})
        </p>
      </div>

      <div class="user-card__section">
        <h4 class="user-card__section-title">Personal</h4>
        <p class="user-card__detail">
          <span class="user-card__label">Age:</span>
          {{ user.dob.age }} years
        </p>
        <p class="user-card__detail">
          <span class="user-card__label">Gender:</span>
          {{ capitalizeFirstLetter(user.gender) }}
        </p>
      </div>
    </div>

    <button
      class="user-card__expand-btn"
      @click.stop="toggleExpanded"
    >
      {{ isExpanded ? "Show Less" : "Show More" }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from "vue";
import type { User } from "@/entities/user";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

/**
 * Component for displaying a single user's information in a card format
 * @component UserCard
 */
export default defineComponent({
  name: "UserCard",
  props: {
    /**
     * The user object containing all user information
     */
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props) {
    /**
     * Tracks the loading state of the user's image
     */
    const isImageLoading = ref(true);

    /**
     * Tracks if there was an error loading the image
     */
    const imageLoadError = ref(false);

    /**
     * Toggles the expanded state of the card
     */
    const isExpanded = ref(false);

    /**
     * Computes the full name of the user
     * @returns {string} The user's full name
     */
    const fullName = computed(
      (): string => `${props.user.name.first} ${props.user.name.last}`
    );

    /**
     * Computes the formatted address of the user
     * @returns {string} The user's formatted address
     */
    const formatAddress = computed(() => {
      const { street, city, state, postcode } = props.user.location;
      return `${street.number} ${street.name}, ${city}, ${state} ${postcode}`;
    });
    /**
     * Handles the successful loading of the user's image
     */
    const handleImageLoad = (): void => {
      isImageLoading.value = false;
    };
    /**
     * Handles any errors that occur while loading the user's image
     */
    const handleImageError = (): void => {
      isImageLoading.value = false;
      imageLoadError.value = true;
    };

    /**
     * Toggles the expanded state of the card
     */
    const toggleExpanded = (): void => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isImageLoading,
      imageLoadError,
      fullName,
      formatAddress,
      isExpanded,
      toggleExpanded,
      handleImageLoad,
      handleImageError,
      capitalizeFirstLetter,
    };
  },
});
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-card__header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.user-card__image-container {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.user-card__image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--secondary-color);
}

.user-card__basic-info {
  flex-grow: 1;
}

.user-card__name {
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-color);
  font-weight: 600;
}

.user-card__username {
  margin: 0.25rem 0 0;
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.user-card__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.user-card__content--expanded {
  max-height: 500px;
}

.user-card__section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.user-card__section-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: var(--primary-color);
}

.user-card__detail {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.user-card__label {
  font-weight: 600;
  color: var(--primary-color);
}

.user-card__expand-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-card__expand-btn:hover {
  background: var(--secondary-color);
  color: white;
}

.user-card__image-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
