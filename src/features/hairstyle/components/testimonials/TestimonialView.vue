<script setup lang="ts">
import { useTestimonialStore } from "@/stores/testimonialStore.ts";
import { onMounted, ref, nextTick, watch } from "vue";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import TestimonialModal from "@/templates/testimonial-modal/TestimonialModal.vue";

gsap.registerPlugin(ScrollTrigger);

const testimonialStore = useTestimonialStore();

const showTestimonialModal = ref<boolean>(false);

/* ===========================
  TESTIMONIALS
=========================== */

onMounted(async () => {
  await testimonialStore.resetTestimonials();
  await testimonialStore.testimonialList();
});

/* ===========================
 ANIMATION TESTIMONIAL
=========================== */

const testimonialRef = ref<HTMLElement | null>(null);

function animationTestimonial() {
  const cards = testimonialRef.value?.querySelectorAll(".testimonials-card__items");

  if (!cards || cards.length === 0) return;

  gsap.from(cards, {
    opacity: 0,
    y: 12,              // léger → OK mobile
    filter: "blur(8px)",
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: testimonialRef.value,
      start: "top 80%",
      once: true,       // pas de replay chelou
    },
  });
}

watch(
  () => testimonialStore.testimonials.length,
  async (len) => {
    if (!len) return;

    // 👇 IMPORTANT : corrige le bug mobile
    window.scrollTo({ top: 0, behavior: "auto" });

    await nextTick();
    animationTestimonial();
  },
);


function toggleModal() {
  showTestimonialModal.value = !showTestimonialModal.value;
}
</script>

<template>
  <!-- TESTIMONIALS -->
  <div id="testimonials-section" class="testimonials-section">
    <!-- CONTAINER -->
    <div class="container">
      <section class="testimonials">
        <!-- HEADER -->
        <div class="testimonials__header">
          <h2 class="testimonials__title">
            Nos clients
            <span>témoignent</span>
          </h2>
          <p class="testimonials__subtitle">
            Découvrez les expériences des personnes qui nous font confiance pour améliorer leur
            bien-être au quotidien.
          </p>
        </div>
      </section>

      <!-- CARDS -->

      <section v-if="testimonialStore.loading" class="loading-state">
        <p class="loading-text">Chargement…</p>
      </section>

      <section
        v-else-if="testimonialStore.publishedTestimonials.length > 0"
        ref="testimonialRef"
        class="testimonials-card"
      >
        <div class="testimonials-card__elems">
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
      </section>

      <section v-else class="testimonial-no-card">
        <p>Aucun témoignage pour le moment...</p>
      </section>

      <section class="testimonials-load-more">
        <button
          v-if="testimonialStore.hasMore"
          class="btn-load"
          @click="testimonialStore.testimonialLazyLoad()"
        >
          <span v-if="!testimonialStore.loading">Charger plus de témoignages</span>
          <span v-else>Chargement...</span>
        </button>
      </section>

      <!-- PHRASE TRANSITION -->
      <section class="testimonials-cta">
        <p>Vous aussi, partagez votre expérience</p>
        <TestimonialModal
          v-if="showTestimonialModal"
          :showTestimonialModal="showTestimonialModal"
          @close="showTestimonialModal = false"
        />
        <p>Vous êtes client ?</p>
        <button @click="toggleModal()" class="btn btn-review">✍️ Laisser un avis</button>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 1300px;
  margin: 0 auto;
}

.testimonials-section {
  background: radial-gradient(
    circle at bottom center,
    #f8eefa 0%,
    #faf5fb 40%,
    #fdfbfc 75%,
    #ffffff 100%
  );
  padding: 4rem 2rem 4rem 2rem;
  min-height: 100%;
}

@media (max-width: 991.98px) {
  .testimonials-section {
    padding: 3rem 1.5rem 2rem 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .testimonials-section {
    padding: 2rem 1.5rem 1rem 1.5rem;
  }
}

// testimonial title

.testimonials {
  &__header {
    text-align: center;
    margin-bottom: 4rem;
  }
  &__title {
    color: #555;
    font-size: 2.4rem;
    font-weight: 700;
    span {
      color: oklch(0.627 0.265 303.9);
    }
  }
  &__subtitle {
    margin-top: 1rem;
    color: #555;
    font-size: 16px;
  }
}

@media (max-width: 991.98px) {
  .testimonials {
    &__title {
      font-size: 2rem;
    }
    &__subtitle {
      margin-top: 0.5rem;
      font-size: 14px;
    }
    &__header {
      margin-bottom: 3rem;
    }
    &__cards {
      gap: 1.3rem;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials {
    &__title {
      font-size: 1.5rem;
    }
    &__subtitle {
      margin-top: 0.3rem;
      font-size: 13px;
    }
    &__header {
      margin-bottom: 2rem;
    }
    &__cards {
      gap: 1rem;
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
      flex: 0 0 370px; // largeur fixe, pas de shrink
    }
    &__stars {
      font-size: 1rem;
    }
    &__text {
      color: #555;
      font-size: 14px;
      margin-bottom: 0.8rem;
    }
    &__text {
      color: #555;
      font-size: 14px;
      line-height: 1.4;
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

// testimonials-load-more

.testimonials-load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 24px;
  @media (max-width: 991.98px) {
    margin-top: 5px;
  }
  @media (max-width: 767.98px) {
    margin-top: 0;
  }
  .btn-load {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 18px;
    border: 0;
    border-radius: 12px;
    color: #fff;
    font-weight: 600;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    box-shadow: 0 10px 26px rgba(168, 85, 247, 0.22);
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      filter 0.15s ease;
  }
  .btn-load span {
    font-size: 13px;
    @media (max-width: 991.98px) {
      font-size: 12px;
    }
    @media (max-width: 767.98px) {
      font-size: 10px;
    }
  }
  .btn-load:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }
  .btn-load:active {
    transform: translateY(0);
    box-shadow: 0 10px 26px rgba(168, 85, 247, 0.22);
  }
  .btn-load:focus-visible {
    outline: 3px solid rgba(168, 85, 247, 0.35);
    outline-offset: 3px;
  }
}

/* CARDS */

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 991.98px) {
    margin-bottom: 30px;
  }
  @media (max-width: 767.98px) {
    margin-bottom: 20px;
  }
  .loading-text {
    font-size: 15px;
    color: #b56cff;
    font-weight: 500;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
}

.testimonial-no-card {
  p {
    color: #9ca3af; /* gris doux */
    font-size: 15px;
    text-align: center;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
}

/* PHRASE CTA */

.testimonials-cta {
  padding: 20px 20px 24px 20px;
  text-align: center;
  margin: 0 auto;
  font-size: 0.95rem;
  color: #8a8a8a;
  p {
    font-size: 15px;
    color: #6b7280; /* gris élégant */
    font-weight: 500;
    margin-bottom: 10px;
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
  .btn-review {
    margin-top: 5px;
    background: transparent;
    border: 1px solid rgba(180, 85, 247, 0.4);
    color: #b455f7;
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    @media (max-width: 991.98px) {
      font-size: 14px;
    }
    @media (max-width: 767.98px) {
      font-size: 13px;
    }
  }
  .btn-review:hover {
    background: rgba(180, 85, 247, 0.12);
    transform: translateY(-1px);
  }
}
</style>
