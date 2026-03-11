<script setup lang="ts">
import ScrollTrigger from "gsap/ScrollTrigger";
import {nextTick, onMounted, ref, watch} from "vue";
import { useOpeningStatus } from "@/shared/date/useOpeningStatus.ts";
const { isOpen, closingHour, nextOpening } = useOpeningStatus();
import { useScrollToTop } from "@/shared/scroll-top/scrollTop.ts";
const { scrollToTop, showScrollTop } = useScrollToTop();

import { gsap } from "gsap";
import {useTestimonialStore} from "@/stores/testimonialStore.ts";
import {useUiStore} from "@/stores/uiStore.ts";
gsap.registerPlugin(ScrollTrigger);

const testimonialStore = useTestimonialStore()

/*=================
 OPEN MODAL RDV
=================*/

const uiStore = useUiStore()

const bookingOpen = () => {
  uiStore.openBooking()
}

/*======================
  ANIMATIONS GSAP
======================*/

// Hero
const heroTitleRef = ref<HTMLElement | null>(null);
const heroSpanRef = ref<HTMLElement | null>(null);
const heroOpenRef = ref<HTMLElement | null>(null);

function animationHero() {
  const isDesktop = window.innerWidth > 575.98
  const tl = gsap.timeline();

  tl.from(heroTitleRef.value, {
    opacity: 0,
    x: isDesktop ? -10 : -8,
    duration: isDesktop ? 0.6 : 0.5,
    ease: "power2.out",
  });

  tl.from(
    heroSpanRef.value,
    {
      opacity: 0,
      x: isDesktop ? -6 : -5,
      duration: isDesktop ? 0.6 : 0.5,
      ease: "power2.out",
    },
    "-=0.35",
  );

  tl.from(
    heroOpenRef.value,
    {
      opacity: 0,
      x: isDesktop ? -10 : -8,
      duration: 0.5,
      ease: "power2.out",
    },
    "-=0.3",
  );
}

// About
const aboutImageRef = ref<HTMLElement | null>(null);
const aboutContentRef = ref<HTMLElement | null>(null);

function animationAbout() {
  const isDesktop = window.innerWidth > 575.98

  gsap.from(aboutImageRef.value, {
    opacity: 0,
    x: isDesktop ? 150 : 60,
    duration: isDesktop ? 0.7 : 0.55,
    ease: "power2.out",
    scrollTrigger: {
      trigger: aboutImageRef.value,
      start: "top 80%",
    },
  });

  gsap.from(aboutContentRef.value, {
    opacity: 0,
    x: isDesktop ? -150 : -60,
    duration: isDesktop ? 0.7 : 0.55,
    ease: "power2.out",
    scrollTrigger: {
      trigger: aboutImageRef.value,
      start: "top 80%",
    },
  });
}

// Services Cards

const serviceGridRef = ref<HTMLElement | null>(null);

function animationServices() {
  const cards = serviceGridRef.value.querySelectorAll(".service-card");

  const isDesktop = window.innerWidth > 575.98;

  gsap.from(cards, {
    opacity: 0,
    y: isDesktop ? 30 : 20,
    duration: isDesktop ? 0.5 : 0.45,
    ease: "power2.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: serviceGridRef.value,
      start: "top 85%",
    },
  });
}

// Testimonials cards

const testimonialCardsRef = ref<HTMLElement | null>(null);

function animationTestimonial() {
  const cards = testimonialCardsRef.value?.querySelectorAll(".testimonials-card__items");

  if (!cards || cards.length === 0) return;

  const isDesktop = window.innerWidth > 575.98;

  gsap.from(cards, {
    opacity: 0,
    y: isDesktop ? 12 : 8,
    filter: "blur(10px)",
    duration: isDesktop ? 0.8 : 0.65,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: testimonialCardsRef.value,
      start: "top 80%",
      once: true,
    },
  });
}

watch(
  () => testimonialStore.testimonials.length,
  async (len) => {
    if (!len) return;
    await nextTick();
    animationTestimonial();
  },
);

// Testimonials cta

const ctaRef = ref<HTMLElement | null>(null);

function animationCta() {
  const isDesktop = window.innerWidth > 575.98;

  gsap.from(ctaRef.value, {
    opacity: 0,
    y: isDesktop ? 40 : 28,
    duration: isDesktop ? 0.7 : 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ctaRef.value,
      start: "top 80%",
    },
  });
}

