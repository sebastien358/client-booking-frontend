<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', term: string): void
}>()

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="input-search">
    <input
      class="search"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder ?? ''"
      type="text"
    />
  </div>
</template>

<style scoped lang="scss">
.input-search {
  display: flex;
  align-items: center;
  justify-content: center;
  .search {
    width: min(100%, 370px);
    padding: 10px 15px;
    margin-bottom: 30px;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-size: 14px;
    @media (max-width: 991.98px) {
      font-size: 13px;
      padding: 10px;
    }
    @media (max-width: 767.98px) {
      font-size: 12px;
      padding: 11px 10px;
    }
  }
}
</style>
