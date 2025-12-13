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

  const usernameInput = ref("")
  const passwordInput = ref("")
  const remember_me = ref("false") // Set default remember


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
      console.log(stringResponse)
      if (stringResponse === 'Vous êtes connecté!') {
        console.log('Logged in')
        redirectIfLoggedIn()
      } else {
        wrongCredentials.value = true
      }
    })
  }

</script>

<template>
  <form @submit.prevent="requestLogin">
    <fieldset>
      <legend>Login</legend>
      <span style="color: crimson; font-style: italic; margin-bottom: 0.8em;" class="wrong" v-show="wrongCredentials">Invalid credentials</span>
      <div class="form-wrapper grid-wrapper">
          <label for="usernameInput">Username</label>
          <input :class="{ wrong: wrongCredentials }" required autocomplete="off" placeholder="Enter your username" id="usernameInput" name="username" type="text" v-model="usernameInput">
          <label for="passwordInput">Password</label>
          <input :class="{ wrong: wrongCredentials }" required autocomplete="current-password" placeholder="Enter your password" type="password" name="password" id="passwordInput" v-model="passwordInput">
          <label for="remember_me" class="switch">Remeber Me</label>
          <label class="switch">
            <input type="checkbox" id="remember_me" v-model="remember_me" true-value="true" false-value="false">
            <span class="slider round"></span>
          </label>
      </div>
      
      <button type="submit">Login!</button>

      <nav>
        <RouterLink class="red" to="/signup">No account? Sign-up!</RouterLink>
        <RouterLink class="red" to="/forgot">Forgot Password?</RouterLink>
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
    gap: 0.5em;
  }

  a.forgot-password-link {
    color: crimson;
  }

  a.forgot-password-link:hover {
    background-color: rgba(220, 20, 60, 0.1);
  }

  @media (max-width: 640px) {
    .switch {
      width: 50px;
      height: 28px;
    }

    .slider:before {
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
    }

    #remember_me:checked + .slider:before {
      transform: translateX(22px);
    }
  }

  @media (max-width: 480px) {
    nav {
      font-size: 0.9em;
    }

    .switch {
      width: 45px;
      height: 25px;
    }

    .slider:before {
      height: 19px;
      width: 19px;
      left: 3px;
      bottom: 3px;
    }

    #remember_me:checked + .slider:before {
      transform: translateX(19px);
    }
  }
</style>