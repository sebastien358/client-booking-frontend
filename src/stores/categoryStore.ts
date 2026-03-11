import { defineStore } from 'pinia'
import type { CategoryInterface } from '../shared/interfaces'
import { axiosCategoryList } from '../shared/services/category.service.ts'

interface CategoryState {
  categories: CategoryInterface[]
  loading: boolean
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    loading: true
  }),
  actions: {
    async categoryList() {
      try {
        this.loading = true
        const response = await axiosCategoryList()
        if (response) {
          this.categories = Array.isArray(response) ? response : [response]
        } else {
          console.log('La response est vide')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
