<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { onMounted, ref} from "vue";
import { useAuthStore } from "@/stores/authStore.ts";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import gsap from "gsap";
import {useRoute} from "vue-router";

const authStore = useAuthStore();

const route = useRoute()

/*===================
  FORM LOGIN
===================*/

const schema = z.object({
  password: z
    .string({ message: "Veuillez renseigner votre mot de passe." })
    .trim()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." }),

  confirmPassword: z
    .string({ message: "Veuillez confirmer votre mot de passe." })
    .trim()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: password, errorMessage: errorPassword } = useField<string>("password");
const { value: confirmPassword, errorMessage: errorConfirmPassword } = useField<string>("confirmPassword");

/*===================
  SUBMIT FORM
===================*/

const onSubmit = handleSubmit(async (data, { resetForm }) => {
  try {
    const response = await authStore.resetPassword(data, route.params.token)
    if (!response) {
      setErrorMessage('Le mot de passe n\'a pas pu être modifié')
    }

    setSuccessMessage("Mot de passe modifié.", resetForm);
  } catch (e: any) {
    const apiError = e?.response?.data

    if (apiError.type === 'RESET-PASSWORD') {
      setErrorMessage(apiError.message)
      return
    }

    setErrorMessage("Erreur serveur, réessayez plus tard");
  }
});

/*==================
  FORM GESTION DES ERREURS
==================*/

let reset = () => {};

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function setSuccessMessage(msg: string, resetForm: () => void) {
  successMessage.value = msg;
  errorMessage.value = null;
  reset = resetForm;
}

function setErrorMessage(msg: string) {
  successMessage.value = null;
  errorMessage.value = msg;
}

function closeFields() {
  successMessage.value = null;
  errorMessage.value = null;
}

function handleResetForm() {
  closeFields();
  reset();
}

/*===================
  ANIMATION LOGIN
===================*/

const resetRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!resetRef.value) return;

  const isDesktop = window.innerWidth > 575.98;

  gsap.from(resetRef.value, {
    opacity: 0,
    y: isDesktop ? 20 : 10, // 👈 mobile plus soft
    duration: isDesktop ? 0.5 : 0.4,
    ease: "power2.out",
  });
});
</script>

<template>
  <section class="reset-password container" ref="resetRef">
    <div class="reset-password__form">
      <h2 class="reset-title">Modification du mot de passe</h2>
      <p class="reset-subtitle"></p>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Mot de passe" />
          <span v-if="errorPassword" class="error-field">
            {{ errorPassword }}
          </span>
        </div>
        <div class="form-group">
          <input v-model="confirmPassword" type="password" placeholder="Confirmation de mot de passe" />
          <span v-if="errorConfirmPassword" class="error-field">
            {{ errorConfirmPassword }}
          </span>
        </div>
        <AlertMessage
          v-if="successMessage"
          :successMessage="successMessage"
          type="success"
          to="/login"
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
        <div class="form__actions">
          <button class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
/*===============
  CONTAINER
===============*/

.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/*===============
  LOGIN FORM
===============*/

.reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  &__form {
    background: #ffffff;
    padding: 2.5rem;
    border-radius: 1.2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 400px;
    .reset-title {
      text-align: center;
      font-size: 1.4rem;
      margin-bottom: 0.3rem;
      font-weight: 700;
      font-family: "Playfair Display", serif;
    }
    .reset-subtitle {
      text-align: center;
      margin-bottom: 1rem;
      color: #777;
      font-size: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      input,
      textarea {
        padding: 0.9rem 1rem;
        border-radius: 0.9rem;
        font-size: 12px;
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
        &:focus {
          border-color: #d3aeff;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(211, 174, 255, 0.35);
        }
        &::placeholder {
          font-size: 12px;
        }
      }
    }
  }

  .alert {
    margin-top: 8px;
  }

  .form__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-submit {
      margin-top: 12px;
    }
  }
}

@media (max-width: 991.98px) {
  .container {
    padding: 20px;
  }

  .reset-password {
    height: 100%;
    &__form {
      padding: 2rem 1.5rem 1rem 1.5rem;
      max-width: 340px;
      .reset-title {
        font-size: 1.4rem;
        margin-bottom: 0.4rem;
      }
      .reset-subtitle {
        font-size: 13px;
      }
      input,
      textarea {
        font-size: 13px;
        &::placeholder {
          font-size: 11px;
        }
      }
    }
  }
}

@media (max-width: 767.98px) {
  .container {
    padding: 100px 20px;
  }

  .reset-password {
    height: 100%;
    &__form {
      padding: 1.6rem 1.3rem 1rem 1.3rem;
      .reset-title {
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
      }
      .reset-subtitle {
        font-size: 12px;
      }
      input,
      textarea {
        font-size: 12px;
        padding: 0.8rem 1rem;
        &::placeholder {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
