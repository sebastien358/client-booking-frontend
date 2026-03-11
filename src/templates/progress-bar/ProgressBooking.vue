<script setup lang="ts">

const props = defineProps<{
  progress: number
}>()
</script>

<template>
  <section class="booking-progress">
    <div class="separator-progress-left" :class="{ active: props.progress >= 1 }"></div>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" :class="{ active: props.progress >= 1 }">
      <rect x="3" y="4" width="18" height="4" rx="2" fill="#ffffff"/>
      <rect x="3" y="10" width="12" height="4" rx="2" fill="#ffffff"/>
      <rect x="3" y="16" width="8" height="4" rx="2" fill="#ffffff"/>
    </svg>
    <div class="separator-progress" :class="{ active: props.progress >= 2 }"></div>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" :class="{ active: props.progress >= 2 }">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#ffffff" stroke-width="2"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke="#ffffff" stroke-width="2"/>
      <rect x="7" y="12" width="4" height="4" rx="1" fill="#ffffff"/>
    </svg>

    <div class="separator-progress" :class="{ active: props.progress >= 3 }"></div>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" :class="{ active: props.progress >= 3 }">
      <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="2"/>
      <path d="M7 12l3 3 7-7" stroke="#ffffff" stroke-width="2" fill="none"/>
    </svg>
    <div class="separator-progress-right"></div>
  </section>
</template>

<style scoped lang="scss">

.booking-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 25px 0 0 0;
  width: 100%;
  .separator-progress-left,
  .separator-progress-right {
    width: 20px;
    height: 2px;
    background: #dfe4ea;
  }
  .separator-progress-left.active {
    background: #08d8ea;
  }
  .separator-progress {
    width: 40px;
    height: 2px;
    background: #dfe4ea;
  }
  .separator-progress.active {
    background: #08d8ea;
  }
  svg {
    background: #dfe4ea;
    padding: 5px;
    border-radius: 50%;
    height: 32px;
    width: 32px;
  }
  svg.active {
    background: #08d8ea;
  }
}
</style>
