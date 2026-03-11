import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export const axiosUserBookingList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/appointment/user/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la récupération des rdv client : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
