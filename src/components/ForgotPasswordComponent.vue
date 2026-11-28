<script setup>
  import { ref } from 'vue'
  import config from '@config/config.json';
  import { useRoute, useRouter } from 'vue-router'

  // May use afterwards, so keep-it
  const route  = useRoute()
  const router = useRouter()

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const apiForgotPasswordUrl  = `${protocol}://${ip}/api/forgotpassword`;
  const apiGetMyId   = `${protocol}://${ip}/api/myprofile`

  const loaded = ref(false)

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

  const emailInput = ref("")
  const successMessage = ref("")
  const errorMessage = ref("")

  async function requestPasswordReset () {
    successMessage.value = ""
    errorMessage.value = ""
    
    await fetch(apiForgotPasswordUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        email_address: emailInput.value,
      })
    })
    .then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        successMessage.value = "If an account exists with this email, a password reset link has been sent. Please check your inbox."
      } else {
        errorMessage.value = data.error || "An error occurred. Please try again."
      }
    })
    .catch((err) => {
      console.error(err)
      errorMessage.value = "An error occurred. Please try again."
    })
  }

</script>

<template>
  <Transition>
  <form v-if="loaded" @submit.prevent="requestPasswordReset">
    <fieldset>
      <legend>Forgotten Password</legend>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="form-wrapper grid-wrapper">
          <label for="emailInput">Email Address</label>
          <input required autocomplete="off" placeholder="Enter your email address" id="emailInput" name="email" type="email" v-model="emailInput">
      </div>
      
      <button type="submit">Send Reset Link</button>

      <nav>
        <RouterLink class="red" to="/login">Back to Login</RouterLink>
        <RouterLink class="red" to="/signup">No account? Sign-up!</RouterLink>
      </nav>
    </fieldset>
  </form>
  </Transition>
</template>
