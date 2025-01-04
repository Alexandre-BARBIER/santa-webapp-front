<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import LogoutIcon from './icons/LogoutIcon.vue'

const router = useRouter()

const isLoggedIn = ref(false)
const userId = ref()
const bannerRoutes = ref([])

const ip = import.meta.env.VITE_API_HOST
const protocol = import.meta.env.VITE_API_PROTOCOL

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
</script>

<template>
<nav class="header">
  <RouterLink class="banner" v-for="(route) in bannerRoutes" :to="route.path">{{ route.name }}</RouterLink>
  <div v-show="isLoggedIn" @click="logoutUser" class="right logout">
    <span>Logout</span>
    <LogoutIcon class="logout-display" style="scale: 0.8;" />
  </div>
</nav>
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
  z-index: 1;
  top: 0;
  left: 0;

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