<script setup lang="ts">
import { useStaffAdminStore } from "@/stores/admin/staffAdminStore.ts";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Modal from "@/templates/modal/Modal.vue";

const showModal = ref<boolean>(false);

const textModal = ref<string>("");
textModal.value = "Supprimer ce salarié ?";

const staffAdminStore = useStaffAdminStore();

const route = useRoute();

const state = reactive<{
  id: number;
  created_at: string;
  firstname: string;
  lastname: string;
  is_active: boolean;
  picture: {
    id: number;
    filename: string;
  };
}>({
  id: 0,
  created_at: "",
  firstname: "",
  lastname: "",
  is_active: false,
  picture: {
    id: 0,
    filename: "",
  },
});

const currentStaff = async () => {
  try {
    const id = Number(route.params.id)
    if (!id) return
    const staffs = await staffAdminStore.currentStaff(id)
    Object.assign(state, {
      ...staffs,
      picture: {
        id: staffs.picture?.id ?? 0,
        filename: staffs?.picture?.filename ?? ''
      }
    })
  } catch(e) {
    console.error(e)
  }
}

onMounted(currentStaff)

async function toggleStaffActive(id: number) {
  try {
    const response = await staffAdminStore.currentStaffToggle(id);
    state.is_active = response.is_active;
  } catch (e) {
    console.error(e);
  }
}

const isActive = computed(() => (!state.is_active ? "Non active" : "Active"));

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
    <section v-if="staffAdminStore.loading" class="loading-indicator">
      <p>Chargement...</p>
    </section>
    <section v-else-if="state">
      <div class="contact-details">
        <h2>{{ state.firstname }} {{ state.lastname }}</h2>
        <div class="meta">
          <div class="contact-email">
            <p>{{ formattedDate }}</p>
          </div>
        </div>
        <div class="message-body">
          <p class="label">Photo du personnel</p>
          <img v-if="state.picture" :src="state.picture.filename" />
        </div>
        <div class="actions">
          <button @click="showModal = true" class="btn btn-delete">Supprimer</button>
          <button
            @click="toggleStaffActive(state.id)"
            :class="state.is_active ? 'btn-active' : 'btn-inactive'"
          >
            {{ isActive }}
          </button>
        </div>
      </div>
      <Modal
        :showModal="showModal"
        :staffId="state.id"
        :imageId="state.picture?.id"
        @close="showModal = false"
        :textModal="textModal"
        type="staff"
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
    width: 500px;
    padding: 30px;
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
      padding: 22px 20px 20px 20px;
      .label {
        font-size: 12px;
        color: #94a3b8; // gris doux
        margin-bottom: 8px;
      }
      img {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        border: 0;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      column-gap: 6px;
      .btn-active {
        font-size: 12px;
        margin-top: 10px;
        padding: 11px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        background: #dcfce7;
        color: #166534;
        border: 1px solid #86efac;
        @media (max-width: 767.98px) {
          font-size: 10px;
        }
      }
      .btn-inactive {
        font-size: 12px;
        margin-top: 10px;
        padding: 11px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
        @media (max-width: 767.98px) {
          font-size: 10px;
        }
      }
    }
  }
}

@media (max-width: 991.98px) {
  .contact-container {
    margin: 30px 20px;
    .contact-details {
      width: 450px;
      padding: 20px;
      h2 {
        font-size: 15px;
      }
      .meta {
        margin-bottom: 12px;
        .contact-email {
          margin-top: 12px;
          font-size: 14px;
        }
      }
      .message-body {
        padding: 10px;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .contact-container {
    margin: 30px 10px;
    .contact-details {
      width: 320px;
      padding: 15px;
      h2 {
        font-size: 14px;
      }
      .meta {
        margin-bottom: 10px;
        .contact-email {
          margin-top: 10px;
          font-size: 13px;
        }
      }
    }
  }
}

/*======================
  LOADING
======================*/

.loading-state {
  min-height: 300px;
  p {
    color: #9ca3af;
  }
}
</style>
