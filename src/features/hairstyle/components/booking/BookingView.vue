<script setup lang="ts">
import { useStaffStore } from "@/stores/staffStore.ts";
import { useCategoryStore } from "@/stores/categoryStore.ts";
import { useServiceStore } from "@/stores/serviceStore.ts";
import { useBookingStore } from "@/stores/bookingStore.ts";
import { computed, onMounted, ref, watch, nextTick, type Slot } from "vue";
import BookingConfirmation from "@/features/hairstyle/components/booking/BookingConfirmation.vue";
import ProgressBooking from "@/templates/progress-bar/ProgressBooking.vue";
import {useUiStore} from "@/stores/uiStore.ts";
import Calc from "@/templates/calc/Calc.vue";
import { gsap } from "gsap/gsap-core";
import {useAuthStore} from "@/stores/authStore.ts";
import router from "@/router";

const authStore = useAuthStore()

/*===============
  BOOKING CATEGORY
===============*/

const categoryStore = useCategoryStore();

const bookingCategoryId = ref<number | null>(null);

onMounted(async () => {
  try {
    await categoryStore.categoryList();
  } catch(e) {
    console.error(e)
  }
});

const selectCategory = (id: number) => {
  bookingCategoryId.value = id;
}

/*===============
  BOOKING STAFF
===============*/

const staffStore = useStaffStore();

const bookingStaffId = ref<number | null>(null);
const bookingStaffText = ref<string | null>(null);

onMounted(async () => {
  try {
    await staffStore.staffList()
  } catch (e) {
    console.error(e)
  }
})

const selectStaff = (id: number, name: string) => {
  bookingStaffId.value = id;
  bookingStaffText.value = name
}

/*===============
  BOOKING SERVICES
===============*/

const serviceStore = useServiceStore();

const bookingServiceId = ref<number | null>(null);
const bookingServiceText = ref<string | null>(null);
const bookingServiceDuration = ref<string | null>(null);

onMounted(async () => {
  try {
    await serviceStore.serviceList();
  } catch(e) {
    console.error(e)
  }
});

const selectService = (id: number, duration: string, name: string) => {
  bookingServiceId.value = id;
  bookingServiceText.value = name;
  bookingServiceDuration.value = duration;

  isOpen.value = false;
}

const filteredService = computed(() => {
  return serviceStore.services.filter((service) => service.category.id === bookingCategoryId.value);
});

/*===============
  DAYS
===============*/

const availableDays = computed(() => {
  const days: {value: string, label: string}[] = []

  const now = new Date()

  const isAfter18 = now.getHours() >= 18
  const currentDay = isAfter18 ? 1 : 0

  for (let i = currentDay; i < currentDay + 11; i++) {
    const d = new Date(now)

    d.setDate(d.getDate() + i)

    if (d.getDay() === 0) continue

    days.push({
      label: d.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }).replace(/\./g, ''),
      value: d.toLocaleDateString('fr-CA'),
    })

    if (days.length === 11) break
  }

  return days
});

/*===============
  DAYS CAROUSEL
===============*/

const pageSize = ref<number>(3)
const carouselIndex = ref<number>(0)

const maxIndex = computed(() => {
  return Math.max(0, Math.ceil(availableDays.value.length / pageSize.value) - 1)
})

const visibleDays = computed(() => {
  const start = carouselIndex.value * pageSize.value
  return availableDays.value.slice(start, start + pageSize.value)
})

const prevDays = () => {
  if (carouselIndex.value > 0) return carouselIndex.value--
}

const nextDays = () => {
  if (carouselIndex.value < maxIndex.value) return carouselIndex.value++
}

/*====================================================
  AFFICHAGE DES CRÉNEAUX DE RÉSERVATION
  - Jours ouvrés uniquement (hors dimanche / lundi)
  - Initialisation automatique sur le prochain jour ouvert
  - Rechargement des créneaux selon :
    • la catégorie
    • la prestation
    • le membre du staff
    • la date sélectionnée
====================================================*/

