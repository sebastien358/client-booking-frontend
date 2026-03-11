<script setup lang="ts">
import InputSearch from "@/templates/inputSearch/InputSearch.vue";
import { onMounted, ref, watch } from "vue";
import {useTestimonialAdminStore} from "@/stores/admin/testimonialAdminStore.ts";


const testimonialAdminStore = useTestimonialAdminStore()
onMounted(async () => {
  await testimonialAdminStore.testimonialAdminList();
});

const placeholder = ref<string | null>(null);
placeholder.value = "Rechercher un témoignage...";

watch(() => testimonialAdminStore.searchTerm, (term) => {
  testimonialAdminStore.testimonialAdminSearch(term)
}, { immediate: true })
</script>

<template>
  <section v-if="testimonialAdminStore.loading" class="loading-indicator">
    <p>Chargement...</p>
  </section>
  <section v-else-if="testimonialAdminStore.testimonials.length === 0" class="empty-state">
    <p>Aucun praticien pour le moment</p>
  </section>
  <!-- liste du staff -->
  <section v-else class="testimonial">
    <div class="container">
      <InputSearch
        :modelValue="testimonialAdminStore.searchTerm"
        @update:modelValue="testimonialAdminStore.searchTerm = $event"
        :placeholder="placeholder"
      />
      <div class="grid-container">
        <router-link
          class="grid-item"
          v-for="t in testimonialAdminStore.testimonials"
          :to="{ name: 'testimonial-details', params: { id: t.id } }"
          :key="t.id"
        >
          <div class="testimonial__title">
            <h3>{{ t.author }}</h3>
            <div class="testimonial__stars">
              <span v-for="nbr in t.rating" :key="nbr">⭐️</span>
            </div>
          </div>
          <p>{{ t.message.slice(0, 40) }}...</p>
          <p>{{ t.job }}</p>
        </router-link>
      </div>
      <div class="load-contact">
        <button
          v-if="testimonialAdminStore.hasMore"
          @click="testimonialAdminStore.testimonialLazyLoad()"
          class="btn btn-load"
        >
          Charger plus
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// LOADING
.loading-indicator,
.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 767.98px) {
    min-height: 150px;
  }
  p {
    font-size: 15px;
    color: #9ca3af;
    @media (max-width: 767.98px) {
      font-size: 14px;
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 991.98px) {
    width: 100%;
  }
  input {
    max-width: 320px;
  }
  .load-contact {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      margin-top: 20px;
    }
  }
}

.testimonial {
  padding: 20px 10px;
  @media (max-width: 991.98px) {
    padding: 15px 10px;
  }
  .testimonial__title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .testimonial__title h3 {
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    color: #555;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
  .testimonial__stars {
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
  .testimonial__stars span {
    font-size: 12px;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    @media (max-width: 991.98px) {
      gap: 1.3rem;
    }
    @media (max-width: 767.98px) {
      gap: 1rem;
    }
    .grid-item {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      padding: 1rem;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      cursor: pointer;
      overflow: hidden;
      @media (max-width: 991.98px) {
        padding: 0.8rem;
      }
      @media (max-width: 767.98px) {
        padding: 0.6rem;
      }
      &:hover {
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
      p {
        font-size: 14px;
        color: #555;
        margin-top: 0.5rem;
        @media (max-width: 991.98px) {
          font-size: 13px;
        }
        @media (max-width: 767.98px) {
          font-size: 12px;
          margin-top: 0.4rem;
        }
      }
    }
  }
}
</style>