onMounted(async () => {
  await testimonialStore.testimonialList();

  await nextTick();
  animationHero();
  animationAbout();
  animationServices();
  animationCta();
});
</script>

<template>
  <div class="salon-page">
    <!-- MAIN CONTENT -->
    <main>
      <!-- HERO -->
      <section id="hero" class="hero-section">
        <div class="hero">
          <div class="hero__content">
            <span class="hero__badge">⭐ Plus de 150 clientes satisfaites</span>
            <h1 class="hero__title" ref="heroTitleRef">
              Retrouvez équilibre <br />
              <span ref="heroSpanRef">et sérénité</span>
            </h1>
            <p class="hero__text">
              Dans un espace dédié au bien-être et à l’accompagnement, nous vous proposons des
              consultations personnalisées pour vous aider à avancer, à votre rythme, vers un
              mieux-être durable.
            </p>
            <div class="hero__cta">
              <button @click="bookingOpen()" class="btn-primary">
                Réserver maintenant
              </button>
              <a href="tel:+33780468148" class="btn-secondary">
                <font-awesome-icon icon="fa-solid fa-phone" />
                Nous appeler
              </a>
            </div>
            <div class="hero__stats">
              <div><strong>10+</strong><span>Expérience</span></div>
              <div><strong>150+</strong><span>Accompagnements</span></div>
              <div><strong>95%</strong><span>Satisfaction</span></div>
            </div>
          </div>
          <div class="hero__image__wrapper">
            <img src="../../assets/images/hero.jpg" alt="Salon de coiffure" class="hero__image" />
            <div class="hero__open" :class="isOpen ? 'isOpen' : 'isClosed'">
              <span class="dot" ref="heroOpenRef"></span>
              {{ isOpen ? "Ouvert maintenant" : "Fermé actuellement" }} <br />
              <small>{{
                isOpen
                  ? `Ferme à ${closingHour} aujourd’hui`
                  : `Prochaine ouverture à ${nextOpening}`
              }}</small>
            </div>
          </div>
        </div>
      </section>
      <!-- À PROPOS -->
      <section id="about" class="about-section">
        <div class="about">
          <div class="about__image__wrapper" ref="aboutImageRef">
            <img src="../../assets/images/about.jpg" alt="Le salon" class="about__image" />
          </div>
          <div class="about__content" ref="aboutContentRef">
            <h2 class="about__title">
              Notre approche,<br />
              <span>votre équilibre</span>
            </h2>
            <p class="about__text">
              Depuis plus de 10 ans, nous accompagnons des personnes dans leur recherche de
              mieux-être, d’équilibre et de sérénité.
            </p>
            <p class="about__text">
              Chaque accompagnement est pensé comme un temps d’écoute, d’échange et de suivi
              personnalisé, dans un cadre bienveillant et confidentiel.
            </p>
            <div class="about__cards">
              <div class="about-card">
                <div class="icon">💜</div>
                <h3>Écoute</h3>
                <p>Un accompagnement basé sur l’échange et la bienveillance.</p>
              </div>
              <div class="about-card">
                <div class="icon">⭐</div>
                <h3>Expertise</h3>
                <p>Plus de 10 ans d’expérience dans l’accompagnement personnalisé.</p>
              </div>
              <div class="about-card">
                <div class="icon">💚</div>
                <h3>Suivi</h3>
                <p>Un suivi adapté à votre rythme et à vos besoins.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- SERVICES -->
      <section id="services" class="services">
        <div class="services__header">
          <h2 class="services__title">
            Nos services<br />
            <span>d'exception</span>
          </h2>
          <p class="services__subtitle">
            Découvrez une gamme d’accompagnements dédiés à votre bien-être et à votre équilibre
            personnel.
          </p>
        </div>
        <div class="services__cards" ref="serviceGridRef">
          <!-- CARD 1 -->
          <div class="service-card">
            <img
              src="../../assets/images/accompagnement.jpg"
              alt="Coloration"
              class="service-card__image"
            />
            <div class="service-card__content">
              <h3 class="service-card__title">🧘‍♀️ Accompagnement</h3>
              <p class="service-card__text">
                Un accompagnement personnalisé pour vous aider à retrouver équilibre, clarté et
                sérénité dans votre quotidien.
              </p>
              <ul class="service-card__list">
                <li>
                  <div class="service-card__point"></div>
                  <div>Consultation personnalisée</div>
                </li>
                <li>Techniques modernes</li>
                <li>Finition impeccable</li>
              </ul>
              <div class="service-card__footer">
                <span class="price">À partir de 40€</span>
                <button @click="bookingOpen()" class="reserve">Réserver</button>
              </div>
            </div>
          </div>
          <!-- CARD 2 -->
          <div class="service-card">
            <img
              src="../../assets/images/stress.jpg"
              alt="Coloration"
              class="service-card__image"
            />
            <div class="service-card__content">
              <h3 class="service-card__title">🌿 Stress & émotions</h3>
              <p class="service-card__text">
                Apprenez à mieux comprendre et apaiser vos tensions émotionnelles et mentales.
              </p>
              <ul class="service-card__list">
                <li>Produits premium</li>
                <li>Techniques d’experts</li>
                <li>Couleur sur-mesure</li>
              </ul>
              <div class="service-card__footer">
                <span class="price">À partir de 40€</span>
                <button @click="bookingOpen()" class="reserve">Réserver</button>
              </div>
            </div>
          </div>
          <!-- CARD 3 -->
          <div class="service-card">
            <img
              src="../../assets/images/person.jpg"
              alt="Soins & Traitements"
              class="service-card__image"
            />
            <div class="service-card__content">
              <h3 class="service-card__title">✨ Développement personnel</h3>
              <p class="service-card__text">
                Un accompagnement pour avancer, prendre du recul et vous reconnecter à l’essentiel.
              </p>
              <ul class="service-card__list">
                <li>Diagnostic personnalisé</li>
                <li>Soins restructurants</li>
                <li>Résultats durables</li>
              </ul>
              <div class="service-card__footer">
                <span class="price">À partir de 40€</span>
                <button @click="bookingOpen()" class="reserve">Réserver</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- TESTIMONIALS -->
      <section id="testimonials" class="testimonials-section">
        <div class="testimonials">
          <!-- HEADER -->
          <div class="testimonials__header">
            <h2 class="testimonials__title">
              Nos clients<br />
              <span>témoignent</span>
            </h2>
            <p class="testimonials__subtitle">
              Découvrez les retours de celles et ceux qui nous ont fait confiance pour leur
              bien-être et leur accompagnement.
            </p>
          </div>
          <!-- CARDS -->
          <div v-if="testimonialStore.loading" class="loading-overlay">
            <span class="loading-overlay__loader"></span>
          </div>
          <div
            v-else-if="testimonialStore.publishedTestimonials.length"
            ref="testimonialCardsRef"
            class="testimonials-card"
          >
            <div class="testimonials-card__elems" ref="testimonialRef">
              <div
                v-for="testimonial in testimonialStore.publishedTestimonials"
                :key="testimonial.id"
                class="testimonials-card__items"
              >
                <div class="testimonials-card__content">
                  <div class="testimonials-card__stars">
                    <span v-for="nbr in testimonial.rating" :key="nbr">⭐️</span>
                  </div>
                  <p class="testimonials-card__text">{{ testimonial.message }}</p>
                  <div class="testimonials-card__user">
                    <img
                      v-if="testimonial.picture"
                      :src="testimonial.picture.filename"
                      alt="Photos clients"
                    />
                    <img v-else src="@/assets/images/téléchargement.svg" alt="Photos clients" />
                    <div>
                      <div class="name">{{ testimonial.author }}</div>
                      <div class="role">{{ testimonial.job }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Aucun témoignage pour le moment.</p>
          </div>
          <!-- REDIRECT LINK -->
          <div class="testimonials-redirect__link">
            <router-link to="/testimonials">Voir tous les témoignages →</router-link>
          </div>
          <!-- BOTTOM CTA -->
          <div class="testimonials__cta" ref="ctaRef">
            <h3 class="testimonials-title">Ils nous ont fait confiance</h3>
            <p class="testimonials-subtitle">
              Plus de 150 personnes nous ont déjà fait confiance pour leur bien-être et leur
              accompagnement. À votre tour de découvrir une approche humaine, bienveillante et
              personnalisée.
            </p>
            <div class="testimonials__stats">
              <img src="../../assets/images/user-1.jpg" class="avatars" alt="Marie Dubois" />
              <img src="../../assets/images/user-2.jpg" class="avatars" alt="Sophie Martin" />
              <img src="../../assets/images/user-3.jpg" class="avatars" alt="Camille Rousseau" />
              <div class="avatars-users"><span>+150</span></div>
              <div class="testimonials__item">
                <div class="stat">95% de satisfaction</div>
                <span class="reviews">Une expérience reconnue et appréciée</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- SCROLL TO TOP -->
    <button
      class="scroll-top"
      :class="{ 'is-visible': showScrollTop }"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<style scoped lang="scss">
/*==========================
  SCROLL TO TOP
==========================*/

.scroll-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a259ff, #ff4dd4);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(162, 89, 255, 0.35);
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.scroll-top.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/*==========================
  SALON PAGE
==========================*/

.salon-page {
  overflow: hidden;
  z-index: 6;
}

/*==========================
  HERO SECTION
==========================*/

.hero-section {
  position: relative;
  background: radial-gradient(
    circle at top right,
    #f7eaea 0%,
    #f8f4f2 40%,
    #faf8f6 70%,
    #fdfdfd 100%
  );
  width: 100%;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/*==========================
  HERO
==========================*/

.hero {
  max-width: 1300px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  margin: 0 auto;
  padding: 6rem 1rem 6rem 1rem;
  @media (max-width: 1600px) {
    padding: 5rem 1rem 5rem 1rem;
  }
  /*=====================
        LEFT CONTENT
  ======================*/
  &__badge {
    font-size: 15px;
    opacity: 0.8;
    display: inline-block;
    margin-bottom: 1rem;
  }
  &__title {
    font-size: 47px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.2rem;

    span {
      color: #ad46ffff;
    }
  }
  &__text {
    max-width: 420px;
    font-size: 16px;
    margin-bottom: 2rem;
    color: #444;
    line-height: 1.55;
  }
  &__cta {
    margin-bottom: 2rem;
    .btn-primary {
      cursor: pointer;
      background: linear-gradient(90deg, #9b4dff 0%, #d66bff 100%);
      color: #fff;
      font-weight: 600;
      padding: 15px 1.8rem;
      border-radius: 999px;
      border: 0;
      transition: 0.25s ease;
      box-shadow: 0 4px 12px rgba(155, 77, 255, 0.25);
      width: 240px;
      margin: auto;
      font-size: 13px;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(155, 77, 255, 0.35);
    }
    .btn-secondary {
      background: #f5f5f5;
      border-radius: 8px;
      cursor: pointer;
      padding: 12px 10px;
      border: 1px solid #ad46ffff;
      color: #ad46ffff;
      margin: 0 auto 0 15px;
      white-space: nowrap;
      font-size: 13px;
    }

    .fa-phone {
      margin-right: 5px;
    }
  }
  .hero__stats {
    display: flex;
    align-items: center;
    gap: 2.5rem; /* l’espace que tu as déjà mis */
  }
  .hero__stats strong {
    display: block;
    font-size: 1.6rem; /* chiffre mis en valeur */
  }
  .hero__stats span {
    font-size: 0.85rem;
    opacity: 0.75;
    line-height: 1.2; /* texte plus discret */
  }
  /* =====================
         RIGHT IMAGE
  ====================== */
  &__image__wrapper {
    position: relative;
  }
  &__image {
    border-radius: 22px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
    width: 100%;
    object-fit: cover;
    object-position: center top;
  }
  &__open {
    position: absolute;
    bottom: -18px;
    left: 24px;
    background: white;
    padding: 12px 16px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    font-size: 14px;

    line-height: 17px;
  }
  &__open .dot {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 3px;
  }
  &__open.isOpen .dot {
    background: #0ecf40;
  }
  &__open.isClosed .dot {
    background-color: #dc2626; /* red-600 */
    box-shadow: none;
  }
}


/* =====================
  RESPONSIVE
====================== */

@media (max-width: 991.98px) {
  .hero-section {
    min-height: auto !important;
    align-items: flex-start;
    padding: 0 2rem;
  }
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 3rem 0;
    &__badge {
      font-size: 14px;
    }
    &__cta {
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn-secondary {
        margin: 15px 0 0 0;
      }
    }
    &__text {
      margin: 0 auto 1.5rem auto;
      font-size: 15px;
    }
    &__content {
      order: 2;
    }
    &__title {
      font-size: 32px;
    }
    &__cta {
      justify-content: center;
    }
    &__stats {
      justify-content: center;
      margin-top: 2rem;
    }
    &__image-wrapper {
      order: 1;
    }
    .hero__open {
      left: 50%;
      transform: translateX(-50%);
      font-size: 13px;
      line-height: 16px;
      small {
        margin-top: 15px;
      }
    }
    .hero__stats {
      gap: 1.7rem;
    }
    .hero__stats strong {
      display: block;
      font-size: 1.4rem; /* chiffre mis en valeur */
    }
    .hero__stats span {
      font-size: 0.85rem;
      opacity: 0.75;
      line-height: 1.2; /* texte plus discret */
    }
  }
}

@media (max-width: 677.98px) {
  .hero-section {
    min-height: auto !important;
    align-items: flex-start;
    padding: 0;
  }
  .hero {
    padding: 1.5rem 1rem;
    grid-template-columns: 1fr;
    text-align: center;
    &__title {
      font-size: 24px;
    }
    &__stats {
      flex-direction: column;
      gap: 1rem;
    }
    &__image {
      width: 100%;
      border-radius: 22px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
    }
    &__cta {
      flex-direction: column;
    }
    &__image-wrapper {
      order: 1;
    }
    .hero__open {
      line-height: 16px;
      font-size: 12px;
    }
    &__badge {
      font-size: 13px;
    }
    &__cta {
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn-secondary {
        margin: 15px 0 0 0;
      }
    }
    &__text {
      margin: 0 auto 1.3rem auto;
      font-size: 14px;
    }
    .hero__stats {
      gap: 1.7rem;
    }
    .hero__stats strong {
      display: block;
      font-size: 1.2rem;
    }
    .hero__stats span {
      font-size: 0.85rem;
      opacity: 0.75;
      line-height: 1.2;
    }
  }
}

/*===============
  ABOUT
===============*/

.about-section {
  background: radial-gradient(
    circle at top left,
    #f5edf9 0%,
    #f7f3fb 35%,
    #faf7ff 70%,
    #ffffff 100%
  );
}

.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem;
  /* IMAGE */
  &__image__wrapper {
    width: 100%;
  }
  &__image {
    width: 100%;
    border-radius: 22px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
    filter: saturate(0.9) contrast(0.95);
  }
  /* TEXT CONTENT */
  &__title {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    span {
      color: oklch(0.627 0.265 303.9);
    }
  }
  &__text {
    font-size: 16px;
    line-height: 1.65;
    margin-bottom: 1.4rem;
    color: #444;
  }
  &__cards {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  .about-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 16px;
    padding: 1.4rem;
    text-align: center;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.05);
    height: 200px;
    width: 160px;
    .icon {
      font-size: 1.8rem;
      margin-bottom: 0.6rem;
    }
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    p {
      opacity: 0.5;
      font-size: 12px;
      line-height: 1.5;
    }
  }
}

