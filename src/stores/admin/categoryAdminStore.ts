import { defineStore } from 'pinia'
import type { CategoryInterface } from '../../shared/interfaces'
import { axiosAdminCategoryList } from '../../shared/services/admin/categoryAdmin.service.ts'

interface CategoryState {
  categories: CategoryInterface[]
}

export const useCategoryAdminStore = defineStore('categoryAdmin', {
  state: (): CategoryState => ({
    categories: [],
  }),
  actions: {
    async categoryList() {
      try {
        const response = await axiosAdminCategoryList()
        if (response) {
          this.categories = Array.isArray(response) ? response : [response]
        } else {
          console.log('La response est vide')
        }
      } catch (e) {
        console.error(e)
      }
    },
  },
})
