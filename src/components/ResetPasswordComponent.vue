<script setup>
  import { ref, onMounted, computed } from 'vue'
  import config from '@config/config.json';
  import { useRoute, useRouter } from 'vue-router'
  import zxcvbn from 'zxcvbn';

  const route = useRoute()
  const router = useRouter()

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const minLengthPassword = config.minLengthPassword;

  const apiValidateTokenUrl = `${protocol}://${ip}/api/validate-reset-token`;
  const apiResetPasswordUrl = `${protocol}://${ip}/api/reset-password`;

  const token = ref(`${route.params.token}`)
  const newPasswordInput = ref('')
  const confirmPasswordInput = ref('')
  const firstName = ref('')
  const isValidToken = ref(false)
  const isLoading = ref(true)
  const errorMessage = ref('')
  const successMessage = ref('')

  onMounted(async () => {
    
    await validateToken()
  })

  let evaluatePasswordStrength = 0;
  evaluatePasswordStrength = computed(() => {
    const result = zxcvbn(newPasswordInput.value);
    return result.score; // zxcvbn returns a score from 0 to 4
  });


  async function validateToken() {
    try {
      const response = await fetch(`${apiValidateTokenUrl}?token=${token.value}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        isValidToken.value = true
        firstName.value = data.first_name
      } else {
        errorMessage.value = data.error || 'Invalid or expired reset link'
        isValidToken.value = false
      }
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Failed to validate reset token'
      isValidToken.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword() {
    errorMessage.value = ''
    successMessage.value = ''

    if (newPasswordInput.value !== confirmPasswordInput.value) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    if (newPasswordInput.value.length < (minLengthPassword -1)) {
      errorMessage.value = `Password must be at least ${minLengthPassword} characters long`
      return
    }

    try {
      const response = await fetch(apiResetPasswordUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.value,
          new_password: newPasswordInput.value
        })
      })

      const data = await response.json()

      if (response.ok) {
        successMessage.value = 'Password successfully reset! Redirecting to login...'
        setTimeout(async () => {
          await router.push('/login')
        }, 2000)
      } else {
        errorMessage.value = data.error || 'Failed to reset password'
      }
    } catch (err) {
      console.error(err)
      errorMessage.value = 'An error occurred while resetting your password'
    }
  }
</script>

<template>
  <form @submit.prevent="resetPassword" v-if="!isLoading">
    <fieldset v-if="isValidToken">
      <legend>Reset Your Password</legend>
      
      <p v-if="firstName" style="margin-bottom: 20px;">Welcome back, {{ firstName }}! Please enter your new password below.</p>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-wrapper grid-wrapper">
        <label for="newPasswordInput">New Password*</label>
        <input required :class="{ wrong: newPasswordInput.length <= (minLengthPassword-1) }" :minlength="minLengthPassword" autocomplete="new-password" placeholder="Enter new password" type="password" name="password" id="newPasswordInput" v-model="newPasswordInput" @input="evaluatePasswordStrength">
        <div></div>
        <div class="password-strength-bar" 
             :class="{'very-weak': evaluatePasswordStrength === 0, 
                      'weak': evaluatePasswordStrength === 1, 
                      'medium': evaluatePasswordStrength === 2, 
                      'strong': evaluatePasswordStrength === 3, 
                      'very-strong': evaluatePasswordStrength === 4}">
          <div class="strength-fill" :style="{ width: `${(evaluatePasswordStrength + 1) * 20}%` }"></div>
        </div>

        <label for="confirmPasswordInput">Confirm Password*</label>
        <input required :class="{ wrong: newPasswordInput !=  confirmPasswordInput}" autocomplete="new-password" placeholder="Confirm your password" type="password" name="confirmpassword" id="confirmPasswordInput" v-model="confirmPasswordInput">
      </div>
      
      <button type="submit" :disabled="newPasswordInput !=  confirmPasswordInput || !newPasswordInput || !confirmPasswordInput">Reset Password</button>

      <nav>
        <RouterLink class="red" to="/login">Back to Login</RouterLink>
      </nav>
    </fieldset>

    <fieldset v-else>
      <legend>Invalid Reset Link</legend>
      
      <div class="error-message">
        {{ errorMessage || 'This password reset link is invalid or has expired.' }}
      </div>

      <p>Please request a new password reset link.</p>

      <nav>
        <RouterLink class="red" to="/forgot">Request New Reset Link</RouterLink>
        <RouterLink class="red" to="/login">Back to Login</RouterLink>
      </nav>
    </fieldset>
  </form>

  <div v-else class="loading">
    <p>Validating reset link...</p>
  </div>
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

.error-text {
  color: #d9534f;
  font-size: 0.9em;
  display: block;
  margin-top: 5px;
}

.password-mismatch {
  border-color: #d9534f !important;
}

.loading {
  text-align: center;
  padding: 40px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

nav {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
