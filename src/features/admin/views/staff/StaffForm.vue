<script setup lang="ts">
import { useStaffAdminStore } from "@/stores/admin/staffAdminStore.ts";
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ref } from "vue";
import * as z from "zod";

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const imgFile = ref<string | null>(null);

const staffAminStore = useStaffAdminStore();

/* ===========================
  GESTION FORM
=========================== */

const schema = z.object({
  firstname: z
    .string({ message: "Veuillez renseigner le prénom." })
    .trim()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .max(70, { message: "Le prénom ne peut pas dépasser 70 caractères." }),
  lastname: z
    .string({ message: "Veuillez renseigner le nom." })
    .trim()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(70, { message: "Le nom ne peut pas dépasser 70 caractères." }),
  image: z
    .instanceof(File, { message: "Veuillez sélectionner une image." })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "L’image ne doit pas dépasser 2 Mo.",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Seules les images JPG, PNG ou WebP sont acceptées.",
    }),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: firstname, errorMessage: errorFirstname } = useField<string>("firstname");
const { value: lastname, errorMessage: errorLastname } = useField<string>("lastname");
const { value: image, errorMessage: errorImage, setValue } = useField<string>("image");

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  setValue(file ?? undefined)
  imgFile.value = file.name
}

const onSubmit = handleSubmit(async (dataStaff, { resetForm }) => {
  try {
    const response = await staffAminStore.staffCreate(dataStaff);
    if (!response) {
      setErrorMessage("Impossible d'ajouter l'employé.");
      return;
    }

    setSuccessMessage("Employé ajouté avec succès ✨", resetForm);
  } catch (e) {
    setErrorMessage("Une erreur est survenue.");
    console.error(e);
  }
});

/*===============
  FORM GESTION DES ERREURS
===============*/

let reset = () => {};

function setSuccessMessage(msg: string, resetForm: () => void) {
  successMessage.value = msg;
  imgFile.value = null;
  reset = resetForm;
}

function setErrorMessage(msg: string) {
  errorMessage.value = msg;
  successMessage.value = null;
}

function closeFields() {
  successMessage.value = null;
  errorMessage.value = null;
}

function handleResetForm() {
  closeFields();
  reset();
}
</script>

<template>
  <div class="staff container">
    <!-- FORMULAIRE -->
    <div class="staff__form">
      <h2 class="staff__title">Ajout Accompagnant</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input v-model="firstname" type="text" placeholder="Votre prénom" />
          <span v-if="errorFirstname" class="error-field">
            {{ errorFirstname }}
          </span>
        </div>
        <div class="form-group">
          <input v-model="lastname" type="text" placeholder="Votre nom" />
          <span v-if="errorLastname" class="error-field">
            {{ errorLastname }}
          </span>
        </div>
        <div class="form-group">
          <input type="file" @change="onFileChange" />
          <small :class="errorImage ? 'error-field' : 'file-hint'">
            {{ errorImage ? errorImage : imgFile }}
          </small>
        </div>
        <AlertMessage
          v-if="successMessage"
          :successMessage="successMessage"
          type="success"
          to=""
          class="alert"
          @close="handleResetForm()"
        />
        <AlertMessage
          v-if="errorMessage"
          :errorMessage="errorMessage"
          type="error"
          to=""
          class="alert"
          @close="closeFields()"
        />
        <div class="form-submit">
          <button class="btn btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Envoi en cours…</span>
            <span v-else>Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* FORMULAIRE */

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 10px;
}

.staff__form {
  background: #ffffff;
  padding: 1.6rem 1.2rem 1.2rem 1.2em;
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  .staff__title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: 700;
    font-family: "Playfair Display", serif;
    text-align: center;
    color: black;
  }
  .staff__subtitle {
    margin-bottom: 1.6rem;
    color: #777;
    font-size: 0.95rem;
    text-align: center;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
  }
  input,
  textarea,
  select {
    padding: 0.8rem 1rem;
    border-radius: 0.9rem;
    font-size: 13px;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    width: 100%;
    border: 1px solid #ddd;
    background: #f9fafb;
    max-width: 435px;
    margin-left: auto;
    margin-right: auto;
    color: #777;
    &:focus {
      border-color: #d3aeff;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(211, 174, 255, 0.35);
    }
    &::placeholder {
      font-size: 13px;
      color: #777;
    }
  }
  input[type="file"] {
    color: #f9fafb;
    padding: 0.5rem 1rem;
  }
  input[type="file"]::file-selector-button {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    padding: 0.3rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 13px;
  }
  input[type="file"]::file-selector-button:hover {
    background: #f3e8ff;
    border-color: #c084fc;
    color: #6b21a8;
  }
  .file-hint {
    color: #9ca3af;
    font-size: 9px;
    margin-left: 7px;
    font-style: italic;
    margin-top: 3px;
  }
  textarea {
    height: 120px;
    resize: none;
  }
  .rating {
    color: #9ca3af;
    font-size: 9px;
    font-style: italic;
    position: relative;
    bottom: 3px;
  }
  .form-submit {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .alert {
    margin-top: 6px;
  }
}

@media (max-width: 991.98px) {
  .container {
    margin: 0 10px;
  }
  .staff__form {
    padding: 1.5rem 1.2rem 1rem 1.2em;
    max-width: 390px;
    .staff__title {
      font-size: 1.3rem;
      margin-bottom: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      margin-top: 13px;
    }
    input,
    textarea,
    select {
      font-size: 13px;
      padding: 0.8rem 0.5rem;
      &::placeholder {
        font-size: 12px;
        color: #777;
      }
    }
    .select-wrapper .placeholder {
      position: absolute;
      font-size: 12px;
    }
  }
}

@media (max-width: 767.98px) {
  .container {
    margin: 0 10px;
  }
  .staff__form {
    padding: 1.4rem 1.2rem 1rem 1.2em;
    .staff__title {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      margin-top: 12px;
    }
    input,
    textarea,
    select {
      font-size: 12px;
      padding: 0.8rem 0.5rem;
      &::placeholder {
        font-size: 11px;
        color: #777;
      }
    }
    .select-wrapper .placeholder {
      position: absolute;
      font-size: 11px;
    }
  }
}
</style>
