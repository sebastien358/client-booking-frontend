import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES_ADMIN } from '../features/admin/admin.routes.ts'
import { useAuthStore } from '../stores/authStore.ts'

const PrestationsView = () => import('../features/hairstyle/PrestationsView.vue')
const ContactForm = () => import('../features/hairstyle/components/contact/ContactForm.vue')
const TestimonialView = () => import('../features/hairstyle/components/testimonials/TestimonialView.vue')
const Legal = () => import('../templates/mentions-legales/Legal.vue')
const Login = () => import('../features/hairstyle/components/auth/Login.vue')
const Register = () => import('../features/hairstyle/components/auth/Register.vue')
const RequestPassword = () => import('../features/hairstyle/components/auth/reset-password/RequestPassword.vue')
const ResetPassword = () => import('../features/hairstyle/components/auth/reset-password/ResetPassword.vue')
const NotFound = () => import('../templates/notFound/NotFound.vue')
const Admin = () => import('../features/admin/Admin.vue')

const routes = [
  { path: '/', component: PrestationsView },
  { path: '/contact/form', component: ContactForm },
  { path: '/testimonials', component: TestimonialView },
  { path: '/legal-notices', component: Legal },
  { path: '/login', component: Login },
  { path: '/register', component: Register},
  { path: '/request-password', component: RequestPassword },
  { path: '/reset-password/:token', component: ResetPassword },
  {
    path: '/admin',
    component: Admin,
    meta: {
      hideHeader: true,
      hideFooter: true,
      requiresAuth: true,
      requiresUser: true
    },
    children: ROUTES_ADMIN
  },
  { path: '/:notFound(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 🔹 Cas 1 : navigation avec bouton retour / avant
    if (savedPosition) {
      return savedPosition
    }
    // 🔹 Cas 2 : navigation avec ancre (#services, #about, etc.)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // 🔹 Cas 3 : navigation classique
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some(route => route.meta.requiresAuth) && !authStore.isLoggedIn) {
    return next({ path: '/' })
  }

  if (to.matched.some(route => route.meta.requiresAdmin) && !authStore.isAdmin) {
    return next({ path: '/' })
  }

  if (to.matched.some(route => route.meta.requiresUser) && !authStore.isUser) {
    return next({ path: '/' })
  }

  next()
})

export default router
