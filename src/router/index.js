import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MyProfileView from '@/views/MyProfileView.vue'
import GroupView from '@/views/GroupView.vue'
import MyGiftsView from '@/views/MyGiftsView.vue'
import GroupGiftView from '@/views/GroupGiftView.vue'
import GroupAdminView from '@/views/GroupAdminView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      meta: {
        requiresAuth: false,
        displayOnUserBanner: true,
        displayOnBanner: true
      },
      component: HomeView,
      props: { isLoggedIn: false }
    },
    {
      path: "/about",
      name: "About",
      meta: {
        requiresAuth: false,
        displayOnBanner: false
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      meta: {
        requiresAuth: false,
        displayOnBanner: true
      },
      component: LoginView,
    },
    {
      path: "/forgot",
      name: "Forgot Password",
      meta: {
        requiresAuth: false,
        displayOnBanner: false
      },
      component: ForgotPasswordView,
    },
    {
      path: '/signup',
      name: 'Sign Up',
      meta: {
        requiresAuth: false,
        displayOnUserBanner: false,
        displayOnBanner: true
      },
      component: SignUpView
    },
    {
      path: '/profile/:id',
      name: 'profile',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: false,
        displayOnBanner: false
      },
      component: ProfileView
    },
    {
      path: '/groups',
      name: 'My Groups',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: true,
        displayOnBanner: true
      },
      component: GroupView
    },
    {
      path: '/mygifts',
      name: 'My Gifts',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: true,
        displayOnBanner: true
      },
      component: MyGiftsView
    },
    {
      path: '/gift/group/:id',
      name: 'Group gifts',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: false,
        displayOnBanner: false
      },
      component: GroupGiftView
    },
    {
      path: '/group/admin/:id',
      name: 'Group Admin',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: false,
        displayOnBanner: false
      },
      component: GroupAdminView
    },
    {
      path: '/myprofile',
      name: 'My Profile',
      meta: {
        requiresAuth: true,
        displayOnUserBanner: true,
        displayOnBanner: true
      },
      component: MyProfileView
    },
  ]
})

export default router
