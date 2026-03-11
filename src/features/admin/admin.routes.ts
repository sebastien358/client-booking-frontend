import type { RouteRecordRaw } from 'vue-router'

const BookingList = () => import('./views/booking/BookingList.vue')
const BookingDetails = () => import('./views/booking/BookingDetails.vue')
const TestimonialList = () => import('./views/testimonial/TestimonialAdminList.vue')
const TestimonialDetails = () => import('./views/testimonial/TestimonialDetails.vue')
const ContactList = () => import('./views/contact/ContactList.vue')
const ContactDetails = () => import('./views/contact/ContactDetails.vue')
const ServiceList = () => import('./views/service/ServiceList.vue')
const ServiceDetails = () => import('./views/service/ServiceDetails.vue')
const ServiceForm = () => import('./views/service/ServiceForm.vue')
const StaffList = () => import('./views/staff/StaffList.vue')
const StaffDetails = () => import('./views/staff/StaffDetails.vue')
const StaffForm = () => import('./views/staff/StaffForm.vue')
const MyBooking = () => import('./views/booking/MyBooking.vue')
const DataUser = () => import('./views/DataUser.vue')

export const ROUTES_ADMIN: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/admin/booking/me'
  },
  {
    path: '/admin/booking/me',
    name: 'booking-me',
    component: MyBooking,
    meta: {
      requiresUser: true
    }
  },
  {
    path: '/admin/update/me',
    name: 'data-me',
    component: DataUser,
    meta: {
      requiresUser: true
    }
  },
  {
    path: '/admin/booking/list',
    name: 'booking-list',
    component: BookingList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/booking/details/:id',
    name: 'booking-details',
    component: BookingDetails,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/testimonial/list',
    name: 'testimonial-list',
    component: TestimonialList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/testimonial/details/:id',
    name: 'testimonial-details',
    component: TestimonialDetails,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/contact/list',
    name: 'contact-list',
    component: ContactList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/contact/details/:id',
    name: 'contact-details',
    component: ContactDetails,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/service/list',
    name: 'service-list',
    component: ServiceList,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/service/details/:id',
    name: 'service-details',
    component: ServiceDetails,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/service/form',
    name: 'service-form',
    component: ServiceForm,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/staff/list',
    name: 'staff-list', component: StaffList },
  { path: '/admin/staff/show/:id',
    name: 'staff-details',
    component: StaffDetails,
    meta: {
      requiresAdmin: true
    }
  },
  {
    path: '/admin/staff/form',
    name: 'staff-form',
    component: StaffForm,
    meta: {
      requiresAdmin: true
    }
  }
]