const todayLocal = new Date();

const bookingSelectedDate = ref(todayLocal.toLocaleDateString("fr-CA"));

watch(
  availableDays,
  (days) => {
    if (days.length === 0) return;
    // si la date actuelle n'est pas dans les jours autorisés
    const isValid = days.some((d) => d.value === bookingSelectedDate.value);
    if (!isValid) {
      bookingSelectedDate.value = days[0].value;
    }
  },
  { immediate: true },
);

const bookingStore = useBookingStore();

const bookingSelectDay = ref<HTMLElement | string>('')

const selectDay = (day: {value: string, label: string}) => {
  bookingSelectedDate.value = day.value

  bookingStore.setBookingDraft({
    date: day.value,
    datetime: null,
  });

  bookingSelectDay.value = day.value
  bookingStore.slots = []
}

/*====================================================
  WATCHER DE RÉSERVATION
  Ce watcher :
  - écoute les dépendances clés de la réservation
  - déclenche un rechargement des créneaux dès qu’un
    paramètre change
  - garantit que les créneaux affichés sont toujours
    cohérents avec l’état courant
====================================================*/

const delay = async (ms: number) => {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error("Le chiffre doit etre positif"));
      return;
    }

    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const loadingSlots = ref<boolean>(true);

watch([() => bookingCategoryId.value, () => bookingServiceId.value, () => bookingStaffId.value, () => bookingSelectedDate.value],
  async ([categoryId, serviceId, staffId, date]) => {
    loadingSlots.value = true;

    if (!categoryId || !serviceId || !staffId || !date) {
      loadingSlots.value = false;
      return;
    }

    bookingStore.setBookingDraft({
      categoryId,
      serviceId,
      staffId,
      date,
    });

    await Promise.all([bookingStore.axiosSlots(), delay(300)]);
    loadingSlots.value = false;
  },
  { immediate: true },
);

onMounted(() => {
  const draft = bookingStore.bookingDraft

  if (draft.categoryId) bookingCategoryId.value = draft.categoryId
  if (draft.serviceId) bookingServiceId.value = draft.serviceId
  if (draft.staffId) bookingStaffId.value = draft.staffId
  if (draft.date) bookingSelectedDate.value = draft.date
})

const bookingSelectedSlot = ref<string | null>('')

const selectSlot = (slot: Slot) => {
  bookingStore.setBookingDraft({
    ...bookingStore.bookingDraft,
    datetime: slot.start,
  });

  bookingSelectedSlot.value = slot.start

  if (!authStore.isLoggedIn) {
    uiStore.bookingAfterLogin = true
    router.push({path: '/login'})
    uiStore.closeBooking()
    return
  }
}

/*===============
  ANIMATIONS SERVICE GSAP
===============*/

const serviceMenu = ref<HTMLElement | null>(null);

const isOpen = ref<boolean>(false);
const isVisible = ref<boolean>(false);

watch(isOpen, async (newVal) => {
  if (newVal && bookingCategoryId.value) {
    isVisible.value = true;

    await nextTick();
    if (!serviceMenu.value) return;

    gsap.fromTo(
      serviceMenu.value,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  } else {
    if (!serviceMenu.value) return;

    gsap.to(serviceMenu.value, {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        isVisible.value = false;
      },
    });
  }
});

/*===============
  BUTTON TOGGLE
===============*/

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};


// 1. loading réel (store)
const rawLoading = computed(
  () => categoryStore.loading || serviceStore.loading || staffStore.loading,
);

// 2. loading affiché (UI)
const loadingPage = ref<boolean>(true);

watch(rawLoading, (isLoading) => {
  if (isLoading) {
    loadingPage.value = true;
  } else {
    setTimeout(() => {
      loadingPage.value = false;
    }, 500);
  }
});

/*===============
  ANIMATION BOOKING PAGE
===============*/

