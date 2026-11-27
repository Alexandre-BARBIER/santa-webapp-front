<script setup>
  import { ref, onMounted } from 'vue'
  import config from '@config/config.json';
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const { ip, protocol } = config.api;
  const apiVerifyEmailUrl = `${protocol}://${ip}/api/verify-email`;

  const isLoading = ref(true)
  const errorMessage = ref('')
  const successMessage = ref('')

  onMounted(async () => {
    try {
      const response = await fetch(apiVerifyEmailUrl, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: route.params.token })
      })

      if (response.status === 429) {
        errorMessage.value = 'Too many attempts, please try again later'
      } else {
        const data = await response.json()
        if (response.ok) {
          successMessage.value = 'Your email address is confirmed. You can now log in.'
        } else if (data.status === 'Email already used') {
          errorMessage.value = 'This email address is already used by another account'
        } else {
          errorMessage.value = 'This confirmation link is invalid or has expired'
        }
      }
    } catch (err) {
      console.error(err)
      errorMessage.value = 'An error occurred. Please try again.'
    }
    isLoading.value = false
  })
</script>

<template>
  <fieldset>
    <legend>Email confirmation</legend>

    <p v-if="isLoading">Confirming your email address...</p>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <nav>
      <RouterLink class="red" to="/login">Go to login</RouterLink>
    </nav>
  </fieldset>
</template>

<style scoped>
.success-message {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.error-message {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

nav {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