/* ======================
  RESPONSIVE
====================== */

@media (max-width: 991.98px) {
  .about {
    grid-template-columns: 1fr;
    padding: 1rem 2rem;
    &__title {
      font-size: 1.9rem;
      text-align: center;
    }
    &__text {
      text-align: center;
      font-size: 15px;
      margin-bottom: 0.6rem;
    }
    &__image__wrapper {
      order: 1;
    }
    &__content {
      order: 2;
      margin-top: 2rem;
      max-width: 100%;
    }
    &__cards {
      justify-content: center;
    }
  }
}

@media (max-width: 767.98px) {
  .about {
    grid-template-columns: 1fr;
    padding: 1rem;
    &__cards {
      flex-direction: column;
      gap: 1.2rem;
    }
    &__title {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
    &__text {
      font-size: 14px;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    .about-card {
      width: 100%;
      max-width: 250px;
    }
  }
}

/*===============
  SERVICES
===============*/

.services {
  max-width: 1300px;
  margin: 5rem auto;
  padding: 0 2rem;
  /* HEADER */
  &__header {
    text-align: center;
    margin-bottom: 3rem;
  }
  &__title {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 1.2;
    span {
      color: oklch(0.627 0.265 303.9);
    }
  }
  &__subtitle {
    margin-top: 1rem;
    color: #555;
    font-size: 16px;
    line-height: 20px;
  }
  /* CARDS */
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  &__cards li {
    display: flex;
    align-items: center;
  }
  &__point {
    width: 6px;
    height: 6px;
    margin-top: 7px;
    border-radius: 50%;
    background: #b874ff; /* ton violet */
    flex-shrink: 0;
  }
  .service-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    &__image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    &__content {
      padding: 1.6rem;
    }
    &__title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
    }
    &__text {
      color: #555;
      line-height: 1.5;
      margin-bottom: 1rem;
      font-size: 15px;
    }
    &__list {
      margin-bottom: 1.5rem;
      color: #444;
      opacity: 0.9;
      padding-left: 0;
      list-style: none;
    }
    &__list li {
      position: relative;
      padding-left: 16px; /* espace pour le point */
      font-size: 13px;
      line-height: 1.5;
    }
    &__list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.75em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #b874ff;
      transform: translateY(-50%);
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.6rem 1.6rem;
    }
    &__footer .price {
      font-weight: 600;
      color: #c025d6;
      font-size: 14px;
    }
  }
  .reserve {
    background: #c025d6;
    color: #fff;
    border: none;
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      opacity: 0.85;
    }
  }
  /* BUTTON BOTTOM */
  &__button-wrapper {
    text-align: center;
    margin-top: 3rem;
  }
  &__btn {
    background: linear-gradient(90deg, #c025d6, #ff77dd);
    color: #fff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.25s;
    &:hover {
      transform: translateY(-2px);
    }
  }
}

