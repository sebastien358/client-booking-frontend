import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosServiceList() {
  try {
    const response = await axios.get(`${BASE_URL}/api/service/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération des services : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
