<script setup lang="ts">
import { useBookingAdminStore } from "@/stores/admin/bookingAdminStore.ts";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "@/templates/modal/Modal.vue";

const showModal = ref<boolean>(false);

const textModal = ref<string | null>(null);
textModal.value = "Supprimer ce rendez-vous ?";

const bookingAdminStore = useBookingAdminStore();

const route = useRoute();

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
}

type Staff = {
  id: number;
  firstname: string;
  lastname: string;
}

type Booking = {
  id: number;
  startAt: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_read: boolean;
  service: Service[]
  staff: Staff[]
}

const state = reactive<Booking>({
  id: 0,
  startAt: '',
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  is_read: false,
  service: [],
  staff: []
});

const currentBooking = async () => {
  try {
    const id = Number(route.params.id);
    if (!id) return;

    const bookings = await bookingAdminStore.bookingAdminCurrent(id);

    Object.assign(state, {
      ...bookings,
      service: bookings.service ?? state.service,
      staff: bookings.staff ?? state.staff
    });
  } catch (e) {
    console.error(e);
  }
}

onMounted(currentBooking);

const formattedDate = computed(() => {
  if (!state.startAt) return "—";

  const date = new Date(state.startAt);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
});
</script>

<template>
  <section class="booking-container">
    <section v-if="bookingAdminStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>
    <section v-else-if="state">
      <div class="booking-details">
        <h2>Rendez-vous - {{ state.staff.firstname }} {{ state.staff.lastname }}</h2>
        <div class="meta">
          <div class="booking-email">
            <p>{{ state.email }}</p>
            <span class="status" :class="{ unread: !state.is_read }">
              {{ state.is_read ? "✅ vu" : "❌ non-vu" }}
            </span>
          </div>
        </div>
        <div class="message-body">
          <h3 class="date-title">📅 : {{ formattedDate }}</h3>
          <p>👤 : {{ state.firstname }} {{ state.lastname }}</p>
          <p>📞 : {{ state.phone }}</p>
          <p>✂️ : {{ state.service.name }} - {{ state.service.duration }}min</p>
          <p>⏱ : {{ state.service.duration }}min</p>
          <p>💶 : {{ state.service.price }}€</p>
        </div>
        <div class="actions">
          <a
            :href="`https://mail.google.com/mail/?view=cm&to=${state.email}`"
            target="_blank"
            rel="noopener"
            class="btn btn-reply"
            >Répondre</a
          >
          <button @click="showModal = true" class="btn btn-delete">Supprimer</button>
        </div>
      </div>
      <Modal
        :showModal="showModal"
        :appointmentId="state.id"
        @close="showModal = false"
        :textModal="textModal"
        type="appointment"
      />
    </section>
    <section v-else class="empty-state">
      <p>Aucun rendez-vous pour le moment</p>
    </section>
  </section>
</template>

<style scoped lang="scss">
// LOADING

.loading-indicator,
.empty-state {
  //min-height: 100px;
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

/*======================
  BOOKINGS
======================*/

.booking-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 20px;
  .booking-details {
    width: 600px;
    padding: 2rem 2.5rem;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: "Inter", sans-serif;
    h2 {
      color: black;
      font-size: 20px;
    }
    .meta {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      .booking-email {
        margin-top: 20px;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
      }
      .unread {
        font-size: 14px;
      }
    }
    .message-body {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.7rem 1.2rem;
      .date-title {
        color: #475569; /* gris bleuté (proche Tailwind slate-600) */
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 9px;
      }
      p {
        margin-top: 22px;
        color: #374151; /* gris foncé élégant (Tailwind gray-700) */
        font-size: 14px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      column-gap: 6px;
    }
  }
}

@media (max-width: 991.98px) {
  .booking-container {
    margin: 30px 20px;
    .booking-details {
      width: 500px;
      h2 {
        color: black;
        font-size: 18px;
      }
      .meta {
        margin-bottom: 10px;
        .booking-email {
          margin-top: 12px;
          font-size: 14px;
        }
        .status {
          font-size: 12px;
        }
      }
      .message-body {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.7rem 1.2rem;
        .date-title {
          margin-bottom: 9px;
        }
        p {
          margin-top: 15px;
          color: #374151; /* gris foncé élégant (Tailwind gray-700) */
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 767.98px) {
  .booking-container {
    margin: 30px 10px;
    .booking-details {
      width: 320px;
      padding: 15px;
      h2 {
        color: black;
        font-size: 15px;
      }
      .meta {
        .booking-email {
          font-size: 13px;
          margin-top: 8px;
        }
        .status {
          font-size: 11px;
        }
      }
      .message-body {
        padding: 1rem;
        .date-title {
          font-size: 13px;
        }
        p {
          margin-top: 13px;
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 575.98px) {
  .booking-container {
    .booking-details {
      width: 320px;
    }
  }
}

/*======================
  LOADING
======================*/

.loading-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    color: #9ca3af;
  }
}
</style>
