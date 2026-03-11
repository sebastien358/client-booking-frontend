import { defineStore } from 'pinia'

import {
  axiosAdminTestimonialAdminList,
  axiosAdminTestimonialSearch, axiosTestimonialAdminCurrent, axiosTestimonialAdminDelete,
  axiosToggleTestimonial
} from '../../shared/services/admin/testimonialAdmin.service.ts'

import type {TestimonialInterface} from "@/shared/interfaces";

interface TestimonialState {
  testimonials: TestimonialInterface[]
  loading: boolean,
  isSearching: boolean
  searchTerm: string
  hasMore : boolean
  offset: number
  limit: number
}

export const useTestimonialAdminStore = defineStore('testimonialAdmin', {
  state: (): TestimonialState => ({
    testimonials: [],
    loading: true,
    isSearching: false,
    searchTerm: '',
    hasMore : true,
    offset: 0,
    limit: 3
  }),
  actions: {
    async testimonialAdminList(append = false) {
      try {
        this.loading = true

        const offset = append ? this.offset : 0

        const response = await axiosAdminTestimonialAdminList(this.limit, offset)
        const testimonials = Array.isArray(response) ? response : []

        if (!append) {
          this.testimonials = testimonials
          this.offset = testimonials.length
          this.hasMore = true
        } else {
          this.testimonials.push(...testimonials)
          this.offset += testimonials.length
        }

        if (testimonials.length < this.limit) {
          this.hasMore = false
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async testimonialAdminSearch(term: string) {
      const cleaned = (term ?? '').trim()

      if (cleaned.length === 0) {
        this.searchTerm = ''
        this.offset = 0
        this.hasMore = true
        this.isSearching = false
        await this.testimonialAdminList(true)
        return
      }

      if (cleaned.trim().length < 2) return

      try {
        this.loading = true
        this.isSearching = true
        this.searchTerm = cleaned

        const response = await axiosAdminTestimonialSearch(term)
        const data = Array.isArray(response) ? response : []

        this.testimonials = data

        this.hasMore = false
      } catch(e) {
        this.isSearching = false
        this.testimonials = []
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async testimonialLazyLoad() {
      try {
        if (this.loading) return
        if (!this.hasMore) return
        if (this.isSearching) return

        await this.testimonialAdminList(true)
      } catch(e) {
        console.error(e)
      }
    },
    async testimonialCurrent(id: number) {
      try {
        this.loading = true
        return await axiosTestimonialAdminCurrent(id)
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async testimonialToggle(id: number) {
      try {
        return await axiosToggleTestimonial(id)
      } catch(e) {
        console.error(e)
        return null
      }
    },
    async testimonialDelete(id: number, pictureId?: number) {
      try {
        return await axiosTestimonialAdminDelete(id, pictureId)
      } catch (e) {
        console.error(e)
        return null
      }
    },
    async resetTestimonialList() {
      try {
        this.isSearching = false
        this.searchTerm = ''
        this.offset = 0
        this.hasMore = true
        this.testimonials = []
        await this.testimonialAdminList(false)
      } catch(e) {
        console.error(e)
      }
    }
  },
})

