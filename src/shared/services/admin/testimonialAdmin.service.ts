import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosAdminTestimonialAdminList(limit: number, offset: number) {
  const response = await axios.get(`${BASE_URL}/api/admin/testimonial/list`, {
    params: { limit: limit, offset: offset }
  })
  return response.data ?? []
}

export async function axiosAdminTestimonialSearch(term: string) {
  const response = await axios.get(`${BASE_URL}/api/admin/testimonial/search`, {
    params: { search: term }
  })
  return response.data ?? []
}

export async function axiosTestimonialAdminCurrent(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/testimonial/show/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? []
    }
    throw new Error(`Erreur de la récupération d'un des témoignage : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosToggleTestimonial(id: number) {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/testimonial/${id}/toggle`)
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur témoignage toggle : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosTestimonialAdminDelete(id: number, pictureId?: number) {
  try {
    if (pictureId === null) {
      const response = await axios.delete(`${BASE_URL}/api/admin/testimonial/show/${id}`)
      if (response.status === 200 || response.status === 204) {
        return response.data ?? true
      }
    }
    const response = await axios.delete(`${BASE_URL}/api/admin/testimonial/show/${id}/picture/${pictureId}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}


