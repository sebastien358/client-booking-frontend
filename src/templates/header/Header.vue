<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from "vue";
import { useAuthStore } from "@/stores/authStore.ts";
import {useUiStore} from "@/stores/uiStore.ts";
import gsap from "gsap";
import {useRouter} from "vue-router";
import BookingView from "@/features/hairstyle/components/booking/BookingView.vue";
import Calc from "@/templates/calc/Calc.vue";

const authStore = useAuthStore();

const router = useRouter()

/*===============
  ÉTAT CONNEXION, RÉCUPÉRATION UTILISATEUR
===============*/

onMounted(async () => {
  try {
    await authStore.me();
  } catch (e) {
    console.error(e);
  }
});

/*===============
  DÉCONNEXION
===============*/

const logout = () => {
  authStore.logout();
  router.push({ path: "/login" });
  closeMenu();
}

/*===============
  ANIMATION MENU MOBILE
===============*/

const serviceMenu = ref<HTMLElement | null>(null);

const isOpen = ref<boolean>(false);
const isVisible = ref<boolean>(false);

watch(
  isOpen,
  async (newVal) => {
    if (newVal) {
      isVisible.value = true;

      await nextTick();

      if (!serviceMenu.value) return;

      gsap.fromTo(
        serviceMenu.value,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    } else {
      if (!serviceMenu.value) return;

      gsap.to(serviceMenu.value, {
        opacity: 0,
        y: -12,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          isVisible.value = false;
        },
      });
    }
  },
  { flush: "post" },
);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

/*===============
  ANIMATION HEADER
===============*/

const headerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();

  gsap.from(headerRef.value, {
    opacity: 0,
    duration: 0.6,
    y: -15,
    ease: "power2.out",
  });
});

/*===============
  MODAL DE RDV
===============*/

const uiStore = useUiStore()

const bookingOpen = () => {
  uiStore.openBooking()
}

const closeMenu = () => {
  isOpen.value = false;
};
</script>

