<script setup lang="ts">
import { useTestimonialAdminStore } from "@/stores/admin/testimonialAdminStore.ts";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "@/templates/modal/Modal.vue";

const showModal = ref<boolean>(false);

const textModal = ref<string>("");
textModal.value = "Supprimer ce témoignage ?";

const testimonialAdminStore = useTestimonialAdminStore();

const route = useRoute();

const state = reactive<{
  id: number;
  created_at: string;
  author: string;
  is_published: boolean;
  job: string;
  message: string;
  rating: number;
  picture: {
    id: number;
    filename: string;
  };
}>({
  id: 0,
  created_at: "",
  author: "",
  is_published: false,
  job: "",
  message: "",
  rating: 0,
  picture: {
    id: 0,
    filename: "",
  },
});

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) return;
  try {
    const testimonial = await testimonialAdminStore.testimonialCurrent(id);
    Object.assign(state, testimonial);
  } catch (e) {
    console.error(e);
  }
});

const formattedDate = computed(() => {
  if (!state.created_at) return "";

  const date = new Date(state.created_at);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
});

const testimonialToggleId = async (id: number) => {
  const testimonial = await testimonialAdminStore.testimonialToggle(id)
  state.is_published = testimonial.is_published
}
</script>

<template>
  <section class="contact-container">
    <section v-if="testimonialAdminStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>
    <section v-else-if="state">
      <div class="contact-details">
        <div class="contact-title">
          <div class="title-left">
            <h2>{{ state.author }}</h2>
            <div class="rating">
              <span v-for="n in state.rating" :key="n">⭐</span>
            </div>
            <div class="sub">
              <span class="date">{{ formattedDate }}</span>
              <span class="sep">·</span>
              <span class="job">{{ state.job }}</span>
            </div>
          </div>
          <img v-if="state.picture" :src="state.picture.filename" class="img-testimonial" />
          <img v-else src="@/assets/images/téléchargement.svg" class="img-not-found" />
        </div>
        <div class="message-body">
          <h3 class="date-title"></h3>
          <p class="text">{{ state.message }}</p>
        </div>
        <div class="actions">
          <button
            @click="testimonialToggleId(state?.id)"
            :class="state.is_published ? 'btn-active' : 'btn-inactive'"
          >
            {{ state.is_published ? 'Visible' : 'Non-visible' }}
          </button>
          <button @click="showModal = true" class="btn btn-delete">Supprimer</button>
        </div>
      </div>
      <!-- MODAL -->
      <Modal
        :showModal="showModal"
        :testimonialId="state?.id"
        :imageId="state.picture?.id ?? null"
        :textModal="textModal"
        @close="showModal = false"
        type="testimonial"
      />
    </section>
    <section v-else class="empty-state">
      <p>Aucun témoignage pour le moment</p>
    </section>
  </section>
</template>

<style scoped lang="scss">
/*======================
  LOADING
======================*/

.loading-indicator,
.empty-state {
  min-height: 300px;
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

.contact-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 20px;
  .contact-details {
    max-width: 550px;
    width: 100%;
    padding: 30px 40px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: "Inter", sans-serif;
    .contact-details {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .contact-title {
      display: flex;
      justify-content: space-between;
      align-items: start;
    }
    .title-left {
      display: flex;
      flex-direction: column;
      gap: 6px; // un peu plus d’air
    }
    .title-left h2 {
      font-size: 22px;
      font-weight: 600;
      margin: 0;
    }
    .rating {
      display: flex;
      gap: 3px;
      font-size: 14px; // ⬅️ un poil plus petit
      opacity: 0.85; // ⬅️ moins agressif
    }
    .sub {
      font-size: 12px; // ⬅️ vrai texte secondaire
      color: #6b7280;
    }
    .sep {
      margin: 0 6px;
    }
    .contact-title h2 {
      font-size: 22px;
      color: black;
    }
    .contact-title .img-testimonial {
      height: 100px;
      width: 100px;
      border-radius: 6px;
      opacity: 0.95;
    }
    .contact-title .img-not-found {
      height: 100px;
      width: 100px;
      border-radius: 6px;
      opacity: 0.95;
    }
    .message-body {
      margin-top: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.2rem;
      line-height: 26px;
      .text {
        font-size: 14px;
        font-weight: 400;
        color: #374151;
        line-height: 1.6;
        word-wrap: break-word;
        overflow-wrap: anywhere;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      column-gap: 6px;
      .btn-active {
        font-size: 11px;
        margin-top: 10px;
        padding: 11px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        background: #dcfce7;
        color: #166534;
        border: 1px solid #86efac;
      }
      .btn-inactive {
        font-size: 11px;
        margin-top: 10px;
        padding: 11px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
      }
    }
  }
}

@media (max-width: 991.98px) {
  .contact-container {
    margin: 30px 10px;
    .contact-details {
      padding: 30px 20px;
      .title-left h2 {
        font-size: 16px;
      }
      .message-body {
        padding: 0.9rem;
        .text {
          font-size: 14px;
        }
      }
      .actions {
        .btn-active {
          font-size: 10px;
        }
        .btn-inactive {
          font-size: 10px;
        }
      }
    }
  }
}

@media (max-width: 767.98px) {
  .contact-container {
    margin: 30px 10px;
    .contact-details {
      padding: 20px;
      .title-left h2 {
        font-size: 15px;
      }
      .message-body {
        padding: 0.8rem;
        .text {
          font-size: 13px;
        }
      }
      .actions {
        .btn-active {
          font-size: 10px;
        }
        .btn-inactive {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
