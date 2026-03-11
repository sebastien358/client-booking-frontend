import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosTestimonialList(limit: number, offset: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/testimonial/list`, {
      params: { limit: limit, offset: offset }
    })
    return response.data ?? []
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosCreateTestimonial(formData: FormData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/testimonial/create`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur ajout d'un témoignage : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
