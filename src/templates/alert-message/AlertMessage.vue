<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {useUiStore} from "@/stores/uiStore.ts";

const router = useRouter()

const uiStore = useUiStore()

const props = defineProps<{
  successMessage: string | null
  errorMessage: string | null
  type?: string
  to?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const DELAY_TIME = 2000

onMounted(() => {
  if (props.type === "success" && props.to && props.to.trim().length > 0) {
    const timeout = setTimeout(() => {
      emit('close')

      router.push({ path: `${props.to}` })

      if (uiStore.bookingAfterLogin && props.to === "/") {
        uiStore.openBooking()
      }

      clearTimeout(timeout)
    }, DELAY_TIME)
  } else {
    const timeout = setTimeout( () => {
      emit('close')
      clearTimeout(timeout)
    }, DELAY_TIME)
  }
})
</script>

<template>
  <div class="msg-form">
    <span v-if="props.successMessage" v-html="props.successMessage" :class="{ 'success-field': props.successMessage }"></span>
    <span v-if="props.errorMessage" v-html="props.errorMessage" :class="{ 'error-field': props.errorMessage }"></span>
  </div>
</template>

<style scoped lang="scss">
.msg-form {
  text-align: center;
  .success-field {
    font-size: 12px;
    color: green;
    @media (max-width: 675.98px) {
      font-size: 12px;
    }
  }
  .error-field {
    font-size: 12px;
    color: red;
    @media (max-width: 675.98px) {
      font-size: 12px;
    }
  }
}
</style>
