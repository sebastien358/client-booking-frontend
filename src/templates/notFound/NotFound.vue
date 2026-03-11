<script setup lang="ts">
import { onMounted, nextTick } from "vue"
import gsap from "gsap"

onMounted(async () => {
  await nextTick()
  gsap.from(".notfound h1", { opacity: 0, y: -30, duration: 0.8 })
  gsap.from(".notfound p", { opacity: 0, y: 10, delay: 0.4 })
  gsap.from(".home-link-container", { opacity: 0, y: 10, delay: 0.5 })
})
</script>

<template>
  <section class="notfound">
    <h1>404</h1>
    <p>Oups... Cette page n’existe pas !</p>
    <div class="home-link-container">
      <router-link to="/" class="home-link">← Retour à l’accueil</router-link>
    </div>
  </section>
</template>

<style scoped lang="scss">
.notfound {
  text-align: center;
  padding: 100px 20px;
  color: #e0e0e0;
  h1 {
    font-size: 56px;
    color: #4b464d;
    margin-bottom: 10px;
  }
  p {
    color: #4b464d;
    font-size: 15px;
    opacity: 0.8;
    margin-bottom: 35px;
  }
  .home-link {
    color: #3892f6;
    text-decoration: none;
    border: 1px solid rgba(56,146,246,0.3);
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(56,146,246,0.1);
      box-shadow: 0 0 8px rgba(56,146,246,0.2);
    }
  }
}
</style>
