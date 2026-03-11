
import { defineStore } from 'pinia'
import {
  axiosBookingSlots,
  axiosCreateBooking,
} from '../shared/services/booking.service.ts'

export interface BookingDraft {
  categoryId: number | null
  serviceId: number | null
  staffId: number | null
  date: string | null
  datetime: string | null
}

export interface Slot {
  start: string
  end: string
  label: string
}

export interface BookingState {
  bookingDraft: BookingDraft
  slots: Slot[],
  success: boolean,
  error: string | null
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookingDraft: {
      categoryId: null,
      serviceId: null,
      staffId: null,
      date: null,
      datetime: null
    },
    slots: [],
    success: false,
    error: null
  }),
  getters: {
    isStep1Complete: (state) => state.bookingDraft.categoryId && state.bookingDraft.serviceId && state.bookingDraft.staffId,
    isStep2Complete: (state) => state.bookingDraft.date,
  },
  actions: {
    setBookingDraft(payload: Partial<BookingDraft>) {
      this.bookingDraft = {
        ...this.bookingDraft,
        ...payload
      }
    },
    resetBookingDraft() {
      this.bookingDraft = {
        categoryId: null,
        serviceId: null,
        staffId: null,
        date: null,
        datetime: null,
      }
      this.slots = []
      this.success = false
    },
    async axiosSlots() {
      const { categoryId, serviceId, staffId, date } = this.bookingDraft

      if (!categoryId || !serviceId || !staffId || !date) {
        this.slots = []
        return
      }

      try {
        const slots = await axiosBookingSlots(categoryId, serviceId, staffId, date)
        this.slots = slots
      } catch(e) {
        console.error(e)
      }
    },
    async createBooking(dataBooking) {
      try {
        return await axiosCreateBooking(dataBooking)
      } catch (e: any) {
        this.error = e?.message || 'Erreur réservation'
        this.success = false
        throw e
      }
    }
  },

  persist: {
    paths: ['bookingDraft', 'slots']
  }
})
