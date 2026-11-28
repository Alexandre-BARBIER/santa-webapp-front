<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import config from '@config/config.json'
import LogoutIcon from './icons/LogoutIcon.vue'
import IconNPELogo from './icons/IconNPELogo.vue'

const router = useRouter()

const isLoggedIn = ref(false)
const userId = ref()
const bannerRoutes = ref([])
const isBurgerMenuOpen = ref(false)

// Below this width every link moves into the burger menu
const mobileQuery = window.matchMedia('(max-width: 640px)')
const isMobile = ref(mobileQuery.matches)

function onMobileQueryChange(event) {
  isMobile.value = event.matches
  if (!event.matches) {
    isBurgerMenuOpen.value = false
  }
}

onMounted(() => mobileQuery.addEventListener('change', onMobileQueryChange))
onUnmounted(() => mobileQuery.removeEventListener('change', onMobileQueryChange))

const { ip, protocol } = config.api
const apiGetMyId = `${protocol}://${ip}/api/myprofile`
const apiLogoutUser = `${protocol}://${ip}/api/logout`

function refreshBannerRoutes (loggedIn) {
  bannerRoutes.value = router.getRoutes().filter(route =>
    (route.meta?.displayOnBanner) &&
    (route.meta.requiresAuth === loggedIn || route.meta?.displayOnUserBanner === loggedIn)
  )
}

watch(isLoggedIn, (fresh) => refreshBannerRoutes(fresh))


async function getMyProfile () {
  await fetch(apiGetMyId, {
    withCredentials: true,
    credentials: 'include',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      dataType: 'json'
  })
  .then((response) => {
    isLoggedIn.value = response.status < 400
    refreshBannerRoutes(isLoggedIn.value)
  })
  .then((json) => {
    userId.value = json?.user_id
  })
  .catch((err) => {
    // console.error(err)
    bannerRoutes.value = router.getRoutes().filter(route =>
      (route.meta?.displayOnBanner) &&
      (route.meta.requiresAuth === false || route.meta?.displayOnUserBanner === false)
    )
  })
}

getMyProfile()


async function logoutUser () {
    await fetch(apiLogoutUser, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST'
    })
    .then((response) => {      
      if (response.status >= 400) {
        return new Promise((resolve, reject) => {
          reject(response)
        })
      } else {
        return response
      }
    })
    .then(async (response) => {
      const reader = response.body.getReader()
      return reader.read().then(({ done, value }) => {
        if (done) {
          reader.cancel()
          return
        }
        return new TextDecoder('utf-8').decode(value)
      })
    })
    .then(async (stringResponse) => {
      isLoggedIn.value = false
      router.push('/')
    })
    .catch((err) => {
      // console.error(err)
    })
}

function toggleBurgerMenu() {
  isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
}

function closeBurgerMenu() {
  isBurgerMenuOpen.value = false;
}
</script>

<template>
<div>
  <transition name="fade">
    <div v-if="isBurgerMenuOpen && isMobile" class="overlay" @click="closeBurgerMenu"></div>
  </transition>

  <nav class="header">
    <RouterLink to="/" class="brand" @click="closeBurgerMenu">
      <IconNPELogo class="brand-logo" aria-hidden="true" />
      <span>Santa Zapy</span>
    </RouterLink>

    <div v-if="!isMobile" class="links">
      <RouterLink v-for="route in bannerRoutes" :key="route.path" class="nav-link" :to="route.path">{{ route.name }}</RouterLink>
      <button v-if="isLoggedIn" type="button" class="logout" @click="logoutUser">
        <LogoutIcon class="logout-icon" /><span>Logout</span>
      </button>
    </div>

    <button v-else type="button" class="burger-icon" aria-label="Menu" :aria-expanded="isBurgerMenuOpen" @click="toggleBurgerMenu">
      <span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span>
    </button>

    <transition name="slide">
      <div v-if="isBurgerMenuOpen && isMobile" class="burger-menu">
        <RouterLink v-for="route in bannerRoutes" :key="route.path" class="burger-menu-item" :to="route.path" @click="closeBurgerMenu">{{ route.name }}</RouterLink>
        <button v-if="isLoggedIn" type="button" class="burger-menu-item logout-item" @click="logoutUser">
          <LogoutIcon class="logout-icon" /><span>Logout</span>
        </button>
      </div>
    </transition>
  </nav>
</div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  height: var(--banner-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
  background-color: var(--color-brand);
  box-shadow: 0 2px 12px rgba(20, 13, 13, 0.25);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--white);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
}

.brand:hover {
  background-color: transparent;
}

.brand-logo {
  width: 30px;
  height: 32px;
}

.links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  padding: 0.45em 0.9em;
  border-radius: var(--radius-pill);
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: var(--white);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.18);
  color: var(--white);
}

.logout {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin-left: 0.5rem;
  padding: 0.35em 0.9em;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: var(--white);
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.burger-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* 45x45px hit area (25px lines + 2*10px padding, 17px lines/gaps + 2*14px padding) */
  padding: 14px 10px;
  background: none;
  border: none;
  z-index: 1003;
}

.burger-line {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--white);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.burger-menu {
  position: fixed;
  top: var(--banner-height);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-brand);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1002;
}

.burger-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 1em 1.5em;
  color: var(--white);
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0;
}

button.burger-menu-item {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  text-align: left;
}

.burger-menu-item:hover,
.burger-menu-item.router-link-active {
  background-color: rgba(0, 0, 0, 0.12);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
