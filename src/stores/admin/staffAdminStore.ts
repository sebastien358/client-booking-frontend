import { defineStore } from 'pinia'
import type { StaffFormInterface, StaffInterface } from '../../shared/interfaces'
import { axiosAdminCurrentStaff, axiosAdminCurrentToggle,
  axiosAdminDeleteStaff, axiosAdminStaffCreate, axiosAdminStaffList, axiosAdminStaffSearch
} from '../../shared/services/admin/staffAdmin.service.ts'

interface staffInterfaceState {
  staffs: StaffInterface[]
  loading: boolean
  isSearching: boolean
  searchTerm: string
  hasMore: boolean
  offset: number
  limit: number
}

export const useStaffAdminStore = defineStore('staffAdmin', {
  state: (): staffInterfaceState => ({
    staffs: [],
    loading: true,
    isSearching: false,
    searchTerm: '',
    hasMore: true,
    offset: 0,
    limit: 3
  }),
  actions: {
    async staffList(append = false) {
      try {
        this.loading = true

        const response = await axiosAdminStaffList(this.limit, this.offset)
        const staffs = Array.isArray(response) ? response : []

        if (!append) {
          this.staffs = staffs
          this.offset = staffs.length
        } else {
          this.staffs.push(...staffs)
          this.offset += staffs.length
        }

        if (staffs.length < this.limit) {
          this.hasMore = false
        }
      } catch (e) {
        console.error(e)
        this.staffs = []
      } finally {
        this.loading = false
      }
    },
    async staffSearch(term: string) {

      console.log(term)
      const cleaned = (term ?? '').trim()

      if (cleaned.length === 0) {
        this.searchTerm = ''
        this.offset = 0
        this.hasMore = true
        this.isSearching = false
        await this.staffList(false)
        return
      }

      if (cleaned.trim().length < 2) return

      try {
        this.loading = true
        this.isSearching = true
        this.searchTerm = cleaned

        const response = await axiosAdminStaffSearch(term)
        this.staffs = Array.isArray(response) ? response : []

        this.hasMore = false
      } catch(e) {
        console.error(e)
        this.isSearching = false
        this.staffs = []
      } finally {
        this.loading = false
      }
    },
    async staffLazyLoad() {
      try {
        if (this.loading) return
        if (!this.hasMore) return
        if (this.isSearching) return

        await this.staffList(true)
      } catch(e) {
        this.staffs = []
        console.error(e)
      }
    },
    async currentStaff(id: number) {
      try {
        this.loading = true
        const response =  await axiosAdminCurrentStaff(id)
        return response
      } catch (e) {
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async currentStaffToggle(id: number) {
      try {
        return await axiosAdminCurrentToggle(id)
      } catch (e) {
        console.error(e)
      }
    },
    async staffCreate(dataStaff: StaffFormInterface) {
      try {
        const formData = new FormData()
        formData.append('firstname', dataStaff.firstname)
        formData.append('lastname', dataStaff.lastname)
        if (dataStaff.image instanceof File) {
          formData.append('filename', dataStaff.image)
        }
        const response = await axiosAdminStaffCreate(formData)
        await this.staffList(false)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async deleteStaff(id: number, pictureId?: number) {
      try {
        return await axiosAdminDeleteStaff(id, pictureId)
      } catch (e) {
        console.error(e)
      }
    },
    async resetStaff() {
      try {
        this.hasMore = true
        this.isSearching = false
        this.offset = 0
        this.searchTerm = ''
        await this.staffList(false)
      } catch(e) {
        console.error(e)
      }
    }
  }
})
