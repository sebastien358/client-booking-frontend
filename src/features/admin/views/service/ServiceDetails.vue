<script setup lang="ts">
import { useServiceAdminStore } from "@/stores/admin/serviceAdminStore.ts";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "@/templates/modal/Modal.vue";

const showModal = ref<boolean>(false);

const textModal = ref<string>("");
textModal.value = "Supprimer ce service ?";

const serviceAdminStore = useServiceAdminStore();

const route = useRoute();

const state = reactive<{
  id: number;
  name: string;
  duration: number;
  price: number;
  category: {
    id: number;
    name: string;
  };
}>({
  id: 0,
  name: "",
  duration: 0,
  price: 0,
  category: {
    id: 0,
    name: "",
  },
});

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) return;
  try {
    const contact = await serviceAdminStore.currentService(id);
    Object.assign(state, contact);
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <section class="contact-container">
    <section v-if="serviceAdminStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>
    <section v-else-if="state">
      <div class="contact-details">
        <h2>{{ state.name }}</h2>
        <div class="message-body">
          <div class="info-row">
            <span class="info-label">Catégorie</span>
            <span class="info-value">{{ state.category.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Durée</span>
            <span class="info-value">{{ state.duration }} min</span>
          </div>
          <div class="info-row price-row">
            <span class="info-label">Prix</span>
            <span class="info-value price">{{ state.price }} €</span>
          </div>
        </div>
        <div class="actions">
          <button @click="showModal = true" class="btn btn-delete">Supprimer</button>
        </div>
      </div>
      <Modal
        :showModal="showModal"
        :serviceId="state.id"
        :textModal="textModal"
        @close="showModal = false"
        type="service"
      />
    </section>
    <section v-else class="empty-state">
      <p>Aucun rendez-vous pour le moment</p>
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
    width: 450px;
    padding: 30px 40px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    font-family: "Inter", sans-serif;
    h2 {
      text-align: center;
      color: black;
      font-size: 17px;
      margin-bottom: 15px;
    }
    .meta {
      display: flex;
      flex-direction: column;
      margin-bottom: 19px;
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
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .info-label {
        color: #64748b; // gris doux
        font-size: 14px;
      }
      .info-value {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
      }
      .price {
        font-size: 14px;
        font-weight: 600;
        color: #16a34a; // vert discret
      }
    }
    .actions {
      display: flex;
      align-items: center;
    }
  }
}

@media (max-width: 991.98px) {
  .contact-container {
    margin: 30px 20px;
    .contact-details {
      padding: 30px;
      h2 {
        color: black;
        font-size: 16px;
        margin-bottom: 13px;
      }
      .message-body {
        padding: 1.2rem;
        line-height: 26px;
        .info-row {
          padding: 6px 0;
        }
        .info-label {
          font-size: 14px;
        }
        .info-value {
          font-size: 14px;
        }
        .price {
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
      padding: 20px;
      width: 320px;
      h2 {
        text-align: center;
        font-size: 15px;
        margin-bottom: 10px;
      }
      .message-body {
        padding: 1rem;
        line-height: 26px;
        .info-label {
          font-size: 12px;
        }
        .info-value {
          font-size: 12px;
        }
        .price {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