/* ================= RESPONSIVE ================= */

@media (max-width: 991.98px) {
  .services {
    margin: 5rem auto 4rem auto;
    padding: 0 2rem;
    &__title {
      font-size: 1.9rem;
    }
    &__subtitle {
      font-size: 15px;
    }
    &__cards {
      grid-template-columns: 1fr;
      gap: 1.3rem;
    }
  }
}

@media (max-width: 767.98px) {
  .services {
    margin: 5rem auto 3rem auto;
    padding: 0 1rem;
    &__header {
      margin-bottom: 2rem;
    }
    &__title {
      font-size: 1.4rem;
    }
    &__subtitle {
      font-size: 14px;
    }
    &__cards {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .service-card {
      &__footer .price {
        font-size: 13px;
      }
    }
    .service-card {
      &__content {
        padding: 1.1rem;
      }
      &__title {
        font-size: 1.1rem;
        margin-bottom: 0.8rem;
      }
      &__text {
        line-height: 1.4;
        margin-bottom: 1rem;
        font-size: 15px;
      }
      &__list {
        margin-bottom: 1.5rem;
        color: #444;
        opacity: 0.9;
        padding-left: 0;
        list-style: none;
      }
      &__list li {
        position: relative;
        padding-left: 16px;
        font-size: 13px;
        line-height: 1.5;
      }
      &__list li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.75em;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #b874ff;
        transform: translateY(-50%);
      }
      &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.6rem 1.6rem;
      }
      &__footer .price {
        font-weight: 600;
        color: #c025d6;
        font-size: 14px;
      }
    }
  }
}

