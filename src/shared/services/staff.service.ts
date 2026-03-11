import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosStaffList() {
  try {
    const response = await axios.get(`${BASE_URL}/api/staff/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de la récupération des employés : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

