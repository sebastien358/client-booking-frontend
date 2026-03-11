<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import gsap from "gsap";
import { useAuthStore } from "@/stores/authStore.ts";
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";

const authStore = useAuthStore();

/*===================
  FORM LOGIN
===================*/

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
  password: z
    .string({ message: "Veuillez renseigner votre mot de passe." })
    .trim()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." }),
  confirmPassword: z
    .string({ message: "Veuillez confirmer votre mot de passe." }).trim()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: firstname, errorMessage: errorFirstName } = useField<string>("firstname");
const { value: lastname, errorMessage: errorLastname } = useField<string>("lastname");
const { value: phoneNumber, errorMessage: errorPhoneNumber } = useField<string>("phoneNumber");
const { value: email, errorMessage: errorEmail } = useField<string>("email");
const { value: password, errorMessage: errorPassword } = useField<string>("password");
const { value: confirmPassword, errorMessage: errorConfirmPassword } = useField<string>("confirmPassword");

const onSubmit = handleSubmit(async (dataUser, { resetForm }) => {
  try {
    await authStore.register(dataUser)
    setSuccessMessage('L\'inscription a réussie', resetForm)
  } catch (e: any) {
    const apiError = e?.response?.data

    if (apiError?.type === 'EMAIL_ALREADY_EXISTS') {
      setErrorMessage(apiError.message)
      return
    }

    setErrorMessage('Erreur serveur, réessayez plus tard')
  }
});

/*==================
  FORM GESTION DES ERREURS
==================*/

let reset = () => {};

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const setSuccessMessage = (msg: string, resetForm: () => void) => {
  successMessage.value = msg;
  errorMessage.value = null;
  reset = resetForm;
}

const setErrorMessage = (msg: string) => {
  successMessage.value = null;
  errorMessage.value = msg;
}

const closeFields = () => {
  successMessage.value = null;
  errorMessage.value = null;
}

const handleResetForm = () => {
  closeFields();
  reset();
}

/*===================
  ANIMATION LOGIN
===================*/

const registerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!registerRef.value) return;

  const isDesktop = window.innerWidth > 575.98;

  gsap.from(registerRef.value, {
    opacity: 0,
    y: isDesktop ? 20 : 10, // 👈 mobile plus soft
    duration: isDesktop ? 0.5 : 0.4,
    ease: "power2.out",
  });
});
</script>

<template>
  <section class="register container" ref="registerRef">
    <div class="register__form">
      <h2 class="register-title">S'inscrire</h2>
      <p class="register-subtitle">Créez votre accès à l’espace administrateur</p>
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
          <input v-model="password" type="password" placeholder="Mot de passe" />
          <span v-if="errorPassword" class="error-field">
            {{ errorPassword }}
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
  padding: 30px 20px 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/*===============
  LOGIN FORM
===============*/

.register {
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
    .register-title {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
      font-weight: 700;
      font-family: "Playfair Display", serif;
    }
    .register-subtitle {
      text-align: center;
      margin-bottom: 1rem;
      color: #777;
      font-size: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      margin-top: 14px;
    }
    input,
    textarea {
      padding: 13px;
      border-radius: 10px;
      font-size: 14px;
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
  .register {
    height: 100%;
    &__form {
      padding: 2rem 1.5rem 1rem 1.5rem;
      max-width: 340px;
      .register-title {
        font-size: 1.4rem;
        margin-bottom: 0.4rem;
      }
      .register-subtitle {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .container {
    padding: 70px 1rem 70px 1rem;
  }

  .register {
    height: 100%;
    &__form {
      padding: 1.6rem 1.3rem 1rem 1.3rem;
      .register-title {
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
      }
      .register-subtitle {
        font-size: 12px;
      }
      .form-group {
        margin-top: 10px;
        input,
        textarea {
          font-size: 12px;
          padding: 0.8rem 1rem;
          &::placeholder {
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>

