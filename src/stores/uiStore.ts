import {defineStore} from "pinia";

export const useUiStore = defineStore('uiStore', {
  state: () => ({
    isBookingOpen: false,
    bookingAfterLogin: false
  }),
  actions: {
    openBooking() {
      this.isBookingOpen = true
    },
    closeBooking() {
      this.isBookingOpen = false
    }
  }
})
