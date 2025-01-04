<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const ip = import.meta.env.API_HOST
  const protocol = import.meta.env.API_PROTOCOL

  const apiSecretInfoUrl = `${protocol}://${ip}/api/secret/info/group/${route.params.id}`;
  const apiSecretRescheduleUrl = `${protocol}://${ip}/api/secret/reschedule`;
  const apiSecretStartUrl = `${protocol}://${ip}/api/secret/start`;
  const apiSecretStopUrl = `${protocol}://${ip}/api/secret/stop`;

  const state = ref("inactive")
  const resultMessage = ref("");
  const resultColor = ref("");
  const loaded = ref(false)

  const sdateDayInput = ref('')
  const sdateMonthInput = ref('')
  const sdateYearInput = ref('')

  const sdateCorrectYearInput = computed(() => {
    const year = new Date().getFullYear()
    return (Math.floor(sdateYearInput.value) === sdateYearInput.value) && (sdateYearInput.value >= year)
  })

  const sdateCorrectMonthInput = computed(() => {
    return (Math.floor(sdateYearInput.value) === sdateYearInput.value) && (sdateMonthInput.value > 0) && (sdateMonthInput.value < 13)
  })

  const sdateCorrectDayInput = computed(() => {
    if (sdateDayInput.value <= 0) return false

    if (Math.floor(sdateYearInput.value) !== sdateYearInput.value) return false

    if (sdateMonthInput.value === 2) {
      return (!(sdateYearInput.value % 4) && (sdateYearInput.value % 100)) ? sdateDayInput.value < 29 : sdateDayInput.value < 30
    }
    if ((sdateMonthInput.value % 2 && sdateMonthInput.value < 8) || (!(sdateMonthInput.value % 2) && sdateMonthInput.value > 7)) {
      return sdateDayInput.value < 32
    } else {
      return sdateDayInput.value < 31
    }
  })

  const sdateInput = computed(() => {
    return `${sdateDayInput.value}/${sdateMonthInput.value}/${sdateYearInput.value}`
  })


  function toggleDisplay (newstate) {
    state.value = newstate
    resultMessage.value = ""
  }

  async function requestSecretInfo () {
    await fetch(apiSecretInfoUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      },
    })
    .then((response) => {
      response.json().then((data) => {
        if (data.secret_santa === 'true') {
          state.value = 'active'
          console.log(state.value)
          sdateDayInput.value = data.date.split('/')[0];
          sdateMonthInput.value = data.date.split('/')[1]
          sdateYearInput.value = data.date.split('/')[2]
        }
        else {
          state.value = 'inactive'
        }
      });
    })
    .catch((error) => {
      router.push('/login')
    })
  }

  onMounted(async () => {
    requestSecretInfo();
    loaded.value = true
  })

  async function request_and_update_state () {
    if (state.value === 'active') {
      await requestSecretStop();
    }
    if (state.value === 'modify') {
      await requestSecretReschedule();
    }
    if (state.value === 'inactive') {
      await requestSecretStart();
    }
    await requestSecretInfo();
  }

  function fetch_and_back_to_read () {
    toggleDisplay('active');
    requestSecretInfo();
  }

  async function requestSecretReschedule () {
  // event.preventDefault()
    
    const response = await fetch(apiSecretRescheduleUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: route.params.id,
        date: sdateInput.value
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Secret Santa rescheduled':
              color = 'green';
              message = 'Secret Santa rescheduled';
              break;
          case 'You can\'t reschedule, no Secret Santa is started':
              color = 'red';
              message = 'You can\'t reschedule, no Secret Santa is started';
              break;
          case 'Only group admin can schedule Secret Santa':
              color = 'red';
              message = 'Only group admin can schedule Secret Santa';
              break;
          case 'Invalid group':
              color = 'red';
              message = 'Invalid group';
              break;
          case 'Incorrect date format':
              color = 'dodgerblue';
              message = 'Incorrect date format';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

  async function requestSecretStart () {
  // event.preventDefault()
    
    const response = await fetch(apiSecretStartUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: route.params.id,
        date: sdateInput.value
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Secret Santa started':
              color = 'green';
              message = 'Secret Santa started';
              break;
          case 'Pairs couldn\'t be generated':
              color = 'red';
              message = 'Pairs couldn\'t be generated';
              break;
          case 'Only group admin can start Secret Santa':
              color = 'red';
              message = 'Only group admin can start Secret Santa';
              break;
          case 'Secret Santa already active':
              color = 'red';
              message = 'Secret Santa already active';
              break;
          case 'Invalid group':
              color = 'red';
              message = 'Invalid group';
              break;
          case 'Not enough members in the group, you must have at least 3 members':
              color = 'dodgerblue';
              message = 'Not enough members in the group, you must have at least 3 members';
              break;
          case 'Incorrect date format':
              color = 'dodgerblue';
              message = 'Incorrect date format';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

  async function requestSecretStop () {
  // event.preventDefault()
    
    const response = await fetch(apiSecretStopUrl, {
      withCredntials: true,
      credentials: 'include',
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      dataType: 'json',
      body: JSON.stringify({
        groupID: route.params.id,
      })
    })
    response.text().then((data) => {
      let color = '';
      let message = ''
      switch (data) {
          case 'Secret Santa stopped':
              color = 'green';
              message = 'Secret Santa stopped';
              break;
          case 'No Secret Santa active':
              color = 'red';
              message = 'No Secret Santa active';
              break;
          case 'Only group admin can stop Secret Santa':
              color = 'red';
              message = 'Only group admin can stop Secret Santa';
              break;
          case 'Invalid group':
              color = 'red';
              message = 'Invalid group';
              break;
          default:
              color = 'black';
              message = 'Unexpected response.';
      }
      resultMessage.value = message;
      resultColor.value = color;
    });
  }

</script>

<template>
<Transition>
  <form v-if="loaded" @submit.prevent="request_and_update_state">
    <fieldset v-if="state=='active'" >
      <legend>Secret Santa</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <span>Secret Santa Active in this group</span>
      <div class="grid-wrapper">
        <span>Secret Santa Date : </span><span>{{sdateInput}}</span>
      </div>

      <div class="row-flex-wrapper">
      <button @click="toggleDisplay('modify')" class="action">Reschedule</button>
      <button type="submit">Stop!</button>
      </div>
      
    </fieldset>
    <fieldset v-if="state=='modify'">
      <legend>Secret Santa</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <span>Secret Santa Active in this group</span>
      <div class="form-wrapper grid-wrapper">
        <label for="sdateInput">Secret Santa Date*</label>
          <div class="row-flex-wrapper">
            <input required v-model="sdateDayInput"   class="sdate-input" :class="{ wrong: !sdateCorrectDayInput }"   placeholder="DD"   type="number" name="sdateDay"   id="sdateDayInput">
            <input required v-model="sdateMonthInput" class="sdate-input" :class="{ wrong: !sdateCorrectMonthInput }" placeholder="MM"   type="number" name="sdateMonth" id="sdateMonthInput">
            <input required v-model="sdateYearInput"  class="sdate-input" :class="{ wrong: !sdateCorrectYearInput }"  placeholder="YYYY" type="number" name="sdateYear"  id="sdateYearInput">
          </div>
      </div>
      
      <div class="row-flex-wrapper">
      <button type="submit">Ok!</button>
      <button @click="fetch_and_back_to_read" class="cancel">Cancel</button>

      </div>

    </fieldset>
    <fieldset v-if="state=='inactive'">
      <legend>Secret Santa</legend>
      <div v-if="resultMessage" :style="{ color: resultColor }">{{ resultMessage }}</div>
      <span>No Secret Santa Active in this group</span>
      <div class="form-wrapper grid-wrapper">
        <label for="sdateInput">Secret Santa Date*</label>
          <div class="row-flex-wrapper">
            <input required v-model="sdateDayInput"   class="sdate-input" :class="{ wrong: !sdateCorrectDayInput }"   placeholder="DD"   type="number" name="sdateDay"   id="sdateDayInput">
            <input required v-model="sdateMonthInput" class="sdate-input" :class="{ wrong: !sdateCorrectMonthInput }" placeholder="MM"   type="number" name="sdateMonth" id="sdateMonthInput">
            <input required v-model="sdateYearInput"  class="sdate-input" :class="{ wrong: !sdateCorrectYearInput }"  placeholder="YYYY" type="number" name="sdateYear"  id="sdateYearInput">
          </div>
      </div>
      
      <button type="submit">Start!</button>

    </fieldset>
  </form>
  </Transition>
</template>

<style scoped>
  .grid-wrapper:not(.modify) {
    margin: 0.5em;
    border-radius: 0.3em;
    gap: 0;
  }
  
  .grid-wrapper > span {
    padding: 0.25em 0.8em;
  }

  .grid-wrapper > label {
    padding: 0.25em 0.8em;
    margin: 0.5em;
    justify-self: start;
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