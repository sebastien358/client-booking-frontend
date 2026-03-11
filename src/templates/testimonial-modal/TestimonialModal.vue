<script setup lang="ts">
import AlertMessage from "@/templates/alert-message/AlertMessage.vue";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";
import { useTestimonialStore } from "@/stores/testimonialStore.ts";

defineProps<{
  showTestimonialModal: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const testimonialStore = useTestimonialStore();

/* ===========================
  GESTION FORM
=========================== */

const schema = z.object({
  author: z
    .string({ message: "Veuillez renseigner le champ Auteur." })
    .trim()
    .min(1, { message: "Veuillez renseigner le champ Auteur." })
    .min(3, { message: "Le nom doit contenir au moins 3 caractères." })
    .max(70, { message: "Le nom ne peut pas dépasser 70 caractères." }),
  job: z
    .string({ message: "Veuillez renseigner le champ Profession." })
    .trim()
    .min(1, { message: "Veuillez renseigner le champ Profession." })
    .min(3, { message: "La profession doit contenir au moins 3 caractères." })
    .max(70, { message: "La profession ne peut pas dépasser 70 caractères." }),
  rating: z.coerce
    .number({ message: "Veuillez sélectionner une note." })
    .min(1, { message: "La note minimale est de 1 étoile." })
    .max(5, { message: "La note maximale est de 5 étoiles." })
    .refine((val) => val >= 1 && val <= 5, { message: "La note doit être comprise entre 1 et 5." }),
  message: z
    .string({ message: "Veuillez renseigner le champ Témoignage." })
    .trim()
    .min(1, { message: "Veuillez renseigner le champ Témoignage." })
    .min(50, { message: "Le témoignage doit contenir au moins 50 caractères." })
    .max(250, { message: "Le témoignage ne peut pas dépasser 250 caractères." }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "L’image ne doit pas dépasser 2 Mo.",
    })
    .refine((file) => !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Seules les images JPG, PNG ou WebP sont acceptées.",
    }),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: author, errorMessage: errorAuthor } = useField<string>("author");
const { value: job, errorMessage: errorJob } = useField<string>("job");
const { value: rating, errorMessage: errorRating } = useField<number>("rating");
const { value: message, errorMessage: errorText } = useField<string>("message");
const { value: image, errorMessage: errorImage, setValue } = useField<string>("image");

/* ===========================
  GESTION IMAGES
=========================== */

const imgFile = ref<string | null>(null);

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  setValue(file ?? undefined);
  imgFile.value = file.name;
}

const onSubmit = handleSubmit(async (dataTestimonial, { resetForm }) => {
  try {
    const response = await testimonialStore.createTestimonial(dataTestimonial);
    if (!response) {
      setErrorMessage("Impossible d’envoyer votre avis.");
      return;
    }
    setSuccessMessage("Merci beaucoup pour votre avis. ✨", resetForm);
  } catch (error) {
    setErrorMessage("Une erreur est survenue.");
    console.error(error);
  }
});

/* ===========================
  FORM GESTION DES ERREURS
=========================== */

