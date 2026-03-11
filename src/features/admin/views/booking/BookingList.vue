<script setup lang="ts">
import InputSearch from "@/templates/inputSearch/InputSearch.vue";
import { useBookingAdminStore } from "@/stores/admin/bookingAdminStore.ts";
import { onMounted, ref, watch } from "vue";

const placeholder = ref<string | null>(null);
placeholder.value = "Rechercher par coiffeuse…";

/*===================
  LISTE DES RENDEZ-VOUS
===================*/

const bookingAdminStore = useBookingAdminStore();

onMounted(async () => {
  try {
    await bookingAdminStore.bookingAdminList();
  } catch (e) {
    console.error(e);
  }
});

function dateFormat(date) {
  if (!date) return "-";

  const d = new Date(date);

  return Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

watch(() => bookingAdminStore.searchTerm, (term) => {
  bookingAdminStore.bookingAdminSearch(term)
}, {immediate: true})
</script>

<template>
  <div v-if="bookingAdminStore.loading" class="loading-indicator">
    <p>Chargement...</p>
  </div>
  <div v-else-if="bookingAdminStore.bookings.length === 0" class="empty-state">
    <p>Aucun rendez-vous pour le moment</p>
  </div>
  <!-- LISTE DES RENDEZ-VOUS -->
  <div v-else class="booking-admin">
    <div class="container">
      <InputSearch
        :modelValue="bookingAdminStore.searchTerm"
        @update:modelValue="bookingAdminStore.searchTerm = $event"
        :placeholder="placeholder"
      />
      <div class="grid-container">
        <router-link
          class="grid-item"
          v-for="booking in bookingAdminStore.bookings"
          :to="{ name: 'booking-details', params: { id: booking.id } }"
          :key="booking.id"
        >
          <h3>{{ booking.lastname }}</h3>
          <p>Email : {{ booking.email }}</p>
          <p>Téléphone : {{ booking.phone }}</p>
          <p>Date {{ dateFormat(booking.created_at) }}</p>
          <small class="isRead">
            {{ booking.is_read ? "✅ vu" : "❌ non-vu" }}
          </small>
        </router-link>
      </div>
      <div class="load-contact">
        <button
          v-if="bookingAdminStore.hasMore"
          @click="bookingAdminStore.bookingAdminLazyLoad()"
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

.booking-admin {
  padding: 15px 10px;
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
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #555;
        text-transform: uppercase;
        @media (max-width: 991.98px) {
          font-size: 15px;
        }
        @media (max-width: 767.98px) {
          font-size: 14px;
          margin-bottom: 0.2rem;
        }
      }
      p {
        font-size: 14px;
        margin-bottom: 0.5rem;
        color: #555;
        @media (max-width: 991.98px) {
          font-size: 13px;
        }
        @media (max-width: 767.98px) {
          font-size: 12px;
          margin-bottom: 0.2rem;
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
