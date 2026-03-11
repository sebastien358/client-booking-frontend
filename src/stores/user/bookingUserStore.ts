import {defineStore} from "pinia";
import {axiosUserBookingList} from "@/shared/services/user/bookingUser.ts";

export const useBookingUserStore = defineStore('bookingUser', {
  state: () => ({
    bookings: [],
    loading: true,
    isSearching: false,
    searchTerm: '',
    hasMore: true,
    offset: 0,
    limit: 3,
  }),
  actions: {
    async bookingUserList(append = false) {
      try {
        this.loading = true

        const response = await axiosUserBookingList()
        const bookings = Array.isArray(response) ? response : []

        if (!append) {
          this.bookings = bookings
          this.offset = bookings.length
          this.hasMore = true
        } else {
          this.bookings.push(...bookings)
          this.offset += bookings.length
        }

        if (this.limit < bookings.length) {
          this.hasMore = false
        }

      } catch(e) {
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