const bookingRef = ref<HTMLElement | null>(null);
const logoRef = ref<HTMLElement | null>(null);
const staffLabel = ref<HTMLElement | null>(null);

const animationOverlayPage = () => {
  if (!bookingRef.value || !staffLabel.value) return;

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.from(logoRef.value, {
      opacity: 0,
      rotate: -90,
      duration: 0.6,
    }
  );

  tl.from(staffLabel.value, {
      opacity: 0,
      x: -80,
      duration: 0.5,
      delay: 0.3
    }
  );
}

watch(loadingPage, async (isLoading) => {
  if (!isLoading) {
    await nextTick();
    animationOverlayPage();
  }
});

watch(() => categoryStore.categories, (categories) => {
    if (categories.length && !bookingCategoryId.value) {
      bookingCategoryId.value = categories[0].id
    }
  }, { immediate: true }
)

const uiStore = useUiStore()

const closeModal = () => {
  uiStore.closeBooking()
  bookingStore.resetBookingDraft()
}

const isBookingContextReady = computed(() =>
  staffStore.staffs.length > 0 &&
  serviceStore.services.length > 0 &&
  categoryStore.categories.length > 0
)

/*=================
 COMPLETED BOOKING
=================*/

// Categorie, service, staff

const isStep1Complete = computed(() => {
  return (
    bookingCategoryId.value &&
    bookingServiceId.value &&
    bookingStaffId.value
  )
})

// Form

const isStep2Complete = computed(() => {
  return (
    bookingSelectedDate.value &&
    bookingSelectedSlot.value
  )
})

/*=================
 PROGRESSION
=================*/

const progress = computed(() => {
  if (
    bookingStore.bookingDraft.categoryId &&
    bookingStore.bookingDraft.serviceId &&
    bookingStore.bookingDraft.staffId &&
    bookingSelectedDate.value &&
    bookingSelectedSlot.value
  ) return 3

  if (bookingStore.bookingDraft.categoryId &&
    bookingStore.bookingDraft.serviceId &&
    bookingStore.bookingDraft.staffId
  ) return 2

  return 1
})

const bookingService = computed(() =>
  serviceStore.services.find(
    s => s.id === bookingStore.bookingDraft.serviceId
  )
)

const bookingStaff = computed(() =>
  staffStore.staffs.find(s => s.id === bookingStore.bookingDraft.staffId)
)

const bookingServiceText11 = computed(() =>
  bookingService.value?.name ?? ""
)

const bookingServiceDuration11 = computed(() =>
  bookingService.value?.duration ?? ""
)

const bookingStaffText11 = computed(() =>
  bookingStaff.value?.firstname ?? ""
)
</script>

