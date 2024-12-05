<script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import config from '@config/config.json';
  import zxcvbn from 'zxcvbn';

  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const minLengthPassword = config.minLengthPassword;
  const apiSignupUrl = `${protocol}://${ip}/api/signup`;
  const apiGetMyId = `${protocol}://${ip}/api/myprofile`

  const router = useRouter()

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


  const resultMessage = ref("");
  const resultColor = ref("");

  const firstnameInput = ref('')
  const passwordInput = ref('')
  const confirmPasswordInput = ref('')
  const emailInput = ref('')
  const remember_me = ref("false") // Set default remember

  const surnameInput = ref('')
  const loginInput = ref('')

  const bdateDayInput = ref('')
  const bdateMonthInput = ref('')
  const bdateYearInput = ref('')

  const bdateCorrectYearInput = computed(() => {
    const year = new Date().getFullYear()
    return (Math.floor(bdateYearInput.value) === bdateYearInput.value) && (year - bdateYearInput.value < 118) && (year - bdateYearInput.value > 8)
  })

  const bdateCorrectMonthInput = computed(() => {
    return (Math.floor(bdateYearInput.value) === bdateYearInput.value) && (bdateMonthInput.value > 0) && (bdateMonthInput.value < 13)
  })

  const bdateCorrectDayInput = computed(() => {
    if (bdateDayInput.value <= 0) return false

    if (Math.floor(bdateYearInput.value) !== bdateYearInput.value) return false

    if (bdateMonthInput.value === 2) {
      return (!(bdateYearInput.value % 4) && (bdateYearInput.value % 100)) ? bdateDayInput.value < 29 : bdateDayInput.value < 30
    }
    if ((bdateMonthInput.value % 2 && bdateMonthInput.value < 8) || (!(bdateMonthInput.value % 2) && bdateMonthInput.value > 7)) {
      return bdateDayInput.value < 32
    } else {
      return bdateDayInput.value < 31
    }
  })

  const birthdateInput = computed(() => {
    return `${bdateDayInput.value}/${bdateMonthInput.value}/${bdateYearInput.value}`
  })

  const isCorrectInput = computed(() => {
    return loginInput.value && emailInput.value && (passwordInput.value.length > (minLengthPassword-1)) && (confirmPasswordInput.value === passwordInput.value) && firstnameInput.value && surnameInput.value && bdateCorrectYearInput.value && bdateCorrectMonthInput.value && bdateCorrectDayInput.value
  })

  let evaluatePasswordStrength = 0;
  evaluatePasswordStrength = computed(() => {
    const result = zxcvbn(passwordInput.value);
    return result.score; // zxcvbn returns a score from 0 to 4
  });

  async function requestSignUP () {
    // event.preventDefault()
    
    const response = await fetch(apiSignupUrl, {
      withCredentials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        first_name: firstnameInput.value,
        surname: surnameInput.value,
        login: loginInput.value,
        birthdate: birthdateInput.value,
        password: passwordInput.value,
        remember_me: remember_me.value,
        email_address: emailInput.value // pass the URL to the backend
      })
    })

    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Inscription réussie':
              color = 'green';
              message = 'Inscription réussie';
              console.log('Signed in and Logged in')
              redirectIfLoggedIn()
              break;
          case 'Login already used':
              color = 'red';
              message = 'Login already used';
              break;
          case 'Incorrect date format':
              color = 'dodgerblue';
              message = 'Incorrect date format';
              break;
          case 'Incorrect email format':
              color = 'red';
              message = 'Incorrect email format';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
    
    return response;
  }

</script>

<template>
  <form @submit.prevent="requestSignUP">
    <fieldset>
      <legend>Sign-up!</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <div class="form-wrapper grid-wrapper">

        <label for="loginInput">Login*</label>
        <input required :class="{ wrong: !loginInput }" autocomplete="off" placeholder="Enter a super login" id="loginInput" name="login" type="text" v-model="loginInput">
        
        <label for="emailInput">Email*</label>
        <input required :class="{ wrong: !emailInput }" autocomplete="off" placeholder="Enter your email" type="email" name="email" id="emailInput" v-model="emailInput">
        
        <label for="passwordInput">Password*</label>
        <input required :class="{ wrong: passwordInput.length <= (minLengthPassword-1) }" :minlength="minLengthPassword" autocomplete="new-password" placeholder="Enter your password" type="password" name="password" id="passwordInput" v-model="passwordInput" @input="evaluatePasswordStrength">
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
        <input required :class="{ wrong: passwordInput !=  confirmPasswordInput}" autocomplete="new-password" placeholder="Confirm your password" type="password" name="confirmpassword" id="confirmPasswordInput" v-model="confirmPasswordInput">

        <label for="firstnameInput">First name*</label>
        <input required :class="{ wrong: !firstnameInput }" autocomplete="off" placeholder="Enter your firstname" id="firstnameInput" name="firstname" type="text" v-model="firstnameInput">

        <label for="surnameInput">Surname*</label>
        <input required :class="{ wrong: !surnameInput }" autocomplete="off" placeholder="Enter your surname" id="surnameInput" name="surname" type="text" v-model="surnameInput">

          <label for="birthdateInput">Birthdate*</label>
          <div class="row-flex-wrapper">
            <input required v-model="bdateDayInput"   class="birthdate-input" :class="{ wrong: !bdateCorrectDayInput }"   placeholder="DD"   type="number" name="bdateDay"   id="bdateDayInput">
            <input required v-model="bdateMonthInput" class="birthdate-input" :class="{ wrong: !bdateCorrectMonthInput }" placeholder="MM"   type="number" name="bdateMonth" id="bdateMonthInput">
            <input required v-model="bdateYearInput"  class="birthdate-input" :class="{ wrong: !bdateCorrectYearInput }"  placeholder="YYYY" type="number" name="bdateYear"  id="bdateYearInput">
          </div>
        
        <label for="remember_me" class="switch">Remeber Me</label>
          <label class="switch">
            <input type="checkbox" id="remember_me" v-model="remember_me" true-value="true" false-value="false">
            <span class="slider round"></span>
          </label>

      </div>
      
      <button :disabled="!isCorrectInput" type="submit">Sign-up!</button>

      <nav>
        <RouterLink class="red" to="/login">Already signed-up? Go to login!</RouterLink>
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

nav > a.red {
  padding: 0.1em 0.5em;
  border-radius: 0.5em;
}

.password-strength-bar {
  height: 8px;
  width: 100%;
  background-color: #ccc;
  border-radius: 4px;
  margin-top: 5px;
  margin-bottom: 1em;
  max-width: var( --input-width);
}

.strength-fill {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  max-width: calc(var( --input-width) - 2.6em);
  transition: width 0.3s ease;
}

.very-weak .strength-fill {
  background-color: red;
}

.weak .strength-fill {
  background-color: orange;
}

.medium .strength-fill {
  background-color: yellow;
}

.strong .strength-fill {
  background-color: lightgreen;
}

.very-strong .strength-fill {
  background-color: green;
}
</style>