let reset = () => {};

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function setSuccessMessage(msg: string, resetForm: () => void) {
  successMessage.value = msg;
  errorMessage.value = null;
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
  <Teleport v-if="showTestimonialModal" to="body">
    <Transition>
      <section class="modal-testimonial">
        <!-- FORMULAIRE -->
        <div class="testimonials__form">
          <div class="testimonials__close__modal">
            <button @click="emit('close')" class="btn btn-modal-close">×</button>
          </div>
          <h2 class="testimonials__title">Laissez votre avis</h2>
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <input v-model="author" type="text" placeholder="Votre nom" />
              <span v-if="errorAuthor" class="error-field">
                {{ errorAuthor }}
              </span>
            </div>
            <div class="form-group">
              <input v-model="job" type="text" placeholder="Votre profession" />
              <span v-if="errorJob" class="error-field">
                {{ errorJob }}
              </span>
            </div>
            <div class="form-group">
              <div class="select-wrapper">
                <select v-model="rating" name="rating">
                  <option value="5">⭐⭐⭐⭐⭐ – Excellent</option>
                  <option value="4">⭐⭐⭐⭐ – Très bien</option>
                  <option value="3">⭐⭐⭐ – Bien</option>
                  <option value="2">⭐⭐ – Moyen</option>
                  <option value="1">⭐ – Décevant</option>
                </select>
                <span class="placeholder" v-if="!rating">Choix de la catégorie </span>
              </div>
              <span v-if="errorRating" class="error-field">
                {{ errorRating }}
              </span>
            </div>
            <div class="form-group">
              <input type="file" @change="onFileChange" />
              <small :class="errorImage ? 'error-field' : 'img-file'">
                {{ errorImage ? errorImage : imgFile }}
              </small>
              <div v-if="!imgFile" class="file-helper">
                <small class="file-hint">Image facultative</small>
              </div>
            </div>
            <div class="form-group-textarea">
              <textarea v-model="message" placeholder="Votre Témoignage..."></textarea>
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
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
/*========================
  MODAL
========================*/

.modal-testimonial {
  position: fixed;
  inset: 0; /* équivalent top:0; right:0; bottom:0; left:0 */
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  .testimonials__close__modal {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .testimonials__close__modal .btn-modal-close {
    color: red;
    font-size: 28px;
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    bottom: 8px;
  }
}

@media (max-width: 991.98px) {
  .modal-testimonial {
    .testimonials__close__modal .btn-modal-close {
      bottom: 0;
    }
  }
}

@media (max-width: 767.98px) {
  .modal-testimonial {
    height: 100%;
    .testimonials__close__modal .btn-modal-close {
      bottom: 0;
    }
  }
}

/*========================
  FORM
========================*/

.testimonials__form {
  background: #ffffff;
  padding: 20px 20px 15px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  .testimonials__title {
    font-size: 1.6rem;
    margin-bottom: 20px;
    font-weight: 700;
    font-family: "Playfair Display", serif;
    text-align: center;
  }
  .testimonials__subtitle {
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
  .select-wrapper {
    position: relative;
    .placeholder {
      font-size: 12px;
      color: #777;
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
    }
  }
  .form-group-textarea {
    margin-top: 10px;
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
    min-width: 100%;
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
    padding: 0.6rem 1rem;
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
  .file-helper {
    margin-left: 7px;
    margin-top: -7px;
  }
  .file-hint {
    color: #9ca3af;
    font-style: italic;
    font-size: 9px;
  }
  .img-file {
    color: #9ca3af;
    font-style: italic;
    font-size: 9px;
    margin-left: 5px;
    margin-top: 4px;
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
    color: white;
    font-weight: 600;
  }
  .btn-submit {
    margin-top: 10px;
  }
  .alert {
    margin-top: 10px;
  }
}

@media (max-width: 991.98px) {
  .testimonials__form {
    padding: 15px;
    .testimonials__title {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    .select-wrapper {
      .placeholder {
        font-size: 12px;
      }
    }
    input,
    textarea,
    select {
      padding: 0.8rem 1rem;
      font-size: 12px;
      &::placeholder {
        font-size: 12px;
        color: #777;
      }
    }
    input[type="file"] {
      padding: 0.6rem 1rem;
    }
    input[type="file"]::file-selector-button {
      font-size: 12px;
    }
  }
}

@media (max-width: 767.98px) {
  .testimonials__form {
    padding: 5px 10px 10px 10px;
    .testimonials__title {
      font-size: 1rem;
      margin-bottom: 0;
    }
    .form-group {
      margin-top: 13px;
    }
    .select-wrapper {
      .placeholder {
        font-size: 11px;
      }
    }
    input,
    textarea,
    select {
      padding: 0.9rem 0.6rem;
      font-size: 11px;
      &::placeholder {
        font-size: 11px;
        color: #777;
      }
    }
    input[type="file"] {
      padding: 0.6rem;
    }
    input[type="file"]::file-selector-button {
      font-size: 11px;
    }
  }
}

/*========================
  ANIMATION TRANSITION
========================*/

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
