import { defineStore } from 'pinia'
import { axiosServiceList } from '../shared/services/service.service.ts'

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    loading: true
  }),
  actions: {
    async serviceList() {
      try {
        this.loading = true
        const response = await axiosServiceList()
        if (response) {
          this.services = Array.isArray(response) ? response : [response]
        } else {
          console.log('la response est vide')
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