<template>
  <main class="page-wrapper">
    <div class="container" ref="bookingRef">
      <section v-if="!bookingStore.isStep1Complete" class="booking">
        <div class="booking__description">
          <p>Préparez votre rendez-vous<strong></strong></p>
          <font-awesome-icon icon="fa-solid fa-xmark" @click="closeModal()" />
        </div>
        <!-- Separator -->
        <div class="separator-top"></div>
        <div class="booking__title">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path
              d="M6 13c2-2 4-2 6 0s4 2 6 0"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        </div>
        <!-- Barre de progression -->
        <ProgressBooking :progress="progress" />
        <!-- booking context ready -->
        <div class="loading-overlay" v-if="!isBookingContextReady">
          <div class="loading-overlay__loader"></div>
        </div>
        <div v-else>
          <!-- Booking category -->
          <section class="booking-category" v-if="categoryStore.categories.length > 0">
            <button
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              :class="{ active: bookingCategoryId === cat.id }"
              class="btn btn-category"
            >
              {{ cat.name }}
            </button>
          </section>
          <!-- Booking services -->
          <section class="booking-service" v-if="filteredService">
            <div>
              <div class="booking-service__description">
                <p class="booking-service__description-text"><span>📋</span>Type de consultation</p>
              </div>
              <div @click="toggleMenu()" class="service-label">
                {{ bookingServiceText || "Choisissez votre prestation" }}
                <span class="service-icon" ref="logoRef">
            <font-awesome-icon icon="fa-solid fa-angle-down" />
          </span>
              </div>
              <div class="service-menu" v-show="isVisible" ref="serviceMenu">
                <div
                  @click="selectService(service.id, service.duration, service.name)"
                  v-for="service in filteredService"
                  :key="service.id"
                  class="service-items"
                  :class="{ 'active-service': service.id === bookingServiceId }"
                >
                  <span class="name">{{ service.name }}</span>
                  <span>{{ service.duration }} min</span>
                  <span>{{ service.price }}€</span>
                </div>
              </div>
              <Calc :isVisible="isVisible" @close="isOpen = false" :transparent="true" />
            </div>
          </section>
          <!-- Booking staff -->
          <section class="booking-staff-wrapper" v-if="staffStore.filteredStaff.length > 0">
            <div class="booking-staff" ref="bookingStaff" :class="{ 'active-booking-staff': staffStore.filteredStaff.length > 0 }">
              <p class="booking-staff__label" ref="staffLabel" :class="{ active: staffStore.filteredStaff.length >= 2 }">
                Avec qui ?
              </p>
              <div class="booking-staff__grid">
                <label v-for="staff in staffStore.filteredStaff" :key="staff.id" class="booking-staff__cards">
                  <!-- Accompagnant -->
                  <div class="booking-staff__card__content" :class="{ 'one-card': staffStore.filteredStaff.length === 1 }">
                    <div class="booking-staff__card__content__avatar">
                      <img v-if="staff.picture" :src="staff.picture.filename" :class="{ 'one-card': staffStore.filteredStaff.length === 1 }" />
                      <span class="name" :class="{ 'one-card': staffStore.filteredStaff.length === 1 }">Maître {{ staff.firstname }}</span>
                    </div>
                    <input
                      @click="selectStaff(staff.id, staff.firstname)"
                      type="radio"
                      name="staff"
                      :value="staff.id"
                    />
                  </div>
                </label>
              </div>
            </div>
          </section>
          <div class="booking__placeholder">
            <p>👤 Veuillez sélectionner un avocat pour afficher les disponibilités</p>
          </div>
        </div>
      </section>

      <!-- RESERVATION : DAY & SLOT -->

      <section v-else-if="!isStep2Complete" class="booking-reservation container-reservation">
        <div class="booking-reservation__summary">
          <div class="booking-reservation__description">
            <span>{{ bookingServiceText11 }}</span>
            <span>• Accompagnante {{ bookingStaffText11 }}</span>
            <span>• {{ bookingServiceDuration11 }} min</span>
          </div>
          <font-awesome-icon icon="fa-solid fa-xmark" @click="closeModal()" />
        </div>
        <!-- SEPARATOR -->
        <div class="separator-top"></div>
        <div class="booking-reservation__title">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path
              d="M6 13c2-2 4-2 6 0s4 2 6 0"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        </div>
        <!-- BARRE DE PROGRESSION -->
        <ProgressBooking :progress="progress" />
        <!-- CRÉNEAUX HORAIRES -->
        <h3 class="booking-reservation-title">Choisissez votre créneau 📅</h3>
        <div class="booking-reservation__items">
          <!-- JOURS TOUJOURS VISIBLES -->
          <div class="booking-reservation__pagination">
            <button @click="prevDays" :disabled="carouselIndex === 0" class="prev-day">‹</button>
            <div class="days-list">
              <button
                v-for="day in visibleDays"
                :key="day.value"
                class="day-item"
                :class="{ active: bookingSelectedDate === day.value }"
                @click="selectDay(day)"
              >
                {{ day.label }}
              </button>
            </div>
            <button @click="nextDays" :disabled="carouselIndex === maxIndex" class="next-day">›</button>
          </div>
          <!-- CRÉNEAUX -->
          <div v-if="loadingSlots" class="loading">
            <span class="loading__loader"></span>
          </div>
          <div v-else-if="bookingStore.slots.length > 0" class="booking-reservation__slots">
            <button
              v-for="slot in bookingStore.slots"
              :key="slot.start"
              class="btn btn-reservation"
              @click="selectSlot(slot)"
              :class="{ 'active': bookingStore.bookingDraft.datetime === slot.start }"
            >
              {{ slot.label }}
            </button>
          </div>
          <div v-else class="booking__no__reservation">
            <p>Aucun créneau disponible.</p>
          </div>
        </div>
      </section>

      <!-- CONFIRMATION -->

      <section v-else class="booking-confirmation">
        <div class="booking-confirmation__summary">
          <div class="booking-confirmation__description">
            <span>{{ bookingServiceText11 }}</span>
            <span>• Accompagnante {{ bookingStaffText11 }}</span>
            <span>• {{ bookingServiceDuration11 }} min</span>
          </div>
          <font-awesome-icon icon="fa-solid fa-xmark" @click="closeModal()" />
        </div>
        <!-- Separator -->
        <div class="separator-top"></div>
        <div class="booking-confirmation__title">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path
              d="M6 13c2-2 4-2 6 0s4 2 6 0"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        </div>
        <ProgressBooking :progress="progress" />
        <BookingConfirmation />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">

