<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import config from '@config/config.json'
import LogoutIcon from './icons/LogoutIcon.vue'

const router = useRouter()

const isLoggedIn = ref(false)
const userId = ref()
const bannerRoutes = ref([])
const isBurgerMenuOpen = ref(false)

const visibleRoutes = computed(() => {
  if (window.innerWidth <= 640) {
    return bannerRoutes.value.slice(0, 3)
  }
  return bannerRoutes.value
})

const burgerMenuRoutes = computed(() => {
  if (window.innerWidth <= 640) {
    return bannerRoutes.value.slice(1)
  }
  return []
})

const showBurgerMenu = computed(() => {
  return window.innerWidth <= 640 && burgerMenuRoutes.value.length > 0
})

const { ip, protocol } = config.api
const apiGetMyId = `${protocol}://${ip}/api/myprofile`
const apiLogoutUser = `${protocol}://${ip}/api/logout`

watch(isLoggedIn, (fresh, old) => {
  bannerRoutes.value = router.getRoutes().filter(route =>
    (route.meta?.displayOnBanner) &&
    (route.meta.requiresAuth === fresh || route.meta?.displayOnUserBanner === fresh)
  )
})


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
      method: 'GET'
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
      console.log(stringResponse)
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
    <div v-if="isBurgerMenuOpen && showBurgerMenu" class="overlay" @click="closeBurgerMenu"></div>
  </transition>
  
  <nav class="header">
    <RouterLink class="banner" v-for="(route) in visibleRoutes" :to="route.path" @click="closeBurgerMenu">{{ route.name }}</RouterLink>
    
    <div v-if="showBurgerMenu" class="burger-icon" @click="toggleBurgerMenu">
      <div class="burger-line"></div>
      <div class="burger-line"></div>
      <div class="burger-line"></div>
    </div>
    
    <div v-show="isLoggedIn && !showBurgerMenu" @click="logoutUser" class="right logout">
      <span>Logout</span>
      <LogoutIcon class="logout-display" style="scale: 0.8;" />
    </div>
    
    <transition name="slide">
      <div v-if="isBurgerMenuOpen && showBurgerMenu" class="burger-menu">
        <RouterLink 
          class="burger-menu-item" 
          v-for="(route) in burgerMenuRoutes" 
          :to="route.path"
          @click="closeBurgerMenu"
        >
          {{ route.name }}
        </RouterLink>
        <div v-if="isLoggedIn" @click="logoutUser" class="burger-menu-item logout-item">
          <span>Logout</span>
          <LogoutIcon class="logout-display" style="scale: 0.8;" />
        </div>
      </div>
    </transition>
  </nav>
</div>
</template>

<style scoped>
a.banner {
  display: flex;
  align-items: center;
  height: var(--banner-height);
  border-radius: 0;
  padding-inline: 1em;
}

.right {
  position: absolute;
  right: 2em;
}

.logout {
  display: flex;
  gap: 0.5em;
  align-items: center;
  font-size: 0.8rem;

  color: white;
  transition: all 0.2s ease-in-out;
}

.logout:hover {
  cursor: pointer;
  scale: 1.15;
}

.header {
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100%;

  margin: 0;

  height: var(--banner-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4vw;
  /* justify-content: space-evenly; */
  flex-basis: auto;

  background-color: rgb(182, 11, 20);
}

.header > a {
  color: white;
  font-size: 1rem;
}

.burger-icon {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  z-index: 1003;
}

.burger-line {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.burger-menu {
  position: fixed;
  top: var(--banner-height);
  left: 0;
  right: 0;
  background-color: rgb(182, 11, 20);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1002;
}

.burger-menu-item {
  display: flex;
  align-items: center;
  padding: 1em 2em;
  color: white;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;
}

.burger-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.logout-item {
  cursor: pointer;
  gap: 0.5em;
  justify-content: flex-start;
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

@media (max-width: 640px) {
  .right {
    right: 0.8em;
  }

  .header {
    gap: 2vw;
    justify-content: center;
  }

  .header > a {
    font-size: 0.9rem;
  }
  
  .logout > span {
    opacity: 0;
  }

  .burger-icon {
    display: flex;
    position: absolute;
    left: 1em
  }
}

@media (max-width: 640px) {
  .right {
    right: 0.8em;
  }

  .header {
    /* gap: 1vw; */
    justify-content: center;
  }

  .header > a {
    font-size: 0.9rem;
  }
  
  .logout > span {
    opacity: 0;
  }
}
</style>