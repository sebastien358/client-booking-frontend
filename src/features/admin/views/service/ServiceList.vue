<script setup lang="ts">
import InputSearch from "@/templates/inputSearch/InputSearch.vue";
import { onMounted, ref, watch } from "vue";
import { useServiceAdminStore } from "@/stores/admin/serviceAdminStore.ts";

const serviceAdminStore = useServiceAdminStore();

const placeholder = ref<string | null>(null);
placeholder.value = "Rechercher un service...";

onMounted(async () => {
  await serviceAdminStore.servicesList();
});

watch(
  () => serviceAdminStore.searchTerm,
  (term) => {
    serviceAdminStore.serviceSearch(term);
  },
  { immediate: true },
);
</script>

<template>
  <section v-if="serviceAdminStore.loading" class="loading-indicator">
    <p>Chargement...</p>
  </section>
  <section v-else-if="serviceAdminStore.services.length === 0" class="empty-state">
    <p>Aucun rendez-vous pour le moment</p>
  </section>
  <!-- liste des services -->
  <div v-else class="service-admin">
    <div class="container">
      <InputSearch
        :modelValue="serviceAdminStore.searchTerm"
        @update:modelValue="serviceAdminStore.searchTerm = $event"
        :placeholder="placeholder"
      />
      <div class="grid-container">
        <router-link
          v-for="service in serviceAdminStore.services"
          :to="{ name: 'service-details', params: { id: service.id } }"
          class="grid-item"
          :key="service.id"
        >
          <h3>{{ service.name }}</h3>
          <p>{{ service.price }}€ • {{ service.duration }} min</p>
          <p>Catégorie : {{ service.category.name }}</p>
        </router-link>
      </div>
      <div class="load-contact">
        <button
          v-if="serviceAdminStore.hasMore"
          @click="serviceAdminStore.serviceLazyLoad()"
          class="btn btn-load"
        >
          Charger plus
        </button>
      </div>
    </div>
  </div>
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

.service-admin {
  padding: 20px 10px;
  @media (max-width: 991.98px) {
    padding: 15px 10px;
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
      line-height: 23px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      padding: 1rem;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      cursor: pointer;
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
      h3 {
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
      p {
        font-size: 14px;
        margin-top: 0.5rem;
        color: #555;
        @media (max-width: 991.98px) {
          font-size: 13px;
          margin-top: 0.4rem;
        }
        @media (max-width: 767.98px) {
          font-size: 12px;
          margin-top: 0.2rem;
        }
      }
      small {
        font-size: 14px;
        color: #888;
      }
    }
  }
}
</style>