.booking-form {
  padding: 10px 0 0 0;
  &__summary {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 13px;
    color: #6b7280;
    text-align: center;
    letter-spacing: 0.2px;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
    span {
      white-space: nowrap;
    }
  }
  &__summary .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    color: black;
  }
  &__description {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    row-gap: 5px;
  }
  &__description p {
    font-family: "Playfair Display", serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #2F2F2F;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
  }
  &__description .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    font-weight: 900;
  }
  .separator-top {
    border-bottom: 1px solid #e0e0e0;
    padding-top: 15px;
    @media (max-width: 767.98px) {
      padding-top: 10px;
    }
  }
  &__title {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 30px;
      width: 30px;
      box-shadow: 0 4px 12px rgba(15, 163, 166, 0.15);
      color: #0FA3A6;
      background: rgba(15, 163, 166, 0.08);
      border-radius: 50%;
      padding: 6px;
    }
  }
}

.booking-confirmation {
  padding: 10px 0 0 0;
  &__summary {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 13px;
    color: #6b7280;
    text-align: center;
    letter-spacing: 0.2px;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
    span {
      white-space: nowrap;
    }
  }
  &__summary .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    color: black;
  }
  &__description {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    row-gap: 5px;
  }
  &__description p {
    font-family: "Playfair Display", serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #2F2F2F;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
  }
  &__description .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    font-weight: 900;
  }
  .separator-top {
    border-bottom: 1px solid #e0e0e0;
    padding-top: 15px;
    @media (max-width: 767.98px) {
      padding-top: 10px;
    }
  }
  &__title {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 34px;
      width: 34px;
      box-shadow: 0 4px 12px rgba(15, 163, 166, 0.15);
      color: #0FA3A6;
      background: rgba(15, 163, 166, 0.08);
      border-radius: 50%;
      padding: 6px;
    }
  }
}

/*=================
  PAGE WRAPPER
=================*/

.page-wrapper {
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  background: linear-gradient(
      180deg,
      #d2d6cf 0%,   /* très légèrement plus foncé */
      #e6e8e2 35%,
      #f7f8f6 100%
  );
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(6px);
  transition: background 0.3s ease;
  padding: 0 10px;
}

/*=================
  CONTAINER
=================*/

.container {
  background: white;
  padding: 0 15px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08);
  @media (max-width: 767.98px) {
    width: 100%;
  }
}

/*=================
  LOADING PAGE
=================*/

