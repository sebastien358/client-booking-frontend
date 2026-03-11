import { defineStore } from 'pinia'
import { axiosAdminCurrentService, axiosAdminDeleteService, axiosAdminServiceCreate, axiosAdminServiceList,
  axiosAdminServiceSearch
} from '../../shared/services/admin/serviceAdmin.service.ts'

export interface ServiceState {
  services: Object[],
  limit: number,
  offset: number,
  loading: boolean,
  hasMore: boolean,
  isSearching: false,
  searchTerm: string
}

export const useServiceAdminStore = defineStore('serviceAdmin', {
  state: (): ServiceState => ({
    services: [],
    limit: 3,
    offset: 0,
    loading: false,
    hasMore: true,
    isSearching: false,
    searchTerm: ''
  }),
  actions: {
    async servicesList(append = false) {
      try {
        this.loading = true

        const response = await axiosAdminServiceList(this.limit, this.offset)

        const services = Array.isArray(response) ? response : []
        if (!append) {
          this.services = services
          this.offset = services.length
        } else {
          this.services.push(...services)
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
    async serviceSearch(term: string) {
      const clean = (term ?? '').trim()

      if (clean.trim().length === 0) {
        this.searchTerm = ''
        this.isSearching = false
        this.hasMore = true
        await this.servicesList(false)
        return
      }

      if (clean.trim().length < 2) return

      try {
        this.loading = true
        this.isSearching = true
        this.searchTerm = clean

        const response = await axiosAdminServiceSearch(clean)
        const data = Array.isArray(response) ? response : []

        this.services = data
        this.hasMore = false
      } catch(e) {
        console.error(e)
        this.services = []
      } finally {
        this.loading = false
      }
    },
    async serviceLazyLoad() {
      if (this.loading) return
      if (!this.hasMore) return
      if (this.isSearching) return

      await this.servicesList(true)
    },
    async serviceCreate(dataService) {
      try {
        const response = await axiosAdminServiceCreate(dataService)
        await this.servicesList()
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async currentService(id: number) {
      try {
        this.loading = true
        return await axiosAdminCurrentService(id)
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async deleteService(id: number) {
      try {
        return await axiosAdminDeleteService(id)
      } catch (e) {
        console.error(e)
      }
    },
    async resetServiceList() {
      this.offset = 0
      this.hasMore = true
      this.isSearching = false
      this.searchTerm = ''
      this.services = []
      await this.servicesList(false)
    },
  },
})
