<script setup lang="ts">
import { useContactAdminStore } from "@/stores/admin/contactAdminStore.ts";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "@/templates/modal/Modal.vue";

const showModal = ref<boolean>(false);

const contactAdminStore = useContactAdminStore();

const textModal = ref<string>("");
textModal.value = "Supprimer ce contact ?";

const route = useRoute();

const state = reactive<{
  id: number;
  created_at: string;
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  is_read: boolean;
}>({
  id: 0,
  created_at: "",
  firstname: "",
  lastname: "",
  email: "",
  message: "",
  is_read: false,
});

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) return;
  try {
    const contact = await contactAdminStore.currentContact(id);
    Object.assign(state, contact);
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
</script>

<template>
  <section class="contact-container">
    <section v-if="contactAdminStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>
    <section v-else-if="state">
      <div class="contact-details">
        <h2>{{ state.firstname }} - {{ state.lastname }}</h2>
        <div class="meta">
          <div class="contact-email">
            <p>{{ state.email }}</p>
            <span class="status" :class="{ unread: !state.is_read }">
              {{ state.is_read ? "✅ vu" : "❌ non-vu" }}
            </span>
          </div>
        </div>
        <div class="message-body">
          <h3 class="date-title">{{ formattedDate }}</h3>
          <p>{{ state.message }}</p>
        </div>
        <div class="actions">
          <a
            :href="`https://mail.google.com/mail/?view=cm&to=${state.email}`"
            target="_blank"
            rel="noopener"
            class="btn btn-reply"
          >
            Répondre
          </a>
          <button @click="showModal = true" class="btn btn-delete">Suprimer</button>
        </div>
      </div>
      <Modal
        :showModal="showModal"
        :contactId="state.id"
        @close="showModal = false"
        :textModal="textModal"
        type="contact"
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
    width: 550px;
    padding: 2rem 2.5rem;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: "Inter", sans-serif;
    h2 {
      color: black;
      font-size: 21px;
    }
    .meta {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .contact-email {
        margin-top: 20px;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
      }
      .unread {
        font-size: 14px;
      }
    }
    .message-body {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.2rem;
      line-height: 26px;
      .date-title {
        color: #475569; /* gris bleuté (proche Tailwind slate-600) */
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 6px;
      }
      p {
        color: #374151; /* gris foncé élégant (Tailwind gray-700) */
        font-size: 14px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      column-gap: 6px;
    }
  }
}

@media (max-width: 991.98px) {
  .contact-container {
    margin: 30px 20px;
    .contact-details {
      padding: 0.9rem;
      width: 500px;
      h2 {
        font-size: 16px;
      }
      .meta {
        margin-bottom: 10px;
      }
      .meta .contact-email {
        margin-top: 10px;
        gap: 10px;
        font-size: 14px;
        .status {
          font-size: 11px;
        }
      }
      .message-body {
        padding: 0.9rem;
        line-height: 22px;
        .date-title {
          font-size: 14px;
          margin-bottom: 6px;
        }
        p {
          color: #374151; /* gris foncé élégant (Tailwind gray-700) */
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 767.98px) {
  .contact-container {
    margin: 30px 10px;
    .contact-details {
      width: 350px;
      h2 {
        text-align: center;
        font-size: 15px;
      }
      .meta {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }
      .meta .contact-email {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: initial;
        flex-direction: column;
        gap: 10px;
        font-size: 13px;
        .status {
          font-size: 11px;
        }
      }
      .message-body {
        padding: 0.7rem;
        line-height: 26px;
        .date-title {
          font-size: 13px;
          margin-bottom: 6px;
        }
        p {
          color: #374151; /* gris foncé élégant (Tailwind gray-700) */
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 575.98px) {
  .contact-container {
    margin: 30px 10px;
    .contact-details {
      padding: 1.5rem;
      width: 320px;
    }
  }
}
</style>