.loading-overlay {
  background: #fff;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 400px;
  margin-top: -20px;
  &__loader {
    width: 30px;
    height: 30px;
    border: 5px solid #08d8ea;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 767.98px) {
  .loading-overlay {
    width: 100%;
    height: 350px;
  }
}

/*=================
  BOOKING
=================*/

.booking {
  padding: 20px 0 20px 0;
  &__description {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__description p {
    font-family: "Playfair Display", serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #2F2F2F;
  }
  &__description .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    font-weight: 900;
  }
  .separator-top {
    border-bottom: 1px solid #e0e0e0;
    padding-top: 15px;
  }
  &__title {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 34px;
      width: 34px;
      box-shadow: 0 4px 12px rgba(15, 163, 166, 0.15);
      color: #0FA3A6;
      background: rgba(15, 163, 166, 0.08);
      border-radius: 50%;
      padding: 6px;
    }
  }
  &__subtitle {
    color: rgba(0, 0, 0, 0.55);
    font-size: 14px;
    letter-spacing: 0.2px;
    margin-top: 8px;
  }
}

@media (max-width: 991.98px) {
  .booking {
    padding: 20px 0 20px 0;
    &__description p {
      font-size: 14px;
    }
    &__subtitle {
      font-size: 13px;
    }
  }
}

@media (max-width: 767.98px) {
  .booking {
    padding: 15px 0 0 0;
    &__description p {
      font-size: 12px;
    }
    &__subtitle {
      font-size: 12px;
      text-align: center;
    }
    .separator-top {
      border-bottom: 1px solid #e0e0e0;
      padding-top: 10px;
    }
  }
}

/*===============
  BOOKING CATEGORY
===============*/

.booking-category {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  .btn-category {
    width: 100%;
    max-width: 160px;
    border-radius: 8px;
    font-weight: 500;
    transition: 0.2s ease;
    background: #f1f2f6;
    color: #555;
    padding: 15px 20px;
    font-size: 18px;
    white-space: nowrap;
  }
  .btn-category:hover {
    background: #08d8ea;
    color: white;
  }
  .btn-category.active {
    box-shadow: 0 4px 12px rgba(155, 92, 255, 0.12);
    background: #08d8ea;
    color: white;
  }
}

@media (max-width: 767.98px) {
  .booking-category {
    margin: 30px 0 0 0;
    gap: 10px;
    .btn-category {
      font-size: 14px;
    }
  }
}

/*===============
  BOOKING SERVICES
===============*/

.booking-service {
  z-index: 3;
  position: relative;
  max-width: 450px;
  margin: 22px auto 22px auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &__description {
    margin-bottom: 10px;
    font-weight: 500;
  }
  &__description-text {
    display: flex;
    align-items: center;
    column-gap: 5px;
    font-size: 17px;
    letter-spacing: 0.3px;
  }
  &__description-text span {
    font-size: 15px;
  }
  .service-label {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    padding: 12px 14px;
    border: 1px solid #dfe4ea;
    font-weight: 500;
    color: #4b4b4b;
    gap: 7px;
    font-size: 17px;
    transition: 0.2s ease;
    width: 380px;
  }
  .service-label:hover {
    border-color: #08d8ea;
    color: white;
    background: #08d8ea;
  }
  .service-label .service-icon .fa-angle-down {
    width: 12.5px;
    height: auto;
  }
  .service-menu {
    background: white;
    width: 380px;
    position: absolute;
    border-right: 1px solid #dfe4ea;
    border-left: 1px solid #dfe4ea;
    border-bottom: 1px solid #dfe4ea;
    border-top: none;
    padding: 15px 8px;
    max-height: 270px;
    overflow-y: auto;
    .service-items {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      font-size: 13px;
      color: #47407a;
      padding: 8px;
      &:hover {
        background: #08d8ea;
      }
      .service-name {
        font-weight: 600;
      }
    }
    .service-items.active-service {
      background: var(--blue-reservation);
    }
  }
}

