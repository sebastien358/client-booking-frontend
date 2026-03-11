import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminStaffList(limit: number, offset: number) {
  const response = await axios.get(`${BASE_URL}/api/admin/staff/list`, {
    params: { limit: limit, offset: offset }
  })
  return response.data ?? []
}

export async function axiosAdminStaffSearch(term: string) {
  const response = await axios.get(`${BASE_URL}/api/admin/staff/search`, {
    params: { search: term }
  })
  return response.data ?? []
}

export async function axiosAdminCurrentStaff(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/staff/show/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération d'un employé : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminCurrentToggle(id: number) {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/staff/${id}/toggle`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération d'un employé : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminStaffCreate(formData: FormData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/staff/create`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de l'ajout d'un salarié: ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminDeleteStaff(id: number, pictureId?: number) {
  try {
    if (pictureId === null) {
      const response = await axios.delete(`${BASE_URL}/api/admin/staff/delete/${id}`,)
      if (response.status === 200 || response.status === 204) {
        return response.data ?? true
      }
      throw new Error(`Erreur de la suppression d'un employé : ${response.status}`)
    }

    const response = await axios.delete(`${BASE_URL}/api/admin/staff/delete/${id}/picture/${pictureId}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d'un employé : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}



