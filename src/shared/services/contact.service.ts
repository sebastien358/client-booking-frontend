import type { ContactFormInterface } from '../interfaces'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosCreateContact(dataContact: ContactFormInterface) {
  try {
    const response = await axios.post(`${BASE_URL}/api/contact/create`, dataContact)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de l'ajout d'un contact : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
