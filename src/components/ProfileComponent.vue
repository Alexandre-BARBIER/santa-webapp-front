<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import config from '@config/config.json';
  import zxcvbn from 'zxcvbn';

  const route = useRoute()
  const router = useRouter()
  // Destructure the API IP and port from the configuration object
  const { ip, protocol } = config.api;
  const minLengthPassword = minLengthPassword;
  const apiProfileUrl = `${protocol}://${ip}/api/profile/${route.params.id}`;
  const apiUpdateUrl = `${protocol}://${ip}/api/changeprofile`;
  const apiPasswordUrl = `${protocol}://${ip}/api/changepassword`;
  const apiDeleteUrl = `${protocol}://${ip}/api/user/delete`;
  const apiGetMyId = `${protocol}://${ip}/api/myprofile`;

  // Variables

  const username = ref("")
  const first_name = ref("")
  const last_name = ref("")
  const email_address = ref("")

  const passwordInput = ref('')
  const newPasswordInput = ref('')
  const confirmPasswordInput = ref('')

  const state = ref('readonly')

  const loaded = ref(false)

  const myprofile = ref(false)

  const resultMessage = ref("");
  const resultColor = ref("");

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

  // Functions

  function toggleDisplay (newstate) {
    state.value = newstate
    if (newstate === 'readonly') {
      requestProfile()
    }
  }

  function request_back_to_read () {
    console.log(state.value)
    if (state.value === 'update') {
      requestUpdate();
    }
    if (state.value === 'password') {
      requestPassword();
    }
    if (state.value === 'delete') {
      requestDelete();
    }
  }

  function fetch_and_back_to_read (event) {
    toggleDisplay('readonly');
    requestProfile(event);
  }

  let evaluatePasswordStrength = 0;
  evaluatePasswordStrength = computed(() => {
    const result = zxcvbn(passwordInput.value);
    return result.score; // zxcvbn returns a score from 0 to 4
  });

  // Requests

  async function requestProfile (event) {
    await fetch(apiProfileUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        username.value = data.login;
        first_name.value = data.first_name;
        last_name.value = data.surname;
        bdateDayInput.value = data.birthdate.split('/')[0];
        bdateMonthInput.value = data.birthdate.split('/')[1];
        bdateYearInput.value = data.birthdate.split('/')[2];
        email_address.value = data.email_address;
        passwordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
      });
    })
    .catch((error) => {
      router.push('/login')
    })

    await fetch(apiGetMyId, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        if (String(data.user_id) === route.params.id) {
          myprofile.value = true;
        }
        loaded.value = true;
      })
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  async function requestUpdate () {
  // event.preventDefault()
    
    const response = await fetch(apiUpdateUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        first_name: first_name.value,
        surname: last_name.value,
        login: username.value,
        birthdate: birthdateInput.value,
        email_address: email_address.value // pass the URL to the backend
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Updated Profile':
              color = 'green';
              message = 'Updated Profilee';
              toggleDisplay('readonly');
              break;
          case 'Login already used':
              color = 'red';
              message = 'Login already used';
              break;
          case 'Incorrect format':
              color = 'dodgerblue';
              message = 'Incorrect format';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

  async function requestDelete () {
  // event.preventDefault()
    
    const response = await fetch(apiDeleteUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        password: passwordInput.value
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'User deleted':
              color = 'green';
              message = 'User deleted';
              router.push(`/signup`);
              router.go(0);
              break;
          case 'Wrong password':
              color = 'red';
              message = 'Wrong password';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

  async function requestPassword () {
  // event.preventDefault()
    
    const response = await fetch(apiPasswordUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        old_password: passwordInput.value,
        new_password: newPasswordInput.value
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Update Password':
              color = 'green';
              message = 'Update Password';
              toggleDisplay('readonly');
              break;
          case 'No change made, Wrong Password':
              color = 'red';
              message = 'No change made, Wrong Password';
              break;
          case 'No change made':
              color = 'red';
              message = 'No change made';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

  onMounted(async () => {
    requestProfile();
  })

</script>

<template>
<Transition>
  <form v-if="loaded" @submit.prevent="request_back_to_read">
    <fieldset v-if="state=='readonly'" >
      <legend>Profile</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <div class="grid-wrapper">
        <span>First Name</span> <span>{{first_name}}</span>
        <span>Last Name</span> <span>{{last_name}}</span>
        <span>Login</span> <span>{{username}}</span>
        <span v-show="bdateDayInput">Birthdate</span> <span v-show="bdateDayInput">{{bdateDayInput}}/{{bdateMonthInput}}/{{bdateYearInput}}</span>
        <span v-show="email_address">Email Address</span> <span v-show="email_address">{{email_address}}</span>
      </div>
      <div class="row-flex-wrapper">
        <button v-show="myprofile" @click="toggleDisplay('update')" class="action">Modify</button>
        <button v-show="myprofile" @click="toggleDisplay('password')" class="action">Change Password</button>
        <button v-show="myprofile" @click="toggleDisplay('delete')" class="cancel">Delete User</button>
      </div>
    </fieldset>
    <fieldset v-if="state=='password'" >
      <legend>Profile</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <div class="grid-wrapper">
        <span>First Name</span> <span>{{first_name}}</span>
        <span>Last Name</span> <span>{{last_name}}</span>
        <span>Login</span> <span>{{username}}</span>
        <span v-show="bdateDayInput">Birthdate</span> <span v-show="bdateDayInput">{{bdateDayInput}}/{{bdateMonthInput}}/{{bdateYearInput}}</span>
        <span v-show="email_address">Email Address</span> <span v-show="email_address">{{email_address}}</span>

        <label for="passwordInput">Old Password*</label>
        <input required autocomplete="new-password" placeholder="Enter your old password" type="password" name="password" id="passwordInput" v-model="passwordInput" @input="evaluatePasswordStrength">

        <label for="newPasswordInput">New Password*</label>
        <input required :class="{ wrong: newPasswordInput.length < (minLengthPassword-1) }" :minlength="minLengthPassword" autocomplete="new-password" placeholder="Enter your new password" type="password" name="newPassword" id="newPasswordInput" v-model="newPasswordInput" @input="evaluatePasswordStrength">
        
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
      <div class="row-flex-wrapper">
        <button type="submit">Update!</button>
        <button @click="fetch_and_back_to_read" class="cancel">Cancel</button>
      </div>
    </fieldset>
    <fieldset v-if="state=='delete'" >
      <legend>Profile</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <div class="grid-wrapper">
        <span>First Name</span> <span>{{first_name}}</span>
        <span>Last Name</span> <span>{{last_name}}</span>
        <span>Login</span> <span>{{username}}</span>
        <span v-show="bdateDayInput">Birthdate</span> <span v-show="bdateDayInput">{{bdateDayInput}}/{{bdateMonthInput}}/{{bdateYearInput}}</span>
        <span v-show="email_address">Email Address</span> <span v-show="email_address">{{email_address}}</span>
      </div>
      <label for="passwordInput">Password*</label>
        <input required autocomplete="new-password" placeholder="Enter your password" type="password" name="password" id="passwordInput" v-model="passwordInput" @input="evaluatePasswordStrength">

      <div class="row-flex-wrapper">
        <button type="submit">Delete!</button>
        <button @click="fetch_and_back_to_read" class="cancel">Cancel</button>
      </div>
    </fieldset>
    <fieldset v-if="state=='update'">
      <legend>Profile</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <div class="form-wrapper grid-wrapper" :class="{modify: myprofile}">
        <label for="first_name">First name*</label>
        <input required :class="{ wrong: !first_name }" autocomplete="off" placeholder="Enter your firstname" id="first_name" name="firstname" type="text" v-model="first_name">

        <label for="last_name">Last Name*</label>
        <input required :class="{ wrong: !last_name }" autocomplete="off" placeholder="Enter your surname" id="last_name" name="surname" type="text" v-model="last_name">

        <label for="username">Login*</label>
        <input required :class="{ wrong: !username }" autocomplete="off" placeholder="Enter a super login" id="username" name="login" type="text" v-model="username">
        
        <label for="email_address">Email*</label>
        <input required :class="{ wrong: !email_address }" autocomplete="off" placeholder="Enter your email" type="email" name="email" id="email_address" v-model="email_address">

        <label for="birthdateInput">Birthdate*</label>
          <div class="row-flex-wrapper">
            <input required v-model="bdateDayInput"   class="birthdate-input" :class="{ wrong: !bdateCorrectDayInput }"   placeholder="DD"   type="number" name="bdateDay"   id="bdateDayInput">
            <input required v-model="bdateMonthInput" class="birthdate-input" :class="{ wrong: !bdateCorrectMonthInput }" placeholder="MM"   type="number" name="bdateMonth" id="bdateMonthInput">
            <input required v-model="bdateYearInput"  class="birthdate-input" :class="{ wrong: !bdateCorrectYearInput }"  placeholder="YYYY" type="number" name="bdateYear"  id="bdateYearInput">
          </div>

      </div>
      
      <div class="row-flex-wrapper">
      <button type="submit">Update!</button>
      <button @click="fetch_and_back_to_read" class="cancel">Cancel</button>

      </div>


    </fieldset>
  </form>
  </Transition>
</template>

<style scoped>
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

  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  nav > a {
    padding: 0.1em 0.5em;
    border-radius: 0.5em;
  }

  a.forgot-password-link {
    color: crimson;
  }

  a.forgot-password-link:hover {
    background-color: rgba(220, 20, 60, 0.1);
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>