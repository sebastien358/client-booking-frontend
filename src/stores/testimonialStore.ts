import { defineStore } from 'pinia'
import type { TestimonialFormInterface, TestimonialInterface } from '../shared/interfaces'
import {
  axiosCreateTestimonial,
  axiosTestimonialList,
} from '../shared/services/testimonial.service.ts'

interface TestimonialState {
  testimonials: TestimonialInterface[]
  loading: boolean
  hasMore: boolean
  offset: number
  limit: number
  isSearching: boolean
}

export const useTestimonialStore = defineStore('testimonials', {
  state: (): TestimonialState => ({
    testimonials: [],
    loading: true,
    hasMore: true,
    offset: 0,
    limit: 3,
    isSearching: false
  }),
  getters: {
    publishedTestimonials(state) {
      return (state.testimonials ?? []).filter((t) => t.is_published)
    },
  },
  actions: {
    async testimonialList(append = false) {
      try {
        this.loading = true

        const offset = append ? this.offset : 0

        const response = await axiosTestimonialList(this.limit, offset)
        const testimonials = Array.isArray(response) ? response : []

        if (!append) {
          this.testimonials = testimonials
          this.offset = testimonials.length
          this.hasMore = true // sécurité
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
    async testimonialLazyLoad() {
      try {
        if (this.loading) return
        if (!this.hasMore) return
        if (this.isSearching) return

        await this.testimonialList(true)
      } catch (e) {
        console.log(e)
      }
    },
    async createTestimonial(dataTestimonial: TestimonialFormInterface) {
      try {
        const formData = new FormData()
        formData.append('author', dataTestimonial.author)
        formData.append('job', dataTestimonial.job)
        formData.append('rating', dataTestimonial.rating)
        formData.append('message', dataTestimonial.message)
        if (dataTestimonial.image instanceof File) {
          formData.append('filename', dataTestimonial.image)
        }
        const response = await axiosCreateTestimonial(formData)
        this.testimonials.unshift(response)
        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async resetTestimonials() {
      try {
        this.testimonials = []
        this.offset = 0
        this.hasMore = true
      } catch(e) {
        console.error(e)
      }
    }
  }
})
