<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { onMounted, ref } from "vue";
import * as z from "zod";
import { gsap } from "gsap";
import { useContactStore } from "@/stores/contactStore.ts";

const contactStore = useContactStore();

/* ===========================
  GESTION FORM
=========================== */

const schema = z.object({
  firstname: z
    .string({ message: "Veuillez renseigner votre prénom." })
    .trim()
    .min(1, { message: "Veuillez renseigner votre prénom." })
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .max(70, { message: "Le prénom ne peut pas dépasser 70 caractères." }),
  lastname: z
    .string({ message: "Veuillez renseigner votre nom." })
    .trim()
    .min(1, { message: "Veuillez renseigner votre nom." })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(70, { message: "Le nom ne peut pas dépasser 70 caractères." }),
  email: z
    .string({ message: "Veuillez renseigner votre adresse email." })
    .trim()
    .min(1, { message: "Veuillez renseigner votre adresse email." })
    .email({ message: "Veuillez renseigner une adresse email valide." }),
  message: z
    .string({ message: "Veuillez renseigner votre message." })
    .trim()
    .min(1, { message: "Veuillez renseigner votre message." })
    .min(10, { message: "Le message doit contenir au moins 10 caractères." })
    .max(500, { message: "Le message ne peut pas dépasser 500 caractères." }),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: firstname, errorMessage: errorFirstname } = useField<string>("firstname");
const { value: lastname, errorMessage: errorLastname } = useField<string>("lastname");
const { value: email, errorMessage: errorEmail } = useField<string>("email");
const { value: message, errorMessage: errorText } = useField<string>("message");

const onSubmit = handleSubmit(async (dataContact, { resetForm }) => {
  try {
    const reponse = await contactStore.contactNew(dataContact);
    if (!reponse) {
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      return;
    }
    setSuccessMessage("Message envoyé avec succès. ✨", resetForm);
  } catch (e) {
    console.error(e);
    setErrorMessage("Impossible d’envoyer le message. Vérifiez votre connexion.");
  }
});

/*===============
  FORMULAIRE GESTION DES ERREURS
===============*/

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

const contactFormRef = ref<HTMLElement | null>(null);
const contactInfoRef = ref<HTMLElement | null>(null);

function animationContact() {
  const isDesktop = window.innerWidth > 575.98;

  gsap.from(contactFormRef.value, {
    opacity: 0,
    x: isDesktop ? 100 : 48,
    duration: isDesktop ? 0.7 : 0.6,
    ease: "power2.out",
    filter: "blur(8px)",
    scrollTrigger: {
      trigger: contactFormRef.value,
      start: "top 80%",
    },
  });

  gsap.from(contactInfoRef.value, {
    opacity: 0,
    x: isDesktop ? -100 : -48,
    duration: isDesktop ? 0.7 : 0.6,
    ease: "power2.out",
    filter: "blur(8px)",
    scrollTrigger: {
      trigger: contactInfoRef.value,
      start: "top 80%",
    },
  });
}

onMounted(async () => {
  animationContact();
});
</script>

<template>
  <section class="contact-page">
    <div class="contact__container">
      <!-- FORMULAIRE -->
      <div class="contact__form" ref="contactFormRef">
        <h2>Contactez-nous</h2>
        <p class="contact__subtitle">Une question ?</p>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <input v-model="firstname" type="text" placeholder="Prénom" />
            <span v-if="errorFirstname" class="error-field">
              {{ errorFirstname }}
            </span>
          </div>
          <div class="form-group">
            <input v-model="lastname" type="text" placeholder="Nom" />
            <span v-if="errorLastname" class="error-field">
              {{ errorLastname }}
            </span>
          </div>
          <div class="form-group">
            <input v-model="email" type="text" placeholder="Email" />
            <span v-if="errorEmail" class="error-field">
              {{ errorEmail }}
            </span>
          </div>
          <div class="form-group">
            <textarea v-model="message" placeholder="Votre message..."></textarea>
            <span v-if="errorText" class="error-field">
              {{ errorText }}
            </span>
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
      <!-- INFOS + MAP -->
      <div class="contact__info" ref="contactInfoRef">
        <h3>Le cabinet</h3>
        <p class="contact__address">
          18 rue de la Sérénité <br />
          75003 Paris
        </p>
        <ul class="contact__hours">
          <li>🕒 Lun – Ven : 9h – 19h</li>
          <li>🕒 Samedi : sur rendez-vous</li>
        </ul>
        <p class="contact__phone">📞 01 23 45 67 89</p>
        <p class="contact__mail">✉️ contact@salon-bien-etre.fr</p>
        <div class="contact__badges">
          <span class="badge badge--green">Réponse sous 24h</span>
          <span class="badge badge--yellow">Prise de RDV rapide</span>
        </div>
        <div class="contact__map">
          <!-- Mets ici ton image de carte -->
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12294.319109934564!2d-0.24133006287153588!3d49.28515163344128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480a6156d5655ba5%3A0x1eb3a9d9ae79f46a!2sPlage%20de%20Ouistreham!5e0!3m2!1sfr!2sfr!4v1765478462795!5m2!1sfr!2sfr"
            width="400"
            height="300"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-page {
  padding: 30px 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #faf7fd 0%, #ffffff 60%);
  height: 100%;
  overflow: hidden;
}

/* LAYOUT PRINCIPAL */
.contact__container {
  display: grid;
  grid-template-columns: 440px 400px;
  align-items: flex-start;
  justify-content: center;
  gap: 1.6rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

/*=====================
  FORM
=====================*/

.contact__form {
  background: #ffffff;
  padding: 2rem 1.7rem;
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 1.7rem;
    margin-bottom: 0.3rem;
    font-weight: 700;
    font-family: "Playfair Display", serif;
  }

  .contact__subtitle {
    margin-bottom: 15px;
    color: #777;
    font-size: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
  }

  input,
  textarea {
    padding: 0.8rem 1rem;
    border-radius: 0.9rem;
    font-size: 0.95rem;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    width: 100%;
    border: 1px solid #ddd;
    background: #f9fafb;

    &:focus {
      border-color: #d3aeff;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(211, 174, 255, 0.35);
    }

    &::placeholder {
      font-size: 13px;
    }
  }

  textarea {
    height: 120px;
    resize: none;
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



/*=====================
  RESPONSIVE FORM
=====================*/

@media (max-width: 1600px) {
  .contact-page {
    padding: 3rem 2rem;
  }
}

@media (max-width: 991.98px) {
  .contact-page {
    padding: 2.5rem 1.5rem 2.5rem 1.5rem;
    max-width: 100%;
    height: 100%;
  }
  .contact__container {
    grid-template-columns: 400px auto;
    gap: 1.2rem;
  }
  .contact__form {
    h2 {
      font-size: 1.5rem;
    }
    .contact__subtitle {
      font-size: 14px;
    }
    input,
    textarea {
      font-size: 13px;
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

@media (max-width: 767.98px) {
  .contact-page {
    padding: 1.5rem 1rem;
    height: 100%;
  }
  .contact__container {
    grid-template-columns: 1fr;
    align-items: initial;
    gap: 1.2rem;
    max-width: 100%;
  }
  .contact__form {
    h2 {
      font-size: 1.2rem;
    }
    .contact__subtitle {
      font-size: 13px;
    }
    input,
    textarea {
      font-size: 13px;
      &:focus {
        border-color: #d3aeff;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(211, 174, 255, 0.35);
      }
      &::placeholder {
        font-size: 11px;
      }
    }
  }
  .contact__form,
  .contact__info {
    padding: 1.8rem 1.7rem;
    width: 100%;
  }
}

/*=====================
  CONTACT INFO
=====================*/

.contact__info {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 1.7rem;
  border-radius: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  h3 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-family: "Playfair Display", serif;
  }
  .contact__address {
    line-height: 20px;
  }
  .contact__address,
  .contact__phone,
  .contact__mail {
    font-size: 15px;
    color: #444;
  }
  .contact__hours {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0.8rem;
    li {
      font-size: 14px;
      color: #555;
      margin-bottom: 0.2rem;
    }
  }
  .contact__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.6rem;
  }
  .badge {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .badge--green {
    background: #e8f8ee;
    color: #1f8f4b;
  }
  .badge--yellow {
    background: #fff6da;
    color: #b28715;
  }
  .contact__map {
    overflow: hidden;
  }
  .contact__map iframe {
    max-width: 100%;
    border-radius: 1rem;
    margin-top: 0.8rem;
    display: block;
  }
}

@media (max-width: 991.98px) {
  .contact__info {
    gap: 0.7rem;
    h3 {
      font-size: 20px;
    }
    .contact__address {
      line-height: 19px;
    }
    .contact__address,
    .contact__phone,
    .contact__mail {
      font-size: 14px;
    }
    .contact__hours {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0.8rem;
      li {
        font-size: 13px;
        color: #555;
        margin-bottom: 0.2rem;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .contact__info {
    gap: 0.5rem;
    h3 {
      font-size: 19px;
    }
    .contact__address {
      line-height: 18px;
    }
    .contact__address,
    .contact__phone,
    .contact__mail {
      font-size: 13px;
    }
    .contact__hours {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0.8rem;
      li {
        font-size: 12px;
        color: #555;
        margin-bottom: 0.2rem;
      }
    }
  }
}
</style>