@media (max-width: 991.98px) {
  .booking-service {
    .service-menu {
      .service-items {
        gap: 13px;
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .booking-service {
    display: block;
    &__description {
      margin-bottom: 8px;
    }
    &__description-text {
      justify-content: center;
      font-size: 16px;
    }
    .service-label {
      font-size: 15px;
      width: 100%;
    }
    .service-menu {
      padding: 10px 0;
      width: 100%;
      .service-items {
        gap: 10px;
        font-size: 12px;
      }
    }
  }
}

/*===============
  BOOKING STAFF
===============*/

.booking-staff-wrapper {
  display: flex;
  justify-content: center;
  .booking-staff {
    margin: 0 auto 20px auto;
    &__grid {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    &__label {
      margin-bottom: 7px;
      display: none;
      text-align: left;
      position: relative;
      color: #a0a0a0;
      font-size: 13px;
      font-weight: 500;
      opacity: 0.85;
    }
    &__label.active {
      display: block;
      align-self: flex-start;
    }
    &__label::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 0;
      height: 2px;
      width: 0;
      background-color: #a06bff;
      transition: width 0.25s ease;
    }
    &__cards {
      input[type="radio"] {
        appearance: none;
        width: 15px;
        height: 15px;
        border: 2px solid #dfe4ea;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        cursor: pointer;
        transition: 0.2s;
      }
      /* Effet quand sélectionné */
      input[type="radio"]:checked {
        border-color: #08d8ea;
        background: #08d8ea;
      }
      input[type="radio"]:checked::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      }
      .name {
        color: #6f7a86;
        font-size: 12px;
      }
      .name.one-card {
        font-size: 15px;
        font-weight: 500;
        color: #6f7a86;
      }
    }
    &__card__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 12px;
      border-radius: 12px;
      border: 1px solid #dfe4ea;
      background: white;
      width: 230px;
    }
    &__card__content.one-card {
      padding: 18px 20px;
      gap: 16px;
      width: 340px;
    }
    &__card__content__avatar {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    &__card__content__avatar .name {
      font-size: 13px;
    }
    &__card__content__avatar img {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      object-fit: cover;
    }
    &__card__content__avatar img.one-card {
      width: 72px;
      height: 72px;
    }
  }
}

@media (max-width: 767.98px) {
  .booking-staff-wrapper {
    .booking-staff.active-booking-staff {
      margin: 5px auto 25px auto;
    }
    .booking-staff {
      &__label {
        margin-bottom: 10px;
      }
      &__grid {
        flex-direction: column;
      }
      &__card__content {
        width: 250px;
      }
      &__card__content__avatar .name {
        font-size: 12px;
      }
      &__card__content.one-card {
        width: 230px;
      }
      &__card__content__avatar img.one-card {
        width: 50px;
        height: 50px;
      }
      &__card__content__avatar .name.one-card {
        font-size: 13px;
      }
    }
  }
}

/*===============
  BOOKING PLACEHOLDER
===============*/

.booking__placeholder {
  padding: 20px 10px;
  border-radius: 3px;
  width: auto;
  background: #F5F6F7;
  border: 1px solid #E5E7EB;
  color: #6B7280;
  margin: 0 15px;
  p {
    text-align: center;
    font-size: 15px;
  }
}

@media (max-width: 991.98px) {
  .booking__placeholder {
    p {
      font-size: 13px;
      line-height: 21px;
    }
  }
}

@media (max-width: 767.98px) {
  .booking__placeholder {
    display: none;
  }
}

/*===============
  BOOKING ICON
===============*/

.booking-icon {
  margin: 30px 0 45px 0;
  text-align: center;
  font-size: 22px;
  opacity: 0.5;
}

/*=================
  BOOKING RÉSERVATION
=================*/

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.booking-reservation {
  padding: 10px 0 30px 0;
  display: flex;
  flex-direction: column;
  &__summary {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 13px;
    color: #6b7280;
    text-align: center;
    letter-spacing: 0.2px;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
    span {
      white-space: nowrap;
    }
  }
  &__summary .fa-xmark {
    cursor: pointer;
    width: 16px;
    height: 16px;
    color: black;
  }
  &__description {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    row-gap: 5px;
  }
  &__description p {
    font-family: "Playfair Display", serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #2F2F2F;
    @media (max-width: 767.98px) {
      font-size: 11px;
    }
  }
  .separator-top {
    border-bottom: 1px solid #e0e0e0;
    padding-top: 15px;
  }
  &__title {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 34px;
      width: 34px;
      box-shadow: 0 4px 12px rgba(15, 163, 166, 0.15);
      color: #0FA3A6;
      background: rgba(15, 163, 166, 0.08);
      border-radius: 50%;
      padding: 6px;
    }
  }

  .booking-reservation-title {
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: #5a4e6a;
  }
  &__items {
    padding: 0 15px;
  }
  &__items .day-item {
    outline: none;
    cursor: pointer;
    background: #f4f6f8;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    padding: 10px 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 120px;
    &:hover {
      background: #0fd2e6;
      font-weight: 500;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.08);
      border-color: #0fd2e6;
    }
  }
  &__items .day-item.active {
    font-weight: 500;
    border: none;
    background: #0fd2e6;
    color: #ffffff;
    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.06);
  }
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    .prev-day,
    .next-day {
      background: transparent;
      border: none;
      padding: 0 10px;
      color: black;
      font-size: 26px;
      cursor: pointer;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .prev-day:hover {
      color: #08d8ea;
      transform: translateX(-2px);
    }
    .next-day:hover {
      color: #08d8ea;
      transform: translateX(2px);
    }
    .days-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  &__slots {
    margin: 22px auto 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 10px;
    animation: fadeIn 0.25s ease;
    width: 100%;
    max-width: 300px;
    .btn-reservation {
      background: #f4f6f8;
      border-radius: 10px;
      padding: 20px 0;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 8px rgba(0,0,0,0.06);
      transition: all 0.2s ease;
      &:hover {
        background: #D7EAF2;
        border: 1px solid #BFD6E2;
        color: #1F2937;
      }
    }
    .btn-reservation.active {
      background: #D7EAF2;
      border: 1px solid #BFD6E2;
      color: #1F2937;
    }
    .btn-reservation:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

.booking__no__reservation {
  margin: 60px 0 40px 0;
  text-align: center;
  p {
    font-size: 15px;
    @media (max-width: 767.98px) {
      font-size: 14px;
    }
  }
}

@media (max-width: 991.98px) {
  .booking-reservation {
    .booking-reservation-title {
      display: none;
    }
    &__items {
      margin-top: 30px;
      .day-item {
        font-size: 13px;
      }
    }
    &__pagination {
      display: flex;
      align-items: center;
    }
    &__slots {
      .btn-reservation {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .container-reservation {
    padding: 10px 0 25px 0;
  }

  .booking-reservation {
    .separator-top {
      padding-top: 10px;
    }
    &__items {
      .days-list {
        gap: 8px;
      }
      .day-item {
        font-size: 13px;
      }
    }
    &__pagination {
      display: flex;
      align-items: center;
      .prev-day,
      .next-day {
        padding: 0 20px;
      }
    }
    &__slots {
      margin: 18px auto 0 auto;
      .btn-reservation {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 575.98px) {
  .booking-reservation {
    .separator-top {
      padding-top: 10px;
    }
    &__items {
      .days-list {
        gap: 10px;
      }
      .day-item {
        width: 140px;
        font-size: 13px;
      }
    }
    &__slots {
      margin: 18px auto 0 auto;
      max-width: 250px;
    }
    &__pagination {
      .prev-day,
      .next-day {
        font-size: 24px;
      }
    }
  }
}

/*=================
  LOADING SLOT
=================*/

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  &__loader {
    width: 30px;
    height: 30px;
    border: 5px solid #08d8ea;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
