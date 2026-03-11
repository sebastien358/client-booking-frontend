import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminContactList(limit: number, offset: number) {
  const response = await axios.get(`${BASE_URL}/api/admin/contact/list`, {
    params: { limit: limit, offset: offset }
  })
  return response.data ?? []
}

export async function axiosAdminContactSearch(term: string) {
  const response = await axios.get(`${BASE_URL}/api/admin/contact/search`, {
    params: { search: term }
  })
  return response.data ?? []
}

export async function axiosAdminContactShow(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/contact/show/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération d'un contact : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminDeleteContact(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/contact/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la supression d'un contact : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
