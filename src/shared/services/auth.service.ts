import type { LoginFormInterface } from '../interfaces'
import {useAuthStore} from "@/stores/authStore.ts";
import router from '../../router'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export const axiosLogin = async (dataUser: LoginFormInterface) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login`, {
      username: dataUser.email,
      password: dataUser.password,
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la réservation : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const axiosRegister = async (dataUser: Object) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/register`, dataUser)
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de l' inscription utlisateur: ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export const axiosRequestPassword = async (dataReset: Object) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/request-password`, {
      email: dataReset.email
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la notification de mot de passe : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export const axiosResetPassword = async (data: Object, token: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/reset-password/${token}`, {
      password: data.password
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la réinitialisation du mot de passe : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export const axiosEmailExisting = async (dataLogin: LoginFormInterface) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/existing`, {
      email: dataLogin.email
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true;
    }
    throw new Error(`Erreur l'email n'existe pas dans les données: ${response.status}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const axiosUserMe = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/me`)
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la récupération de l'utilisateur connecté : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const axiosUpdateMe = async (dataUser: Object) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/update/me`, {
      firstname: dataUser.firstname,
      lastname: dataUser.lastname,
      phoneNumber: dataUser.phoneNumber,
      email: dataUser.email,
      newPassword: dataUser.newPassword
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la modification des données utilisateur : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const axiosDeleteUser = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/user/delete/account`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d'un utilisateur : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

// REQUEST

axios.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// RESPONSE
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    const hasAuthHeader = Boolean(
      error.config?.headers?.Authorization ||
      error.config?.headers?.authorization
    )

    if (error.response?.status === 401 && hasAuthHeader) {
      authStore.logout()
      router.push('/') // ✅ retour accueil, pas login
    }

    return Promise.reject(error)
  }
)

