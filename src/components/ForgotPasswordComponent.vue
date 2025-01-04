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

  const wrongCredentials = ref(false)

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
      }
      router.go(0)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  redirectIfLoggedIn()

  const emailInput = ref("")

  async function requestPasswordReset () {
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
      console.log(stringResponse)
      await router.push('/login')
    })
  }

</script>

<template>
  <form @submit.prevent="requestPasswordReset">
    <fieldset>
      <legend>Forgotten Password</legend>
      <div class="form-wrapper grid-wrapper">
          <label for="emailInput">Email Address</label>
          <input required autocomplete="off" placeholder="Enter your email address" id="emailInput" name="email" type="text" v-model="emailInput">
      </div>
      
      <button type="submit">Forgot Password!</button>

      <nav>
        <RouterLink class="red" to="/signup">No account? Sign-up!</RouterLink>
      </nav>
    </fieldset>
  </form>
</template>

<style scoped>

 /* The switch - the box around the slider */
 .switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

#remember_me:checked + .slider {
  background-color: rgb(184, 9, 9);;
}

#remember_me:focus + .slider {
  box-shadow: 0 0 1px rgb(184, 9, 9);;
}

#remember_me:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
} 

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  a.forgot-password-link {
    color: crimson;
  }

  a.forgot-password-link:hover {
    background-color: rgba(220, 20, 60, 0.1);
  }
</style>