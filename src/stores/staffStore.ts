import { defineStore } from 'pinia'
import type { StaffInterface } from '../shared/interfaces'
import { axiosStaffList } from '../shared/services/staff.service.ts'

interface StaffState {
  staffs: StaffInterface[]
  loading: boolean
}

export const useStaffStore = defineStore('', {
  state: (): StaffState  => ({
    staffs: [],
    loading: true
  }),
  getters: {
    filteredStaff(state) {
      return state.staffs.filter((f) => f.is_active)
    }
  },
  actions: {
   async staffList(append = false) {
     try {
       this.loading = true
       const response = await axiosStaffList()
       if (response) {
         const staffs = Array.isArray(response) ? response : [response]
         this.staffs = append ? [...this.staffs, ...staffs] : staffs
       } else {
         console.log('La response est vide')
       }
     } catch (e) {
       console.log(e)
     } finally {
       this.loading = false
     }
   }
  }
})
