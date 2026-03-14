<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {onMounted, ref} from "vue";
import * as z from "zod";
import {useAuthStore} from "@/stores/authStore.ts";
import Modal from "@/templates/modal/Modal.vue";

const authStore = useAuthStore()

/* ===========================
  GESTION FORM
=========================== */

const schema = z.object({
  firstname: z
    .string({ message: "Veuillez renseigner votre prénom." })
    .trim()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .max(180, { message: "Le prénom ne peut pas dépasser 180 caractères." }),
  lastname: z
    .string({ required_error: "Veuillez renseigner votre nom." })
    .trim()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(180, { message: "Le nom ne peut pas dépasser 180 caractères." }),
  phoneNumber: z
    .string({ required_error: "Veuillez indiquer votre numéro de téléphone." })
    .trim()
    .regex(/^(\+33|0)[1-9]\d{8}$/, {message: "Merci de saisir un numéro de téléphone valide."}),
  email: z
    .string({ message: "Veuillez renseigner votre adresse email." })
    .trim()
    .email({ message: "Veuillez renseigner une adresse email valide." })
    .max(180, { message: "Email trop long." }),
  newPassword: z
    .string({ message: "" })
    .trim()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." }),
  confirmPassword: z
    .string({ message: "" }).trim()
}).refine((data) => data.newPassword=== data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: ''
  }
});

onMounted(async () => {
  try {
    const response = await authStore.me()

    if (!response) return

    setValues({
      firstname: response.firstname,
      lastname: response.lastname,
      phoneNumber: response.phoneNumber,
      email: response.email
    })

  } catch (e) {
    console.error(e)
    throw e
  }
})

const { value: firstname, errorMessage: errorFirstName } = useField<string>("firstname");
const { value: lastname, errorMessage: errorLastname } = useField<string>("lastname");
const { value: phoneNumber, errorMessage: errorPhoneNumber } = useField<string>("phoneNumber");
const { value: email, errorMessage: errorEmail } = useField<string>("email");
const { value: newPassword, errorMessage: errorNewPassword } = useField<string>("newPassword");
const { value: confirmPassword, errorMessage: errorConfirmPassword } = useField<string>("confirmPassword");

const onSubmit = handleSubmit(async (dataUser) => {
  try {
    const response = await authStore.updateMe(dataUser)

    if (!response) {
      setErrorMessage('La modification a échouée')
      return
    }

    setSuccessMessage('Vos données ont été modifiées')
  } catch (e) {
    setErrorMessage("Une erreur est survenue.");
    console.error(e);
  }
});

/*===============
  FORM GESTION DES ERREURS
===============*/

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const setSuccessMessage = (msg: string) => {
  successMessage.value = msg;
  errorMessage.value = null;
}

const setErrorMessage = (msg: string) => {
  errorMessage.value = msg;
  successMessage.value = null;
}

const closeFields = () => {
  successMessage.value = null;
  errorMessage.value = null;
}

const handleResetForm = () => {
  closeFields();
}

/* ===========================
  DELETE USER
=========================== */

const showModal = ref<boolean>(false)
const textModal = ref<string>('ccscsqcqs')

const toggleModal = () => {
  showModal.value = true
}
</script>

<template>
  <div class="staff container">
    <!-- FORMULAIRE -->
    <div class="d-flex flex-column">
      <section class="staff__form">
        <h2 class="staff__title">Modifier mes données</h2>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <input v-model="firstname" type="text" placeholder="Prénom" />
            <span v-if="errorFirstName" class="error-field">
            {{ errorFirstName }}
          </span>
          </div>
          <div class="form-group">
            <input v-model="lastname" type="text" placeholder="Nom" />
            <span v-if="errorLastname" class="error-field">
            {{ errorLastname }}
          </span>
          </div>
          <div class="form-group">
            <input v-model="phoneNumber" type="tel" placeholder="Téléphone" />
            <span v-if="errorPhoneNumber" class="error-field">
            {{ errorPhoneNumber }}
          </span>
          </div>
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email" />
            <span v-if="errorEmail" class="error-field">
            {{ errorEmail }}
          </span>
          </div>
          <div class="form-group">
            <input v-model="newPassword" type="password" placeholder="Mot de passe" />
            <span v-if="errorNewPassword" class="error-field">
            {{ errorNewPassword }}
          </span>
          </div>
          <div class="form-group">
            <input v-model="confirmPassword" type="password" placeholder="Confirmation de Mot de passe" />
            <span v-if="errorConfirmPassword" class="error-field">
            {{ errorConfirmPassword }}
          </span>
          </div>
          <AlertMessage
            v-if="successMessage"
            :successMessage="successMessage"
            type="success"
            :to="null"
            class="alert"
            @close="handleResetForm()"
          />
          <AlertMessage
            v-if="errorMessage"
            :errorMessage="errorMessage"
            type="error"
            :to="null"
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
      </section>

      <!-- SUPPRESSION COMPTE -->

      <section class="danger-zone">
        <p class="danger-title">Zone sensible</p>
        <p class="danger-text">
          La suppression de votre compte est définitive et entraînera la perte de toutes vos données.
        </p>
        <button @click="toggleModal()" class="btn-delete-account">
          Supprimer mon compte
        </button>
      </section>
      <Modal
        :showModal="showModal"
        :textModal="textModal"
        type="delete-account"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* FORMULAIRE */

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  height: 100%;
}

.staff__form {
  background: #ffffff;
  padding: 1.6rem 1.2rem 1.2rem 1.2em;
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  .staff__title {
    font-size: 1.4rem;
    margin-bottom: 15px;
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
    border-radius: 8px;
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
    margin: 0;
    height: initial;
    padding: 30px 20px;
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
    margin: 0;
    padding: 30px 10px;
    height: initial;
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

/* SUPPRESSION COMPTE */

.danger-zone {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  text-align: center;
}

.danger-title {
  font-size: 14px;
  font-weight: 600;
  color: #d32f2f;
  margin-bottom: 6px;
}

.danger-text {
  font-size: 12px;
  color: #777;
  margin-bottom: 12px;
}

.btn-delete-account {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 14px;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-delete-account:hover {
  background: #e43a3c;
}
</style>