<template>
  <BookingView v-if="uiStore.isBookingOpen" />
  <header class="header">
    <div class="header__container" ref="headerRef">
      <!-- LOGO -->
      <div class="header__brand">
        <div class="header__logo">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path
              d="M6 13c2-2 4-2 6 0s4 2 6 0"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </svg>
        </div>
        <div class="d-flex flex-column">
          <p>Cabinet Bien-Être</p>
          <span>Consultations sur rendez-vous</span>
        </div>
      </div>
      <!-- NAV DESKTOP -->
      <div class="header__nav">
        <RouterLink to="/" :class="{ active: $route.path === '/' && !$route.hash }"
        >Accueil</RouterLink
        >
        <RouterLink to="/#about" :class="{ active: $route.hash === '#about' }">À propos</RouterLink>
        <RouterLink to="/#services" :class="{ active: $route.hash === '#services' }"
        >Services</RouterLink
        >
        <RouterLink to="/#testimonials" :class="{ active: $route.hash === '#testimonials' }"
        >Témoignages</RouterLink
        >
        <RouterLink
          to="/contact/form"
          :class="{ active: $route.path === '/contact/form' && !$route.hash }"
        >Contact</RouterLink
        >

        <div class="header__actions">
          <font-awesome-icon icon="fa-solid fa-user" @click="toggleMenu()" :class="{ 'active-login': authStore.isLoggedIn }" />
          <div v-show="isVisible" class="header__actions__menu" ref="serviceMenu">
            <RouterLink v-if="!authStore.isLoggedIn" to="/login" :class="{ active: $route.path === '/login' && !$route.hash }">Connexion</RouterLink>
            <RouterLink v-if="authStore.isLoggedIn" to="/admin" :class="{ active: $route.path === '/admin' && !$route.hash }">
              {{ authStore.isAdmin ? 'Espace pro' : 'Espace client' }}
            </RouterLink>
            <router-link to="/register" :class="{ active: $route.path === '/register' && !$route.hash }">Inscription</router-link>
            <a v-if="authStore.isLoggedIn" @click="logout()" href="#" class="#">Déconnexion</a>
          </div>
        </div>
      </div>

      <!-- CTA -->

      <div>
        <button @click="bookingOpen()" class="header__cta">Prendre RDV</button>
      </div>

      <!-- BURGER (mobile) -->

      <button class="header__burger" @click="toggleMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- MENU MOBILE -->
    <div v-show="isVisible" class="mobile-menu" ref="serviceMenu">
      <RouterLink
        to="/"
        @click="closeMenu"
        :class="{ active: $route.path === '/' && !$route.hash }"
      >
        Accueil
      </RouterLink>
      <RouterLink to="/#about" @click="closeMenu" :class="{ active: $route.hash === '#about' }">
        À propos
      </RouterLink>
      <RouterLink
        to="/#services"
        @click="closeMenu"
        :class="{ active: $route.hash === '#services' }"
      >
        Services
      </RouterLink>
      <RouterLink
        to="/#testimonials"
        @click="closeMenu"
        :class="{ active: $route.hash === '#testimonials' }"
      >
        Témoignages
      </RouterLink>
      <RouterLink
        to="/contact/form"
        @click="closeMenu"
        :class="{ active: $route.path === '/contact/form' && !$route.hash }"
      >Contact
      </RouterLink>
      <div>
        <RouterLink
          to="/login"
          @click="closeMenu()"
          :class="{ active: $route.path === '/login' && !$route.hash }"
        >Connexion</RouterLink
        >
      </div>
      <div class="mobile-menu__connected">
        <RouterLink
          to="/admin"
          @click="closeMenu()"
          :class="{ active: $route.path === '/admin' && !$route.hash }"
        >Espace pro</RouterLink
        >
        <a @click="logout()" href="#" class="logout-mobile">Déconnexion</a>
      </div>
      <button @click="bookingOpen()" class="mobile-cta">Prendre RDV</button>
    </div>
  </header>
  <Calc :isVisible="isVisible" @close="isOpen = false" :transparent="true" />
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  background: #ffffffcc;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
  &__container {
    max-width: 1300px;
    margin: auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    p {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    span {
      font-size: 12px;
    }
  }

  /* LOGO */
  &__logo {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    svg {
      width: 18px;
      height: 18px;
      color: #a259ff; /* ton violet clair */
    }
    span {
      font-weight: 600;
      font-size: 1.1rem;
    }
  }
  .active {
    color: #b22ad0;
  }
  /* NAV DESKTOP */
  &__nav {
    display: flex;
    align-items: center;
    gap: 1.8rem;
    a {
      font-size: 14px;
      color: #333;
      transition: 0.2s;
    }
    a:hover {
      color: #b22ad0;
    }
    a:last-child {
      opacity: 0.25;
      font-size: 13px;
    }
    a:last-child:hover {
      opacity: 1;
    }
  }
  &__actions {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.8rem;
    .logout {
      color: #333;
      font-weight: 500;
    }
    .logout:hover {
      color: red;
    }
    .fa-user {
      cursor: pointer;
      font-size: 18px;
      color: #333;
      transition: color 0.2s ease;
      margin-bottom: 5px;
      opacity: 0.6;
    }
    .fa-user:hover {
      opacity: 1;
    }
    .active-login {
      color: green;
    }
  }
  &__actions__menu {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    position: absolute;
    display: flex;
    width: 160px;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 25px 30px;
    gap: 12px;
    top: 65px;
    left: -50px
  }
  &__actions__menu a {
    font-size: 13px;
  }
  /* CTA */
  &__cta {
    background: #ff4dd4;
    color: white;
    padding: 0.7rem 1.2rem;
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 77, 212, 0.35);
    border: 0;
    cursor: pointer;
  }
  /* BURGER */
  &__burger {
    cursor: pointer;
    display: none;
    width: 26px;
    height: 26px;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    background: none;
    padding: 0;
    span {
      width: 100%;
      background: #333;
      border-radius: 10px;
      transition: 0.3s;
      height: 3px;
    }
  }
}

/* MENU MOBILE */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.6rem;
  padding: 2rem;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  &__connected {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  a {
    font-size: 1.2rem;
  }
  .mobile-cta {
    background: #ff4dd4;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    color: white;
    text-align: center;
    border: 0;
  }
}

/* RESPONSIVE */
@media (max-width: 991.98px) {
  .header {
    &__container {
      padding: 0 1rem;
    }
  }
  .header__brand p {
    font-size: 15px;
    font-weight: 600;
  }
  .header__brand span {
    font-size: 12px;
  }
  .header__nav,
  .header__cta {
    display: none;
  }
  .header__burger {
    display: flex;
  }
  .mobile-menu {
    display: flex;
    text-align: center;
    box-shadow: 0 8px 20px rgba(192, 132, 252, 0.25);
    a {
      color: #333;
      font-size: 14px;
      padding: 8px 0;
    }
    .mobile-cta {
      border: 0;
      width: 30%;
      margin: 10px auto 0 auto;
      font-size: 12px;
    }
    .logout-mobile {
      color: red;
    }
  }
}

@media (max-width: 767.98px) {
  .header {
    &__burger {
      width: 22px;
      height: 22px;
    }
  }
  .mobile-menu {
    display: flex;
    text-align: center;
    box-shadow: 0 8px 20px rgba(192, 132, 252, 0.25);
    a {
      color: #333;
      font-size: 13px;
      padding: 8px 0;
    }
    .mobile-cta {
      border: 0;
      width: 37%;
      margin: 10px auto 0 auto;
      font-size: 11px;
    }
  }
}
</style>
