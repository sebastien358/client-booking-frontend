<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/templates/header/Header.vue";
import Footer from "@/templates/footer/Footer.vue";
import {useTestimonialStore} from "@/stores/testimonialStore.ts";
import {onMounted} from "vue";
import {useCategoryStore} from "@/stores/categoryStore.ts";
import {useServiceStore} from "@/stores/serviceStore.ts";
import {useStaffStore} from "@/stores/staffStore.ts";
const route = useRoute();

const testimonialStore = useTestimonialStore()
const categoryStore = useCategoryStore()
const serviceStore = useServiceStore()
const staffStore = useStaffStore()


onMounted(async () => {
  await testimonialStore.testimonialList()
  await categoryStore.categoryList()
  await serviceStore.serviceList()
  await staffStore.staffList()
})
</script>

<template>
  <section class="app" :class="{ 'no-header-footer': route.meta.hideFooter }">
    <Header v-if="!route.meta.hideHeader" class="header" />

    <main class="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="route.fullPath" />
      </router-view>
    </main>

    <Footer v-if="!route.meta.hideFooter" class="footer" />
  </section>
</template>

<style scoped lang="scss">
/*===================
  RACINE APPLICATION
===================*/

.app {
  display: grid;
  grid-template-areas: "header" "main" "footer";
  grid-template-rows: 100px 1fr auto;
  min-height: 100dvh;
  .header {
    grid-area: header;
  }
  .main {
    grid-area: main;
  }
  .footer {
    grid-area: footer;
  }
}

@media (max-width: 991.98px) {
  .app {
    height: 100vh;
    grid-template-rows: 100px 1fr auto;
  }
}

@media (max-width: 767.98px) {
  .app {
    height: 100vh;
    grid-template-rows: 90px 1fr auto;
  }
}

/*===================
  PANEL ADMIN : SUPPRESSION HEADER ET FOOTER
===================*/

.no-header-footer {
  display: grid;
  grid-template-areas: "main";
  grid-template-rows: 1fr;
  min-height: 100dvh;
  .main {
    grid-area: main;
  }
}
</style>
