<script setup lang="ts">
import { onMounted, ref} from "vue";
import {useBookingUserStore} from "@/stores/user/bookingUserStore.ts";
import Modal from "@/templates/modal/Modal.vue";

const bookingUserStore = useBookingUserStore()

const showModal = ref<boolean>(false);

const textModal = ref<string | null>(null);
textModal.value = "Supprimer ce rendez-vous ?";

onMounted(async () => {
  try {
    await bookingUserStore.bookingUserList()
  } catch(e) {
    console.error(e)
    throw e
  }
})

/*===============
  DISPLAY DATE RDV
===============*/

const formattedDate = (date: Date) => {
  if (!date) return ''

  const d = new Date(date)

  return Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(d)
}

const openModal = () => {
  showModal.value = true
}

const deleteAppointment = (id: number) => {
  return bookingUserStore.bookings = bookingUserStore.bookings.filter((a) => a.id !== id )
}
</script>

<template>
  <section class="booking-container" v-if="bookingUserStore.bookings.length">
    <section v-if="bookingUserStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>

    <section v-for="booking in bookingUserStore.bookings" :key="booking.id" class="my-booking" v-else-if="bookingUserStore.bookings.length > 0">
      <div class="my-booking__content">
        <h2>Rendez-vous - {{ booking.service.name }}</h2>
        <div class="my-booking__body">
          <h3 class="date-title">📅 : {{ formattedDate(booking.startAt) }} </h3>
          <p>👤 : {{ booking.staff.firstname }} {{ booking.staff.lastname }} </p>
          <p>⏱ : {{ booking.service.duration }} min</p>
          <p>💶 : {{ booking.service.price }} €</p>
        </div>
        <div class="my-booking__actions">
          <button @click="openModal()" class="btn btn-delete">Supprimer</button>
        </div>
      </div>
      <Modal
        :showModal="showModal"
        :appointmentId="booking.id"
        :textModal="textModal"
        type="appointment-user"
        @delete-appointment="deleteAppointment"
        @close="showModal = false"
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
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 767.98px) {
    //min-height: 150px;
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
  padding: 30px 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  place-items: stretch;
  flex-wrap: wrap;
  gap: 20px;
}

.my-booking {
  width: 420px;
  padding: 2rem 2rem 1.1rem 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  &__content h2 {
    text-align: center;
    color: black;
    font-size: 14px;
    margin-bottom: 10px;
  }
  &__body {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px 15px;
    .date-title {
      color: #475569; /* gris bleuté (proche Tailwind slate-600) */
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 9px;
    }
    p {
      margin-top: 19px;
      color: #374151; /* gris foncé élégant (Tailwind gray-700) */
      font-size: 14px;
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    .btn {
      width: 120px;
    }
  }
}

@media (max-width: 991.98px) {
  .booking-container {
    padding: 2rem 2rem 1.1rem 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .my-booking {
    width: 100%;
    padding: 10px 0 0 0;
    &__content {
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
    &__body {
      margin-top: 12px;
      font-size: 14px;
    }
  }
}

@media (max-width: 767.98px) {
  .booking-container {
    padding: 30px 10px;
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }

  .my-booking {
    width: 100%;
    padding: 0 0 0 0;
    h2 {
      color: black;
      font-size: 15px;
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
    &__actions {
      gap: 10px;
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
