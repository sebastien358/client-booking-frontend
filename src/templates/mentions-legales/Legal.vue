<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import gsap from 'gsap'

const legal = ref<HTMLElement | null>(null)

function animationLegal() {
  gsap.from(legal.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  })
}

onMounted(async () => {
  await nextTick()
  animationLegal()
})
</script>

<template>
  <div class="container" ref="legal">
    <div class="legal-page">
      <section class="legal-me">
        <h1>Mentions légales</h1>
        <p><strong>Éditeur du site :</strong> Sébastien Petit</p>
        <p><strong>Statut :</strong> Entrepreneur individuel</p>
        <p><strong>Email :</strong> sebastien.p0027@gmail.fr</p>
      </section>
      <section class="legal-propriety">
        <p>
          <strong>Crédits :</strong><br />
          L’ensemble des contenus du site (textes, images, logo, graphismes, code) est protégé par
          le droit d’auteur. Toute reproduction sans autorisation est interdite.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
/*=============
  LEGAL PAGE
=============*/

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
  @media (max-width: 1199.98px) {
    padding: 0 25px;
  }
  @media (max-width: 575.98px) {
    padding: 30px 20px;
  }
}

/*==============
  Large devices (desktops, less than 1200px)
==============*/

.legal-page {
  padding: 2rem;
  width: 100%;
  max-width: 550px;
  border-radius: 12px;
  background: #ffffff;
  color: #111;
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  @media (max-width: 1600px) {
    line-height: 1.5;
    max-width: 700px;
  }
  @media (max-width: 991.98px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    margin: auto auto;
    line-height: 1.5;
  }
  @media (max-width: 575.98px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    margin: auto auto;
    line-height: 1.2;
  }
  h1 {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
    color: #1a3e6d;
    font-weight: 600;
    border-bottom: 2px solid #e8f0ff;
    padding-bottom: 0.1rem;
  }
  strong {
    font-size: 15px;
    @media (max-width: 575.98px) {
      font-size: 14px;
    }
  }
  p {
    font-size: 15px;
    margin-bottom: 0.9rem;
    color: #333;

    @media (max-width: 767.98px) {
      font-size: 14px;
      margin-bottom: 0.8rem;
    }
    @media (max-width: 575.98px) {
      font-size: 14px;
      margin-bottom: 0.7rem;
    }
  }
  .legal-lodging {
    .tel,
    .site {
      @media (max-width: 1600px) {
        display: none;
      }
    }
  }
}

/*==============
  Large devices (desktops, less than 1200px)
==============*/

@media (max-width: 1199.98px) {
  .legal-page {
    padding: 1.5rem;
    h1 {
      font-size: 1.5rem;
    }
    p {
      margin-bottom: 0.8rem;
    }
  }
}
</style>
