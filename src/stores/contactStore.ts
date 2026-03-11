import { defineStore } from 'pinia'
import type { ContactFormInterface } from '../shared/interfaces'
import { axiosCreateContact } from '../shared/services/contact.service.ts'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: []
  }),
  actions: {
    async contactNew(dataContact: ContactFormInterface) {
      try {
        const response = await axiosCreateContact(dataContact)
        return response
      } catch(e) {
        console.error(e)
      }
    }
  }
})
