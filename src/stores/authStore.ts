import { defineStore } from 'pinia'
import {
  axiosDeleteUser,
  axiosEmailExisting,
  axiosLogin,
  axiosRegister, axiosRequestPassword, axiosResetPassword, axiosUpdateMe,
  axiosUserMe
} from "../shared/services/auth.service.ts";
import type {LoginFormInterface} from "@/shared/interfaces";

interface authState {
  isLoggedIn: boolean,
  token: string | null,
  user: string[] | null,
  roles: string[],
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): authState => ({
    token: null,
    isLoggedIn: false,
    user: [],
    roles: [],
    loading: true
  }),
  getters: {
    isAdmin: (state) => state.roles?.includes('ROLE_ADMIN'),
    isUser: (state) => state.roles?.includes('ROLE_USER'),
  },
  actions: {
    async login(dataUser: LoginFormInterface) {
      this.isLoggedIn = false;
      this.token = null;

      try {
        const response = await axiosLogin(dataUser);

        if (!response?.token) {
          return null;
        }

        this.token = response.token;
        this.isLoggedIn = true;

        await this.me();

        return response;
      } catch (e) {
        this.isLoggedIn = false;
        this.token = null;
        console.error(e);
        return null;
      }
    },
    async register(dataUser: Object) {
      try {
        return await axiosRegister(dataUser)
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async emailExisting(dataUser: LoginFormInterface) {
      try {
        return await axiosEmailExisting(dataUser)
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async requestPassword(dataReset: Object) {
      try {
        return await axiosRequestPassword(dataReset)
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async resetPassword(data: Object, token: string) {
      try {
        return await axiosResetPassword(data, token)
      } catch(e) {
        console.error(e)
        throw e
      }
    },
    async me() {
      this.roles = []

      try {
        this.loading = true
        const response = await axiosUserMe()
        if (!response && !response?.roles) {
          return null
        }
        this.roles = response.roles
        this.user = response

        return response
      } catch(e) {
        this.roles = []
        console.error(e)
        return null
      } finally {
        this.loading = false
      }
    },
    async updateMe(dataUser: Object) {
      try {
        return await axiosUpdateMe(dataUser)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async deleteUser() {
      try {
        return await axiosDeleteUser()
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    logout() {
      this.token = null
      this.isLoggedIn = false
      this.user = null
      this.roles = []
    }
  },

  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['token']
  }
})
