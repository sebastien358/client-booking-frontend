import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminServiceList(limit: number, offset: number) {
  const response = await axios.get(`${BASE_URL}/api/admin/service/list`, {
    params: { limit: limit, offset: offset }
  })
  return response.data ?? []
}

export async function axiosAdminServiceSearch(term: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/service/search`, {
      params: { search: term }
    })
    return response.data ?? []
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminCurrentService(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/service/show/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération d\'un service : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminServiceCreate(dataService) {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/service/create`, dataService)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de l\'ajout d\'un services : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminDeleteService(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/service/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d\'un service : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
