import { defineStore } from 'pinia'
import { axiosAdminContactList, axiosAdminContactSearch, axiosAdminContactShow, axiosAdminDeleteContact } from '../../shared/services/admin/contactAdmin.service.ts'

export const useContactAdminStore = defineStore('contactAdmin', {
  state: () => ({
    contacts: [],
    loading: true,
    isSearching: false,
    searchTerm: '',
    hasMore: true,
    limit: 3,
    offset: 0,
  }),
  actions: {
    async contactAdminList(append = false) {
      try {
        this.loading = true

        const response = await axiosAdminContactList(this.limit, this.offset)
        const contacts = Array.isArray(response) ? response : [response]

        if (!append) {
          this.contacts = contacts
          this.offset = contacts.length
        } else {
          this.contacts.push(...contacts)
          this.offset += contacts.length
        }

        if (contacts.length < this.limit) {
          this.hasMore = false
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async contactLazyLoad() {
      try {
        if (this.loading) return
        if (!this.hasMore) return
        if (this.isSearching) return
        await this.contactAdminList(true)
      } catch(e) {
        console.error(e)
      }
    },
    async contactSearch(term: string) {
      if (!term && term.trim().length === 0) {
        this.searchTerm = term
        this.hasMore = true
        this.isSearching = false
        this.offset = 0
        await this.contactAdminList(false)
        return
      }
      this.loading = true
      if (term.trim().length < 2) return
      try {
        const response = await axiosAdminContactSearch(term)
        this.contacts = Array.isArray(response) ? response : []

        this.hasMore = false
      } catch (e) {
        console.error(e)
        this.contacts = []
      } finally {
        this.loading = false
      }
    },
    async currentContact(id: number) {
      try {
        this.loading = true
        const response = await axiosAdminContactShow(id)
        return response
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async deleteAdminContact(id: number) {
      try {
        return await axiosAdminDeleteContact(id)
      } catch (e) {
        console.error(e)
      }
    },
    async resetContact() {
      try {
        this.offset = 0
        this.hasMore = true
        this.searchTerm = ''
        this.isSearching = false
        await this.contactAdminList(false)
      } catch(e) {
        console.error(e)
      }
    }
  }
})
