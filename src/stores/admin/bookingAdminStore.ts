import { defineStore } from 'pinia'
import {
  axiosAdminBookingCurrent, axiosAdminBookingDelete, axiosAdminBookingList, axiosAdminBookingSearch,
  axiosAdminDeleteMyBookingUser
} from '../../shared/services/admin/bookingAdmin.service.ts'
import type { BookingInterface } from '../../shared/interfaces'

interface BookingState {
  bookings: BookingInterface[]
  loading: boolean
  isSearching: boolean
  searchTerm: string
  hasMore: boolean
  offset: number
  limit: number
}

export const useBookingAdminStore = defineStore('bookingAdmin', {
  state: (): BookingState => ({
    bookings: [],
    loading: true,
    isSearching: false,
    searchTerm: '',
    hasMore: true,
    offset: 0,
    limit: 3,
  }),
  actions: {
    async bookingAdminList(append = false) {
      try {
        this.loading = true

        const response = await axiosAdminBookingList(this.limit, this.offset)

        const services = Array.isArray(response) ? response : []

        if (!append) {
          this.bookings = services
          this.offset = services.length
          this.hasMore = true
        } else {
          this.bookings.push(...services)
          this.offset += services.length
        }

        if (services.length < this.limit) {
          this.hasMore = false
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async bookingAdminSearch(term: string) {
      const clean = (term ?? '').trim()

      if (clean.trim().length === 0) {
        this.searchTerm = ''
        this.isSearching = false
        this.offset = 0
        this.hasMore = true
        await this.bookingAdminList(false)
        return
      }

      if (clean.trim().length < 2) return

      try {
        this.loading = true
        this.isSearching = true
        this.searchTerm = clean

        const response = await axiosAdminBookingSearch(clean)
        this.bookings = Array.isArray(response) ? response : []

        this.hasMore = false
      } catch (e) {
        console.error(e)
        this.bookings = []
      } finally {
        this.loading = false
      }
    },
    async bookingAdminLazyLoad() {
      try {
        if (this.loading) return
        if (!this.hasMore) return
        if (this.isSearching) return
        return await this.bookingAdminList(true)
      } catch (e) {
        console.error(e)
      }
    },
    async bookingAdminCurrent(id: number) {
      try {
        this.loading = true
        return await axiosAdminBookingCurrent(id)
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async bookingAdminDelete(id: number) {
      try {
        await axiosAdminBookingDelete(id)
        this.bookings = this.bookings.filter(booking => booking.id !== id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async bookingDeleteMyBookingUser(id: number) {
      try {
        await axiosAdminDeleteMyBookingUser(id)
        this.bookings = this.bookings.filter(booking => booking.id !== id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async resetBooking() {
      try {
        this.offset = 0
        this.hasMore = true
        this.searchTerm = ''
        this.isSearching = false
        await this.bookingAdminList(false)
      } catch(e) {
        console.error(e)
      }
    }
  },
})
