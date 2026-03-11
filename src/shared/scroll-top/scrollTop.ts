import {onMounted, onUnmounted, ref} from "vue";

export const useScrollToTop = (offset = 300) => {

  const showScrollTop = ref<boolean>(false)

  const handleScroll = () => {
    showScrollTop.value = window.scrollY > offset
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    useScrollToTop,
    scrollToTop,
    showScrollTop
  }
}
