<script setup lang="ts">
import InputSearch from "@/templates/inputSearch/InputSearch.vue";
import { onMounted, ref, watch } from "vue";
import { useStaffAdminStore } from "@/stores/admin/staffAdminStore.ts";

const staffAdminStore = useStaffAdminStore();

onMounted(async () => {
  await staffAdminStore.staffList();
});

function dateDisplay(str: string) {
  if (!str) return "-";

  const date = new Date(str);
  return Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const placeholder = ref<string | null>(null);
placeholder.value = "Rechercher une coiffeuse...";

watch(() => staffAdminStore.searchTerm, (term) => {
  staffAdminStore.staffSearch(term)
}, { immediate: true })
</script>

<template>
  <section v-if="staffAdminStore.loading" class="loading-indicator">
    <p>Chargement...</p>
  </section>
  <section v-else-if="staffAdminStore.staffs.length === 0" class="empty-state">
    <p>Aucun praticien pour le moment</p>
  </section>
  <!-- liste du staff -->
  <div v-else class="service-admin">
    <div class="container">
      <InputSearch
        :modelValue="staffAdminStore.searchTerm"
        @update:modelValue="staffAdminStore.searchTerm = $event"
        :placeholder="placeholder"
      />
      <div class="grid-container">
        <router-link
          class="grid-item"
          v-for="staff in staffAdminStore.staffs"
          :key="staff.id"
          :to="{ name: 'staff-details', params: { id: staff.id } }"
        >
          <h3>{{ staff.firstname }} {{ staff.lastname }}</h3>
          <p>{{ dateDisplay(staff.created_at) }}</p>
        </router-link>
      </div>
      <div class="load-contact">
        <button
          v-if="staffAdminStore.hasMore"
          @click="staffAdminStore.staffLazyLoad()"
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
  width: min(1200px, 92%);
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
          margin-top: 0.2rem;
        }
        @media (max-width: 767.98px) {
          font-size: 12px;
          margin-top: 0;
        }
      }
      small {
        font-size: 14px;
        color: #888;
      }
      .isRead {
        font-size: 13px;
        font-weight: 500;
        color: #888;
        @media (max-width: 991.98px) {
          font-size: 12px;
        }
        @media (max-width: 767.98px) {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
