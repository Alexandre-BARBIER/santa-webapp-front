<script setup>
  import { ref } from 'vue'
  import config from '@config/config.json';
  import { useRoute, useRouter } from 'vue-router'

  // May use afterwards, so keep-it
  const route  = useRoute()
  const router = useRouter()

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const apiLoginUrl  = `${protocol}://${ip}/api/login`;
  const apiGetMyId   = `${protocol}://${ip}/api/myprofile`

  const tooManyRequests = ref(false)
  const wrongCredentials = ref(false)
  const emailNotVerified = ref(false)

  // Redirects to profile page if logged in
  async function redirectIfLoggedIn () {
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
      if (response.status < 400) {
        return response.json()
      }
    })
    .then(async (json) => {
      if (json) {
        await router.push(`/profile/${json?.user_id}`)
        router.go(0)
      }
    })
    .catch((err) => {
      console.error(err)
    })
    loaded.value = true
  }
  redirectIfLoggedIn()

  const usernameInput = ref("")
  const passwordInput = ref("")
  const remember_me = ref("false") // Set default remember
  const loaded = ref(false)

  async function requestLogin () {
    await fetch(apiLoginUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        login: usernameInput.value,
        password: passwordInput.value,
        remember_me: remember_me.value
      })
    })
    .then(async (response) => {
      if (response.status === 429) {
        tooManyRequests.value = true
        wrongCredentials.value = false
        return null
      }
      tooManyRequests.value = false
      const reader = response.body.getReader()
      return reader.read().then(({ done, value }) => {
        if (done) {
          reader.cancel()
          return
        }
        return new TextDecoder('utf-8').decode(value)
      })
    })
    .then((stringResponse) => {
      if (stringResponse === null) return
      if (stringResponse === 'Vous êtes connecté!') {
        emailNotVerified.value = false
        redirectIfLoggedIn()
      } else if (stringResponse === 'Email not verified') {
        emailNotVerified.value = true
        wrongCredentials.value = false
      } else {
        emailNotVerified.value = false
        wrongCredentials.value = true
      }
    })
  }

</script>

<template>
  <Transition>
  <form v-if="loaded" @submit.prevent="requestLogin">
    <fieldset>
      <legend>Login</legend>
      <span class="alert alert-red" v-show="wrongCredentials">Invalid credentials</span>
      <span class="alert alert-red" v-show="emailNotVerified">Please confirm your email address first (check your inbox)</span>
      <span class="alert alert-red" v-show="tooManyRequests">Too many attempts, please try again later</span>
      <div class="form-wrapper grid-wrapper">
          <label for="usernameInput">Username</label>
          <input :class="{ wrong: wrongCredentials }" required autocomplete="off" placeholder="Enter your username" id="usernameInput" name="username" type="text" v-model="usernameInput">
          <label for="passwordInput">Password</label>
          <input :class="{ wrong: wrongCredentials }" required autocomplete="current-password" placeholder="Enter your password" type="password" name="password" id="passwordInput" v-model="passwordInput">
          <label for="remember_me">Remember me</label>
          <label class="switch">
            <input type="checkbox" id="remember_me" v-model="remember_me" true-value="true" false-value="false">
            <span class="slider"></span>
          </label>
      </div>
      
      <button type="submit">Login!</button>

      <nav>
        <RouterLink class="red" to="/signup">No account? Sign-up!</RouterLink>
        <RouterLink class="red" to="/forgot">Forgot Password?</RouterLink>
      </nav>
    </fieldset>
  </form>
  </Transition>
</template>
