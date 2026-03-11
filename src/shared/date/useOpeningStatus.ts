import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type OpeningHours = {
  open: number;
  close: number;
};

const SCHEDULE: Record<number, OpeningHours | null> = {
  0: null,
  1: { open: 9, close: 18 },
  2: { open: 9, close: 18 },
  3: { open: 9, close: 18 },
  4: { open: 9, close: 18 },
  5: { open: 9, close: 18 },
  6: { open: 9, close: 18 },
};

export function useOpeningStatus() {
  let now = new Date()
  let timer: number | undefined

  const isOpen = computed(() => {
    const day = now.getDay()
    const hour = now.getHours()

    const today = SCHEDULE[day]
    if (!today) return false

    return hour >= today.open && hour < today.close
  });

  const closingHour = computed(() => {
    const today = SCHEDULE[now.getDay()];
    return today ? `${today.close}h` : null;
  });

  // 🔥 LA CLÉ DU BUG
  const nextOpening = computed(() => {
    const currentDay = now.getDay()

    for (let i = 0; i < 7; i++) {
      const day = (currentDay + i) % 7
      const schedule = SCHEDULE[day]

      if (schedule) {
        return `${schedule.open}h`
      }
    }
  });

  onMounted(() => {
    timer = window.setTimeout(() => {
      now = new Date()
    }, 60000)
  })

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return {
    isOpen,
    closingHour,
    nextOpening,
  };
}
