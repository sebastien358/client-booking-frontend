<script setup lang="ts">
import { useBookingAdminStore } from "@/stores/admin/bookingAdminStore.ts";
import { useTestimonialAdminStore } from "@/stores/admin/testimonialAdminStore.ts";
import { useServiceAdminStore } from "@/stores/admin/serviceAdminStore.ts";
import { useContactAdminStore } from "@/stores/admin/contactAdminStore.ts";
import { useStaffAdminStore } from "@/stores/admin/staffAdminStore.ts";
import { computed, onMounted, ref, watch } from "vue";
import Calc from "@/templates/calc/Calc.vue";
import { useRoute } from "vue-router";
import gsap from "gsap";
import {useAuthStore} from "@/stores/authStore.ts";

const authStore = useAuthStore()

const bookingAdminStore = useBookingAdminStore();
const testimonialAdminStore = useTestimonialAdminStore();
const serviceAdminStore = useServiceAdminStore();
const contactAdminStore = useContactAdminStore();
const staffAdminStore = useStaffAdminStore();

onMounted(async () => {
  if (!bookingAdminStore.bookings.length) {
    await bookingAdminStore.bookingAdminList();
  }
  if (!testimonialAdminStore.testimonials.length) {
    await testimonialAdminStore.testimonialAdminList();
  }
  if (!serviceAdminStore.services.length) {
    await serviceAdminStore.servicesList();
  }
  if (!contactAdminStore.contacts.length) {
    await contactAdminStore.contactAdminList();
  }
  if (!staffAdminStore.staffs.length) {
    await staffAdminStore.staffList();
  }
});

const bookingCount = computed(() => bookingAdminStore.bookings.length);
const testimonialCount = computed(() => testimonialAdminStore.testimonials.length);
const serviceCount = computed(() => serviceAdminStore.services.length);
const contactCount = computed(() => contactAdminStore.contacts.length);
const staffCount = computed(() => staffAdminStore.staffs.length);

/*==============
  DÉTECTION DE LA ROUTE ACTUELLE
*=============*/

const route = useRoute();

/*==============
  LIENS DU MENU ADMIN
*=============*/

const adminLinks = [
  { name: "Accueil", path: "/" },
  { name: 'Mes rendez-vous', path: "/admin/booking/me", admin: false },
  { name: 'Mes données', path: "/admin/update/me", admin: false },
  { name: "Rendez-vous", path: "/admin/booking/list", admin: true },
  { name: "Accompagnants", path: "/admin/staff/list", admin: true },
  { name: "Services", path: "/admin/service/list", admin: true },
  { name: "Contacts", path: "/admin/contact/list", admin: true },
  { name: "Témoignages", path: "/admin/testimonial/list", admin: true },
  { name: "Ajout Service", path: "/admin/service/form", admin: true },
  { name: "Ajout accompagnant", path: "/admin/staff/form", admin: true },
];

const visibleLinks = computed(() =>
  adminLinks.filter((link) => {
    if (link.admin && !authStore.isAdmin) {
      return false
    }
    return true
  })
)

/*==================
  PERMET D'AJOUTER UNE CLASSE ACTIVE AU LIEN ACTUELLE
==================*/

const isActive = (path: string) => route.path === path;

/*==================
  PERMET DE RÉCUPÉRER LA QUANTITÉE DE MESSAGE ET DE TÉMOIGNAGE DANS LE STORE
==================*/

const totalCount = ref<number>(0);
const totalLabel = ref<string | null>(null);

const fetchCount = () => {
  if (route.name === "booking-list") {
    totalLabel.value = "Nombre de rendez-vous: ";
    totalCount.value = bookingCount;
    return;
  }

  if (route.name === "service-list") {
    totalLabel.value = "Nombre de service(s): ";
    totalCount.value = serviceCount;
    return;
  }

  if (route.name === "testimonial-list") {
    totalLabel.value = "Nombre de témoignage(s): ";
    totalCount.value = testimonialCount;
    return;
  }

  if (route.name === "contact-list") {
    totalLabel.value = "Nombre de contact(s): ";
    totalCount.value = contactCount;
    return;
  }

  if (route.name === "staff-list") {
    totalLabel.value = "Nombre d'accompagnant(s): ";
    totalCount.value = staffCount;
    return;
  }
};

onMounted(() => {
  fetchCount();
});

watch(
  () => route.name,
  () => fetchCount(),
);

/*==================
   RESET CONTACT OU TESTIMONIAL
==================*/

async function resetList() {
  try {
    if (route.name === "staff-list") {
      await staffAdminStore.resetStaff();
      return;
    }

    if (route.name === "testimonial-list") {
      await testimonialAdminStore.resetTestimonialList();
      return;
    }

    if (route.name === "service-list") {
      await serviceAdminStore.resetServiceList();
      return;
    }

    if (route.name === "booking-list") {
      await bookingAdminStore.resetBooking();
      return;
    }

    if (route.name === "contact-list") {
      await contactAdminStore.resetContact();
      return;
    }
  } catch (e) {
    console.error(e);
  }
}

const showButton = computed(
  () =>
    route.name === "contact-list" ||
    route.name === "service-list" ||
    route.name === "booking-list" ||
    route.name === "testimonial-list" ||
    route.name === "staff-list",
);

