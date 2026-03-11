<script setup lang="ts">

defineProps<{
  isVisible?: boolean,
  transparent?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport v-if="isVisible" to="body">
    <div @click="emit('close')" class="calc" :class="{'transparent': transparent}"></div>
  </Teleport>
</template>

<style scoped lang="scss">
.calc {
  //z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.71);
}

.transparent {
  background-color: transparent;
}
</style>
