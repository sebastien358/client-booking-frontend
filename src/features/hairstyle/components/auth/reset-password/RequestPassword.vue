<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { onMounted, ref } from 'vue'
import { useForm ,useField } from 'vee-validate'
import { toTypedSchema } from "@vee-validate/zod";
import {useAuthStore} from "@/stores/authStore.ts";
import * as z from "zod"
import gsap from 'gsap'

const authStore = useAuthStore()

/*===================
  ANIMATION FORM
===================*/

const schema = z.object({
  email: z
    .string({ message: 'Veuillez renseigner un email' })
    .trim()
    .email({ message: 'Veuillez renseigner une adresse email valide' })
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema)
})

const { value: email, errorMessage: errorEmail } = useField('email')

const onSubmit = handleSubmit(async (dataReset, { resetForm }) => {
  try {
    const response = await authStore.requestPassword(dataReset)
    if (!response) {
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      return
    }

    setSuccessMessage("Un email de réinitialisation vient d’être envoyé.", resetForm)
  } catch (e: any) {
    const apiError = e?.response?.data

    if (apiError?.type === 'REQUEST-PASSWORD') {
      setErrorMessage(apiError.message)
      return
    }

    setErrorMessage("Une erreur serveur est survenue. Veuillez réessayer.")
  }
})

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

let reset = () => {}

const setSuccessMessage = (msg: string, resetForm: () => void) => {
  successMessage.value = msg
  errorMessage.value = null
  reset = resetForm
}

const closeFields = () => {
  successMessage.value = null
  errorMessage.value = null
}

const setErrorMessage = (msg: string) => {
  errorMessage.value = msg
  successMessage.value = null
}
const handleResetForm = () => {
  closeFields();
  reset();
}

/*===================
  ANIMATION FORM
===================*/

const requestRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (requestRef.value) {
    gsap.from(requestRef.value, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
})
</script>

<template>
  <section class="request-password-grid container">
    <div class="request-password-form" ref="requestRef">
      <h1 class="request-password-title">Réinitialiser votre mot de passe</h1>
      <p class="request-password-subtitle">Renseignez votre email pour recevoir le lien de réinitialisation.</p>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Email" />
          <span :class="errorEmail && !successMessage && !errorMessage ? 'error-field' : 'info-hint'">
            {{ errorEmail && !successMessage && !errorMessage ?
            'Veuillez renseigner une adresse email' : 'Vous recevrez un lien pour réinitialiser votre mot de passe.' }}
          </span>
        </div>
        <AlertMessage
          v-if="successMessage"
          :successMessage="successMessage"
          type="success"
          class="alert"
          to="/" @close="handleResetForm()"
        />
        <AlertMessage
          v-if="errorMessage"
          :errorMessage="errorMessage"
          type="error"
          class="alert"
          :to="null"
          @close="closeFields()"
        />
        <div class="btn-wrapper">
          <button class="btn btn-submit">
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/*===============
  REQUEST PASSWORD FORM
===============*/

.request-password-form {
  background: #fff;
  border-radius: 18px;
  padding: 35px 20px 20px 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  .request-password-title {
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: 0.2px;
    font-size: 22px;
    font-weight: 700;
  }
  .request-password-subtitle {
    font-size: 14px;
    margin-bottom: 18px;
    text-align: center;
    font-style: italic;
    line-height: 1.4;
    opacity: 0.7;
  }
  .form-group {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 15px;
    .error-field {
      margin-top: 15px;
    }
    .info-hint {
      margin-top: 4px;
      text-align: center;
      font-size: 11px;
      font-style: italic;
      opacity: 0.6;
      line-height: 1.4;
      color: #A8A8A8;
    }
  }
}

.inputs-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.request-password-form input,
.request-password-form textarea {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: #fafafa;
  &:focus {
    outline: none;
    border-color: #d3aeff;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(211, 174, 255, 0.35);
  }
  &::placeholder {
    font-size: 12px;
  }
}

.request-password-form textarea {
  min-height: 90px;
  resize: none;
}

.btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    margin-top: 12px;
    text-align: center;
  }
}

@media (max-width: 991.98px) {
  .container {
    padding: 20px;
  }
}

@media (max-width: 767.98px) {
  .container {
    padding: 100px 20px;
  }

  .request-password-form {
    padding: 35px 20px 20px 20px;
    .request-password-title {
      font-size: 16px;

      margin-bottom: 6px;
    }
    .request-password-subtitle {
      font-size: 11px;

      margin-bottom: 0;
    }
    .form-group {
      .info-hint {
        font-size: 10px;
      }
    }
  }

  .request-password-form input,
  .request-password-form textarea {
    padding: 12px;
    font-size: 13px;
    &::placeholder {
      font-size: 11px;
    }
  }
}
</style>
