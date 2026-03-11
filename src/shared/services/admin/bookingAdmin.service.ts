import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminBookingList(limit: number, offset: number) {
  const response = await axios.get(`${BASE_URL}/api/admin/appointment/list`, {
    params: { limit: limit, offset: offset }
  })
  return response.data ?? []
}

export async function axiosAdminBookingSearch(term: string) {
  const response = await axios.get(`${BASE_URL}/api/admin/appointment/search`, {
    params: { search: term }
  })
  return response.data ?? []
}

export async function axiosAdminBookingCurrent(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/appointment/show/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur récupération d'une réservation : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const axiosAdminBookingDelete = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/appointment/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d'une réservation : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const axiosAdminDeleteMyBookingUser = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/appointment/delete/${id}/user`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d'une réservation coté client : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
