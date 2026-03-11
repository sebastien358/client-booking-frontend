<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { onMounted, ref} from "vue";
import { useAuthStore } from "@/stores/authStore.ts";
import { useUiStore } from "@/stores/uiStore.ts";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import gsap from "gsap";

const authStore = useAuthStore();

/*===================
  FORM LOGIN
===================*/

const schema = z.object({
  email: z
    .string({ message: "Veuillez renseigner votre adresse email." })
    .trim()
    .min(1, { message: "Veuillez renseigner votre adresse email." })
    .email({ message: "Veuillez renseigner une adresse email valide." }),
  password: z
    .string({ message: "Veuillez renseigner votre mot de passe." })
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." }),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: email, errorMessage: errorEmail } = useField<string>("email");
const { value: password, errorMessage: errorPassword } = useField<string>("password");

/*===================
  REDIRECT ADMIN OR MODAL RDV
===================*/

const toRedirect = ref<string | null>(null)

const uiStore = useUiStore()

const handleRedirectAfterConfirmation = () => {
  if (uiStore.bookingAfterLogin) {
    toRedirect.value = "/"
  } else {
    toRedirect.value = "/admin"
  }
}

/*===================
  SUBMIT FORM
===================*/

const onSubmit = handleSubmit(async (dataUser, { resetForm }) => {
  try {
    const existsResp = await authStore.emailExisting(dataUser)
    if (!existsResp?.existing) {
      setErrorMessage("Cet email n'existe pas dans nos données");
      return;
    }

    const loginResp = await authStore.login(dataUser);

    if (!loginResp) {
      setErrorMessage("Identifiants incorrects");
      return;
    }

    handleRedirectAfterConfirmation()

    setSuccessMessage("Connexion réussie ✨", resetForm);
  } catch (e) {
    console.error(e);
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

const loginRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!loginRef.value) return;

  const isDesktop = window.innerWidth > 575.98;

  gsap.from(loginRef.value, {
    opacity: 0,
    y: isDesktop ? 20 : 10, // 👈 mobile plus soft
    duration: isDesktop ? 0.5 : 0.4,
    ease: "power2.out",
  });
});
</script>

<template>
  <section class="login container" ref="loginRef">
    <div class="login__form">
      <h2 class="login-title">Se connecter</h2>
      <p class="login-subtitle">Accéder à votre espace administrateur.</p>
      <form @submit.prevent="onSubmit">
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
        <div class="reset-password">
          <router-link to="/request-password" class="link-reset-password">
            Mot de passe oublié?
          </router-link>
        </div>
        <AlertMessage
          v-if="successMessage"
          :successMessage="successMessage"
          type="success"
          :to="toRedirect"
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

        <div class="link-register">
          <span>Pas encore de compte ?</span>
          <router-link to="/register">S'inscrire</router-link>
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

.login {
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
    .login-title {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
      font-weight: 700;
      font-family: "Playfair Display", serif;
    }
    .login-subtitle {
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
  .form__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-submit {
      margin-top: 12px;
    }
  }
}

.reset-password {
  margin-top: 6px;
  display: flex;
  justify-content: end;
  .link-reset-password {
    font-size: 10px;
    font-style: italic;
    color: #777;
  }
  .link-reset-password:hover {
    text-decoration: underline;
  }
}

.link-register {
  margin-top: 14px;
  font-size: 12px;
  color: #777;
  text-align: center;
}
a {
  margin-left: 4px;
  text-decoration: underline;
}

.alert {
  margin-top: 8px;
}



@media (max-width: 991.98px) {
  .login {
    height: 100%;
    &__form {
      padding: 2rem 1.5rem 1rem 1.5rem;
      max-width: 340px;
      .login-title {
        font-size: 1.4rem;
        margin-bottom: 0.4rem;
      }
      .login-subtitle {
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
    padding: 70px 1rem 70px 1rem;
  }

  .login {
    height: 100%;
    &__form {
      padding: 1.6rem 1.3rem 1rem 1.3rem;
      .login-title {
        font-size: 1.3rem;
        margin-bottom: 0.4rem;
      }
      .login-subtitle {
        font-size: 12px;
      }

      .form-group {
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

  .reset-password {
    margin-top: 6px;
    display: flex;
    justify-content: end;
    .link-reset-password {
      font-size: 10px;
      font-style: italic;
      color: #777;
    }
    .link-reset-password:hover {
      text-decoration: underline;
    }
  }

  .link-register {
    font-size: 11px;
  }
}
</style>