/*===============
 TESTIMONIALS
===============*/

.testimonials-section {
  background: radial-gradient(
    circle at bottom center,
    #f8eefa 0%,
    #faf5fb 40%,
    #fdfbfc 75%,
    #ffffff 100%
  );
}

.testimonials {
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem 2rem;
  &__header {
    text-align: center;
    margin-bottom: 3rem;
  }
  h2 {
    font-size: 2.4rem;
    font-weight: 700;
    span {
      color: oklch(0.627 0.265 303.9);
    }
  }
  &__subtitle {
    margin-top: 1rem;
    color: #555;
    font-size: 1.05rem;
  }
}

@media (max-width: 991.98px) {
  .testimonials {
    padding: 3rem 2rem 6rem 2rem;
    h2 {
      font-size: 1.9rem;
    }
    &__subtitle {
      font-size: 15px;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials {
    padding: 3rem 1rem 3rem 1rem;
    &__header {
      margin-bottom: 2rem;
    }
    h2 {
      font-size: 1.4rem;
    }
    &__subtitle {
      font-size: 14px;
      line-height: 20px;
    }
  }
}

// testimonial cards

.testimonials-card {
  display: flex;
  justify-content: center;
  &__elems {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    gap: 1.5rem;
  }
  &__content {
    background: #fff7f7;
    border-radius: 18px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    height: 100%;
  }
  &__items {
    flex: 0 0 370px; // largeur fixe, pas de shrink
  }
  &__stars {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    color: #ffbf00;
    font-size: 1.3rem;
    column-gap: 3px;
  }
  &__text {
    margin-bottom: 1rem;
    color: #555;
    font-size: 15px;
    line-height: 1.4;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  &__user {
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
    }
    .name {
      font-size: 15px;
      font-weight: 600;
    }
    .role {
      color: #777;
      font-size: 14px;
    }
  }
}

@media (max-width: 991.98px) {
  .testimonials-card {
    &__elems {
      gap: 1.3rem;
    }
    &__items {
      flex: 0 0 370px;
    }
    &__stars {
      font-size: 1rem;
    }
    &__text {
      color: #555;
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 0.8rem;
    }
    &__text {
      color: #555;
      font-size: 14px;
      line-height: 1.2;
    }
    &__user .name {
      font-size: 13px;
    }
    &__user .role {
      font-size: 12px;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials-card {
    &__elems {
      gap: 1rem;
    }
    &__items {
      flex: 0 0 100%;
    }
    &__stars {
      font-size: 0.8rem;
    }
    &__text {
      color: #555;
      font-size: 13px;
    }
    &__user .name {
      font-size: 12px;
    }
    &__user .role {
      font-size: 11px;
    }
  }
}

/*=================
  LOADING TESTIMONIALS
=================*/

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-bottom: 25px;
  &__loader {
    width: 36px;
    height: 36px;
    border: 5px solid #b874ff;
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

@media (max-width: 991.98px) {
  .loading-overlay {
    align-items: center;
    &__loader {
      width: 35px;
      height: 35px;
    }
  }
}

@media (max-width: 767.98px) {
  .loading-overlay {
    padding-bottom: 15px;
    &__loader {
      width: 30px;
      height: 30px;
    }
  }
}

/*======================
  TESTIMONIAL LINK
======================*/

.testimonials-redirect__link {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
  @media (max-width: 575.98px) {
    margin-bottom: 2rem;
  }
  a {
    color: #6b5e7a;
    font-weight: 500;
    font-size: 13px;
    @media (max-width: 575.98px) {
      font-size: 12px;
    }
  }
}

.testimonials-redirect__link a:hover {
  color: #9b6edc;
  transform: translateX(2px);
}

/*======================
  NO TESTIMONIAL
======================*/

.empty-state {
  text-align: center;
  position: relative;
  bottom: 20px;
  margin-bottom: 20px;
  color: #9ca3af; /* gris doux */
  font-size: 15px;
}

/*======================
  CTA BOTTOM
======================*/

.testimonials__cta {
  background: #ece0f7;
  padding: 1.7rem;
  border-radius: 20px;
  text-align: center;
  max-width: 620px;
  margin: 0 auto;
  opacity: 0.9;
  .testimonials-title {
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 15px;
    @media (max-width: 991.98px) {
      font-size: 18px;
      margin-bottom: 10px;
    }
    @media (max-width: 767.98px) {
      font-size: 15px;
    }
  }
  .testimonials-subtitle {
    color: #4b5563;
    font-size: 0.9rem;
    @media (max-width: 767.98px) {
      font-size: 0.8rem;
    }
  }
}

.testimonials__stats {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .avatars {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-left: -8px;
  }
  .avatars-users {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-left: -8px;
    background: #ad46ffff;
    color: white;
  }
  .avatars-users span {
    font-size: 11px;
  }
  .avatars img:first-child {
    margin-left: 0;
  }
}

@media (max-width: 991.98px) {
  .testimonials__stats {
    margin-top: 1rem;
    .avatars {
      width: 34px;
      height: 34px;
    }
    .avatars-users {
      width: 34px;
      height: 34px;
    }
    .avatars-users span {
      font-size: 10px;
    }
    .avatars img:first-child {
      margin-left: 0;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials__stats {
    margin-top: 0.8rem;
    .avatars {
      width: 32px;
      height: 32px;
    }
    .avatars-users {
      width: 32px;
      height: 32px;
    }
    .avatars-users span {
      font-size: 10px;
    }
    .avatars img:first-child {
      margin-left: 0;
    }
  }
}

// Items
.testimonials__item {
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .stat {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .reviews {
    color: #555;
    font-size: 12px;
  }
}

@media (max-width: 991.98px) {
  .testimonials__item {
    .stat {
      font-size: 14px;
    }
    .reviews {
      font-size: 11px;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials__item {
    .stat {
      font-size: 12px;
    }
    .reviews {
      font-size: 10px;
    }
  }
}
</style>