/*==================
  ANIMATION DU GSAP MENU MOBILE
==================*/

const isOpen = ref<boolean>(false);
const isVisible = ref<boolean>(false);
const menuMobile = ref<HTMLElement | null>(null);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

watch(isOpen, async (newVal) => {
  if (newVal) {
    isVisible.value = true;

    if (!menuMobile.value) return;

    gsap.fromTo(
      menuMobile.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  } else {
    if (!menuMobile.value) return;

    gsap.to(menuMobile.value, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        isVisible.value = false;
      },
    });
  }
});
</script>

<template>
  <div class="admin-sidebar">
    <div class="admin-sidebar__container">
      <h2>Admin</h2>
      <div class="admin-sidebar__container__nav">
        <router-link
          v-for="link in visibleLinks"
          :key="link.path"
          :to="link.path"
          :class="{ active: isActive(link.path) }"
        >
          {{ link.name }}
        </router-link>
      </div>
    </div>
    <div v-if="showButton" class="reset-contact">
      <p>
        {{ totalLabel }}<span>{{ totalCount }}</span>
      </p>
      <button @click="resetList()" class="btn btn-reset">Réinitialiser</button>
    </div>
  </div>

  <div class="admin-menu-mobile">
    <p>Sébastien Petit</p>
    <font-awesome-icon @click="toggleMenu()" icon="fa-solid fa-bars" />
    <div ref="menuMobile" class="admin-menu-mobile_toggle">
      <nav class="admin-menu-mobile_toggle_nav" aria-label="Main navigation" role="navigation">
        <router-link
          v-for="link in visibleLinks"
          :key="link.path"
          :to="link.path"
          class="link"
          :class="{ active: isActive(link.path) }"
        >
          {{ link.name }}
        </router-link>
        <div v-if="showButton" class="reset-contact">
          <p>
            {{ totalLabel }}<span>{{ totalCount }}</span>
          </p>
          <button @click="resetList()" class="btn btn-reset">Réinitialiser</button>
        </div>
      </nav>
    </div>
  </div>
  <Calc :isVisible="isVisible" @close="isOpen = false" :transparent="true" />
</template>

<style scoped lang="scss">
/*==================
  ADMIN SIDEBAR
==================*/

.admin-sidebar {
  width: 230px;
  background: #0f0f12;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid #333;
  padding: 25px 15px 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.3s ease;
  &__container {
    h2 {
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
      color: #4caf50;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }
  &__container__nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    a {
      color: #aaa;
      text-decoration: none;
      padding: 0.7rem 0.8rem;
      border-radius: 6px;
      transition: all 0.25s ease;
      font-size: 13px;
      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
        transform: translateX(2px);
      }
      &.active {
        background: rgba(76, 175, 80, 0.2);
        color: #fff;
        font-weight: 600;
      }
    }
  }
  .reset-contact {
    display: flex;
    flex-direction: column;
    p, span {
      font-size: 12px;
      margin-bottom: 6px;
    }
  }
}

.btn {
  border: 0;
  &-reset {
    background: #ff4d4d;
    color: white;
    font-size: 12px;
    padding: 8px;
    transition: all 600ms ease;
    border-radius: 3px;
    @media (max-width: 991.98px) {
      font-size: 10px;
    }
    &:hover {
      background: #ff3838;
      transform: translateY(-1px);
    }
  }
}

/*===============
  RESPONSIVE TABLET
===============*/

@media (max-width: 991.98px) {
  .admin-sidebar {
    flex-direction: row;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    border-bottom: 1px solid #333;
    padding: 0 25px 0 15px;
    height: 100px;
    @media (max-width: 991.98px) {
      display: none;
    }
    &__container {
      display: flex;
      align-items: center;
      h2 {
        display: none;
      }
    }
    &__container__nav {
      align-items: center;
      flex-direction: row;
      column-gap: 12px;
    }
    .reset-contact {
      display: initial;
      p,
      span {
        display: none;
      }
      .btn {
        margin: 0;
        min-width: initial;
        padding: 9px 8px;
      }
    }
  }
}

/*===============
  RESPONSIVE MOBILE
===============*/

.admin-menu-mobile {
  display: none;
}

@media (max-width: 991.98px) {
  .admin-menu-mobile {
    z-index: 500;
    display: flex;
    justify-content: space-between;
    align-content: center;
    backdrop-filter: blur(6px);
    background: white;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding: 20px 10px;
    p {
      white-space: nowrap;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }
    .fa-bars {
      cursor: pointer;
      font-size: 19px;
      color: #fff;
    }
    &_toggle {
      position: absolute;
      padding: 10px 10px 5px 10px;
      background: white;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      top: 70px;
      right: 10px;
      opacity: 0;
    }
    &_toggle_nav {
      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;
      .reset-contact {
        margin-top: 2px;
        display: flex;
        flex-direction: column;
        row-gap: 6px;
        p {
          font-size: 9px;
          margin: 0;
          color: gray;
          font-weight: normal;
        }
        span {
          color: gray;
          font-size: 9px;
        }
      }
    }
    &_toggle_nav .link {
      color: black;
      transition: color 0.3s ease;
      font-size: 11px;
      &:hover {
        color: #b22ad0;
      }
      &.router-link-active {
        color: #b22ad0;
      }
    }
  }
}
</style>
